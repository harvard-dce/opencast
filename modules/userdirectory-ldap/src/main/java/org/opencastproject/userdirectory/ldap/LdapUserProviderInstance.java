/**
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 *
 * The Apereo Foundation licenses this file to you under the Educational
 * Community License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License
 * at:
 *
 *   http://opensource.org/licenses/ecl2.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 */

package org.opencastproject.userdirectory.ldap;

import org.opencastproject.security.api.CachingUserProviderMXBean;
import org.opencastproject.security.api.JaxbOrganization;
import org.opencastproject.security.api.JaxbRole;
import org.opencastproject.security.api.JaxbUser;
import org.opencastproject.security.api.Organization;
import org.opencastproject.security.api.SecurityService;
import org.opencastproject.security.api.User;
import org.opencastproject.security.api.UserProvider;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.google.common.util.concurrent.UncheckedExecutionException;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.ldap.DefaultSpringSecurityContextSource;
import org.springframework.security.ldap.search.FilterBasedLdapUserSearch;
import org.springframework.security.ldap.userdetails.LdapUserDetailsService;

import java.lang.management.ManagementFactory;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

import javax.management.InstanceNotFoundException;
import javax.management.MBeanServer;
import javax.management.ObjectName;
import javax.naming.InvalidNameException;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.ldap.LdapName;
import javax.naming.ldap.Rdn;

/**
 * A UserProvider that reads user roles from LDAP entries.
 */
public class LdapUserProviderInstance implements UserProvider, CachingUserProviderMXBean {

  /** The logger */
  private static final Logger logger = LoggerFactory.getLogger(LdapUserProviderInstance.class);

  public static final String PROVIDER_NAME = "ldap";

  /** The spring ldap userdetails service delegate */
  private LdapUserDetailsService delegate = null;

  /** The organization id */
  private Organization organization = null;

  /** Total number of requests made to load users */
  private AtomicLong requests = null;

  /** The number of requests made to ldap */
  private AtomicLong ldapLoads = null;

  /** A cache of users, which lightens the load on the LDAP server */
  private LoadingCache<String, Object> cache = null;

  /** A token to store in the miss cache */
  protected Object nullToken = new Object();

  /** Opencast's security service */
  private SecurityService securityService;

  /** The general role prefix, to be added to all the LDAP roles that do not start by one of the exclude prefixes */
  private String rolePrefix;

  /** A Set of roles to be added to all the users authenticated using this LDAP instance */
  private Set<GrantedAuthority> setExtraRoles = new HashSet<>();

  /** A Set of prefixes. When a role starts with any of these, the role prefix defined above will not be prepended */
  private Set<String> setExcludePrefixes = new HashSet<>();

  // #DCE OPC-66 Now it's an instance variable
  private String emailAttr;
  private OpencastLdapAuthoritiesPopulator authoritiesPopulator;

  /**
   * Constructs an ldap user provider with the needed settings.
   *
   * @param pid
   *          the pid of this service
   * @param organization
   *          the organization
   * @param searchBase
   *          the ldap search base
   * @param searchFilter
   *          the ldap search filter
   * @param url
   *          the url of the ldap server
   * @param userDn
   *          the user to authenticate as
   * @param password
   *          the user credentials
   * @param roleAttributesGlob
   *          the comma separate list of ldap attributes to treat as roles
   * @param rolePrefix
   *          a prefix to be prepended to all the roles read from the LDAP server
   * @param extraRoles
   *          an array of extra roles to add to all the users
   * @param excludePrefixes
   *          an array of role prefixes. The roles starting with any of these will not be prepended with the rolePrefix
   * @param convertToUppercase
   *          whether or not the role names will be converted to uppercase
   * @param cacheSize
   *          the number of users to cache
   * @param cacheExpiration
   *          the number of minutes to cache users
   * @param securityService
   *          a reference to Opencast's security service
   */
  // CHECKSTYLE:OFF
  LdapUserProviderInstance(DefaultSpringSecurityContextSource contextSource, OpencastLdapAuthoritiesPopulator populator,
          String pid, Organization organization, String searchBase, String searchFilter, String roleAttributesGlob,
          String rolePrefix, String[] extraRoles,
          String[] excludePrefixes, boolean convertToUppercase, int cacheSize, int cacheExpiration,
          SecurityService securityService, String emailAttr) {
    // CHECKSTYLE:ON
    this.organization = organization;
    this.securityService = securityService;
    this.authoritiesPopulator = populator;

    // #DCE OPC-191
    logger.info("Activating  {}", getClass().getName());

    FilterBasedLdapUserSearch userSearch = new FilterBasedLdapUserSearch(searchBase, searchFilter, contextSource);

    // #DCE OPC-66 Also return email attribute
    String[] roleAttrs = roleAttributesGlob.split(",");
    String[] returnAttrs;
    if (StringUtils.isNotBlank(emailAttr)) {
      returnAttrs = Arrays.copyOf(roleAttrs, roleAttrs.length + 1);
      returnAttrs[roleAttrs.length] = emailAttr.trim();
      this.emailAttr = emailAttr.trim();
    } else
      returnAttrs = roleAttrs;
    userSearch.setReturningAttributes(returnAttrs);
    delegate = new LdapUserDetailsService(userSearch);

    // #DCE OPC-66 Replace LdapUserDetailsMapper by ours
    OpencastUserDetailsMapper mapper = new OpencastUserDetailsMapper();

    mapper.setConvertToUpperCase(convertToUppercase);

    mapper.setRoleAttributes(roleAttrs);

    if (convertToUppercase)
      this.rolePrefix = StringUtils.trimToEmpty(rolePrefix).toUpperCase();
    else
      this.rolePrefix = StringUtils.trimToEmpty(rolePrefix);

    logger.debug("Role prefix set to: \"{}\"", this.rolePrefix);

    // The default prefix value is "ROLE_", so we must explicitly set it to "" by default
    // Because of the parameters extraRoles and excludePrefixes, we must add the prefix manually
    mapper.setRolePrefix("");
    delegate.setUserDetailsMapper(mapper);

    // Process the excludePrefixes if needed
    if (!this.rolePrefix.isEmpty()) {
      if (excludePrefixes != null) {
        // "Clean" the list of exclude prefixes
        for (String excludePrefix : excludePrefixes) {
          String cleanPrefix = excludePrefix.trim();
          if (!cleanPrefix.isEmpty()) {
            if (convertToUppercase)
              setExcludePrefixes.add(cleanPrefix.toUpperCase());
            else
              setExcludePrefixes.add(cleanPrefix);
          }
        }

        if (logger.isDebugEnabled()) {
          if (setExcludePrefixes.size() > 0) {
            logger.debug("Exclude prefixes set to:");
            for (String prefix : excludePrefixes) {
              logger.debug("\t* {}", prefix);
            }
          } else {
            logger.debug("No exclude prefixes defined");
          }
        }
      }
    }

    // Process extra roles
    if (extraRoles != null) {
      for (String extraRole : extraRoles) {
        String finalRole = StringUtils.trimToEmpty(extraRole);
        if (!finalRole.isEmpty()) {
          if (convertToUppercase) {
            setExtraRoles.add(new SimpleGrantedAuthority(finalRole.toUpperCase()));
          } else {
            setExtraRoles.add(new SimpleGrantedAuthority(finalRole));
          }
        }
      }
    }

    // Setup the caches
    cache = CacheBuilder.newBuilder().maximumSize(cacheSize).expireAfterWrite(cacheExpiration, TimeUnit.MINUTES)
            .build(new CacheLoader<String, Object>() {
              @Override
              public Object load(String id) throws Exception {
                User user = loadUserFromLdap(id);
                // Needed? cache.put(id, user);
                return user == null ? nullToken : user;
              }
            });

    registerMBean(pid);
  }

  @Override
  public String getName() {
    return PROVIDER_NAME;
  }

  /**
   * Registers an MXBean.
   */
  protected void registerMBean(String pid) {
    // register with jmx
    requests = new AtomicLong();
    ldapLoads = new AtomicLong();
    try {
      ObjectName name;
      name = LdapUserProviderFactory.getObjectName(pid);
      Object mbean = this;
      MBeanServer mbs = ManagementFactory.getPlatformMBeanServer();
      try {
        mbs.unregisterMBean(name);
      } catch (InstanceNotFoundException e) {
        logger.debug(name + " was not registered");
      }
      mbs.registerMBean(mbean, name);
    } catch (Exception e) {
      logger.warn("Unable to register {} as an mbean: {}", this, e);
    }
  }

  /**
   * {@inheritDoc}
   *
   * @see org.opencastproject.security.api.UserProvider#getOrganization()
   */
  @Override
  public String getOrganization() {
    return organization.getId();
  }

  /**
   * {@inheritDoc}
   *
   * @see org.opencastproject.security.api.UserProvider#loadUser(java.lang.String)
   */
  @Override
  public User loadUser(String userName) {
    logger.debug(Thread.currentThread().getId() + " - LdapUserProvider is loading user " + userName);
    requests.incrementAndGet();
    try {
      // use #getUnchecked since the loader does not throw any checked exceptions
      Object user = cache.getUnchecked(userName);
      if (user == nullToken) {
        return null;
      } else {
        return (JaxbUser) user;
      }
    } catch (UncheckedExecutionException e) {
      logger.warn("Exception while loading user " + userName, e);
      return null;
    } finally {
      logger.debug(Thread.currentThread().getId() + " - LdapUserProvider returning user " + userName);
    }
  }

  /**
   * Loads a user from LDAP.
   *
   * @param userName
   *          the username
   * @return the user
   */
  protected User loadUserFromLdap(String userName) {
    if (delegate == null || cache == null) {
      throw new IllegalStateException("The LDAP user detail service has not yet been configured");
    }
    ldapLoads.incrementAndGet();
    OpencastUserDetails userDetails = null;

    Thread currentThread = Thread.currentThread();
    ClassLoader originalClassloader = currentThread.getContextClassLoader();
    String userNameFromDn = userName;
    try {
      currentThread.setContextClassLoader(LdapUserProviderFactory.class.getClassLoader());
      try {
        logger.debug("Loading user {} from ldap", userName);
        userDetails = (OpencastUserDetails) delegate.loadUserByUsername(userName);
        // #DCE OPC-83 Get the dn and set the user name to replace the HUID.
        // This is necessary when authorizing producers that come via Canvas/LTI with their HUID, not ldap user name.
        // dn is something like "uid=rsantos,ou=People,dc=dce,dc=harvard,dc=edu"
        // If logging in via OC, user name is already the dn user name. If via Canvas/LTI, userName is the HUID and the
        // user name returned in the User object will be the ldap user name.
        try {
          LdapName ldapName = new LdapName(userDetails.getDn());
          List<Rdn> rdns = ldapName.getRdns();
          userNameFromDn = rdns.get(rdns.size() - 1).getValue().toString();
          logger.debug("Ldap dn is {}, user name is {}", userDetails.getDn(), userNameFromDn);
        } catch (InvalidNameException e) {
          logger.warn("Could not get user name from ldap dn, user is: {}", userName);
        }
      } catch (UsernameNotFoundException e) {
        cache.put(userName, nullToken);
        return null;
      }

      JaxbOrganization jaxbOrganization = JaxbOrganization.fromOrganization(organization);
      Set<JaxbRole> roles = new HashSet<>();
      // #DCE OPC-66
      // We don't set the authorities populator in the delegate LdapUserDetailsService to avoid a recursive load
      for (GrantedAuthority authority : authoritiesPopulator.getExpandedAuthorities(userDetails.getCtx(),
              userNameFromDn))
        roles.add(new JaxbRole(authority.getAuthority(), jaxbOrganization));

      // OPC-66 Add user email gotten from LDAP
      String email = null;
      if (StringUtils.isNotBlank(emailAttr)) {
        try {
          Attribute emailAttr = userDetails.getAttribute(this.emailAttr);
          email = emailAttr.get().toString();
        } catch (NamingException e) {
          logger.warn("Could not get user email", e);
        }
      }

      // #DCE OPC-66 Replaced constructor to pass email address
      User user = new JaxbUser(userNameFromDn, null, null, email, PROVIDER_NAME, true, jaxbOrganization,
              roles);
      cache.put(userName, user);
      return user;
    } finally {
      currentThread.setContextClassLoader(originalClassloader);
    }
  }

  /**
   * {@inheritDoc}
   *
   * @see org.opencastproject.security.api.CachingUserProviderMXBean#getCacheHitRatio()
   */
  @Override
  public float getCacheHitRatio() {
    if (requests.get() == 0) {
      return 0;
    }
    return (float) (requests.get() - ldapLoads.get()) / requests.get();
  }

  @Override
  public Iterator<User> findUsers(String query, int offset, int limit) {
    if (query == null)
      throw new IllegalArgumentException("Query must be set");
    // TODO implement a LDAP wildcard search
    // FIXME We return the current user, rather than an empty list, to make sure the current user's role is displayed in
    // the admin UI (MH-12526).
    User currentUser = securityService.getUser();
    if (loadUser(currentUser.getUsername()) != null) {
      List<User> retVal = new ArrayList<>();
      retVal.add(securityService.getUser());
      return retVal.iterator();
    }
    return Collections.<User> emptyList().iterator();
  }

  @Override
  public Iterator<User> getUsers() {
    // TODO implement LDAP get all users
    // FIXME We return the current user, rather than an empty list, to make sure the current user's role is displayed in
    // the admin UI (MH-12526).
    User currentUser = securityService.getUser();
    if (loadUser(currentUser.getUsername()) != null) {
      List<User> retVal = new ArrayList<>();
      retVal.add(securityService.getUser());
      return retVal.iterator();
    }
    return Collections.<User> emptyList().iterator();
  }

  @Override
  public long countUsers() {
    // TODO implement LDAP count users
    // FIXME Because of MH-12526, we return conditionally 1 when the previous methods return the current user
    if (loadUser(securityService.getUser().getUsername()) != null) {
      return 1;
    }
    return 0;
  }

  @Override
  public void invalidate(String userName) {
    cache.invalidate(userName);
  }

}

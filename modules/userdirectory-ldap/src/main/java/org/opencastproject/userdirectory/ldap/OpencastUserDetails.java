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

import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.ldap.userdetails.LdapUserDetails;
import org.springframework.security.ldap.userdetails.LdapUserDetailsImpl;

import java.util.Collection;

import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;

public class OpencastUserDetails implements LdapUserDetails {

  private static final long serialVersionUID = 7988204614189314191L;

  private LdapUserDetailsImpl userDetails;
  private DirContextOperations ctx;
  private Attributes attrs;

  public OpencastUserDetails(LdapUserDetailsImpl userDetails, DirContextOperations ctx) {
    this.userDetails = userDetails;
    this.ctx = ctx;
    this.attrs = ctx.getAttributes();
  }

  @Override
  public Collection<GrantedAuthority> getAuthorities() {
    return userDetails.getAuthorities();
  }

  @Override
  public String getPassword() {
    return userDetails.getPassword();
  }

  @Override
  public String getUsername() {
    return userDetails.getUsername();
  }

  @Override
  public boolean isAccountNonExpired() {
    return userDetails.isAccountNonExpired();
  }

  @Override
  public boolean isAccountNonLocked() {
    return userDetails.isAccountNonLocked();
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return userDetails.isCredentialsNonExpired();
  }

  @Override
  public boolean isEnabled() {
    return userDetails.isEnabled();
  }

  @Override
  public String getDn() {
    return userDetails.getDn();
  }

  public Attribute getAttribute(String attrName) {
    return attrs.get(attrName);
  }

  public DirContextOperations getCtx() {
    return ctx;
  }
}

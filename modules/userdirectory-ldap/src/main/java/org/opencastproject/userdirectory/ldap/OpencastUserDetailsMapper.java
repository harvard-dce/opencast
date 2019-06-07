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

import org.springframework.ldap.core.DirContextAdapter;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.ldap.userdetails.LdapUserDetails;
import org.springframework.security.ldap.userdetails.LdapUserDetailsImpl;
import org.springframework.security.ldap.userdetails.LdapUserDetailsMapper;
import org.springframework.security.ldap.userdetails.UserDetailsContextMapper;

import java.util.Collection;

public class OpencastUserDetailsMapper extends LdapUserDetailsMapper implements UserDetailsContextMapper {

  @Override
  public LdapUserDetails mapUserFromContext(DirContextOperations ctx, String username,
          Collection<? extends GrantedAuthority> authorities) {
    LdapUserDetailsImpl details = (LdapUserDetailsImpl) super.mapUserFromContext(ctx, username, authorities);
    return new OpencastUserDetails(details, ctx);
  }

  @Override
  public void mapUserToContext(UserDetails user, DirContextAdapter ctx) {
    super.mapUserToContext(user, ctx);
  }
}

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
 
/*global Opencast
         MHAnnotationServiceDefaultDataDelegate
         MHAnnotationServiceTrimmingDataDelegate
         MHFootPrintsDataDelegate
         OpencastTrackCameraDataDelegate
         OpencastToPaellaConverter
         OpencastAccessControl
*/

/* #DCE OPC-359 override Opencast engage-paella-player/src/main/paella-opencast/plugins/es.upv.paella.opencast.loader/05_loader.js 
   for DCE specific auth handling. TEST if stream toggling still neeede for ios and multi to single
   TODO: next iteration, use the Opencat preferred location for paella config
*/


function initPaellaOpencast() {
  if (!paella.opencast) {
    paella.opencast = new Opencast();

    paella.dataDelegates.MHAnnotationServiceDefaultDataDelegate = MHAnnotationServiceDefaultDataDelegate;
    paella.dataDelegates.MHAnnotationServiceTrimmingDataDelegate = MHAnnotationServiceTrimmingDataDelegate;
    paella.dataDelegates.MHFootPrintsDataDelegate = MHFootPrintsDataDelegate;
    paella.dataDelegates.OpencastTrackCameraDataDelegate = OpencastTrackCameraDataDelegate;
    paella.OpencastAccessControl = OpencastAccessControl;
    window.OpencastAccessControl = OpencastAccessControl;
  }
}

function loadOpencastPaella(containerId) {
  initPaellaOpencast();
  paella.load(containerId, {
    // #DCE OPC-357 revert to original path during migration
    //configUrl:'/ui/config/paella/config.json',
    configUrl:'/engage/player/config/config.json',
    loadVideo:function() {
      return new Promise((resolve, reject) => {
        paella.opencast.getEpisode()
        .then((episode) => {
          var converter = new OpencastToPaellaConverter();
          var data = converter.convertToDataJson(episode);
          if (data.streams.length < 1) {
            paella.messageBox.showError(paella.dictionary.translate('Error loading video! No video tracks found'));
          }
          else {
            paella.dce = paella.dce || {};
            paella.dce.sources = data.streams;
            // #DCE toggle presenter & presenation option when ios (bypass paella5 exclusion of presentation video)
            // This is still necessary in Paellav6x: Hide the slave stream from paella if ios, will be used in singleVideoToggle
            // Toggling video players with profiles and hard swap the main Audio player doesn't work. Safari video elements become "suspended"
            if (base.userAgent.system.iOS) {
              data.streams = [];
              data.streams[0] = paella.dce.sources[0];
            }
            resolve(data);
          }
        })
        .catch((jsonData)=>{
          // #DCE start specific DCE auth handling, formally in isHarvardDceAuth() (MATT-2212)
          if (jsonData && jsonData[ 'dce-auth-results']) {
            paella.opencast.doHarvardDceAuthRedirect(jsonData)
            base.log.debug("Successfully performed DCE auth redirect");
            // #DCE end specific DCE auth handling
         } else if (jsonData == 0) {
            var errMsg = paella.dictionary.translate('No recordings found for episode id {id}').replace(/\{id\}/g, paella.utils.parameters.get('id') || '');
            paella.messageBox.showError(errMsg);

         } else {
            // #DCE OPC-374 Opencast makes user log in if 0 results, DCE has already done auth by this point and knows 0 means 0 to this user.
            //var oacl = new OpencastAccessControl();
            //oacl.userData().then(user => {
            //  if (user.isAnonymous) {
            //    window.location.href = oacl.getAuthenticationUrl();
            //  } else {
            var errMsg = paella.dictionary.translate('Error loading video {id}').replace(/\{id\}/g, paella.utils.parameters.get('id') || '');
            paella.messageBox.showError(errMsg);
            // }
            //});
          }
        });
      });
    }
  });
}

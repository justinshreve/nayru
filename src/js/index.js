import actions from '../core/actions.php?raw';
import plugin from '../core/plugin.php?raw';

import { main } from './pg.js';

const platform = 'Browser'; // TODO: Detect Browser

async function load () {
  await main({
    url: '/wp-admin/post-new.php',
    beforeLoad: ({url, text}) => {
      localStorage.setItem('persist', JSON.stringify({ url }));
    },
  
    async ready( php ) {
     
     await php.writeFile(
        '/wordpress/wp-content/mu-plugins/nayru.php',
        `<?php global $platform; $platform = '${platform}'; ?>${plugin}`
      )
    
      await php.writeFile(
        '/wordpress/temp.json',
        JSON.stringify({
          platform,
          gmt_offset: -new Date().getTimezoneOffset() / 60
        })
      )
    
      await php.writeFile(
        '/wordpress/wp-content/mu-plugins/actions.php',
        actions
      )

      if (process.env.NODE_ENV === 'production') {
        // TODO: In the future, this should probably load from a app URL
        const siteUrl = window.electronAPI ? `file://${await window.electronAPI.getAppPath()}/dist/` : 'capacitor://localhost/';

        const config = await php.readFileAsText('/wordpress/wp-config.php');
        const newConfigContent = config.replace(/define\('WP_SITEURL',\s*'.*?'\);/, `define('WP_SITEURL', '${siteUrl}');`);
        await php.writeFile('/wordpress/wp-config.php', newConfigContent);
      }
    
      /*
      php.onMessage(async (data) => {
        // alert('data');
      })*/
    },
  })

}

load()

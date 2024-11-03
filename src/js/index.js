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
    
      php.onMessage(async (data) => {
        // alert('data');
      })
    },
  })

}

load()

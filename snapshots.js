import PercyScript from '@percy/script'
import httpServer from 'http-server'
import dirTree from 'directory-tree'


const PORT = 8080
const BASE_URL = `http://localhost:${PORT}`

let options = {
    widths: [768, 900, 1024, 1280]
}

// A script to navigate our app and take snapshots with Percy.
PercyScript.run(async (page, percySnapshot) => {
  let server = httpServer.createServer({
    root: './build/'
  });
  server.listen(PORT);
  // page fetch (.html)
  let pages = []
  dirTree('./build', {extensions:/\.html$/}, async(item, PATH, stats) =>  {
    pages.push(item)
  });
  // snapshots
  for (let index = 0; index < pages.length; index++) {
    await page.goto(`${BASE_URL}/${pages[index].name}`);
    await percySnapshot(pages[index].name,options);
  }
  server.close()
});
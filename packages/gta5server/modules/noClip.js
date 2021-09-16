var fs = require('fs');
const saveFile = 'saved/savedposcam.txt';

const user = require('../user')

mp.events.add('client::noclip:saveCamCoords', (player, position, pointAtCoord, name = 'No name') =>
{
    if(user.getAdmin() < 5)return

    const pos = JSON.parse(position);
    const point = JSON.parse(pointAtCoord);

    fs.appendFile(saveFile, `Username: ${user.getUserName(player)} | Position: ${pos.x}, ${pos.y}, ${pos.z} | pointAtCoord: ${point.position.x}, ${point.position.y}, ${point.position.z} | entity: ${point.entity} - ${name}\r\n`, (err) => {
        if(err) user.notify(player, `SaveCamPos Error: ${err.message}`);
        else user.notify(player, `PositionCam saved. (${name})`);
    });
})

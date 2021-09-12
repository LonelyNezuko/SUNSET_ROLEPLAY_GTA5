var fs = require('fs');
const saveFile = 'saved/savedposcam.txt';

const user = require('../user')

mp.events.add({
    'command::savecam': (player, name = 'No name') =>
    {
        player.call('getCamCoords', [name]);
    },
    'saveCamCoords': (player, position, pointAtCoord, name = 'No name') =>
    {
        const pos = JSON.parse(position);
        const point = JSON.parse(pointAtCoord);

        fs.appendFile(saveFile, `Position: ${pos.x}, ${pos.y}, ${pos.z} | pointAtCoord: ${point.position.x}, ${point.position.y}, ${point.position.z} | entity: ${point.entity} - ${name}\r\n`, (err) => {
            if (err) {
                user.notify(player, `SaveCamPos Error: ${err.message}`);
            } else {
                user.notify(player, `PositionCam saved. (${name})`);
            }
        });
    }
})

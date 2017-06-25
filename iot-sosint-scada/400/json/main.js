let wireshark_packets = require('./putget.json');

const REGEX_LIGHT_STATE = /\/lights\/([1-3])\/state/;

const OLD_LIGHT_VALUES = {};
const NEW_LIGHT_VALUES = {};

for (let packetNum = 0; packetNum < wireshark_packets.length; packetNum++) {
    const layers = wireshark_packets[packetNum]._source.layers;
    const jsonData = layers.http["http.file_data"] && JSON.parse(layers.http["http.file_data"]);
    const httpReq = layers.http[Object.keys(layers.http)[0]];

    if (httpReq) {
        const method = httpReq["http.request.method"];
        const endpoint = httpReq["http.request.uri"].replace('/api/tmQYBFKceA8EmNOA0-rPNK3nv87yZV9tOL7FWKea', '');

        const lightMatch = endpoint.match(REGEX_LIGHT_STATE)
        if (lightMatch && lightMatch[1]) {
            const lightNum = lightMatch[1];
            NEW_LIGHT_VALUES[lightNum] = jsonData;

            if (lightNum === "3") {
                // Print delta
                let outputString = '';

                for (let i = 1; i <= 3; i++) {
                    let oldVals = OLD_LIGHT_VALUES[i];
                    let newVals = NEW_LIGHT_VALUES[i];
                    if (oldVals && newVals) {
                        outputString += `${i}: `;
                        outputString += `0x${oldVals.sat.toString(16)}->0x${newVals.sat.toString(16)}`;
                        outputString += `(${oldVals.sat - newVals.sat})`;
                        outputString += `    `;
                    }
                    OLD_LIGHT_VALUES[i] = NEW_LIGHT_VALUES[i];
                }

                console.log(outputString);
            }
        } else if (endpoint.match('/groups/0/action')) {
            console.log('groupline');
        } else {
            // GET
        }
    }
}

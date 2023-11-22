(function (console) {

    console.save = function (data, filename) {

        if (!data) {
            console.error('Console.save: No data')
            return;
        }

        if (!filename) filename = 'console.json'

        if (typeof data === "object") {
            data = JSON.stringify(data, undefined, 4)
        }

        var blob = new Blob([data], { type: 'text/json' }),
            e = document.createEvent('MouseEvents'),
            a = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }
})(console)

function hexToBase64(hexstring) {
    return btoa(hexstring.match(/\w{2}/g).map(function (a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}

function ascii_to_hexa(str) {
    var arr1 = [];
    for (var n = 0, l = str.length; n < l; n++) {
        var hex = Number(str.charCodeAt(n)).toString(16);
        arr1.push(hex);
    }
    return arr1.join('');
}

function formatPath(path) {
    var formatedPath;
    if (path.startsWith("/Game/")) {
        formatedPath = path.replace("/Game/", "FortniteGame/Content/");
    } else if (path.startsWith("/BRCosmetics/")) {
        formatedPath = path.replace("/BRCosmetics/", "FortniteGame/Plugins/GameFeatures/BRCosmetics/Content/");
    } else {
        formatedPath = path;
    }
    if (!formatedPath.endsWith(".uasset")) {
        formatedPath += ".uasset";
    }

    return formatedPath;
}

function constructSwaps(swap, newPlugin) {
    search = swap.search;
    replace = swap.replace;
    if (swap.type == "string") {
        if (swap.UEFN) {
            replace = "/58328612-4b4d-eedc-990c-85bd6aec9e34" + replace;
        }
        if (swap.search.includes("/")) {
            newPlugin += `\nsearch = ar.CreateSoftObjectProperty("${search}");`;
            newPlugin += `\nreplace = ar.CreateSoftObjectProperty("${replace}");`;
            newPlugin += `\nar.SwapSoftObjectProperty(search, replace);`;
        } else {
            usedHexSearch = true;
            newPlugin += `\nsearchHex = ar.CreateByteArrayProperty("${hexToBase64(ascii_to_hexa(search))}");`;
            newPlugin += `\nreplaceHex = ar.CreateByteArrayProperty("${hexToBase64(ascii_to_hexa(replace))}");`;
            newPlugin += `\nar.SwapByteArrayProperty(searchHex, replaceHex);`;
        }

    }
    if (swap.type == "hex") {
        usedHexSearch = true;
        newPlugin += `\nsearchHex = ar.CreateByteArrayProperty("${hexToBase64(search)}");`;
        newPlugin += `\nreplaceHex = ar.CreateByteArrayProperty("${hexToBase64(replace)}");`;
        newPlugin += `\nar.SwapByteArrayProperty(searchHex, replaceHex);`;
    }
    return newPlugin;
}

var startingPlugin = `sign: "Author", "pheonn"
sign: "Name", "NAMEFROM to NAMETO"
sign: "Description", "This converts NAMEFROM to NAMETO."
sign: "Icon", "https://fortnite-api.com/images/cosmetics/br/IDTO/icon.png"

system.Download("https://github.com/IlikebreadYum/fortnite-plugins/raw/main/plugin.utoc", "utoc");
system.Download("https://github.com/IlikebreadYum/fortnite-plugins/raw/main/plugin.ucas", "ucas");
system.Download("https://github.com/IlikebreadYum/fortnite-plugins/raw/main/plugin.pak", "pak");
system.Download("https://github.com/IlikebreadYum/fortnite-plugins/raw/main/plugin.sig", "sig");

SoftObjectProperty search;
SoftObjectProperty replace;
REPLACEHEXSEARCH
REPLACEHEXREPLACE
archive ar;
REPLACEAR2`;

var plugins = [];
function constructPlugin(override, to) {
    if(!override){
        constructPlugin(data.uefn.Swaps[document.getElementById("skinFrom").value],data.cosmetics.Characters.Array[document.getElementById("skinTo").value]);
        return
    }
    var newPlugin = startingPlugin;
    newPlugin = newPlugin.replaceAll("NAMEFROM", override.Name);
    newPlugin = newPlugin.replaceAll("NAMETO", to.Name);
    newPlugin = newPlugin.replaceAll("IDTO", to.ID);
    var usedAr2 = true;
    for (let asset of override.Assets) {
        var AssetPath = formatPath(asset.AssetPath);
        newPlugin += `\nar = import "${AssetPath}";`
        if (asset.AssetPathTo) {
            var AssetPath2 = formatPath(asset.AssetPathTo);
            newPlugin += `\nar2 = import "${AssetPath2}";`
            newPlugin += `\nar.Swap(ar2);`
            usedAr2 = true;
        }
        if (asset.Swaps) {
            for (let swap of asset.Swaps) {
                newPlugin = constructSwaps(swap, newPlugin);
            }
        }
        newPlugin += `\nar.Save();`;
    }

    newPlugin += `\nar = import "FortniteGame/Content/Athena/Heroes/Meshes/Bodies/CP_Athena_Body_F_Fallback.uasset";`;
    newPlugin += `\nar2 = import "${formatPath(to.Object)}";`;
    newPlugin += `\nar.Swap(ar2);`;
    var swaps = to.Swaps.sort((a, b) => {
        const nameA = a.type; // ignore upper and lowercase
        const nameB = b.type; // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    });
    for (let swap of swaps) {
        newPlugin = constructSwaps(swap, newPlugin);
    }
    newPlugin += `\nar.Save();`;



    if (usedAr2) {
        newPlugin = newPlugin.replaceAll("REPLACEAR2", "archive ar2;");
    } else {
        newPlugin = newPlugin.replaceAll("REPLACEAR2", "");
    }

    if (newPlugin.includes("SwapByteArrayProperty")) {
        newPlugin = newPlugin.replaceAll("REPLACEHEXSEARCH", "ByteArrayProperty searchHex;");
        newPlugin = newPlugin.replaceAll("REPLACEHEXREPLACE", "ByteArrayProperty replaceHex;");
    } else {
        newPlugin = newPlugin.replaceAll("REPLACEHEXSEARCH", "");
        newPlugin = newPlugin.replaceAll("REPLACEHEXREPLACE", "");
    }
    console.save(newPlugin,`${override.Name}to${to.Name}.rd`);
}
data.uefn.Swaps.forEach((fromElement) => {
    document.getElementById("skinFrom").innerHTML += `<option value="${data.uefn.Swaps.indexOf(fromElement)}">${fromElement.Name}</option>`;
});

data.cosmetics.Characters.Array.forEach(toElement => {
    document.getElementById("skinTo").innerHTML += `<option value="${data.cosmetics.Characters.Array.indexOf(toElement)}">${toElement.Name}</option>`;
});

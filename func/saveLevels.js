require("../models/Hierarchy");

async function saveLevels(mongoose, guildId, level1Name, level2Name, level3Name, incrementalVal) {
    const levelArray = [level1Name, level2Name, level3Name];
    const Hierarchy = mongoose.model("hierarchy");
    await Hierarchy.deleteMany({}).then((() => {
        console.log("Deleted all levels");
    }))
    for (let i = 0; i < 3; i++) {
        let levelPoint = incrementalVal * (i + 1);
        const level = new Hierarchy({
            DiscordID: guildId,
            LevelName: levelArray[i],
            Point: levelPoint,
        });
        level.save().then(() => console.log("Saved")).catch((err) => console.log(err));
    }
}

exports.saveLevels = saveLevels;

require('../models/Hierarchy');
require('../models/Student');

async function update(guild, mongoose) {
    const roles = await getRoleArray(mongoose, guild);
    const studentPoint = mongoose.model('student');
    for await (const sp of studentPoint.find()) {
        const name = sp['Name'];
        const discordId = sp['DiscordId'];
        const point = sp['Point'];
        const roleName = getRoleName(point, roles);
        if (!roleName) {
            guild.members.fetch(discordId).then(member => {
                if (!member) {
                    console.log(`${discordId} not found in ${guild.name}`);
                    return;
                }
                member.roles.set([]).then(() => {
                    console.log(`${member.displayName}'s role has been removed`);
                });
            }).catch(console.error);
            continue;
        }
        await changeRoleTo(guild, discordId, roleName);
    }
}

async function getRoleArray(mongoose, guild) {
    const id = guild.id;
    const roles = {};
    const hierarchy = mongoose.model('hierarchy');
    for await (const h of hierarchy.find()) {
        if (h['DiscordID'] === id) {
            roles[h['LevelName']] = h['Point'];
        }
    }
    return new Promise((resolve) => {
        resolve(roles);
    });
}

function getRoleName(point, roles) {
    let roleName = '';
    let curMax = 0;
    Object.keys(roles).forEach(key => {
        if (roles[key] <= point && roles[key] > curMax) {
            roleName = key;
            curMax = roles[key];
        }
    });
    return roleName;
}

function changeRoleTo(guild, userId, roleName) {
    let role = guild.roles.cache.find(role => role.name === roleName);
    if (!role) {
        console.log(`Role ${roleName} not found`);
        return;
    }
    guild.members.fetch(userId).then(member => {
        if (!member) {
            console.log(`${userId} not found in ${guild.name}`);
            return;
        }
        member.roles.set([role]).then(() => {
            console.log(`${member.displayName} has been given the role ${role.name}`);
        });
    }).catch(console.error);
}

exports.update = update;
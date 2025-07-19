const { setTimeout } = require('timers/promises');

const data = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
    },
    {
        id: 2,
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
    },
    {
        id: 3,
        name: 'Jim Doe',
        email: 'jim.doe@example.com',
    },
    // {
    //     id: 4,
    //     name: 'Jill Doe',
    //     email: 'jill.doe@example.com',
    // },
    // {
    //     id: 5,
    //     name: 'Jack Doe',
    //     email: 'jack.doe@example.com',
    // },
];

exports.data = data;

exports.readData = function (begin, size) {
    return data.slice(begin, begin + size);
};
exports.readDataDelay = function (delayTimeMs) {
    return async function (begin, size) {
        await setTimeout(delayTimeMs);
        return data.slice(begin, begin + size);
    };
};

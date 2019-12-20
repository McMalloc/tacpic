import {includes} from 'lodash';

const deepPull = (objects, uuids, result = []) => {
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].type === 'group') {
            deepPull(objects[i].objects, uuids, result);
        }

        if (includes(uuids, objects[i].uuid)) {
            result.push(objects[i]);
            delete objects[i];
        }
    }

    return result;
};

export default deepPull;

// const example = [
//     {uuid: 1},
//     {uuid: 2},
//     {uuid: 3,  type: 'group', objects: [
//         {uuid: 4},
//             {uuid: 5,  type: 'group', objects: [
//                 {uuid: 6}
//                 ]
//             }]
//     }];
//
// setTimeout(() => {
//     console.log("--------------------------------------");
//     console.log(
//         deepPull(example, [2, 5, 6])
//     );
//     console.log(example);
//     console.log("--------------------------------------");
// }, 800);

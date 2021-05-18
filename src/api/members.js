import axios from 'axios';

export const getMembers = () => {
    return axios.get('/adminui-problem/members.json', {
        // params: {
        //     total: 1000,
        //     per_page: 12
        // }
    });
};

export const Types = {
    GET_MEMBERS_REQUEST: 'GET_MEMBERS_REQUEST',
    GET_MEMBERS_SUCCESS: 'GET_MEMBERS_SUCCESS'
};

export const getMembersRequest = () => ({
    type: Types.GET_MEMBERS_REQUEST
});

export const getMembersSuccess = items => ({
    type: Types.GET_MEMBERS_SUCCESS,
    payload: { items }
});

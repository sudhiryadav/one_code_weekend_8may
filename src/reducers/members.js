import { Types } from '../actions/members';

const initialState = {
    items: []
};

export const membersReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_MEMBERS_SUCCESS:
            return {
                ...state,
                items: action.payload.items
            };
        default:
            return state;
    }
};

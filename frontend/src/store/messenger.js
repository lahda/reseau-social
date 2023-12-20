export default {
  state: {
    drawerConv: false,
    viewed: false,
    privateChat: [],
    popup: [],
    selected: null,
  },
  mutations: {
    SET_DRAWER_CHAT: function(state, value) {
      state.drawerConv = value;
    },
    ADD_PRIVATE_POPUP: function(state, index) {
      for (let i in state.popup) {
        if (state.popup[i] === index) return;
      }
      if (state.popup.length < 4) {
        state.popup.push(index);
      }
    },
    DELETE_PRIVATE_POPUP: function(state, index) {
      state.popup.splice(index, 1);
    },
    SELECTED_CHAT: function(state, index) {
      state.selected = index;
    },
    SET_PRIVATE_CHAT: function(state, { to, room }) {
      for (let i in state.privateChat) {
        if (state.privateChat[i].to.uuid === to.uuid) return;
      }
      state.privateChat.push({ to, room, notView: 0, messages: [] });
    },
    SET_ROOM_CHAT: function(state, { to, room }) {
      for (let i in state.privateChat) {
        if (state.privateChat[i].to.uuid === to.uuid) {
          state.privateChat[i].room = room;
        }
      }
    },
    INITIALIZE_MESSAGES: function(state, { index, messages }) {
      state.privateChat[index].messages = messages;
      for (let i in state.privateChat) {
        for (let j in messages) {
          if (state.privateChat[i].to.uuid === messages[j].user.uuid) {
            if (!messages[j].viewed){
              state.viewed = true
              state.privateChat[i].notView += 1;
            }
          }
        }
      }
    },
    ADD_NEW_MESSAGE: function(state, { index, message }) {
      state.viewed = true
      state.privateChat[index].messages.push(message);
      for (let i in state.privateChat) {
        if (state.privateChat[i].to.uuid === message.user.uuid) {
          state.privateChat[i].notView += 1;
        }
      }
    },
    RESET_MESSAGES_VIEWED: function(state, index){
      state.privateChat[index].notView = 0;
    },
    SET_VIEWED: function(state){
      state.viewed = false
    }
  },
  actions: {},
};

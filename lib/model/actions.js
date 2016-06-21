'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Actions;
function Actions(knex) {

  return {

    getNotJoined: function getNotJoined(userID) {
      return knex('actions').whereNotIn('id', knex.select('action_id').from('users_actions_index').where('user_id', userID)).then(function (rows) {
        // console.log('actions.getNotJoined returning rows', rows)
        return { actions: rows };
      });
    },

    getJoined: function getJoined(userID) {
      return knex('actions').join('users_actions_index', 'actions.id', 'users_actions_index.action_id').where('users_actions_index.user_id', userID).select('actions.*').then(addCommentsToActions).then(function (rows) {
        // console.log('actions.getJoined returning rows', rows)
        return { joinedActions: rows };
      });
    },

    joinAction: function joinAction(userID, actionID) {
      return knex('users_actions_index').insert({
        user_id: userID,
        action_id: actionID
      }).then(function () {
        return addCommentsToActions([{
          id: actionID
        }]).then(function (rows) {
          // console.log('actions.joinAction returning rows', rows)
          return { joinedAction: rows[0] };
        });
      });
    },

    unjoinAction: function unjoinAction(userID, actionID) {
      return knex('users_actions_index').where({
        user_id: userID,
        action_id: actionID
      }).del();
    }

  };

  function addCommentsToActions(actions) {
    return Promise.all(actions.map(function (action) {
      return selectComments(action.id);
    })).then(function (comments) {
      // console.log('actions.addCommentsToActions found comments', comments)
      for (var i = 0; i < actions.length; i++) {
        actions[i].comments = comments[i];
      }
      return actions;
    });
  }

  function selectComments(actionID) {
    return knex('comments').where('action_id', actionID).join('users', 'comments.user_id', 'users.id').select('users.id as user_id', 'users.name as user_name', 'comments.comment', 'comments.created_at');
  }
}
import router from './../main';
import authService from './auth';
import { TASK_URL } from './main';
// URL and endpoint constants


/* global localStorage: false, console: false, $: false */
/* eslint no-param-reassign: [2, { "props": false }]*/

export default {
  store(context, data, redirect) {
    context.$http.post(TASK_URL, data, authService.getAuthHeader())
      .then((res) => {
        if (res.data.id) {
          context.$store.dispatch('addSuccessMessage', 'Add task has been successful.');
          router.replace(redirect);
        }
      }, (err) => {
        if (typeof err.data === 'object') {
          context.errors.push(err.data);
        } else {
          const errors = JSON.parse(err.data);
          context.errors.push(errors);
        }
      });
  },

  all(context, parent = false) {
    context.items = [];
    context.$http.get(TASK_URL, authService.getAuthHeader())
      .then((res) => {
        if (typeof res.data === 'object') {
          context.items = res.data.items;
          if (parent) {
            if (context.items === null) {
              context.items = [];
            }
            context.items.push({ ID: 0, name: 'Parent' });
          }
        }
      }, (err) => {
        if (typeof err.data === 'object') {
          context.errors.push(err.data);
        } else {
          const errors = JSON.parse(err.data);
          context.errors.push(errors);
        }
      });
  },

  show(context, id) {
    context.$http.get(`${TASK_URL}/${id}`, authService.getAuthHeader())
      .then((res) => {
        if (typeof res.data === 'object') {
          context.task = res.data;
        }
      }, (err) => {
        if (typeof err.data === 'object') {
          context.errors.push(err.data);
        } else {
          const errors = JSON.parse(err.data);
          context.errors.push(errors);
        }
      });
  },

  showNotes(context, id) {
    context.items = [];
    context.$http.get(`${TASK_URL}/${id}/notes`, authService.getAuthHeader())
      .then((res) => {
        context.notes = res.data.items;
      }, (err) => {
        if (typeof err.data === 'object') {
          context.errors.push(err.data);
        } else {
          const errors = JSON.parse(err.data);
          context.errors.push(errors);
        }
      });
  },

  update(context, data, id, redirect) {
    context.$http.put(`${TASK_URL}/${id}`, data, authService.getAuthHeader())
      .then((res) => {
        if (res.data.ID) {
          context.$store.dispatch('addSuccessMessage', 'Update task has been successful.');
          router.replace(redirect);
        }
      }, (err) => {
        if (typeof err.data === 'object') {
          context.errors.push(err.data);
        } else {
          const errors = JSON.parse(err.data);
          context.errors.push(errors);
        }
      });
  },

  destroy(context, id, redirect) {
    context.$http.delete(`${TASK_URL}/${id}`, authService.getAuthHeader())
      .then((res) => {
        if (res.data.message) {
          context.$store.dispatch('addSuccessMessage', 'Delete task has been successful.');
          router.go(redirect);
        }
      }, (err) => {
        if (typeof err.data === 'object') {
          context.errors.push(err.data);
        } else {
          const errors = JSON.parse(err.data);
          context.errors.push(errors);
        }
      });
  },
};

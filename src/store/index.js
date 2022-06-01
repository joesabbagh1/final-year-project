import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    MenusDescription1: [],
    MenusDescription2: [],
    MenusDescription3: [],
    completeMenu: [],
    loading: false
  },
  getters: {
    getMenusDescription1: state => state.MenusDescription1,
    getMenusDescription2: state => state.MenusDescription2,
    getMenusDescription3: state => state.MenusDescription3,
    getCompleteMenu: state => state.completeMenu,
    loading: state => state.loading
  },
  mutations: {
    setCompleteMenu(state, payload) {
      state.completeMenu = payload;
    },
    setMenuDescription1(state, payload) {
      state.MenusDescription1 = payload;
    },
    setMenuDescription2(state, payload) {
      state.MenusDescription2 = payload;
    },
    setMenuDescription3(state, payload) {
      state.MenusDescription3 = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    
  },
  actions: {
    async getUsersMenus(context){
      let usersMenus = [], usersMenus1 = [], usersMenus2 = [], usersMenus3 = [], completeMenu = [],MenusDescription1 = [], MenusDescription2 = [], MenusDescription3 = []

      context.dispatch('getMenusDescription1')
      context.dispatch('getMenusDescription2')
      context.dispatch('getMenusDescription3')

      axios.get(`http://localhost:5290/api/UsersMenusAccess/1`)
      .then((Response)=>{

        usersMenus1= Response.data.map(e => {
          return e.mainNodeID1
        })
        
        usersMenus1.forEach((e1, i, a) => {
          context.state.MenusDescription1.forEach(e2 => {
            if (e1 == e2.subVariableCode) {
              a[i] = e2.description
            }
          })
        })

        usersMenus2= Response.data.map(e => {
          return e.mainNodeID2
        })

        usersMenus2.forEach((e1, i, a) => {
          context.state.MenusDescription2.forEach(e2 => {
            if (e1 == e2.subVariableCode) {
              a[i] = e2.description
            }
          })
        })

        usersMenus3= Response.data.map(e => {
          return e.mainNodeID3
        })

        usersMenus3.forEach((e1, i, a) => {
          context.state.MenusDescription3.forEach(e2 => {
            if (e1 == e2.subVariableCode) {
              a[i] = e2.description
            }
          })
        })

        usersMenus1.forEach((e,i) => {
          let a = [ e, usersMenus2[i], usersMenus3[i]]
          usersMenus.push(a)
        })

        usersMenus.forEach(v => {
          v.forEach((v2,i2,a2) => {
            if(i2 == 0 && !(completeMenu.some((v3,i3,a3) => { return v2 === v3.title }))) {
              let obj = { title: v2, subTitles: []}
              completeMenu.push(obj)
            }
            if(i2 == 1) {
              {
                let index = completeMenu.findIndex(
                  element => element.title === a2[0]
                )
                let obj = {}
                if (a2[2]) {
                  obj = { title: v2, subTitles: []}
                }
                else{
                  obj = {title: v2}
                }
                completeMenu[index].subTitles.push(obj)
              }
            }

            if(i2 == 2 && v2) {
              let obj = { title: v2}
              let index1 = completeMenu.findIndex(
                element => element.title === a2[0]
              )

              let index2 = completeMenu[index1].subTitles.findIndex((e,i,a) => {
                  return e.title === a2[1] && e.subTitles
              })
              completeMenu[index1].subTitles[index2].subTitles.push(obj)
            }
          })
          context.commit("setCompleteMenu", completeMenu)
        })
      });
    },
  
    async getMenusDescription1(context){
      context.commit("setLoading", true)
      await axios.get(`http://localhost:5290/api/UsersMenusAccess/api/UsersMenusAccess/menusDescription/1`)
      .then((Response)=>{
        context.commit("setMenuDescription1", Response.data)
        context.commit("setLoading", false)
      });
    },
    async getMenusDescription2(context){
      context.commit("setLoading", true)
      await axios.get(`http://localhost:5290/api/UsersMenusAccess/api/UsersMenusAccess/menusDescription/2`)
      .then((Response)=>{
        context.commit("setMenuDescription2", Response.data)
        context.commit("setLoading", false)
      });
    },
    async getMenusDescription3(context){
      context.commit("setLoading", true)
      await axios.get(`http://localhost:5290/api/UsersMenusAccess/api/UsersMenusAccess/menusDescription/3`)
      .then((Response)=>{
        context.commit("setMenuDescription3", Response.data)
        context.commit("setLoading", false)
      });
    },
  },
  modules: {},
});

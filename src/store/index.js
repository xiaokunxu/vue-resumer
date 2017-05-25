import Vuex from 'vuex'
import Vue from 'vue'
import objectPath from "object-path"
import AV from '../lib/leancloud'
import getAVUser from '../lib/getAVUser'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        selected: 'profile',
        user: {
            id: '',
            username: ''
        },
        resumeConfig: [
            { field: 'profile', icon: 'id', keys: ['name', 'city', 'title', 'birthday'] },
            { field: 'workHistory', icon: 'work', type: 'array', keys: ['company', 'details'] },
            { field: 'education', icon: 'book', type: 'array', keys: ['school', 'details'] },
            { field: 'projects', icon: 'heart', type: 'array', keys: ['name', 'details'] },
            { field: 'awards', icon: 'cup', type: 'array', keys: ['name', 'details'] },
            { field: 'contacts', icon: 'phone', type: 'array', keys: ['contact', 'content'] },
        ],
        resume: {
            // visibleItems: ['profile', 'work history', 'education', 'projects', 'awards', 'contacts', 'others'],
            id: ''
        }
    },
    mutations: {
        initState(state, payload) {
            state.resumeConfig.map((item) => {
                if (item.type === 'array') {
                    // state.resume[item.field] = [] // 这样写 Vue 无法监听属性变化
                    Vue.set(state.resume, item.field, [])
                } else {
                    // state.resume[item.field] = {} // 这样写 Vue 无法监听属性变化
                    Vue.set(state.resume, item.field, {})
                    item.keys.map((key) => {
                        // state.resume[item.field][key] = '' // 这样写 Vue 无法监听属性变化
                        Vue.set(state.resume[item.field], key, '')
                    })
                }
            })
            Object.assign(state, payload)
        },
        switchTab(state, payload) {
            state.selected = payload
            localStorage.setItem('state', JSON.stringify(state))
        },
        updateResume(state, { path, value }) {
            objectPath.set(state.resume, path, value)
            localStorage.setItem('state', JSON.stringify(state))
        },
        setUser(state, payload) {
            Object.assign(state.user, payload)
        },
        removeUser(state) {
            state.user.id = ''
        },
        addResumeSubfield(state, { field }) {
            let empty = {}
            state.resume[field].push(empty)
            state.resumeConfig.filter((i) => i.field === field)[0].keys.map((key) => {
                Vue.set(empty, key, '')
            })
        },
        removeResumeSubfield(state, { field, index }) {
            state.resume[field].splice(index, 1)
        },
        setResumeId(state, { id }) {
            state.resume.id = id
        },
        setResume(state, resume) {
            console.log('s')
            state.resumeConfig.map(({ field }) => {
                Vue.set(state.resume, field, resume[field])
            })
            state.resume.id = resume.id
        }
    },
    actions: {
        saveResume({ state, commit }, payload) {
            // 新建一个帖子对象
            var Resume = AV.Object.extend('Resume')
            var resume = new Resume()
            if (state.resume.id) {
                resume.id = state.resume.id
            } else {
                var resume = new Resume()
                resume.set('profile', state.resume.profile)
                resume.set('workHistory', state.resume.workHistory)
                resume.set('education', state.resume.education)
                resume.set('projects', state.resume.projects)
                resume.set('awards', state.resume.awards)
                resume.set('contacts', state.resume.contacts)
                resume.set('owner_id', getAVUser().id)
                var acl = new AV.ACL()
                acl.setPublicReadAccess(true)
                acl.setWriteAccess(AV.User.current(), true)

                resume.setACL(acl)
                resume.save().then(function(response) {
                    commit('setResumeId', { id: response.id })
                    console.log(111)
                }).catch(function(error) {
                    console.log(error)
                })
            }
        }
    }
})
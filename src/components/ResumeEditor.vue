<template>
  	<div id="resumeEditor">
	    <nav>
	    	<ol>
	    		<li v-for="(item, index) in resumeConfig" :class="{active: item.field === selected}" @click="selected = item.field"
	    		>
	    		<!-- {{index}} -->
		    		<svg class="icon">
           				<use :xlink:href="`#icon-${item.icon}`"></use>
			       </svg>
	    		</li>
	    	</ol>
	    </nav>
	    <ol class="panels">
	    	<li v-for="item in resumeConfig" v-show="item.field === selected">
		    <!-- {{resume[item.field]}} -->
		    <!-- <div class="resumeField" v-for="(value, key) in resume[item.field]"> -->
		        <div v-if="item.type === 'array'">
                    <h2>{{$t(`resume.${item.field}._`)}}</h2>
          		    <div class="subitem" v-for="(subitem, i) in resume[item.field]">
                        <button class="button remove small" @click="removeResumeSubfield(item.field, i)">删除</button>
            		    <div class="resumeField" v-for="(value,key) in subitem">
                            <label> {{$t(`resume.${item.field}.${key}`)}} </label>
              			    <input type="text" :value="value" @input="changeResumeField(`${item.field}.${i}.${key}`, $event.target.value)">
            		    </div>
            		    <hr>
          		    </div>
                    <button class="button" @click="addResumeSubfield(item.field)">新增</button>
        	    </div>
                <div v-else class="resumeField" v-for="(value,key) in resume[item.field]">
                    <label> {{$t(`resume.profile.${key}`)}} </label>
                    <input type="text" :value="value" @input="changeResumeField(`${item.field}.${key}`, $event.target.value)">
                </div>
	    	</li>
	    </ol>
	</div>
</template>

<script>
    export default {
        name: 'ResumeEditor',
        computed: { // 只用于读取数据
            selected: {
                get() {
                    return this.$store.state.selected
                },
                set(value) {
                    return this.$store.commit('switchTab', value)
                }
            },
            resume() {
                return this.$store.state.resume
            },
            resumeConfig() {
                return this.$store.state.resumeConfig
            }
        },
        methods: {
            changeResumeField(path, value) {
                this.$store.commit('updateResume', {
                    path,
                    value
                })
            },
            addResumeSubfield(field) {
                this.$store.commit('addResumeSubfield', {
                    field
                })
            },
            removeResumeSubfield(field, index) {
                this.$store.commit('removeResumeSubfield', {
                    field,
                    index
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    #resumeEditor {
        background: #fff;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .25);
        display: flex;
        flex-direction: row;
        overflow: auto;
        >nav {
            width: 80px;
            background: #000;
            color: #fff;
            >ol {
                >li {
                    height: 48px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: 16px;
                    margin-bottom: 16px;
                    cursor: pointer;
                    &.active {
                        background: #fff;
                        color: #000;
                    }
                }
            }
        }
        >.panels {
            flex-grow: 1;
            color: #666;
            font-size: 18px;
            >li {
                padding: 24px;
                h2 {
                    margin-bottom: 24px;
                }
            }
        }
        svg.icon {
            width: 24px;
            height: 24px;
        }
    }
    
    ol {
        list-style: none;
    }
    
    .resumeField {
        padding-bottom: 18px;
        >label {
            display: block;
        }
        input[type=text] {
            margin-top: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: inset 0 0 1px 0 rgba(0, 0, 0, .25);
            width: 100%;
            height: 40px;
            padding: 0 8px;
            outline: none;
        }
        input[type=text]:focus {
            border: 1px solid #ccc;
        }
    }
    
    hr {
        border: none;
        border-top: 1px solid #ddd;
        margin: 24px 0;
    }
    
    .subitem {
        position: relative;
        .button.remove {
            position: absolute;
            right: 0;
            top: -3px;
        }
    }
</style>
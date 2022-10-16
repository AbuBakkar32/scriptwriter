/* This is just a sample of how the script data structure will look like. */
const data = {
    id: 'script main id',
    title: 'the main title of the script',
    draft: {
        draft1: {
            active: 'true', // the current draft content on script bodies. if false then it not the current content on display
            data:{
                // id: representing each line in the editor
                // if type is scene-heading just add ev(emotional value) and scene goal(scenegoal) in others key.
                // if type is character just add charaterId in others key.
                // id: representing each line in the editor
                id:{
                    id:'script main id',
                    content: 'the content text with html',
                    type: 'the type of script body',
                    color: 'bg-blue',
                    others: {},
                    note: {
                        text: 'text box content of the left side message-icon in the content line.',
                        authorID: 'author id',
                        authorName: '',
                        date: '',
                        color: 'bg-blue',
                        list: {
                            0 : {
                                text: 'text box content of the right side tip-icon in the content line.',
                                authorID: 'author id',
                                authorName: '',
                                date: '',
                                color: 'bg-blue',
                            }
                        }
                    }
                }
            }
        },
        draft2: {
            active: 'false',
            data:{
                id:{
                    id:'script main id',
                    body: 'the raw content text',
                    content: 'the content text with html',
                    type: 'the type of script body',
                    color: 'bg-blue',
                    others: {},
                    note: {
                        text: 'text box content of the left side message-icon in the content line.',
                        authorID: 'author id',
                        authorName: '',
                        date: '',
                        color: 'bg-blue',
                        list: {
                            0 : {
                                text: 'text box content of the right side tip-icon in the content line.',
                                authorID: 'author id',
                                authorName: '',
                                date: '',
                                color: 'bg-blue',
                            }
                        }
                    }
                }
            }
        }
        //And so on ...
    },
    location: {
        // id: representing each line in the editor
        id:{
            id:'scriptBody id',
            content: 'the content text with html',
        }
    },
    storydos: {
        // id: representing each line in the editor
        id:{
            id:'scriptBody id',
            content: 'the content text with html',
        }
    },
    character: {
        // id: representing each line in the editor
        id:{
            id:'character id',
            name: 'name of character',
            archetype: 'hero or valine',
            possession: '1% to 100%. this the how much the character name is dominated in the script',
            need: 'what the character needs',
            want: 'what the charater wants',
            obstacle: 'challenges that the character might face',
            resolvingObstacle: 'solution to solve the obstacles',
            synopsis: 'Character Synopsis',
            trait: '',
            occupation: '',
            color: 'bg-blue',
            image: '',
            age: '',
            gender: '',
            interest: '',
            item1: 'nill', item2: 'nill',item3: 'nill',item4: 'nill',item5: 'nill',item6: 'nill',item7: 'nill',item8: 'nill',
            item9: 'nill', item10: 'nill', item11: 'nill', item12: 'nill', item13: 'nill', item14: 'nill',
        }
    },
    pinboard: {
        id: {
            id: '',
            title: '',
            body: '',
            color: 'bg-green',
        }
    },
    titlePage: {
        title: '',
        writtenBy: '',
        contactName: '',
        emailAddress: '',
        phoneNumber: ''
    },
    color: 'bg-blue',
    pageSet:[1]
}
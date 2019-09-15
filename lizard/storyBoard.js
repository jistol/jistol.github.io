const enemyAbility = {
    GRAY : {
        r : 25,
        y : -25,
        s : 3,
        hp : 100,
        score : 5,
        bodyStyle : '#989898',
        bodyStrokeStyle : '#909090'
    },
    YELLOW : {
        r : 25,
        y : -25,
        s : 3,
        hp : 150,
        score : 7,
        bodyStyle : '#e9de12',
        bodyStrokeStyle : '#dbd018'
    },
    RED : {
        r : 25,
        y : -25,
        s : 3.5,
        hp : 200,
        score : 10,
        bodyStyle : '#981a1e',
        bodyStrokeStyle : '#76514f'
    },
    SKY : {
        r : 25,
        y : -25,
        s : 4.5,
        hp : 150,
        score : 15,
        bodyStyle : '#09bac3',
        bodyStrokeStyle : '#557376'
    },
    GOLD : {
        r : 25,
        y : -25,
        s : 2.5,
        hp : 300,
        score : 17,
        bodyStyle : '#c39834',
        bodyStrokeStyle : '#764e21'
    },
    WHITE : {
        r : 25,
        y : -25,
        s : 5.5,
        hp : 100,
        score : 15,
        bodyStyle : '#beaec3',
        bodyStrokeStyle : '#f7f6ff'
    }
};


const storyBoard = {
    version : 1,
    title : 'Lizard Flight',
    txt : {
        opening : {
            message : 'Lizard Flight',
            fontStyle : '#71ff7d',
            bgStyle : 'rgba(0,128,0,0.2)',
            usePressKey : true
        },
        dead : {
            message : 'YOU DIED',
            fontStyle : '#c80000',
            bgStyle : 'rgba(128,0,0,0.2)',
            usePressKey : true
        },
        ending : {
            message : 'THE END',
            fontStyle : '#113dff',
            bgStyle : 'rgba(20,20,20,0.2)',
            usePressKey : true
        }
    },
    story : [
        {
            level : 1,
            opening : {
                message : 'Level 1',
                bgStyle : 'rgba(0,128,0,0.2)',
                fontStyle : '#ffdb2a'
            },
            ending : {
                message : 'MISSION COMPLETE',
                bgStyle : 'rgba(0,128,0,0.2)',
                fontStyle : '#ffdb2a'
            },
            enemyList : [
                { clazz : 'BasicEnemy', option : enemyAbility.GRAY },
                { clazz : 'BasicEnemy', option : enemyAbility.GRAY },
                { clazz : 'BasicEnemy', option : enemyAbility.YELLOW },
                { clazz : 'BasicEnemy', option : enemyAbility.GRAY },
                { clazz : 'BasicEnemy', option : enemyAbility.YELLOW }
            ]
        },
        {
            level : 2,
            opening : {
                message : 'Level 2',
                bgStyle : 'rgba(0,128,0,0.2)',
                fontStyle : '#ffdb2a'
            },
            ending : {
                message : 'MISSION COMPLETE',
                bgStyle : 'rgba(0,128,0,0.2)',
                fontStyle : '#ffdb2a'
            },
            enemyList : [
                { clazz : 'BasicEnemy', option : enemyAbility.GRAY },
                { clazz : 'BasicEnemy', option : enemyAbility.YELLOW },
                { clazz : 'BasicEnemy', option : enemyAbility.GRAY },
                { clazz : 'BasicEnemy', option : enemyAbility.YELLOW },
                { clazz : 'BasicEnemy', option : enemyAbility.GRAY },
                { clazz : 'BasicEnemy', option : enemyAbility.RED },
                { clazz : 'BasicEnemy', option : enemyAbility.RED }
            ]
        },
        {
            level : 3,
            opening : {
                message : 'Level 3',
                bgStyle : 'rgba(0,128,0,0.2)',
                fontStyle : '#ffdb2a'
            },
            ending : {
                message : 'MISSION COMPLETE',
                bgStyle : 'rgba(0,128,0,0.2)',
                fontStyle : '#ffdb2a'
            },
            enemyList : [
                { clazz : 'BasicEnemy', option : enemyAbility.SKY },
                { clazz : 'BasicEnemy', option : enemyAbility.YELLOW },
                { clazz : 'BasicEnemy', option : enemyAbility.RED },
                { clazz : 'BasicEnemy', option : enemyAbility.YELLOW },
                { clazz : 'BasicEnemy', option : enemyAbility.GRAY },
                { clazz : 'BasicEnemy', option : enemyAbility.RED },
                { clazz : 'BasicEnemy', option : enemyAbility.RED }
            ]
        },
        {
            level : 4,
            opening : {
                message : 'Level 4',
                bgStyle : 'rgba(0,128,0,0.2)',
                fontStyle : '#ffdb2a'
            },
            ending : {
                message : 'MISSION COMPLETE',
                bgStyle : 'rgba(0,128,0,0.2)',
                fontStyle : '#ffdb2a'
            },
            enemyList : [
                { clazz : 'BasicEnemy', option : enemyAbility.RED },
                { clazz : 'BasicEnemy', option : enemyAbility.SKY },
                { clazz : 'BasicEnemy', option : enemyAbility.GOLD },
                { clazz : 'BasicEnemy', option : enemyAbility.WHITE },
                { clazz : 'BasicEnemy', option : enemyAbility.SKY },
                { clazz : 'BasicEnemy', option : enemyAbility.RED },
                { clazz : 'BasicEnemy', option : enemyAbility.WHITE },
                { clazz : 'BasicEnemy', option : enemyAbility.GOLD }
            ]
        }
    ]
};
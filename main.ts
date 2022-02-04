namespace SpriteKind {
    export const Icon = SpriteKind.create()
    export const Tower = SpriteKind.create()
}
function startSwarm () {
    swarmLeftToSpawn = swarmTotal
    swarmLeftToDestroy = swarmTotal
    eliteLeftToSpawn = eliteTotal
    eliteLeftToDestroy = eliteTotal
}
function damageBee (sprite: Sprite, damage: number) {
    sprites.changeDataNumberBy(sprite, "health", 0 - damage)
    if (sprites.readDataNumber(sprite, "health") <= 0) {
        sprite.destroy()
        info.changeScoreBy(1)
    }
}
function makeATower (name: string, image2: Image, cost: number) {
    newTower = sprites.create(image2, SpriteKind.Tower)
    sprites.setDataString(newTower, "name", name)
    sprites.setDataNumber(newTower, "cost", cost)
    return newTower
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(thingWeAreHolding)) {
        if (cursor.overlapsWith(archer_icon)) {
            if (info.score() >= 20) {
                thingWeAreHolding = makeATower("Archer", img`
                    . . . . . f f . . . . 
                    . . . . f 7 7 f . . . 
                    . . . f 7 7 7 7 f . . 
                    . . . f 7 7 7 7 7 f . 
                    . . 7 7 f f f f f 7 7 
                    . . . 7 7 7 7 7 7 7 . 
                    . . . . 1 f 1 f 1 . . 
                    . . . . 1 f 1 f 1 . . 
                    . . . . 1 1 3 1 1 . . 
                    . . . . e e e e e . . 
                    . . . . e e e e e . . 
                    4 . . . e e e e e . . 
                    4 4 4 . e e e e e . . 
                    . . 4 4 e e e e e . . 
                    . . . . e e e e e . . 
                    `, 10)
                cursor.setFlag(SpriteFlag.Invisible, true)
                info.changeScoreBy(-20)
            }
        } else if (cursor.overlapsWith(zap_icon)) {
            if (info.score() >= 20) {
                thingWeAreHolding = makeATower("Static Cat", img`
                    . . . . 4 4 . 1 1 
                    . . . . 4 4 . 1 1 
                    . . . . 4 1 1 1 1 
                    . . . . 1 f 1 f 1 
                    . . . . 1 f 1 f 1 
                    . . . . 1 1 3 1 1 
                    . . . . 1 1 1 1 e 
                    . . . . 1 d d d e 
                    e . . . 1 d d d e 
                    e e 1 . 1 d d d e 
                    . . 1 1 1 d d d e 
                    . . . . 1 1 e e e 
                    `, 10)
                cursor.setFlag(SpriteFlag.Invisible, true)
                info.changeScoreBy(-20)
            }
        } else {
        	
        }
    } else {
        thingWeAreHolding = [][0]
        cursor.setFlag(SpriteFlag.Invisible, false)
    }
})
function doLightningStrike (source: Sprite, damage: number, struck: any[]) {
    if (damage > 0) {
        struck.push(source)
        damageBee(source, damage)
        for (let value of spriteutils.getSpritesWithin(SpriteKind.Enemy, 24, source)) {
            if (struck.indexOf(value) == -1) {
                doLightningStrike(value, damage / 2, struck)
                list.push([source, value])
            }
        }
    }
}
info.onCountdownEnd(function () {
    startSwarm()
})
spriteutils.createRenderable(5, function (screen2) {
    for (let value of sprites.allOfKind(SpriteKind.Tower)) {
        if (sprites.readDataString(value, "name") == "Archer") {
            spriteutils.drawCircle(
            screen2,
            value.x,
            value.y,
            archerRadius,
            3
            )
        }
    }
    for (let value of list) {
        screen2.drawLine(value[0].x + randint(-1, 1), value[0].y + randint(-1, 1), value[1].x, value[1].y, 5)
    }
})
scene.onHitWall(SpriteKind.Enemy, function (sprite, location) {
    enemySpeed = commonerSpeed
    if (sprites.readDataBoolean(sprite, "elite")) {
        enemySpeed = eliteSpeed
    }
    if (tiles.tileIs(tiles.locationOfSprite(sprite), assets.tile`myTile7`)) {
        sprite.vy = 0
        sprite.vx = enemySpeed
        if (sprites.readDataBoolean(sprite, "elite")) {
            sprite.setImage(img`
                . . . . 1 1 . . 
                . . . . 1 1 . . 
                . 4 5 . 5 4 2 2 
                5 4 5 4 5 4 5 5 
                5 4 5 4 5 4 5 5 
                . 4 5 . 5 4 2 2 
                . . . . 1 1 . . 
                . . . . 1 1 . . 
                `)
        } else {
            sprite.setImage(img`
                . . . 1 1 . . . 
                . . 1 c 5 1 . . 
                . c 5 1 1 c f f 
                5 c 5 c 5 c 5 5 
                5 c 5 c 5 c 5 5 
                . c 5 1 1 c f f 
                . . 1 c 5 1 . . 
                . . . 1 1 . . . 
                `)
        }
    } else if (tiles.tileIs(tiles.locationOfSprite(sprite), assets.tile`myTile4`)) {
        sprite.vy = enemySpeed
        sprite.vx = 0
        if (sprites.readDataBoolean(sprite, "elite")) {
            sprite.setImage(img`
                . . . 5 5 . . . 
                . . 4 4 4 4 . . 
                . . 5 5 5 5 . . 
                . . . 4 4 . . . 
                1 1 5 5 5 5 1 1 
                1 1 4 4 4 4 1 1 
                . . 2 5 5 2 . . 
                . . 2 5 5 2 . . 
                `)
        } else {
            sprite.setImage(img`
                . . . 5 5 . . . 
                . . c c c c . . 
                . 1 5 5 5 5 1 . 
                1 c 1 c c 1 c 1 
                1 5 1 5 5 1 5 1 
                . 1 c c c c 1 . 
                . . f 5 5 f . . 
                . . f 5 5 f . . 
                `)
        }
    } else if (tiles.tileIs(tiles.locationOfSprite(sprite), assets.tile`myTile8`)) {
        sprite.vy = 0
        sprite.vx = 0 - enemySpeed
        if (sprites.readDataBoolean(sprite, "elite")) {
            sprite.setImage(img`
                . . 1 1 . . . . 
                . . 1 1 . . . . 
                2 2 4 5 . 5 4 . 
                5 5 4 5 4 5 4 5 
                5 5 4 5 4 5 4 5 
                2 2 4 5 . 5 4 . 
                . . 1 1 . . . . 
                . . 1 1 . . . . 
                `)
        } else {
            sprite.setImage(img`
                . . . 1 1 . . . 
                . . 1 5 c 1 . . 
                f f c 1 1 5 c . 
                5 5 c 5 c 5 c 5 
                5 5 c 5 c 5 c 5 
                f f c 1 1 5 c . 
                . . 1 5 c 1 . . 
                . . . 1 1 . . . 
                `)
        }
    } else if (tiles.tileIs(tiles.locationOfSprite(sprite), assets.tile`myTile9`)) {
        sprite.vy = 0 - enemySpeed
        sprite.vx = 0
        if (sprites.readDataBoolean(sprite, "elite")) {
            sprite.setImage(img`
                . . 2 5 5 2 . . 
                . . 2 5 5 2 . . 
                1 1 4 4 4 4 1 1 
                1 1 5 5 5 5 1 1 
                . . . 4 4 . . . 
                . . 5 5 5 5 . . 
                . . 4 4 4 4 . . 
                . . . 5 5 . . . 
                `)
        } else {
            sprite.setImage(img`
                . . f 5 5 f . . 
                . . f 5 5 f . . 
                . 1 c c c c 1 . 
                1 5 1 5 5 1 5 1 
                1 c 1 c c 1 c 1 
                . 1 5 5 5 5 1 . 
                . . c c c c . . 
                . . . 5 5 . . . 
                `)
        }
    } else if (tiles.tileIs(tiles.locationOfSprite(sprite), assets.tile`myTile10`)) {
        sprite.vy = 0
        sprite.vx = enemySpeed
        if (sprites.readDataBoolean(sprite, "elite")) {
            sprite.setImage(img`
                . . 1 1 . . . . 
                . . 1 1 . . . . 
                2 2 4 5 . 5 4 . 
                5 5 4 5 4 5 4 5 
                5 5 4 5 4 5 4 5 
                2 2 4 5 . 5 4 . 
                . . 1 1 . . . . 
                . . 1 1 . . . . 
                `)
        } else {
            sprite.setImage(img`
                . . . 1 1 . . . 
                . . 1 5 c 1 . . 
                f f c 1 1 5 c . 
                5 5 c 5 c 5 c 5 
                5 5 c 5 c 5 c 5 
                f f c 1 1 5 c . 
                . . 1 5 c 1 . . 
                . . . 1 1 . . . 
                `)
        }
        if (Math.percentChance(50)) {
            if (sprites.readDataBoolean(sprite, "elite")) {
                sprite.setImage(img`
                    . . . . 1 1 . . 
                    . . . . 1 1 . . 
                    . 4 5 . 5 4 2 2 
                    5 4 5 4 5 4 5 5 
                    5 4 5 4 5 4 5 5 
                    . 4 5 . 5 4 2 2 
                    . . . . 1 1 . . 
                    . . . . 1 1 . . 
                    `)
            } else {
                sprite.setImage(img`
                    . . . 1 1 . . . 
                    . . 1 c 5 1 . . 
                    . c 5 1 1 c f f 
                    5 c 5 c 5 c 5 5 
                    5 c 5 c 5 c 5 5 
                    . c 5 1 1 c f f 
                    . . 1 c 5 1 . . 
                    . . . 1 1 . . . 
                    `)
            }
            sprite.vx = 0 - enemySpeed
        }
    } else if (tiles.tileIs(tiles.locationOfSprite(sprite), assets.tile`myTile2`)) {
        sprite.destroy()
        info.changeLifeBy(-1)
    } else {
    	
    }
})
sprites.onDestroyed(SpriteKind.Enemy, function (sprite) {
    if (sprites.readDataBoolean(sprite, "elite")) {
        eliteLeftToDestroy += -1
    } else {
        swarmLeftToDestroy += -1
    }
    if (swarmLeftToSpawn == 0 && swarmLeftToDestroy == 0 && (eliteLeftToDestroy == 0 && eliteLeftToSpawn == 0)) {
        swarmTotal += 5
        eliteTotal += 2
        info.startCountdown(10)
    }
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.destroy()
    damageBee(otherSprite, 100)
})
let newEnemy: Sprite = null
let projectile: Sprite = null
let target: Sprite = null
let enemySpeed = 0
let thingWeAreHolding: Sprite = null
let newTower: Sprite = null
let eliteLeftToDestroy = 0
let eliteTotal = 0
let eliteLeftToSpawn = 0
let swarmLeftToDestroy = 0
let swarmLeftToSpawn = 0
let list: Sprite[][] = []
let zap_icon: Sprite = null
let archer_icon: Sprite = null
let cursor: Sprite = null
let archerRadius = 0
let swarmTotal = 0
let eliteSpeed = 0
let commonerSpeed = 0
tiles.loadMap(tiles.createSmallMap(tilemap`level2`))
commonerSpeed = 20
eliteSpeed = 35
tiles.coverAllTiles(assets.tile`myTile4`, assets.tile`myTile0`)
tiles.coverAllTiles(assets.tile`myTile8`, assets.tile`myTile0`)
tiles.coverAllTiles(assets.tile`myTile9`, assets.tile`myTile0`)
tiles.coverAllTiles(assets.tile`myTile7`, assets.tile`myTile0`)
tiles.coverAllTiles(assets.tile`myTile10`, assets.tile`myTile0`)
swarmTotal = 10
archerRadius = 24
cursor = sprites.create(img`
    . . . . . . . f . . 
    . . . . . . f 1 f . 
    . . . . . . f 1 f . 
    . f . f . f f 1 f . 
    f 1 f 1 f 1 f 1 f . 
    f 1 1 1 1 1 1 1 1 f 
    f 1 1 1 1 1 1 1 1 f 
    f 1 1 1 1 1 1 1 1 f 
    . f 1 1 1 1 1 1 f . 
    . . f f f f f f . . 
    `, SpriteKind.Player)
cursor.z = 5
controller.moveSprite(cursor, 70, 70)
cursor.setFlag(SpriteFlag.GhostThroughWalls, true)
archer_icon = sprites.create(img`
    . b b b b b b b b b . 
    b d d d d d d d d d b 
    b d d d d 1 d d d d b 
    b d d d 1 1 1 d d d b 
    b d d d d e d d d d b 
    b d d d d e d d d d b 
    b d d d b e b d d d b 
    b d d d b e b d d d b 
    b d d d b e b d d d b 
    b d d d d d d d d d b 
    . b b b b b b b b b . 
    `, SpriteKind.Icon)
archer_icon.top = 1
archer_icon.left = 100
zap_icon = sprites.create(img`
    . b b b b b b b b b . 
    b d d d d d d d d d b 
    b d d d d 5 5 5 5 d b 
    b d d d 5 5 5 5 d d b 
    b d d 5 5 5 5 d d d b 
    b d d d 5 5 5 5 d d b 
    b d d d d 5 5 d d d b 
    b d d d 5 5 d d d d b 
    b d d d 5 d d d d d b 
    b d d d d d d d d d b 
    . b b b b b b b b b . 
    `, SpriteKind.Icon)
zap_icon.top = 1
zap_icon.left = 115
let goo_icon = sprites.create(img`
    . b b b b b b b b b . 
    b d d d d d d d d d b 
    b d d d d 6 d d d d b 
    b d d d d 6 d d d d b 
    b d d d 6 6 6 d d d b 
    b d d d 6 6 6 d d d b 
    b d d 6 6 6 6 6 d d b 
    b d d 6 6 6 6 6 d d b 
    b d d d 6 6 6 d d d b 
    b d d d d d d d d d b 
    . b b b b b b b b b . 
    `, SpriteKind.Icon)
goo_icon.top = 1
goo_icon.left = 130
info.setLife(20)
info.startCountdown(10)
info.setScore(40)
list = []
game.onUpdate(function () {
    if (thingWeAreHolding) {
        thingWeAreHolding.setPosition(cursor.x, cursor.y)
    }
})
game.onUpdateInterval(2000, function () {
    for (let value of sprites.allOfKind(SpriteKind.Tower)) {
        if (sprites.readDataString(value, "name") == "Static Cat" && value != thingWeAreHolding) {
            target = spriteutils.getSpritesWithin(SpriteKind.Enemy, archerRadius, value)._pickRandom()
            if (target) {
                doLightningStrike(target, 100, [])
            }
        }
    }
    timer.after(1000, function () {
        list = []
    })
})
game.onUpdateInterval(1000, function () {
    for (let value of sprites.allOfKind(SpriteKind.Tower)) {
        if (sprites.readDataString(value, "name") == "Archer" && value != thingWeAreHolding) {
            target = spriteutils.getSpritesWithin(SpriteKind.Enemy, archerRadius, value)._pickRandom()
            if (target) {
                projectile = sprites.createProjectileFromSprite(img`
                    3 3 
                    3 3 
                    `, value, 0, 0)
                spriteutils.setVelocityAtAngle(projectile, spriteutils.angleFrom(value, target), 100)
                projectile.setFlag(SpriteFlag.GhostThroughWalls, true)
            }
        }
    }
})
game.onUpdateInterval(1000, function () {
    if (swarmLeftToSpawn > 0) {
        swarmLeftToSpawn += -1
        newEnemy = sprites.create(img`
            . . . 5 5 . . . 
            . . c c c c . . 
            . 1 5 5 5 5 1 . 
            1 c 1 c c 1 c 1 
            1 5 1 5 5 1 5 1 
            . 1 c c c c 1 . 
            . . f 5 5 f . . 
            . . f 5 5 f . . 
            `, SpriteKind.Enemy)
        tiles.placeOnRandomTile(newEnemy, assets.tile`myTile1`)
        newEnemy.vy = commonerSpeed
        sprites.setDataNumber(newEnemy, "health", 200)
    } else if (eliteLeftToSpawn > 0) {
        eliteLeftToSpawn += -1
        newEnemy = sprites.create(img`
            . . . 5 5 . . . 
            . . 4 4 4 4 . . 
            . . 5 5 5 5 . . 
            . . . 4 4 . . . 
            1 1 5 5 5 5 1 1 
            1 1 4 4 4 4 1 1 
            . . 2 5 5 2 . . 
            . . 2 5 5 2 . . 
            `, SpriteKind.Enemy)
        tiles.placeOnRandomTile(newEnemy, assets.tile`myTile1`)
        newEnemy.vy = eliteSpeed
        sprites.setDataNumber(newEnemy, "health", 400)
        sprites.setDataBoolean(newEnemy, "elite", true)
    }
})

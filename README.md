## Goal

The goal of the project is to create a genetic evolution simulator. The simulation is a 2D world, consisting of a group of "creatures" competing for "food". Creatures expend energy when performing actions like moving or fighting, and regain energy by eating food, which spawns randomly around the map at randomized intervals.

The creatures' actions are governed by a set of genes like speed and strength. The initial set of creatures spawned will have randomized values for each gene, meaning they won't be very good at finding food. Some will move too quickly and will continuously "skip" over food they find until they get bored, some will be too eager to fight other creatures they spot and die fighting, and some may turn right too often and get stuck spinning in a corner. Creatures must move every simulated second, so those who cannot find food in time will run out of energy and die. But some will stumble upon food by the luck of their genes and live long enough to mate with other creatures, passing on their successful (or not so successful) traits to new creatures.

As generations are born and the older ones die out, the creatures will get better at finding food. Hopefully in the end we get to see some interesting genes in those creatures most proficient at getting food.

## Behaviour

A fair warning that this is all tentative. The project is in its infancy and once everything's together I will certainly need to change a lot about the creatures' behaviour to make sure the simulation works.

### Creature States

Each creature has 3 states. They are either:
1. Wandering
2. Pursuing food
3. Pursuing a mate
4. Pursuing combat


#### Wandering

In this state, the creature has no particular goal in mind. Every simulated second it moves in a semi-random manner as governed by its genes and scans its surroundings for food or other creatures. If it finds nothing it will continue wandering. If it finds only food it will enter state 2, pursuing food. If it finds only other creatures it will decide semi-randomly (based off its genes) whether to ignore them (continue in state 1), pursue one to mate with it (state 3), or pursue one to attack it (state 4). If it finds both food and creatures it will decide between all of the listed options based off its inclinations due to its genes.

#### Pursuing food

Food locations do not change so this state is very simple. When pursuing food the creature locks in on one particular food and moves in the direction of that food every simulated second until it either reaches it or gets bored. Boredom is calculated based off genes each time the creature moves in this state. It follows that the longer the creature pursues the food, the more likely it is to get bored doing so. If a creature gets bored looking for food it will go back to wandering (state 1).

> An example of a reason a creature may get bored is due to low speed, it simply isn't moving quick enough toward the food its looking for. 

#### Pursing a mate

In this state, the creature is locked into following another creature until they meet or until the pursuing creature gets bored. Like with food, boredom when pursuing a mate is calculated based off genes. If the two creatures do end up meeting, the pursued creature may not want to mate with its pursuer (this is governed by an "agreeableness to mate" gene). If the pursued does not want to mate, it will fight the pursuer. If it does want to mate, the two will mate. See the sections on combat and mating for more on how those two events occur. If the two successfully mate, the pursuer returns to wandering (state 1) and the pursued continues whatever it was doing.

> Unlike food, high boredom when pursuing a mate may be more desirable, as pursuing a mate for too long costs energy (as any moving does) and since the creature is in pursuit it is not interested in food and thus cannot regain energy.

#### Pursing combat

This state is similar to pursuing a mate. In this state, the creature is locked into following another creature until they meet (and fight) or until the pursuing creature gets bored. To see how combat works, see the section on combat. If the pursuer wins the combat, it will return to wandering.

> A creature that pursues combat often and wins will have access to a lot of food, but combat is risky so it is not always desirable to fight.

### Mating

When two creatures mate, they produce a child that has an average of both the parents' genes, with some variation thrown in. There is a threshold of randomness around the inherited genes, so a child may be better in some areas and worse in some areas than its siblings. There is also a small chance that any given gene is completely randomized, independent of the two parents. The child is imparted a certain amount of energy to start with from its parents, which detracts from the parents' energy totals. How much energy each parent imparts is again based off genes.

> The slight randomness and mutation in child creatures will hopefully allow for different food-gathering strategies to emerge. For example, a child's parents may have been good at getting food because they were fast, strong and often sook combat. The child may inherit the speed and strength but not the combat-seeking, and so be very adept at locating food, and be resilient to aggressive creatures it meets while zipping around.

### Combat

When two creatures fight, the outcome is decided by which of the two has more strength. The one with higher strength wins but loses a large chunk of energy. The one with lower strength is immediately killed (this may change, since it does seem a tad harsh).

> Combat is good for clearing out an area of the world, which in turn means all the food in the area is up for grabs.

### Genes

The genes of each creature are what governs its behaviour. This is all tentative, as the project is currently in its infancy. I may forget to update this list as the project goes on, but here's what I've got so far.

- *speed*: units moved each simulated second
- *strength*: strength in combat
- *boredomFood*: likelihood of becoming bored while pursuing food
- *boredomMate*: likelihood of becoming bored while pursuing a mate
- *energyLostToChild*: amount of energy imparted to a child when it's born
- *energyLostToCombat*: amount of energy lost after winning a combat
- *foodMatePreference*: likelihood to choose food over mating
- *matingAgreeableness*: likelihood to agree to mate if a pursuer catches up (alternative is fighting)
- *likelihoodTurnRight*: chance of turning right when wandering
- *likelihoodTurnLeft*: chance of turning left when wandering
- *angleTurn*: if decided to turn, amount of degrees to turn
- *variationAngleTurn*: if decided to turn, amount of variation in how many degrees to turn

## Tech

The project will use React with no strict typing for page design, and HTML5 canvas for rendering the simulator. I'm also making use of material UI for basic UI elements, and lodash for utility functions.

## Inspiration

This project is inspired by YouTuber SethBling's video on [Genetic Evolution in Minecraft 1.14](https://youtu.be/9aIp5DdnKwM).

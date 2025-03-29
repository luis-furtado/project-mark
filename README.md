TODO:
* Explanation of project structure
    * Dependency injection
    * Factories
    * ETC
* Node version dependency and how to install dependency
* How to run and check prettier format;
* Explain why use enums
* Create example to test and run: 
    ID	Name	Version	parentTopicId
    1	Programming	1	null
    2	Frontend	1	1
    3	Backend	1	1
    4	React	1	2
    5	React	2	2
* Explain how to test by Postman

DONE:
* Adjust logic to can not update the topic for new version if already exists new version (always verify the version - 1 ?);
* Verify if can improve the DI (dependency injection for errors in services);
* Verify route to get all node
* Create route to calculate the shortest path
* Review and remove complexity

TODO:
* Create correct structure of log
* Create unit tests
* Create integration tests


* Return the Anthony that inside the description of the challenge don't specify to implement a CRUD or anything like that for another entities (User and Resource), just specify for Topic entity. Because of this, for this specific models (User and Resources), I create all the base domain/core structure, creating the models, creating the strategies for user/roles permissions but not implemented the CRUD for this 2 entities and not implemented the base authentication for User on the system, this is being a block for use the strategies inside the modules of topics by users/permissions. I prefer not focus on this to focus on Topic business/logic rule and make a unit and integration tests... But if you want this implementation, I can use some more days to implement this... Add in message too, the steps to Anthony can test easily.




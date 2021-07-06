Assumptions:

- Portfolio is an object with subscriptions within it.
- Channels is an array of objects, each object has a name and a set of rewards
- Channel rewards is an array of strings

Design:

- I was going to use promises, however, I was having trouble remembering how to get that to work with Mocha so I reverted.
- I am using Mocha, Chai and Sinon for my libraries
- I decided to include NYC for coverage reporting

What could be done:

- Obviously this would need to be linked to some sort of DB for the channels, we should extend testing for that capability at that time
- We should probably look at how we can better test the response of the rewards for different channels, this was very quickly mocked up.

const { channels } = require("./constants");

function rewardsService({
  customerAccountNumber,
  portfolio,
  eligibilityService,
}) {
  try {
    if (!customerAccountNumber) {
      // If no account number is provided then return an error with no rewards
      return {
        rewards: [],
        error: "Invalid account number",
      };
    }

    // Ensure that the required params are present and valid.
    if (
      portfolio &&
      typeof portfolio === "object" &&
      portfolio.subscriptions &&
      Array.isArray(portfolio.subscriptions) &&
      portfolio.subscriptions.length > 0 &&
      eligibilityService &&
      typeof eligibilityService === "function"
    ) {
      const retrieveEligibility = eligibilityService(customerAccountNumber);

      if (!retrieveEligibility) {
        return {
          rewards: [],
        };
      }

      if (retrieveEligibility === "Invalid account number exception") {
        return {
          rewards: [],
          error: "Invalid account number",
        };
      }

      if (retrieveEligibility === "CUSTOMER_ELIGIBLE") {
        let matchingChannels = [];

        // Map through the portfolio to build a list of the matching channels
        portfolio.subscriptions.map((subscription) => {
          const matchingChannel = channels.find(
            (channel) => channel.name === subscription
          );

          if (matchingChannel) {
            matchingChannels.push(matchingChannel);
          }
        });

        if (matchingChannels && matchingChannels.length > 0) {
          const matchingRewards = [];

          // Map through the matching channels to build a list of rewards
          matchingChannels.map((channel) => {
            channel.rewards.map((reward) => {
              matchingRewards.push(reward);
            });
          });

          if (matchingRewards && matchingRewards.length > 0) {
            // Return list of matching rewards
            return {
              rewards: matchingRewards,
            };
          } else {
            return {
              rewards: [],
            };
          }
        } else {
          return {
            rewards: [],
          };
        }
      } else {
        return {
          rewards: [],
        };
      }
    } else {
      throw new Error("Invalid parameters were provided.");
    }
  } catch (err) {
    // TODO: We should switch this console for a logging tool
    console.error(err);
    return {
      rewards: [],
    };
  }
}

module.exports = {
  rewardsService,
};

const { rewardsService } = require("./redeemService");

const { channels, customerAccountNumber } = require("./constants");

const expect = require("chai").expect;
const assert = require("chai").assert;
const sinon = require("sinon");

describe("Rewards Service", function () {
  it("Returns empty rewards if there's no account number", function () {
    const eligibilityServiceStub = sinon.stub().returns("CUSTOMER_ELIGIBLE");

    const rewardsServiceResponse = rewardsService({
      customerAccountNumber: null,
      portfolio: { subscriptions: ["SPORTS"] },
      eligibilityService: eligibilityServiceStub,
    });

    expect(rewardsServiceResponse).to.be.a("object");
    expect(rewardsServiceResponse.rewards).to.be.a("array");
    expect(rewardsServiceResponse.rewards).to.be.eql([]);
    expect(rewardsServiceResponse.error).to.eql("Invalid account number");
  });

  it("Returns empty rewards if the eligibilityService is not a function", function () {
    const rewardsServiceResponse = rewardsService({
      customerAccountNumber: customerAccountNumber,
      portfolio: { subscriptions: ["SPORTS"] },
      eligibilityService: null,
    });

    expect(rewardsServiceResponse).to.be.a("object");
    expect(rewardsServiceResponse.rewards).to.be.a("array");
    expect(rewardsServiceResponse.rewards).to.be.eql([]);
  });

  it("Returns empty rewards if there are no subscriptions", function () {
    const eligibilityServiceStub = sinon.stub().returns("CUSTOMER_INELIGIBLE");

    const rewardsServiceResponse = rewardsService({
      customerAccountNumber: customerAccountNumber,
      portfolio: { subscriptions: [] },
      eligibilityService: eligibilityServiceStub,
    });

    expect(rewardsServiceResponse).to.be.a("object");
    expect(rewardsServiceResponse.rewards).to.be.a("array");
    expect(rewardsServiceResponse.rewards).to.be.eql([]);
  });

  describe("Eligibility Service", function () {
    it("customerAccountNumber is passed to eligibilityService", function () {
      const eligibilityServiceStub = sinon.stub().returns("CUSTOMER_ELIGIBLE");

      const rewardsServiceResponse = rewardsService({
        customerAccountNumber: customerAccountNumber,
        portfolio: { subscriptions: ["SPORTS"] },
        eligibilityService: eligibilityServiceStub,
      });

      expect(rewardsServiceResponse).to.be.a("object");

      sinon.assert.calledWith(eligibilityServiceStub, customerAccountNumber);
    });

    describe("CUSTOMER_ELIGIBLE", function () {
      it("Returns rewards if the customer is eligible ", function () {
        const eligibilityServiceStub = sinon
          .stub()
          .returns("CUSTOMER_ELIGIBLE");

        const rewardsServiceResponse = rewardsService({
          customerAccountNumber: customerAccountNumber,
          portfolio: { subscriptions: ["SPORTS"] },
          eligibilityService: eligibilityServiceStub,
        });

        expect(rewardsServiceResponse).to.be.a("object");
        expect(rewardsServiceResponse.rewards).to.be.a("array");
        expect(rewardsServiceResponse.rewards).to.be.eql([
          "CHAMPIONS_LEAGUE_FINAL_TICKET",
        ]);
      });

      it("Returns relevant rewards according to the customer's portfolio - NO MATCHING CHANNEL", function () {
        const eligibilityServiceStub = sinon
          .stub()
          .returns("CUSTOMER_ELIGIBLE");

        const rewardsServiceResponse = rewardsService({
          customerAccountNumber: customerAccountNumber,
          portfolio: { subscriptions: ["THIS_DOES_NOT_MATCH"] },
          eligibilityService: eligibilityServiceStub,
        });

        expect(rewardsServiceResponse).to.be.a("object");
        expect(rewardsServiceResponse.rewards).to.be.a("array");
        expect(rewardsServiceResponse.rewards).to.eql([]);
      });

      it("Returns relevant rewards according to the customer's portfolio - SPORTS", function () {
        const eligibilityServiceStub = sinon
          .stub()
          .returns("CUSTOMER_ELIGIBLE");

        const rewardsServiceResponse = rewardsService({
          customerAccountNumber: customerAccountNumber,
          portfolio: { subscriptions: ["SPORTS"] },
          eligibilityService: eligibilityServiceStub,
        });

        const expectedChannel = channels.find(
          (channel) => channel.name === "SPORTS"
        );

        expect(rewardsServiceResponse).to.be.a("object");
        expect(rewardsServiceResponse.rewards).to.be.a("array");
        expect(rewardsServiceResponse.rewards).to.be.eql(
          expectedChannel.rewards
        );
      });

      it("Returns relevant rewards according to the customer's portfolio - NO REWARDS", function () {
        const eligibilityServiceStub = sinon
          .stub()
          .returns("CUSTOMER_ELIGIBLE");

        const rewardsServiceResponse = rewardsService({
          customerAccountNumber: customerAccountNumber,
          portfolio: { subscriptions: ["NEWS"] },
          eligibilityService: eligibilityServiceStub,
        });

        expect(rewardsServiceResponse).to.be.a("object");
        expect(rewardsServiceResponse.rewards).to.be.a("array");
        expect(rewardsServiceResponse.rewards).to.eql([]);
      });
    });

    describe("CUSTOMER_INELIGIBLE", function () {
      it("Returns no rewards ", function () {
        const eligibilityServiceStub = sinon
          .stub()
          .returns("CUSTOMER_INELIGIBLE");

        const rewardsServiceResponse = rewardsService({
          customerAccountNumber: customerAccountNumber,
          portfolio: { subscriptions: ["SPORTS"] },
          eligibilityService: eligibilityServiceStub,
        });

        expect(rewardsServiceResponse).to.be.a("object");
        expect(rewardsServiceResponse.rewards).to.be.a("array");
        expect(rewardsServiceResponse.rewards).to.eql([]);
      });
    });

    describe("Technical failure exception", function () {
      it("Returns no rewards ", function () {
        const eligibilityServiceStub = sinon
          .stub()
          .returns("Technical failure exception");

        const rewardsServiceResponse = rewardsService({
          customerAccountNumber: customerAccountNumber,
          portfolio: { subscriptions: ["SPORTS"] },
          eligibilityService: eligibilityServiceStub,
        });

        expect(rewardsServiceResponse).to.be.a("object");
        expect(rewardsServiceResponse.rewards).to.be.a("array");
        expect(rewardsServiceResponse.rewards).to.eql([]);
      });
    });

    describe("Empty response", function () {
      it("Returns no rewards ", function () {
        const eligibilityServiceStub = sinon.stub().returns("");

        const rewardsServiceResponse = rewardsService({
          customerAccountNumber: customerAccountNumber,
          portfolio: { subscriptions: ["SPORTS"] },
          eligibilityService: eligibilityServiceStub,
        });

        expect(rewardsServiceResponse).to.be.a("object");
        expect(rewardsServiceResponse.rewards).to.be.a("array");
        expect(rewardsServiceResponse.rewards).to.eql([]);
      });
    });

    describe("Invalid account number exception", function () {
      it("Returns no rewards and notify the client that the account number is invalid", function () {
        const eligibilityServiceStub = sinon
          .stub()
          .returns("Invalid account number exception");

        const rewardsServiceResponse = rewardsService({
          customerAccountNumber: customerAccountNumber,
          portfolio: { subscriptions: ["SPORTS"] },
          eligibilityService: eligibilityServiceStub,
        });

        expect(rewardsServiceResponse).to.be.a("object");
        expect(rewardsServiceResponse.rewards).to.be.a("array");
        expect(rewardsServiceResponse.rewards).to.eql([]);
        expect(rewardsServiceResponse.error).to.eql("Invalid account number");
      });
    });
  });
});

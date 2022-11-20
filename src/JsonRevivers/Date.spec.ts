import * as chai from "chai";
import { JsonISO8601DateAndTimeReviver, JsonISO8601DateReviver } from "./Date";

var expect = chai.expect;

describe("JSON Reviver Functions", function () {
  describe("ISO 8601", function () {
    const validDateAndTimeAndSubsecondsWithTimeOffset =
      "2013-12-12T04:13:00.456+00:00";
    const validDateAndTimeAndSubsecondsWithUTC = "2013-12-12T04:13:00.456Z";
    const validDateAndTimeAndSubseconds = "2013-12-12T04:13:00.456";
    const validDateAndTimeWithTimeOffset = "2013-12-12T04:13:00+00:00";
    const validDateAndTimeWithUTC = "2013-12-12T04:13:00Z";
    const validDateAndTime = "2013-12-12T04:13:00";
    const validDateHourAndMinuteWithTimeOffset = "2013-12-12T04:13+00:00";
    const validDateHourAndMinuteWithUTC = "2013-12-12T04:13Z";
    const validDateHourAndMinute = "2013-12-12T04:13";
    const validDate = "2013-12-12";
    const validYearAndMonth = "2013-12";
    const validYear = "2013";
    const invalidDateAndTimeAndSubsecondsWithTimeOffset =
      "2013-99-99T04:13:00.456+00:00";
    const invalidDateAndTimeAndSubsecondsWithUTC = "2013-99-99T04:13:00.456Z";
    const invalidDateAndTimeAndSubseconds = "2013-99-99T04:13:00.456";
    const invalidDateAndTimeWithTimeOffset = "2013-99-99T04:13:00+00:00";
    const invalidDateAndTimeWithUTC = "2013-99-99T04:13:00Z";
    const invalidDateAndTime = "2013-99-99T04:13:00";
    const invalidDateHourAndMinuteWithTimeOffset = "2013-99-99T04:13+00:00";
    const invalidDateHourAndMinuteWithUTC = "2013-99-99T04:13Z";
    const invalidDateHourAndMinute = "2013-99-99T04:13";
    const invalidDate = "2013-99-99";
    const invalidYearAndMonth = "2013-99";
    const invalidYear = "999999";
    describe("JsonISO8601DateReviver", function () {
      describe(`Valid Offset Date And Time With Seconds And Subseconds (${validDateAndTimeAndSubsecondsWithTimeOffset})`, function () {
        it("should tranform", function () {
          expect(
            JsonISO8601DateReviver(
              "someKey",
              validDateAndTimeAndSubsecondsWithTimeOffset
            )
          ).to.deep.equal(
            new Date(validDateAndTimeAndSubsecondsWithTimeOffset)
          );
        });
      });
      describe(`Valid UTC Date And Time With Seconds And Subseconds (${validDateAndTimeAndSubsecondsWithUTC})`, function () {
        it("should tranform", function () {
          expect(
            JsonISO8601DateReviver(
              "someKey",
              validDateAndTimeAndSubsecondsWithUTC
            )
          ).to.deep.equal(new Date(validDateAndTimeAndSubsecondsWithUTC));
        });
      });
      describe(`Valid Date And Time With Seconds And Subseconds (${validDateAndTimeAndSubseconds})`, function () {
        it("should tranform", function () {
          expect(
            JsonISO8601DateReviver("someKey", validDateAndTimeAndSubseconds)
          ).to.deep.equal(new Date(validDateAndTimeAndSubseconds));
        });
      });
      describe(`Valid Offset Date And Time With Seconds (${validDateAndTimeWithTimeOffset})`, function () {
        it("should tranform", function () {
          expect(
            JsonISO8601DateReviver("someKey", validDateAndTimeWithTimeOffset)
          ).to.deep.equal(new Date(validDateAndTimeWithTimeOffset));
        });
      });
      describe(`Valid UTC Date And Time With Seconds (${validDateAndTimeWithUTC})`, function () {
        it("should tranform", function () {
          expect(
            JsonISO8601DateReviver("someKey", validDateAndTimeWithUTC)
          ).to.deep.equal(new Date(validDateAndTimeWithUTC));
        });
      });
      describe(`Valid Date And Time With Seconds (${validDateAndTime})`, function () {
        it("should tranform", function () {
          expect(
            JsonISO8601DateReviver("someKey", validDateAndTime)
          ).to.deep.equal(new Date(validDateAndTime));
        });
      });
      describe(`Valid Offset Date And Time Without Seconds (${validDateHourAndMinuteWithTimeOffset})`, function () {
        it("should tranform", function () {
          expect(
            JsonISO8601DateReviver(
              "someKey",
              validDateHourAndMinuteWithTimeOffset
            )
          ).to.deep.equal(new Date(validDateHourAndMinuteWithTimeOffset));
        });
      });
      describe(`Valid UTC Date And Time Without Seconds (${validDateHourAndMinuteWithUTC})`, function () {
        it("should tranform", function () {
          expect(
            JsonISO8601DateReviver("someKey", validDateHourAndMinuteWithUTC)
          ).to.deep.equal(new Date(validDateHourAndMinuteWithUTC));
        });
      });
      describe(`Valid Date And Time Without Seconds (${validDateHourAndMinute})`, function () {
        it("should tranform", function () {
          expect(
            JsonISO8601DateReviver("someKey", validDateHourAndMinute)
          ).to.deep.equal(new Date(validDateHourAndMinute));
        });
      });
      describe(`Valid Date (${validDate})`, function () {
        it("should tranform", function () {
          expect(JsonISO8601DateReviver("someKey", validDate)).to.deep.equal(
            new Date(validDate)
          );
        });
      });
      describe(`Valid Year And Month (${validYearAndMonth})`, function () {
        it("should tranform", function () {
          expect(
            JsonISO8601DateReviver("someKey", validYearAndMonth)
          ).to.deep.equal(new Date(validYearAndMonth));
        });
      });
      describe(`Valid Year (${validYear})`, function () {
        it("should tranform", function () {
          expect(JsonISO8601DateReviver("someKey", validYear)).to.deep.equal(
            new Date(validYear)
          );
        });
      });
      describe(`Invalid Offset Date And Time With Seconds And Subseconds (${invalidDateAndTimeAndSubsecondsWithTimeOffset})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateReviver(
              "someKey",
              invalidDateAndTimeAndSubsecondsWithTimeOffset
            )
          ).to.equal(invalidDateAndTimeAndSubsecondsWithTimeOffset);
        });
      });
      describe(`Invalid UTC Date And Time With Seconds And Subseconds (${invalidDateAndTimeAndSubsecondsWithUTC})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateReviver(
              "someKey",
              invalidDateAndTimeAndSubsecondsWithUTC
            )
          ).to.equal(invalidDateAndTimeAndSubsecondsWithUTC);
        });
      });
      describe(`Invalid Date And Time With Seconds And Subseconds (${invalidDateAndTimeAndSubseconds})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateReviver("someKey", invalidDateAndTimeAndSubseconds)
          ).to.equal(invalidDateAndTimeAndSubseconds);
        });
      });
      describe(`Invalid Offset Date And Time With Seconds (${invalidDateAndTimeWithTimeOffset})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateReviver("someKey", invalidDateAndTimeWithTimeOffset)
          ).to.equal(invalidDateAndTimeWithTimeOffset);
        });
      });
      describe(`Invalid UTC Date And Time With Seconds (${invalidDateAndTimeWithUTC})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateReviver("someKey", invalidDateAndTimeWithUTC)
          ).to.equal(invalidDateAndTimeWithUTC);
        });
      });
      describe(`Invalid Date And Time With Seconds (${invalidDateAndTime})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateReviver("someKey", invalidDateAndTime)
          ).to.equal(invalidDateAndTime);
        });
      });
      describe(`Invalid Offset Date And Time Without Seconds (${invalidDateHourAndMinuteWithTimeOffset})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateReviver(
              "someKey",
              invalidDateHourAndMinuteWithTimeOffset
            )
          ).to.equal(invalidDateHourAndMinuteWithTimeOffset);
        });
      });
      describe(`Invalid UTC Date And Time Without Seconds (${invalidDateHourAndMinuteWithUTC})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateReviver("someKey", invalidDateHourAndMinuteWithUTC)
          ).to.equal(invalidDateHourAndMinuteWithUTC);
        });
      });
      describe(`Invalid Date And Time Without Seconds (${invalidDateHourAndMinute})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateReviver("someKey", invalidDateHourAndMinute)
          ).to.equal(invalidDateHourAndMinute);
        });
      });
      describe(`Invalid Date (${invalidDate})`, function () {
        it("should not tranform", function () {
          expect(JsonISO8601DateReviver("someKey", invalidDate)).to.equal(
            invalidDate
          );
        });
      });
      describe(`Invalid Year And Month (${invalidYearAndMonth})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateReviver("someKey", invalidYearAndMonth)
          ).to.equal(invalidYearAndMonth);
        });
      });
      describe(`Invalid Year (${invalidYear})`, function () {
        it("should not tranform", function () {
          expect(JsonISO8601DateReviver("someKey", invalidYear)).to.equal(
            invalidYear
          );
        });
      });
    });
    describe("JsonISO8601DateAndTimeReviver", function () {
      describe(`Valid Offset Date And Time With Seconds And Subseconds (${validDateAndTimeAndSubsecondsWithTimeOffset})`, function () {
        it("should tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver(
              "someKey",
              validDateAndTimeAndSubsecondsWithTimeOffset
            )
          ).to.deep.equal(
            new Date(validDateAndTimeAndSubsecondsWithTimeOffset)
          );
        });
      });
      describe(`Valid UTC Date And Time With Seconds And Subseconds (${validDateAndTimeAndSubsecondsWithUTC})`, function () {
        it("should tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver(
              "someKey",
              validDateAndTimeAndSubsecondsWithUTC
            )
          ).to.deep.equal(new Date(validDateAndTimeAndSubsecondsWithUTC));
        });
      });
      describe(`Valid Date And Time With Seconds And Subseconds (${validDateAndTimeAndSubseconds})`, function () {
        it("should tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver(
              "someKey",
              validDateAndTimeAndSubseconds
            )
          ).to.deep.equal(new Date(validDateAndTimeAndSubseconds));
        });
      });
      describe(`Valid Offset Date And Time With Seconds (${validDateAndTimeWithTimeOffset})`, function () {
        it("should tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver(
              "someKey",
              validDateAndTimeWithTimeOffset
            )
          ).to.deep.equal(new Date(validDateAndTimeWithTimeOffset));
        });
      });
      describe(`Valid UTC Date And Time With Seconds (${validDateAndTimeWithUTC})`, function () {
        it("should tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver("someKey", validDateAndTimeWithUTC)
          ).to.deep.equal(new Date(validDateAndTimeWithUTC));
        });
      });
      describe(`Valid Date And Time With Seconds (${validDateAndTime})`, function () {
        it("should tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver("someKey", validDateAndTime)
          ).to.deep.equal(new Date(validDateAndTime));
        });
      });
      describe(`Valid Offset Date And Time Without Seconds (${validDateHourAndMinuteWithTimeOffset})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver(
              "someKey",
              validDateHourAndMinuteWithTimeOffset
            )
          ).to.deep.equal(validDateHourAndMinuteWithTimeOffset);
        });
      });
      describe(`Valid UTC Date And Time Without Seconds (${validDateHourAndMinuteWithUTC})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver(
              "someKey",
              validDateHourAndMinuteWithUTC
            )
          ).to.deep.equal(validDateHourAndMinuteWithUTC);
        });
      });
      describe(`Valid Date And Time Without Seconds (${validDateHourAndMinute})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver("someKey", validDateHourAndMinute)
          ).to.deep.equal(validDateHourAndMinute);
        });
      });
      describe(`Valid Date (${validDate})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver("someKey", validDate)
          ).to.deep.equal(validDate);
        });
      });
      describe(`Valid Year And Month (${validYearAndMonth})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver("someKey", validYearAndMonth)
          ).to.deep.equal(validYearAndMonth);
        });
      });
      describe(`Valid Year (${validYear})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver("someKey", validYear)
          ).to.deep.equal(validYear);
        });
      });
      describe(`Invalid Offset Date And Time With Seconds And Subseconds (${invalidDateAndTimeAndSubsecondsWithTimeOffset})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver(
              "someKey",
              invalidDateAndTimeAndSubsecondsWithTimeOffset
            )
          ).to.equal(invalidDateAndTimeAndSubsecondsWithTimeOffset);
        });
      });
      describe(`Invalid UTC Date And Time With Seconds And Subseconds (${invalidDateAndTimeAndSubsecondsWithUTC})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver(
              "someKey",
              invalidDateAndTimeAndSubsecondsWithUTC
            )
          ).to.equal(invalidDateAndTimeAndSubsecondsWithUTC);
        });
      });
      describe(`Invalid Date And Time With Seconds And Subseconds (${invalidDateAndTimeAndSubseconds})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver(
              "someKey",
              invalidDateAndTimeAndSubseconds
            )
          ).to.equal(invalidDateAndTimeAndSubseconds);
        });
      });
      describe(`Invalid Offset Date And Time With Seconds (${invalidDateAndTimeWithTimeOffset})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver(
              "someKey",
              invalidDateAndTimeWithTimeOffset
            )
          ).to.equal(invalidDateAndTimeWithTimeOffset);
        });
      });
      describe(`Invalid UTC Date And Time With Seconds (${invalidDateAndTimeWithUTC})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver("someKey", invalidDateAndTimeWithUTC)
          ).to.equal(invalidDateAndTimeWithUTC);
        });
      });
      describe(`Invalid Date And Time With Seconds (${invalidDateAndTime})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver("someKey", invalidDateAndTime)
          ).to.equal(invalidDateAndTime);
        });
      });
      describe(`Invalid Offset Date And Time Without Seconds (${invalidDateHourAndMinuteWithTimeOffset})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver(
              "someKey",
              invalidDateHourAndMinuteWithTimeOffset
            )
          ).to.equal(invalidDateHourAndMinuteWithTimeOffset);
        });
      });
      describe(`Invalid UTC Date And Time Without Seconds (${invalidDateHourAndMinuteWithUTC})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver(
              "someKey",
              invalidDateHourAndMinuteWithUTC
            )
          ).to.equal(invalidDateHourAndMinuteWithUTC);
        });
      });
      describe(`Invalid Date And Time Without Seconds (${invalidDateHourAndMinute})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver("someKey", invalidDateHourAndMinute)
          ).to.equal(invalidDateHourAndMinute);
        });
      });
      describe(`Invalid Date (${invalidDate})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver("someKey", invalidDate)
          ).to.equal(invalidDate);
        });
      });
      describe(`Invalid Year And Month (${invalidYearAndMonth})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver("someKey", invalidYearAndMonth)
          ).to.equal(invalidYearAndMonth);
        });
      });
      describe(`Invalid Year (${invalidYear})`, function () {
        it("should not tranform", function () {
          expect(
            JsonISO8601DateAndTimeReviver("someKey", invalidYear)
          ).to.equal(invalidYear);
        });
      });
    });
  });
});

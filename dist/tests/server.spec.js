"use strict";

var expect = require("chai").expect;

describe("test", function ()
{
    it("should return a string", function () 
    {
        expect("Hi Everyone, This is a test to check if server setup is good").to.equal("Hi Everyone, This is a test to check if server setup is good");
    });
});
/*
 * Copyright (c) 2013 Public domain
 * http://animotron.org/sebebe
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * @author <a href="mailto:git@benjiweber.co.uk">Benji Weber</a>
 *
 */

var assert = Packages.org.junit.Assert;
var jsAssert = {};
var TestCase = Packages.junitjs.TestCase;


jsAssert.assertIntegerEquals = function(a, b) {
	if (a === b) return;
	
	
	throw new Packages.org.junit.ComparisonFailure("Expected <" + a + "> but was <" + b + ">", a, b);
}

var nashornDetector = {
	__noSuchMethod__:  function(name, arg0, arg1) {
		return typeof arg1 != "undefined";
	}
}

var isRhino = function() {
	return !nashornDetector.detect('one','two');
}

var console = {
	log: function(text) {
		print(text + (isRhino() ? "\n" : ""));
	}
}

var newStub = function() {
	return 	{
		called: [],
		__noSuchMethod__:  function(name, arg0, arg1, arg2, arg3, arg4, arg5) {
			var desc = {
				name: name,
				args: []
			};
			var rhino = arg0.length && typeof arg1 == "undefined";
			
			var args = rhino ? arg0 : arguments;
			for (var i = rhino ? 0 : 1; i < args.length; i++){
				if (typeof args[i] == "undefined") continue;
				desc.args.push(args[i]);
			}
			this.called.push(desc);
		},
		
		assertCalled: function(description) {
			
			var fnDescToString = function(desc) {
				return desc.name + "("+ desc.args.join(",") +")";
			};
			
			if (this.called.length < 1) assert.fail('No functions called, expected: ' + fnDescToString(description));

			for (var i = 0; i < this.called.length; i++) {
				var fn = this.called[i];
				if (fn.name == description.name) {
					if (description.args.length != fn.args.length) continue;
					
					for (var j = 0; j < description.args.length; j++) {
						if (fn.args[j] == description.args[j]) return;
					}
				}
			}
			
			assert.fail('No matching functions called. expected: ' + 
					'<' + fnDescToString(description) + ")>" +
					' but had ' +
					'<' + this.called.map(fnDescToString).join("|") + '>'
			);
		}
	};
};

var tests = function(testObject) {
	var testCases = new java.util.ArrayList();
	for (var name in testObject) {
		if (testObject.hasOwnProperty(name)) {
			testCases.add(new TestCase(name,testObject[name]));
		}
	}
	return testCases;
};

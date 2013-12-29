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

tests({
	thisTestShouldPass : function() {
		console.log("One == One");
		assert.assertEquals("One","One");
	},
	
	thisTestShouldFail : function() {
		console.log("Running a failing test");
		assert.fail();
	},
	
	testAnEqualityFail : function() {
		console.log("Running an equality fail test");
		assert.assertEquals("One", "Two");
	},
	
	objectEquality : function() {
		var a = { foo: 'bar', bar: 'baz' };
		var b = a;
		assert.assertEquals(a, b);
	},
	
	integerComparison : function() {
		jsAssert.assertIntegerEquals(4, 4);
	},
	
	failingIntegerComparison : function() {
		jsAssert.assertIntegerEquals(4, 5);
	}
});

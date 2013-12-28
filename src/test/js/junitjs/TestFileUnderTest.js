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

load("src/main/java/uk/co/benjiweber/junitjs/examples/FileUnderTest.js");

var stub = newStub();
underTest.collaborator = stub;

tests({
	returnsFour_ShouldReturnFour: function() {
		jsAssert.assertIntegerEquals(4, underTest.returnsFour());
	},

	
	doesSomethingImportant_ThisTestShouldFail: function() {
		underTest.doesSomethingImportant();
		
		stub.assertCalled({
			name: 'importantFunction',
			args: ['wrong', 'args']
		});
	},
	doesSomethingImportant_ShouldDoSomethingImportant: function() {
		underTest.doesSomethingImportant();
		
		stub.assertCalled({
			name: 'importantFunction',
			args: ['hello', 'world']
		});
	}
});

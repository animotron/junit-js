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
package junitjs;

import static java.util.Arrays.asList;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.apache.commons.io.IOUtils;
import org.junit.runner.Description;
import org.junit.runner.Runner;
import org.junit.runner.manipulation.Filter;
import org.junit.runner.manipulation.Filterable;
import org.junit.runner.manipulation.NoTestsRemainException;
import org.junit.runner.manipulation.Sortable;
import org.junit.runner.manipulation.Sorter;
import org.junit.runner.notification.Failure;
import org.junit.runner.notification.RunNotifier;

/**
 * @author <a href="mailto:git@benjiweber.co.uk">Benji Weber</a>
 *
 */
public class JSRunner extends Runner implements Filterable, Sortable  {
	
	private List<TestClass> tests;
	private final Class<?> cls;

	public JSRunner(Class<?> cls) {
		this.cls = cls;
		List<String> testNames = asList(cls.getAnnotation(Tests.class).value());
		this.tests = findJSTests(testNames);
	}
	
	@Override
	public Description getDescription() {
		Description suite = Description.createSuiteDescription(cls);
		for (TestClass testClass : tests) {
			List<TestCase> tests = testClass.testCases;
			Description desc = Description.createTestDescription(testClass.name, testClass.name);
			suite.addChild(desc);
			for (TestCase test : tests) {
				Description methodDesc = Description.createTestDescription(testClass.name, test.name);
				desc.addChild(methodDesc);
			}
		}
		return suite;
	}

	@Override
	public void run(RunNotifier notifier) {
		for (TestClass testClass : tests) {
			List<TestCase> tests = testClass.testCases;
			for (TestCase test : tests) {
				Description desc = Description.createTestDescription(testClass.name, test.name);
				notifier.fireTestStarted(desc);
				try {
					test.testCase.run();
					notifier.fireTestFinished(desc);
				} catch (Exception | Error e) {
					notifier.fireTestFailure(new Failure(desc, bestException(e)));
				}
			}
		}
	}
	
	private List<TestClass> findJSTests(List<String> testNames) {
		
		try {
			ScriptEngine engine = getBestJavaScriptEngine();
			loadTestUtilities(engine);
			List<TestClass> testClasses = new ArrayList<>();
			for (String name : testNames) {
				testClasses.add(new TestClass(name, load(engine, name)));
			}
			return testClasses;
			
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	private void loadTestUtilities(ScriptEngine engine) throws ScriptException,IOException {
		engine.eval(IOUtils.toString(JSRunner.class.getResource("TestUtils.js")));
	}

	public static class Loader {
		
		private final ScriptEngine rhino;

		public Loader(ScriptEngine rhino) {
			this.rhino = rhino;
		}
		
		public void load(String filename) {
			try {
				rhino.eval(new FileReader(filename));
			} catch (FileNotFoundException | ScriptException e) {
				throw new RuntimeException(e);
			}
		}
	}
	
	private ScriptEngine getBestJavaScriptEngine() throws ScriptException {
		ScriptEngineManager factory = new ScriptEngineManager();
		ScriptEngine nashorn = factory.getEngineByName("nashorn");
		
		if (nashorn != null) return nashorn;
		
		final ScriptEngine rhino = factory.getEngineByName("JavaScript");
		
		rhino.put("Loader", new Loader(rhino));
		rhino.eval("function load(filename) { Loader.load(filename); }");
		
		return rhino; 
	}
	
	@SuppressWarnings("unchecked")
	private List<TestCase> load(ScriptEngine engine, String name) throws ScriptException, IOException{
		return (List<TestCase>) engine.eval(IOUtils.toString(cls.getResource(name)));
	}

	public void sort(Sorter sorter) {
		//
	}

	public void filter(Filter filter) throws NoTestsRemainException {
		//
	}

	private Throwable bestException(Throwable e) {
		if (nashornException(e))
			return e.getCause() != null ? e.getCause() : e;
		if (rhinoException(e)) {
			return extractActualExceptionFromRhino(e);
		}
		return e;
	}

	private boolean rhinoException(Throwable e) {
		return e.getClass().getSimpleName().contains("JavaScript");
	}

	private boolean nashornException(Throwable e) {
		return e.getClass().getSimpleName().contains("ECMA");
	}

	private Throwable extractActualExceptionFromRhino(Throwable e) {
		try {
			Field f = e.getClass().getDeclaredField("value");
			f.setAccessible(true);
			Object javascriptWrapper = f.get(e);
			Field javaThrowable = javascriptWrapper.getClass().getDeclaredField("javaObject");
			javaThrowable.setAccessible(true);
			Throwable t = (Throwable) javaThrowable.get(javascriptWrapper);
			return t;
		} catch (NoSuchFieldException | SecurityException | IllegalArgumentException | IllegalAccessException e1) {
			throw new RuntimeException(e);
		}
	}
	
}

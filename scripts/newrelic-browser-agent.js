var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/@newrelic/browser-agent/dist/esm/loaders/configure/public-path.js
var redefinePublicPath;
var init_public_path = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/loaders/configure/public-path.js"() {
    redefinePublicPath = () => {
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/timing/now.js
function now() {
  return Math.floor(performance.now());
}
var init_now = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/timing/now.js"() {
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/constants/runtime.js
var isBrowserScope, isWorkerScope, globalScope, loadedAsDeferredBrowserScript, initiallyHidden, initialLocation, isiOS, iOSBelow16, ffVersion, originTime, supportsNavTimingL2;
var init_runtime = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/constants/runtime.js"() {
    init_now();
    isBrowserScope = typeof window !== "undefined" && !!window.document;
    isWorkerScope = typeof WorkerGlobalScope !== "undefined" && (typeof self !== "undefined" && self instanceof WorkerGlobalScope && self.navigator instanceof WorkerNavigator || typeof globalThis !== "undefined" && globalThis instanceof WorkerGlobalScope && globalThis.navigator instanceof WorkerNavigator);
    globalScope = isBrowserScope ? window : typeof WorkerGlobalScope !== "undefined" && (typeof self !== "undefined" && self instanceof WorkerGlobalScope && self || typeof globalThis !== "undefined" && globalThis instanceof WorkerGlobalScope && globalThis);
    loadedAsDeferredBrowserScript = globalScope?.document?.readyState === "complete";
    initiallyHidden = Boolean(globalScope?.document?.visibilityState === "hidden");
    initialLocation = "" + globalScope?.location;
    isiOS = /iPad|iPhone|iPod/.test(globalScope.navigator?.userAgent);
    iOSBelow16 = isiOS && typeof SharedWorker === "undefined";
    ffVersion = (() => {
      const match = globalScope.navigator?.userAgent?.match(/Firefox[/\s](\d+\.\d+)/);
      if (Array.isArray(match) && match.length >= 2) {
        return +match[1];
      }
      return 0;
    })();
    originTime = Date.now() - now();
    supportsNavTimingL2 = () => typeof PerformanceNavigationTiming !== "undefined" && globalScope?.performance?.getEntriesByType("navigation")?.[0]?.responseStart;
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/ids/unique-id.js
function getRandomValue(valueTable, tableIndex) {
  if (valueTable) {
    return valueTable[tableIndex] & 15;
  } else {
    return Math.random() * 16 | 0;
  }
}
function generateUuid() {
  const crypto = globalScope?.crypto || globalScope?.msCrypto;
  let randomValueTable;
  let randomValueIndex = 0;
  if (crypto && crypto.getRandomValues) {
    randomValueTable = crypto.getRandomValues(new Uint8Array(30));
  }
  return uuidv4Template.split("").map((templateInput) => {
    if (templateInput === "x") {
      return getRandomValue(randomValueTable, randomValueIndex++).toString(16);
    } else if (templateInput === "y") {
      return (getRandomValue() & 3 | 8).toString(16);
    } else {
      return templateInput;
    }
  }).join("");
}
function generateRandomHexString(length) {
  const crypto = globalScope?.crypto || globalScope?.msCrypto;
  let randomValueTable;
  let randomValueIndex = 0;
  if (crypto && crypto.getRandomValues) {
    randomValueTable = crypto.getRandomValues(new Uint8Array(length));
  }
  const chars2 = [];
  for (var i2 = 0; i2 < length; i2++) {
    chars2.push(getRandomValue(randomValueTable, randomValueIndex++).toString(16));
  }
  return chars2.join("");
}
function generateSpanId() {
  return generateRandomHexString(16);
}
function generateTraceId() {
  return generateRandomHexString(32);
}
var uuidv4Template;
var init_unique_id = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/ids/unique-id.js"() {
    init_runtime();
    uuidv4Template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/dispatch/global-event.js
function dispatchGlobalEvent(detail = {}) {
  try {
    globalScope.dispatchEvent(new CustomEvent(GLOBAL_EVENT_NAMESPACE, {
      detail
    }));
  } catch (err2) {
  }
}
var GLOBAL_EVENT_NAMESPACE;
var init_global_event = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/dispatch/global-event.js"() {
    init_runtime();
    GLOBAL_EVENT_NAMESPACE = "newrelic";
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/util/console.js
function warn(code, secondary) {
  if (typeof console.debug !== "function") return;
  console.debug("New Relic Warning: https://github.com/newrelic/newrelic-browser-agent/blob/main/docs/warning-codes.md#".concat(code), secondary);
  dispatchGlobalEvent({
    agentIdentifier: null,
    drained: null,
    type: "data",
    name: "warn",
    feature: "warn",
    data: {
      code,
      secondary
    }
  });
}
var init_console = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/util/console.js"() {
    init_global_event();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/constants.js
var prefix, spaPrefix, ADD_PAGE_ACTION, ADD_TO_TRACE, ADD_RELEASE, FINISHED, INTERACTION, LOG, NOTICE_ERROR, PAUSE_REPLAY, RECORD_CUSTOM_EVENT, RECORD_REPLAY, REGISTER, SET_APPLICATION_VERSION, SET_CURRENT_ROUTE_NAME, SET_CUSTOM_ATTRIBUTE, SET_ERROR_HANDLER, SET_PAGE_VIEW_NAME, SET_USER_ID, START, WRAP_LOGGER, MEASURE, CONSENT;
var init_constants = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/loaders/api/constants.js"() {
    prefix = "api-";
    spaPrefix = prefix + "ixn-";
    ADD_PAGE_ACTION = "addPageAction";
    ADD_TO_TRACE = "addToTrace";
    ADD_RELEASE = "addRelease";
    FINISHED = "finished";
    INTERACTION = "interaction";
    LOG = "log";
    NOTICE_ERROR = "noticeError";
    PAUSE_REPLAY = "pauseReplay";
    RECORD_CUSTOM_EVENT = "recordCustomEvent";
    RECORD_REPLAY = "recordReplay";
    REGISTER = "register";
    SET_APPLICATION_VERSION = "setApplicationVersion";
    SET_CURRENT_ROUTE_NAME = "setCurrentRouteName";
    SET_CUSTOM_ATTRIBUTE = "setCustomAttribute";
    SET_ERROR_HANDLER = "setErrorHandler";
    SET_PAGE_VIEW_NAME = "setPageViewName";
    SET_USER_ID = "setUserId";
    START = "start";
    WRAP_LOGGER = "wrapLogger";
    MEASURE = "measure";
    CONSENT = "consent";
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api-base.js
var ApiBase;
var init_api_base = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/loaders/api-base.js"() {
    init_console();
    init_constants();
    ApiBase = class _ApiBase {
      #callMethod(methodName, ...args) {
        if (this[methodName] === _ApiBase.prototype[methodName]) warn(35, methodName);
        else return this[methodName](...args);
      }
      // MicroAgent class custom defines its own start
      /**
       * Reports a browser PageAction event along with a name and optional attributes.
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/addpageaction/}
       * @param {string} name Name or category of the action. Reported as the actionName attribute.
       * @param {object} [attributes] JSON object with one or more key/value pairs. For example: {key:"value"}. The key is reported as its own PageAction attribute with the specified values.
       */
      addPageAction(name, attributes) {
        return this.#callMethod(ADD_PAGE_ACTION, name, attributes);
      }
      /**
       * @experimental
       * IMPORTANT: This feature is being developed for use internally and is not in a public-facing production-ready state.
       * It is not recommended for use in production environments and will not receive support for issues.
       *
       * Registers an external caller to report through the base agent to a different target than the base agent.
       * @param {import('./api/register-api-types').RegisterAPIConstructor} target the target object to report data to
      @returns {import('./api/register-api-types').RegisterAPI} Returns an object that contains the available API methods and configurations to use with the external caller. See loaders/api/api.js for more information.
       */
      register(target) {
        return this.#callMethod(REGISTER, target);
      }
      /**
       * Records a custom event with a specified eventType and attributes.
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/recordCustomEvent/}
       * @param {string} eventType The eventType to store the event as.
       * @param {Object} [attributes] JSON object with one or more key/value pairs. For example: {key:"value"}.
       */
      recordCustomEvent(eventType, attributes) {
        return this.#callMethod(RECORD_CUSTOM_EVENT, eventType, attributes);
      }
      /**
       * Groups page views to help URL structure or to capture the URL's routing information.
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/setpageviewname/}
       * @param {string} name The page name you want to use. Use alphanumeric characters.
       * @param {string} [host] Default is http://custom.transaction. Typically set host to your site's domain URI.
       */
      setPageViewName(name, host2) {
        return this.#callMethod(SET_PAGE_VIEW_NAME, name, host2);
      }
      /**
       * Adds a user-defined attribute name and value to subsequent events on the page.
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/setcustomattribute/}
       * @param {string} name Name of the attribute. Appears as column in the PageView event. It will also appear as a column in the PageAction event if you are using it.
       * @param {string|number|boolean|null} value Value of the attribute. Appears as the value in the named attribute column in the PageView event. It will appear as a column in the PageAction event if you are using it. Custom attribute values cannot be complex objects, only simple types such as Strings, Integers and Booleans. Passing a null value unsets any existing attribute of the same name.
       * @param {boolean} [persist] Default false. If set to true, the name-value pair will also be set into the browser's storage API. Then on the following instrumented pages that load within the same session, the pair will be re-applied as a custom attribute.
       */
      setCustomAttribute(name, value, persist) {
        return this.#callMethod(SET_CUSTOM_ATTRIBUTE, name, value, persist);
      }
      /**
       * Identifies a browser error without disrupting your app's operations.
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/noticeerror/}
       * @param {Error|string} error Provide a meaningful error message that you can use when analyzing data on browser's JavaScript errors page.
       * @param {object} [customAttributes] An object containing name/value pairs representing custom attributes.
       */
      noticeError(error, customAttributes) {
        return this.#callMethod(NOTICE_ERROR, error, customAttributes);
      }
      /**
       * Adds a user-defined identifier string to subsequent events on the page.
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/setuserid/}
       * @param {string|null} value A string identifier for the end-user, useful for tying all browser events to specific users. The value parameter does not have to be unique. If IDs should be unique, the caller is responsible for that validation. Passing a null value unsets any existing user ID.
       * @param {boolean} [resetSession=false] Optional param. When true, resets the current session ONLY when changing user id from an existing value to another value or null. If the current user id is null when calling the API, the session cannot be reset.
       */
      setUserId(value, resetSession = false) {
        return this.#callMethod(SET_USER_ID, value, resetSession);
      }
      /**
       * Adds a user-defined application version string to subsequent events on the page.
       * This decorates all payloads with an attribute of `application.version` which is queryable in NR1.
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/setapplicationversion/}
       * @param {string|null} value A string identifier for the application version, useful for
       * tying all browser events to a specific release tag. The value parameter does not
       * have to be unique. Passing a null value unsets any existing value.
       */
      setApplicationVersion(value) {
        return this.#callMethod(SET_APPLICATION_VERSION, value);
      }
      /**
       * Allows selective ignoring and grouping of known errors that the browser agent captures.
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/seterrorhandler/}
       * @param {(error: Error|string) => boolean | { group: string }} callback When an error occurs, the callback is called with the error object as a parameter. The callback will be called with each error, so it is not specific to one error.
       */
      setErrorHandler(callback) {
        return this.#callMethod(SET_ERROR_HANDLER, callback);
      }
      /**
       * Adds a unique name and ID to identify releases with multiple JavaScript bundles on the same page.
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/addrelease/}
       * @param {string} name A short description of the component; for example, the name of a project, application, file, or library.
       * @param {string} id The ID or version of this release; for example, a version number, build number from your CI environment, GitHub SHA, GUID, or a hash of the contents.
       */
      addRelease(name, id2) {
        return this.#callMethod(ADD_RELEASE, name, id2);
      }
      /**
       * Capture a single log.
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/log/}
       * @param {string} message String to be captured as log message
       * @param {{customAttributes?: object, level?: 'ERROR'|'TRACE'|'DEBUG'|'INFO'|'WARN'}} [options] customAttributes defaults to `{}` if not assigned, level defaults to `info` if not assigned.
      */
      log(message, options) {
        return this.#callMethod(LOG, message, options);
      }
      /**
       * Starts any and all features that are not running yet in "autoStart" mode
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/start/}
       */
      start() {
        return this.#callMethod(START);
      }
      /**
       * Records an additional time point as "finished" in a session trace and adds a page action.
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/finished/}
       * @param {number} [timeStamp] integer (UNIX time) - Defaults to the current time of the call. If used, this marks the time that the page is "finished" according to your own criteria.
       */
      finished(timeStamp) {
        return this.#callMethod(FINISHED, timeStamp);
      }
      /**
       * Forces a replay to record. If a replay is already actively recording, this call will be ignored.
       * If a recording has not been started, a new one will be created. If a recording has been started, but is currently not recording, it will resume recording.
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/recordReplay/}
       */
      recordReplay() {
        return this.#callMethod(RECORD_REPLAY);
      }
      /**
       * Forces an active replay to pause recording.  If a replay is already actively recording, this call will cause the recording to pause.
       * If a recording is not currently recording, this call will be ignored.  This API will pause both manual and automatic replays that are in progress.
       * The only way to resume recording after manually pausing a replay is to manually record again using the recordReplay() API.
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/pauseReplay/}
       */
      pauseReplay() {
        return this.#callMethod(PAUSE_REPLAY);
      }
      /**
       * Adds a JavaScript object with a custom name, start time, etc. to an in-progress session trace.
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/addtotrace/}
       * @param {{name: string, start: number, end?: number, origin?: string, type?: string}} customAttributes Supply a JavaScript object with these required and optional name/value pairs:
       *
       * - Required name/value pairs: name, start
       * - Optional name/value pairs: end, origin, type
       * - Note: Does not apply to MicroAgent
       *
       * If you are sending the same event object to New Relic as a PageAction, omit the TYPE attribute. (type is a string to describe what type of event you are marking inside of a session trace.) If included, it will override the event type and cause the PageAction event to be sent incorrectly. Instead, use the name attribute for event information.
       */
      addToTrace(customAttributes) {
        return this.#callMethod(ADD_TO_TRACE, customAttributes);
      }
      /**
       * Gives SPA routes more accurate names than default names. Monitors specific routes rather than by default grouping.
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/setcurrentroutename/}
       * @param {string} name Current route name for the page.
       *  - Note: Does not apply to MicroAgent
       */
      setCurrentRouteName(name) {
        return this.#callMethod(SET_CURRENT_ROUTE_NAME, name);
      }
      /**
       * Returns a new API object that is bound to the current SPA interaction.
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/interaction/}
       * @param {Object} [opts] Options to configure the new or existing interaction with
       * @param {boolean} [opts.waitForEnd=false] To forcibly keep the interaction open until the `.end` method is called on its handle, set to true. Defaults to false. After an interaction is earmarked with this, it cannot be undone.
       * @returns {InteractionInstance} An API object that is bound to a specific BrowserInteraction event. Each time this method is called for the same BrowserInteraction, a new object is created, but it still references the same interaction.
       *  - Note: Does not apply to MicroAgent
       *  - Deprecation Notice: interaction.createTracer is deprecated.  See https://docs.newrelic.com/eol/2024/04/eol-04-24-24-createtracer/ for more information.
      */
      interaction(opts) {
        return this.#callMethod(INTERACTION, opts);
      }
      /**
       * Wrap a logger function to capture a log each time the function is invoked with the message and arguments passed
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/wraplogger/}
       * @param {object} parent The parent object containing the logger method
       * @param {string} functionName The property name of the function in the parent object to be wrapped
       * @param {{customAttributes?: object, level?: 'ERROR'|'TRACE'|'DEBUG'|'INFO'|'WARN'}} [options] customAttributes defaults to `{}` if not assigned, level defaults to `info` if not assigned.
      */
      wrapLogger(parent, functionName, options) {
        return this.#callMethod(WRAP_LOGGER, parent, functionName, options);
      }
      /**
       * Measures a task that is recorded as a BrowserPerformance event.
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/measure/}
       * @param {string} name The name of the task
       * @param {{start?: number|PerformanceMark, end?: number|PerformanceMark, customAttributes?: object}} [options] An object used to control the way the measure API operates
       * @returns {{start: number, end: number, duration: number, customAttributes: object}} Measurement details
       */
      measure(name, options) {
        return this.#callMethod(MEASURE, name, options);
      }
      /**
       * Accepts or rejects consent when the agent is configured to require consent before harvesting.
       * The consent state is stored in session storage inside the NRBA_SESSION object.
       * {@link https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/consent/}
       * @param {boolean?} accept Whether to accept or reject consent. Defaults to true (accept) if left undefined.
       */
      consent(accept) {
        return this.#callMethod(CONSENT, accept);
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/loaders/agent-base.js
var AgentBase;
var init_agent_base = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/loaders/agent-base.js"() {
    init_unique_id();
    init_api_base();
    AgentBase = class extends ApiBase {
      agentIdentifier = generateRandomHexString(16);
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/loaders/features/features.js
var EVENTS, JSERRORS, BLOBS, RUM, LOGS, FEATURE_NAMES, featurePriority, FEATURE_TO_ENDPOINT;
var init_features = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/loaders/features/features.js"() {
    EVENTS = "events";
    JSERRORS = "jserrors";
    BLOBS = "browser/blobs";
    RUM = "rum";
    LOGS = "browser/logs";
    FEATURE_NAMES = {
      ajax: "ajax",
      genericEvents: "generic_events",
      jserrors: JSERRORS,
      logging: "logging",
      metrics: "metrics",
      /**
       * @deprecated This feature has been replaced by Generic Events. Use/Import `GenericEvents` instead. This wrapper will be removed in a future release
       */
      pageAction: "page_action",
      pageViewEvent: "page_view_event",
      pageViewTiming: "page_view_timing",
      sessionReplay: "session_replay",
      sessionTrace: "session_trace",
      softNav: "soft_navigations"
    };
    featurePriority = {
      [FEATURE_NAMES.pageViewEvent]: 1,
      [FEATURE_NAMES.pageViewTiming]: 2,
      [FEATURE_NAMES.metrics]: 3,
      [FEATURE_NAMES.jserrors]: 4,
      [FEATURE_NAMES.softNav]: 5,
      [FEATURE_NAMES.ajax]: 6,
      [FEATURE_NAMES.sessionTrace]: 7,
      [FEATURE_NAMES.sessionReplay]: 8,
      [FEATURE_NAMES.logging]: 9,
      [FEATURE_NAMES.genericEvents]: 10
    };
    FEATURE_TO_ENDPOINT = {
      [FEATURE_NAMES.pageViewEvent]: RUM,
      [FEATURE_NAMES.pageViewTiming]: EVENTS,
      [FEATURE_NAMES.ajax]: EVENTS,
      [FEATURE_NAMES.softNav]: EVENTS,
      [FEATURE_NAMES.metrics]: JSERRORS,
      [FEATURE_NAMES.jserrors]: JSERRORS,
      [FEATURE_NAMES.sessionTrace]: BLOBS,
      [FEATURE_NAMES.sessionReplay]: BLOBS,
      [FEATURE_NAMES.logging]: LOGS,
      [FEATURE_NAMES.genericEvents]: "ins"
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/util/monkey-patched.js
function isNative(...fns) {
  return fns.every((fn) => {
    if (checked.has(fn)) return checked.get(fn);
    const fnString = typeof fn === "function" ? fn.toString() : "";
    const isNative2 = fnString.includes("[native code]");
    const isNr = fnString.includes("nrWrapper");
    if (!isNative2 && !isNr) {
      warn(64, fn?.name || fnString);
    }
    checked.set(fn, isNative2);
    return isNative2;
  });
}
var checked;
var init_monkey_patched = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/util/monkey-patched.js"() {
    init_console();
    checked = /* @__PURE__ */ new Map();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/window/nreum.js
function gosNREUM() {
  if (!globalScope.NREUM) {
    globalScope.NREUM = {};
  }
  if (typeof globalScope.newrelic === "undefined") globalScope.newrelic = globalScope.NREUM;
  return globalScope.NREUM;
}
function gosNREUMInfo() {
  let nr2 = gosNREUM();
  const externallySupplied = nr2.info || {};
  nr2.info = {
    beacon: defaults.beacon,
    errorBeacon: defaults.errorBeacon,
    ...externallySupplied
  };
  return nr2;
}
function gosNREUMLoaderConfig() {
  let nr2 = gosNREUM();
  const externallySupplied = nr2.loader_config || {};
  nr2.loader_config = {
    ...externallySupplied
  };
  return nr2;
}
function gosNREUMInit() {
  let nr2 = gosNREUM();
  const externallySupplied = nr2.init || {};
  nr2.init = {
    ...externallySupplied
  };
  return nr2;
}
function gosNREUMOriginals() {
  let nr2 = gosNREUM();
  if (!nr2.o) {
    nr2.o = {
      ST: globalScope.setTimeout,
      SI: globalScope.setImmediate || globalScope.setInterval,
      CT: globalScope.clearTimeout,
      XHR: globalScope.XMLHttpRequest,
      REQ: globalScope.Request,
      EV: globalScope.Event,
      PR: globalScope.Promise,
      MO: globalScope.MutationObserver,
      // this'll be undefined if not in a web window
      FETCH: globalScope.fetch,
      WS: globalScope.WebSocket
    };
    isNative(...Object.values(nr2.o));
  }
  return nr2;
}
function setNREUMInitializedAgent(id2, newAgentInstance) {
  let nr2 = gosNREUM();
  nr2.initializedAgents ??= {};
  newAgentInstance.initializedAt = {
    ms: now(),
    date: /* @__PURE__ */ new Date()
  };
  nr2.initializedAgents[id2] = newAgentInstance;
  if (Object.keys(nr2.initializedAgents).length === 2) {
    warn(69);
  }
}
function addToNREUM(fnName, fn) {
  let nr2 = gosNREUM();
  nr2[fnName] = fn;
}
function gosCDN() {
  gosNREUMInfo();
  gosNREUMInit();
  gosNREUMOriginals();
  gosNREUMLoaderConfig();
  return gosNREUM();
}
var defaults;
var init_nreum = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/window/nreum.js"() {
    init_runtime();
    init_now();
    init_console();
    init_monkey_patched();
    defaults = {
      beacon: "bam.nr-data.net",
      errorBeacon: "bam.nr-data.net"
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/topLevelCallers.js
function setTopLevelCallers(agentRef) {
  const nr2 = gosCDN();
  Object.getOwnPropertyNames(ApiBase.prototype).forEach((fnName) => {
    const origFn = ApiBase.prototype[fnName];
    if (typeof origFn !== "function" || origFn === "constructor") return;
    let origNrFn = nr2[fnName];
    if (!agentRef[fnName] || agentRef.exposed === false || agentRef.runtime?.loaderType === "micro-agent") return;
    nr2[fnName] = (...args) => {
      const thisAgentFnResult = agentRef[fnName](...args);
      if (!origNrFn) return thisAgentFnResult;
      return origNrFn(...args);
    };
  });
}
var init_topLevelCallers = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/loaders/api/topLevelCallers.js"() {
    init_nreum();
    init_api_base();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/config/configurable.js
function getModeledObject(obj2, model2) {
  try {
    if (!obj2 || typeof obj2 !== "object") return warn(3);
    if (!model2 || typeof model2 !== "object") return warn(4);
    const output = Object.create(Object.getPrototypeOf(model2), Object.getOwnPropertyDescriptors(model2));
    const target = Object.keys(output).length === 0 ? obj2 : output;
    for (let key in target) {
      if (obj2[key] === void 0) continue;
      try {
        if (obj2[key] === null) {
          output[key] = null;
          continue;
        }
        if (Array.isArray(obj2[key]) && Array.isArray(model2[key])) output[key] = Array.from(/* @__PURE__ */ new Set([...obj2[key], ...model2[key]]));
        else if (typeof obj2[key] === "object" && typeof model2[key] === "object") output[key] = getModeledObject(obj2[key], model2[key]);
        else output[key] = obj2[key];
      } catch (e2) {
        if (!output[key]) warn(1, e2);
      }
    }
    return output;
  } catch (err2) {
    warn(2, err2);
  }
}
var init_configurable = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/config/configurable.js"() {
    init_console();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/config/info.js
function isValid(info) {
  try {
    return !!info.licenseKey && !!info.errorBeacon && !!info.applicationID;
  } catch (err2) {
    return false;
  }
}
var InfoModel, mergeInfo;
var init_info = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/config/info.js"() {
    init_nreum();
    init_configurable();
    InfoModel = {
      // preset defaults
      beacon: defaults.beacon,
      errorBeacon: defaults.errorBeacon,
      // others must be populated by user
      licenseKey: void 0,
      applicationID: void 0,
      sa: void 0,
      queueTime: void 0,
      applicationTime: void 0,
      ttGuid: void 0,
      user: void 0,
      account: void 0,
      product: void 0,
      extra: void 0,
      jsAttributes: {},
      userAttributes: void 0,
      atts: void 0,
      transactionName: void 0,
      tNamePlain: void 0
    };
    mergeInfo = (info) => {
      return getModeledObject(info, InfoModel);
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/generic_events/constants.js
var FEATURE_NAME, OBSERVED_EVENTS, OBSERVED_WINDOW_EVENTS, RAGE_CLICK_THRESHOLD_EVENTS, RAGE_CLICK_THRESHOLD_MS, FRUSTRATION_TIMEOUT_MS, RESERVED_EVENT_TYPES, FEATURE_FLAGS;
var init_constants2 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/generic_events/constants.js"() {
    init_features();
    FEATURE_NAME = FEATURE_NAMES.genericEvents;
    OBSERVED_EVENTS = ["auxclick", "click", "copy", "keydown", "paste", "scrollend"];
    OBSERVED_WINDOW_EVENTS = ["focus", "blur"];
    RAGE_CLICK_THRESHOLD_EVENTS = 4;
    RAGE_CLICK_THRESHOLD_MS = 1e3;
    FRUSTRATION_TIMEOUT_MS = 2e3;
    RESERVED_EVENT_TYPES = ["PageAction", "UserAction", "BrowserPerformance"];
    FEATURE_FLAGS = {
      RESOURCES: "experimental.resources",
      REGISTER: "register"
      // register.jserrors and register.generic_events are also used, but not referenced directly so no need to represent here
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/dom/query-selector.js
var isValidSelector;
var init_query_selector = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/dom/query-selector.js"() {
    isValidSelector = (selector) => {
      if (!selector || typeof selector !== "string") return false;
      try {
        document.createDocumentFragment().querySelector(selector);
      } catch {
        return false;
      }
      return true;
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/session/constants.js
var PREFIX, DEFAULT_KEY, DEFAULT_EXPIRES_MS, DEFAULT_INACTIVE_MS, SESSION_EVENTS, SESSION_EVENT_TYPES, MODE;
var init_constants3 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/session/constants.js"() {
    PREFIX = "NRBA";
    DEFAULT_KEY = "SESSION";
    DEFAULT_EXPIRES_MS = 144e5;
    DEFAULT_INACTIVE_MS = 18e5;
    SESSION_EVENTS = {
      STARTED: "session-started",
      PAUSE: "session-pause",
      RESET: "session-reset",
      RESUME: "session-resume",
      UPDATE: "session-update"
    };
    SESSION_EVENT_TYPES = {
      SAME_TAB: "same-tab",
      CROSS_TAB: "cross-tab"
    };
    MODE = {
      OFF: 0,
      FULL: 1,
      ERROR: 2
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/config/init.js
var nrMask, InitModelFn, mergeInit;
var init_init = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/config/init.js"() {
    init_constants2();
    init_query_selector();
    init_constants3();
    init_console();
    init_configurable();
    nrMask = "[data-nr-mask]";
    InitModelFn = () => {
      const hiddenState2 = {
        feature_flags: [],
        experimental: {
          allow_registered_children: false,
          resources: false
        },
        mask_selector: "*",
        block_selector: "[data-nr-block]",
        mask_input_options: {
          color: false,
          date: false,
          "datetime-local": false,
          email: false,
          month: false,
          number: false,
          range: false,
          search: false,
          tel: false,
          text: false,
          time: false,
          url: false,
          week: false,
          // unify textarea and select element with text input
          textarea: false,
          select: false,
          password: true
          // This will be enforced to always be true in the setter
        }
      };
      return {
        ajax: {
          deny_list: void 0,
          block_internal: true,
          enabled: true,
          autoStart: true
        },
        api: {
          get allow_registered_children() {
            return hiddenState2.feature_flags.includes(FEATURE_FLAGS.REGISTER) || hiddenState2.experimental.allow_registered_children;
          },
          set allow_registered_children(val) {
            hiddenState2.experimental.allow_registered_children = val;
          },
          duplicate_registered_data: false
        },
        browser_consent_mode: {
          enabled: false
        },
        distributed_tracing: {
          enabled: void 0,
          exclude_newrelic_header: void 0,
          cors_use_newrelic_header: void 0,
          cors_use_tracecontext_headers: void 0,
          allowed_origins: void 0
        },
        get feature_flags() {
          return hiddenState2.feature_flags;
        },
        set feature_flags(val) {
          hiddenState2.feature_flags = val;
        },
        generic_events: {
          enabled: true,
          autoStart: true
        },
        harvest: {
          interval: 30
        },
        jserrors: {
          enabled: true,
          autoStart: true
        },
        logging: {
          enabled: true,
          autoStart: true
        },
        metrics: {
          enabled: true,
          autoStart: true
        },
        obfuscate: void 0,
        page_action: {
          enabled: true
        },
        page_view_event: {
          enabled: true,
          autoStart: true
        },
        page_view_timing: {
          enabled: true,
          autoStart: true
        },
        performance: {
          capture_marks: false,
          capture_measures: false,
          capture_detail: true,
          resources: {
            get enabled() {
              return hiddenState2.feature_flags.includes(FEATURE_FLAGS.RESOURCES) || hiddenState2.experimental.resources;
            },
            set enabled(val) {
              hiddenState2.experimental.resources = val;
            },
            asset_types: [],
            first_party_domains: [],
            ignore_newrelic: true
          }
        },
        privacy: {
          cookies_enabled: true
        },
        proxy: {
          assets: void 0,
          beacon: void 0
        },
        session: {
          expiresMs: DEFAULT_EXPIRES_MS,
          inactiveMs: DEFAULT_INACTIVE_MS
        },
        session_replay: {
          autoStart: true,
          enabled: false,
          preload: false,
          sampling_rate: 10,
          error_sampling_rate: 100,
          collect_fonts: false,
          inline_images: false,
          fix_stylesheets: true,
          mask_all_inputs: true,
          // this has a getter/setter to facilitate validation of the selectors
          get mask_text_selector() {
            return hiddenState2.mask_selector;
          },
          set mask_text_selector(val) {
            if (isValidSelector(val)) hiddenState2.mask_selector = "".concat(val, ",").concat(nrMask);
            else if (val === "" || val === null) hiddenState2.mask_selector = nrMask;
            else warn(5, val);
          },
          // these properties only have getters because they are enforcable constants and should error if someone tries to override them
          get block_class() {
            return "nr-block";
          },
          get ignore_class() {
            return "nr-ignore";
          },
          get mask_text_class() {
            return "nr-mask";
          },
          // props with a getter and setter are used to extend enforcable constants with customer input
          // we must preserve data-nr-block no matter what else the customer sets
          get block_selector() {
            return hiddenState2.block_selector;
          },
          set block_selector(val) {
            if (isValidSelector(val)) hiddenState2.block_selector += ",".concat(val);
            else if (val !== "") warn(6, val);
          },
          // password: must always be present and true no matter what customer sets
          get mask_input_options() {
            return hiddenState2.mask_input_options;
          },
          set mask_input_options(val) {
            if (val && typeof val === "object") hiddenState2.mask_input_options = {
              ...val,
              password: true
            };
            else warn(7, val);
          }
        },
        session_trace: {
          enabled: true,
          autoStart: true
        },
        soft_navigations: {
          enabled: true,
          autoStart: true
        },
        ssl: void 0,
        user_actions: {
          enabled: true,
          elementAttributes: ["id", "className", "tagName", "type"]
        }
      };
    };
    mergeInit = (init) => {
      return getModeledObject(init, InitModelFn());
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/constants/env.npm.js
var VERSION, BUILD_ENV, DIST_METHOD, RRWEB_PACKAGE_NAME, RRWEB_VERSION;
var init_env_npm = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/constants/env.npm.js"() {
    VERSION = "1.310.1";
    BUILD_ENV = "NPM";
    DIST_METHOD = "NPM";
    RRWEB_PACKAGE_NAME = "@newrelic/rrweb";
    RRWEB_VERSION = "1.0.1";
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/config/runtime.js
var _harvestCount, ReadOnly, hiddenState, RuntimeModel, mergeRuntime;
var init_runtime2 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/config/runtime.js"() {
    init_configurable();
    init_runtime();
    init_env_npm();
    _harvestCount = 0;
    ReadOnly = {
      buildEnv: BUILD_ENV,
      distMethod: DIST_METHOD,
      version: VERSION,
      originTime
    };
    hiddenState = {
      consented: false
    };
    RuntimeModel = {
      /** Agent-specific metadata found in the RUM call response. ex. entityGuid */
      appMetadata: {},
      get consented() {
        return this.session?.state?.consent || hiddenState.consented;
      },
      set consented(value) {
        hiddenState.consented = value;
      },
      customTransaction: void 0,
      denyList: void 0,
      disabled: false,
      harvester: void 0,
      isolatedBacklog: false,
      isRecording: false,
      // true when actively recording, false when paused or stopped
      loaderType: void 0,
      maxBytes: 3e4,
      obfuscator: void 0,
      onerror: void 0,
      ptid: void 0,
      releaseIds: {},
      session: void 0,
      timeKeeper: void 0,
      registeredEntities: [],
      /** a proxy is set in agent-session to track jsAttributes changes for harvesting mechanics */
      jsAttributesMetadata: {
        bytes: 0
      },
      get harvestCount() {
        return ++_harvestCount;
      }
    };
    mergeRuntime = (runtime) => {
      const modeledObject = getModeledObject(runtime, RuntimeModel);
      const readonlyDescriptors = Object.keys(ReadOnly).reduce((descriptors, key) => {
        descriptors[key] = {
          value: ReadOnly[key],
          writable: false,
          configurable: true,
          enumerable: true
        };
        return descriptors;
      }, {});
      return Object.defineProperties(modeledObject, readonlyDescriptors);
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/util/feature-flags.js
function activateFeatures(flags, agentRef) {
  const agentIdentifier = agentRef.agentIdentifier;
  activatedFeatures[agentIdentifier] ??= {};
  if (!flags || typeof flags !== "object") return;
  if (sentIds.has(agentIdentifier)) return;
  agentRef.ee.emit("rumresp", [flags]);
  activatedFeatures[agentIdentifier] = flags;
  sentIds.add(agentIdentifier);
  dispatchGlobalEvent({
    agentIdentifier,
    loaded: true,
    drained: true,
    type: "lifecycle",
    name: "load",
    feature: void 0,
    data: flags
  });
}
var sentIds, activatedFeatures;
var init_feature_flags = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/util/feature-flags.js"() {
    init_global_event();
    sentIds = /* @__PURE__ */ new Set();
    activatedFeatures = {};
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/util/get-or-set.js
function getOrSet(obj2, prop2, getVal) {
  if (has.call(obj2, prop2)) return obj2[prop2];
  var val = getVal();
  if (Object.defineProperty && Object.keys) {
    try {
      Object.defineProperty(obj2, prop2, {
        value: val,
        // old IE inherits non-write-ability
        writable: true,
        enumerable: false
      });
      return val;
    } catch (e2) {
    }
  }
  obj2[prop2] = val;
  return val;
}
var has;
var init_get_or_set = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/util/get-or-set.js"() {
    has = Object.prototype.hasOwnProperty;
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/event-emitter/event-context.js
var EventContext;
var init_event_context = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/event-emitter/event-context.js"() {
    EventContext = class {
      constructor(contextId2) {
        this.contextId = contextId2;
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/ids/bundle-id.js
var bundleId;
var init_bundle_id = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/ids/bundle-id.js"() {
    init_unique_id();
    bundleId = generateUuid();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/event-emitter/contextual-ee.js
function ee(old, debugId) {
  var handlers3 = {};
  var bufferGroupMap = {};
  var emitters = {};
  var isolatedBacklog = false;
  try {
    isolatedBacklog = debugId.length !== 16 ? false : nr.initializedAgents?.[debugId]?.runtime.isolatedBacklog;
  } catch (err2) {
  }
  var emitter = {
    on: addEventListener2,
    addEventListener: addEventListener2,
    removeEventListener: removeEventListener2,
    emit,
    get: getOrCreate,
    listeners,
    context,
    buffer: bufferEventsByGroup,
    abort,
    isBuffering,
    debugId,
    backlog: isolatedBacklog ? {} : old && typeof old.backlog === "object" ? old.backlog : {},
    isolatedBacklog
  };
  function abort() {
    emitter._aborted = true;
    Object.keys(emitter.backlog).forEach((key) => {
      delete emitter.backlog[key];
    });
  }
  Object.defineProperty(emitter, "aborted", {
    get: () => {
      let aborted = emitter._aborted || false;
      if (aborted) return aborted;
      else if (old) {
        aborted = old.aborted;
      }
      return aborted;
    }
  });
  return emitter;
  function context(contextOrStore) {
    if (contextOrStore && contextOrStore instanceof EventContext) {
      return contextOrStore;
    } else if (contextOrStore) {
      return getOrSet(contextOrStore, contextId, () => new EventContext(contextId));
    } else {
      return new EventContext(contextId);
    }
  }
  function emit(type, args, contextOrStore, force, bubble) {
    if (bubble !== false) bubble = true;
    if (globalInstance.aborted && !force) {
      return;
    }
    if (old && bubble) old.emit(type, args, contextOrStore);
    var ctx = context(contextOrStore);
    var handlersArray = listeners(type);
    handlersArray.forEach((handler) => {
      handler.apply(ctx, args);
    });
    var bufferGroup = getBuffer()[bufferGroupMap[type]];
    if (bufferGroup) {
      bufferGroup.push([emitter, type, args, ctx]);
    }
    return ctx;
  }
  function addEventListener2(type, fn) {
    handlers3[type] = listeners(type).concat(fn);
  }
  function removeEventListener2(type, fn) {
    var listeners2 = handlers3[type];
    if (!listeners2) return;
    for (var i2 = 0; i2 < listeners2.length; i2++) {
      if (listeners2[i2] === fn) {
        listeners2.splice(i2, 1);
      }
    }
  }
  function listeners(type) {
    return handlers3[type] || [];
  }
  function getOrCreate(name) {
    return emitters[name] = emitters[name] || ee(emitter, name);
  }
  function bufferEventsByGroup(types, group) {
    const eventBuffer = getBuffer();
    group = group || "feature";
    if (emitter.aborted) return;
    Object.entries(types || {}).forEach(([_2, type]) => {
      bufferGroupMap[type] = group;
      if (!(group in eventBuffer)) {
        eventBuffer[group] = [];
      }
    });
  }
  function isBuffering(type) {
    var bufferGroup = getBuffer()[bufferGroupMap[type]];
    return !!bufferGroup;
  }
  function getBuffer() {
    return emitter.backlog;
  }
}
var contextId, globalInstance, nr;
var init_contextual_ee = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/event-emitter/contextual-ee.js"() {
    init_nreum();
    init_get_or_set();
    init_event_context();
    init_bundle_id();
    contextId = "nr@context:".concat(bundleId);
    globalInstance = ee(void 0, "globalEE");
    nr = gosNREUM();
    if (!nr.ee) {
      nr.ee = globalInstance;
    }
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/config/loader-config.js
var LoaderConfigModel, mergeLoaderConfig;
var init_loader_config = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/config/loader-config.js"() {
    init_configurable();
    LoaderConfigModel = {
      accountID: void 0,
      trustKey: void 0,
      agentID: void 0,
      licenseKey: void 0,
      applicationID: void 0,
      xpid: void 0
    };
    mergeLoaderConfig = (loaderConfig) => {
      return getModeledObject(loaderConfig, LoaderConfigModel);
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/loaders/configure/configure.js
function configure(agent, opts = {}, loaderType, forceDrain) {
  let {
    init,
    info,
    loader_config,
    runtime = {},
    exposed = true
  } = opts;
  if (!info) {
    const nr2 = gosCDN();
    init = nr2.init;
    info = nr2.info;
    loader_config = nr2.loader_config;
  }
  agent.init = mergeInit(init || {});
  agent.loader_config = mergeLoaderConfig(loader_config || {});
  info.jsAttributes ??= {};
  if (isWorkerScope) {
    info.jsAttributes.isWorker = true;
  }
  agent.info = mergeInfo(info);
  const updatedInit = agent.init;
  const internalTrafficList = [info.beacon, info.errorBeacon];
  if (!alreadySetOnce.has(agent.agentIdentifier)) {
    if (updatedInit.proxy.assets) {
      redefinePublicPath(updatedInit.proxy.assets);
      internalTrafficList.push(updatedInit.proxy.assets);
    }
    if (updatedInit.proxy.beacon) internalTrafficList.push(updatedInit.proxy.beacon);
    agent.beacons = [...internalTrafficList];
    setTopLevelCallers(agent);
    addToNREUM("activatedFeatures", activatedFeatures);
  }
  runtime.denyList = [...updatedInit.ajax.deny_list || [], ...updatedInit.ajax.block_internal ? internalTrafficList : []];
  runtime.ptid = agent.agentIdentifier;
  runtime.loaderType = loaderType;
  agent.runtime = mergeRuntime(runtime);
  if (!alreadySetOnce.has(agent.agentIdentifier)) {
    agent.ee = globalInstance.get(agent.agentIdentifier);
    agent.exposed = exposed;
    dispatchGlobalEvent({
      agentIdentifier: agent.agentIdentifier,
      drained: !!activatedFeatures?.[agent.agentIdentifier],
      type: "lifecycle",
      name: "initialize",
      feature: void 0,
      data: agent.config
    });
  }
  alreadySetOnce.add(agent.agentIdentifier);
}
var alreadySetOnce;
var init_configure = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/loaders/configure/configure.js"() {
    init_topLevelCallers();
    init_nreum();
    init_info();
    init_init();
    init_runtime2();
    init_feature_flags();
    init_runtime();
    init_public_path();
    init_contextual_ee();
    init_global_event();
    init_loader_config();
    alreadySetOnce = /* @__PURE__ */ new Set();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/event-emitter/handle.js
function handle(type, args, ctx, group, ee2) {
  if (ee2) {
    ee2.buffer([type], group);
    ee2.emit(type, args, ctx);
  } else {
    handleEE.buffer([type], group);
    handleEE.emit(type, args, ctx);
  }
}
var handleEE;
var init_handle = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/event-emitter/handle.js"() {
    init_contextual_ee();
    handleEE = globalInstance.get("handle");
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/metrics/constants.js
var FEATURE_NAME2, SUPPORTABILITY_METRIC, CUSTOM_METRIC, SUPPORTABILITY_METRIC_CHANNEL, CUSTOM_METRIC_CHANNEL;
var init_constants4 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/metrics/constants.js"() {
    init_features();
    FEATURE_NAME2 = FEATURE_NAMES.metrics;
    SUPPORTABILITY_METRIC = "sm";
    CUSTOM_METRIC = "cm";
    SUPPORTABILITY_METRIC_CHANNEL = "storeSupportabilityMetrics";
    CUSTOM_METRIC_CHANNEL = "storeEventMetrics";
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/sharedHandlers.js
function setupAPI(name, fn, agent, obj2) {
  const api = obj2 || agent;
  if (!api || !!api[name] && api[name] !== AgentBase.prototype[name]) return;
  api[name] = function() {
    handle(SUPPORTABILITY_METRIC_CHANNEL, ["API/" + name + "/called"], void 0, FEATURE_NAMES.metrics, agent.ee);
    dispatchGlobalEvent({
      agentIdentifier: agent.agentIdentifier,
      drained: !!activatedFeatures?.[agent.agentIdentifier],
      type: "data",
      name: "api",
      feature: prefix + name,
      data: {}
    });
    try {
      return fn.apply(this, arguments);
    } catch (err2) {
      warn(23, err2);
    }
  };
}
function appendJsAttribute(agent, key, value, apiName, addToBrowserStorage) {
  const currentInfo = agent.info;
  if (value === null) {
    delete currentInfo.jsAttributes[key];
  } else {
    currentInfo.jsAttributes[key] = value;
  }
  if (addToBrowserStorage || value === null) handle(prefix + apiName, [now(), key, value], void 0, "session", agent.ee);
}
var init_sharedHandlers = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/loaders/api/sharedHandlers.js"() {
    init_global_event();
    init_handle();
    init_now();
    init_console();
    init_feature_flags();
    init_constants4();
    init_agent_base();
    init_features();
    init_constants();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/event-emitter/register-handler.js
function defaultRegister(type, handler, group, ee2) {
  registerWithSpecificEmitter(ee2 || handleEE, handlers, type, handler, group);
}
function registerWithSpecificEmitter(ee2, handlers3, type, handler, group) {
  if (!group) group = "feature";
  if (!ee2) ee2 = handleEE;
  var groupHandlers = handlers3[group] = handlers3[group] || {};
  var list2 = groupHandlers[type] = groupHandlers[type] || [];
  list2.push([ee2, handler]);
}
var handlers;
var init_register_handler = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/event-emitter/register-handler.js"() {
    init_handle();
    defaultRegister.on = registerWithSpecificEmitter;
    handlers = defaultRegister.handlers = {};
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/drain/drain.js
function registerDrain(agentIdentifier, group) {
  const item = {
    staged: false,
    priority: featurePriority[group] || 0
  };
  curateRegistry(agentIdentifier);
  if (!registry[agentIdentifier].get(group)) registry[agentIdentifier].set(group, item);
}
function deregisterDrain(agentIdentifier, group) {
  if (!agentIdentifier || !registry[agentIdentifier]) return;
  if (registry[agentIdentifier].get(group)) registry[agentIdentifier].delete(group);
  drainGroup(agentIdentifier, group, false);
  if (registry[agentIdentifier].size) checkCanDrainAll(agentIdentifier);
}
function curateRegistry(agentIdentifier) {
  if (!agentIdentifier) throw new Error("agentIdentifier required");
  if (!registry[agentIdentifier]) registry[agentIdentifier] = /* @__PURE__ */ new Map();
}
function drain(agentIdentifier = "", featureName = "feature", force = false) {
  curateRegistry(agentIdentifier);
  if (!agentIdentifier || !registry[agentIdentifier].get(featureName) || force) return drainGroup(agentIdentifier, featureName);
  registry[agentIdentifier].get(featureName).staged = true;
  checkCanDrainAll(agentIdentifier);
}
function checkCanDrainAll(agentIdentifier) {
  const items = Array.from(registry[agentIdentifier]);
  if (items.every(([key, values]) => values.staged)) {
    items.sort((a2, b3) => a2[1].priority - b3[1].priority);
    items.forEach(([group]) => {
      registry[agentIdentifier].delete(group);
      drainGroup(agentIdentifier, group);
    });
  }
}
function drainGroup(agentIdentifier, group, activateGroup = true) {
  const baseEE = agentIdentifier ? globalInstance.get(agentIdentifier) : globalInstance;
  const handlers3 = defaultRegister.handlers;
  if (baseEE.aborted || !baseEE.backlog || !handlers3) return;
  dispatchGlobalEvent({
    agentIdentifier,
    type: "lifecycle",
    name: "drain",
    feature: group
  });
  if (activateGroup) {
    const bufferedEventsInGroup = baseEE.backlog[group];
    const groupHandlers = handlers3[group];
    if (groupHandlers) {
      for (let i2 = 0; bufferedEventsInGroup && i2 < bufferedEventsInGroup.length; ++i2) {
        emitEvent(bufferedEventsInGroup[i2], groupHandlers);
      }
      Object.entries(groupHandlers).forEach(([eventType, handlerRegistrationList]) => {
        Object.values(handlerRegistrationList || {}).forEach((registration) => {
          if (registration[0]?.on && registration[0].context() instanceof EventContext && !registration[0].listeners(eventType).includes(registration[1])) registration[0].on(eventType, registration[1]);
        });
      });
    }
  }
  if (!baseEE.isolatedBacklog) delete handlers3[group];
  baseEE.backlog[group] = null;
  baseEE.emit("drain-" + group, []);
}
function emitEvent(evt, groupHandlers) {
  var type = evt[1];
  Object.values(groupHandlers[type] || {}).forEach((registration) => {
    var sourceEE = evt[0];
    var ee2 = registration[0];
    if (ee2 === sourceEE) {
      var handler = registration[1];
      var ctx = evt[3];
      var args = evt[2];
      handler.apply(ctx, args);
    }
  });
}
var registry;
var init_drain = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/drain/drain.js"() {
    init_global_event();
    init_contextual_ee();
    init_register_handler();
    init_features();
    init_event_context();
    registry = {};
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/utils/feature-base.js
var FeatureBase;
var init_feature_base = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/utils/feature-base.js"() {
    init_contextual_ee();
    init_drain();
    FeatureBase = class {
      constructor(agentIdentifier, featureName) {
        this.agentIdentifier = agentIdentifier;
        this.ee = globalInstance.get(agentIdentifier);
        this.featureName = featureName;
        this.blocked = false;
      }
      deregisterDrain() {
        deregisterDrain(this.agentIdentifier, this.featureName);
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/event-listener/event-listener-opts.js
function eventListenerOpts(useCapture, abortSignal) {
  return {
    capture: useCapture,
    passive: false,
    signal: abortSignal
  };
}
function windowAddEventListener(event, listener, capture = false, abortSignal) {
  window.addEventListener(event, listener, eventListenerOpts(capture, abortSignal));
}
function documentAddEventListener(event, listener, capture = false, abortSignal) {
  document.addEventListener(event, listener, eventListenerOpts(capture, abortSignal));
}
var init_event_listener_opts = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/event-listener/event-listener-opts.js"() {
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/util/invoke.js
function debounce(func, timeout = 500, options = {}) {
  const leading = options?.leading || false;
  let timer;
  return (...args) => {
    if (leading && timer === void 0) {
      func.apply(this, args);
      timer = setTimeout(() => {
        timer = clearTimeout(timer);
      }, timeout);
    }
    if (!leading) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    }
  };
}
function single(func) {
  let called = false;
  return (...args) => {
    if (!called) {
      called = true;
      func.apply(this, args);
    }
  };
}
var init_invoke = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/util/invoke.js"() {
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/window/load.js
function checkState() {
  return typeof document === "undefined" || document.readyState === "complete";
}
function onWindowLoad(cb, useCapture) {
  if (checkState()) return cb();
  const singleCb = single(cb);
  const poll = setInterval(() => {
    if (checkState()) {
      clearInterval(poll);
      singleCb();
    }
  }, 500);
  windowAddEventListener("load", singleCb, useCapture);
}
function onDOMContentLoaded(cb) {
  if (checkState()) return cb();
  documentAddEventListener("DOMContentLoaded", cb);
}
function onPopstateChange(cb) {
  if (checkState()) return cb();
  windowAddEventListener("popstate", cb);
}
var init_load = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/window/load.js"() {
    init_event_listener_opts();
    init_invoke();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/utils/feature-gates.js
var canEnableSessionTracking;
var init_feature_gates = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/utils/feature-gates.js"() {
    init_runtime();
    canEnableSessionTracking = (agentInit) => {
      return isBrowserScope && agentInit?.privacy.cookies_enabled === true;
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/session_replay/shared/utils.js
function hasReplayPrerequisite(agentInit) {
  return !!gosNREUMOriginals().o.MO && // Session Replay cannot work without Mutation Observer
  canEnableSessionTracking(agentInit) && // requires session tracking to be running (hence "session" replay...)
  agentInit?.session_trace.enabled === true;
}
function isPreloadAllowed(agentInit) {
  return agentInit?.session_replay.preload === true && hasReplayPrerequisite(agentInit);
}
function customMasker(text, element) {
  try {
    if (typeof element?.type === "string") {
      if (element.type.toLowerCase() === "password") return "*".repeat(text?.length || 0);
      if (element?.dataset?.nrUnmask !== void 0 || element?.classList?.contains("nr-unmask")) return text;
    }
  } catch (err2) {
  }
  return typeof text === "string" ? text.replace(/[\S]/g, "*") : "*".repeat(text?.length || 0);
}
var init_utils = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/session_replay/shared/utils.js"() {
    init_nreum();
    init_feature_gates();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/constants/agent-constants.js
var IDEAL_PAYLOAD_SIZE, MAX_PAYLOAD_SIZE, SESSION_ERROR, SUPPORTS_REGISTERED_ENTITIES;
var init_agent_constants = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/constants/agent-constants.js"() {
    init_features();
    IDEAL_PAYLOAD_SIZE = 16e3;
    MAX_PAYLOAD_SIZE = 1e6;
    SESSION_ERROR = "SESSION_ERROR";
    SUPPORTS_REGISTERED_ENTITIES = {
      [FEATURE_NAMES.logging]: true,
      // flip other features here when they are supported by DEM consumers
      [FEATURE_NAMES.genericEvents]: false,
      [FEATURE_NAMES.jserrors]: false,
      [FEATURE_NAMES.ajax]: false
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/util/stringify.js
function stringify(val) {
  try {
    return JSON.stringify(val, getCircularReplacer()) ?? "";
  } catch (e2) {
    try {
      globalInstance.emit("internal-error", [e2]);
    } catch (err2) {
    }
    return "";
  }
}
var getCircularReplacer;
var init_stringify = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/util/stringify.js"() {
    init_contextual_ee();
    getCircularReplacer = () => {
      const seen = /* @__PURE__ */ new WeakSet();
      return (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      };
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/timer/timer.js
var Timer;
var init_timer = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/timer/timer.js"() {
    Timer = class {
      constructor(opts, ms) {
        if (!opts.onEnd) throw new Error("onEnd handler is required");
        if (!ms) throw new Error("ms duration is required");
        this.onEnd = opts.onEnd;
        this.initialMs = ms;
        this.startTimestamp = Date.now();
        this.timer = this.create(this.onEnd, ms);
      }
      create(cb, ms) {
        if (this.timer) this.clear();
        return setTimeout(() => cb ? cb() : this.onEnd(), ms || this.initialMs);
      }
      clear() {
        clearTimeout(this.timer);
        this.timer = null;
      }
      end() {
        this.clear();
        this.onEnd();
      }
      isValid() {
        return this.initialMs - (Date.now() - this.startTimestamp) > 0;
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/window/page-visibility.js
function subscribeToVisibilityChange(cb, toHiddenOnly = false, capture, abortSignal) {
  documentAddEventListener("visibilitychange", handleVisibilityChange, capture, abortSignal);
  function handleVisibilityChange() {
    if (toHiddenOnly) {
      if (document.visibilityState === "hidden") cb();
      return;
    }
    cb(document.visibilityState);
  }
}
function subscribeToPageUnload(cb, capture, abortSignal) {
  windowAddEventListener("pagehide", cb, capture, abortSignal);
}
var init_page_visibility = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/window/page-visibility.js"() {
    init_event_listener_opts();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/timer/interaction-timer.js
var InteractionTimer;
var init_interaction_timer = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/timer/interaction-timer.js"() {
    init_timer();
    init_page_visibility();
    init_invoke();
    init_runtime();
    InteractionTimer = class extends Timer {
      constructor(opts, ms) {
        super(opts, ms);
        this.onPause = typeof opts.onPause === "function" ? opts.onPause : () => {
        };
        this.onRefresh = typeof opts.onRefresh === "function" ? opts.onRefresh : () => {
        };
        this.onResume = typeof opts.onResume === "function" ? opts.onResume : () => {
        };
        this.readStorage = opts.readStorage;
        this.remainingMs = void 0;
        if (!opts.refreshEvents) opts.refreshEvents = ["click", "keydown", "scroll"];
        try {
          this.abortController = new AbortController();
        } catch (e2) {
        }
        if (isBrowserScope && opts.ee) {
          if (opts.ee) {
            this.ee = opts.ee;
            const debouncedRefresh = debounce(this.refresh.bind(this), 500, {
              leading: true
            });
            this.refreshHandler = (evts) => {
              if (opts.refreshEvents.includes(evts?.[0]?.type)) {
                debouncedRefresh();
              }
            };
            opts.ee.on("fn-end", this.refreshHandler);
          }
          subscribeToVisibilityChange((state) => {
            if (state === "hidden") this.pause();
            else this.resume();
          }, false, false, this.abortController?.signal);
        }
      }
      abort() {
        this.clear();
        this.abortController?.abort();
        if (this.refreshHandler) {
          this.ee.removeEventListener("fn-end", this.refreshHandler);
          this.refreshHandler = this.ee = null;
        }
      }
      pause() {
        this.onPause();
        clearTimeout(this.timer);
        this.remainingMs = this.initialMs - (Date.now() - this.startTimestamp);
      }
      resume() {
        try {
          const lsData = this.readStorage();
          const obj2 = typeof lsData === "string" ? JSON.parse(lsData) : lsData;
          if (isExpired(obj2.expiresAt) || isExpired(obj2.inactiveAt)) this.end();
          else {
            this.refresh();
            this.onResume();
          }
        } catch (err2) {
          this.end();
        }
        function isExpired(timestamp) {
          return Date.now() > timestamp;
        }
      }
      refresh(cb, ms) {
        this.clear();
        this.timer = this.create(cb, ms);
        this.startTimestamp = Date.now();
        this.remainingMs = void 0;
        this.onRefresh();
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/wrap/wrap-function.js
function createWrapperWithEmitter(emitter, always) {
  emitter || (emitter = globalInstance);
  wrapFn.inPlace = inPlace;
  wrapFn.flag = flag;
  return wrapFn;
  function wrapFn(fn, prefix3, getContext, methodName, bubble) {
    if (notWrappable(fn)) return fn;
    if (!prefix3) prefix3 = "";
    nrWrapper[flag] = fn;
    copy(fn, nrWrapper, emitter);
    return nrWrapper;
    function nrWrapper() {
      var args;
      var originalThis;
      var ctx;
      var result2;
      let thrownError;
      try {
        originalThis = this;
        args = [...arguments];
        if (typeof getContext === "function") {
          ctx = getContext(args, originalThis);
        } else {
          ctx = getContext || {};
        }
      } catch (e2) {
        report([e2, "", [args, originalThis, methodName], ctx], emitter);
      }
      safeEmit(prefix3 + "start", [args, originalThis, methodName], ctx, bubble);
      const fnStartTime = performance.now();
      let fnEndTime;
      try {
        result2 = fn.apply(originalThis, args);
        fnEndTime = performance.now();
        return result2;
      } catch (err2) {
        fnEndTime = performance.now();
        safeEmit(prefix3 + "err", [args, originalThis, err2], ctx, bubble);
        thrownError = err2;
        throw thrownError;
      } finally {
        const duration = fnEndTime - fnStartTime;
        const task = {
          start: fnStartTime,
          end: fnEndTime,
          duration,
          isLongTask: duration >= LONG_TASK_THRESHOLD,
          methodName,
          thrownError
          // could add more properties here later if needed by downstream features
        };
        if (task.isLongTask) {
          safeEmit("long-task", [task, originalThis], ctx, bubble);
        }
        safeEmit(prefix3 + "end", [args, originalThis, result2], ctx, bubble);
      }
    }
  }
  function inPlace(obj2, methods, prefix3, getContext, bubble) {
    if (!prefix3) prefix3 = "";
    const prependMethodPrefix = prefix3.charAt(0) === "-";
    for (let i2 = 0; i2 < methods.length; i2++) {
      const method = methods[i2];
      const fn = obj2[method];
      if (notWrappable(fn)) continue;
      obj2[method] = wrapFn(fn, prependMethodPrefix ? method + prefix3 : prefix3, getContext, method, bubble);
    }
  }
  function safeEmit(evt, arr, store, bubble) {
    if (inWrapper && !always) return;
    var prev = inWrapper;
    inWrapper = true;
    try {
      emitter.emit(evt, arr, store, always, bubble);
    } catch (e2) {
      report([e2, evt, arr, store], emitter);
    }
    inWrapper = prev;
  }
}
function report(args, emitter) {
  emitter || (emitter = globalInstance);
  try {
    emitter.emit("internal-error", args);
  } catch (err2) {
  }
}
function copy(from, to, emitter) {
  if (Object.defineProperty && Object.keys) {
    try {
      var keys = Object.keys(from);
      keys.forEach(function(key) {
        Object.defineProperty(to, key, {
          get: function() {
            return from[key];
          },
          // eslint-disable-next-line
          set: function(val) {
            from[key] = val;
            return val;
          }
        });
      });
      return to;
    } catch (e2) {
      report([e2], emitter);
    }
  }
  for (var i2 in from) {
    if (has2.call(from, i2)) {
      to[i2] = from[i2];
    }
  }
  return to;
}
function notWrappable(fn) {
  return !(fn && typeof fn === "function" && fn.apply && !fn[flag]);
}
var flag, LONG_TASK_THRESHOLD, has2, inWrapper;
var init_wrap_function = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/wrap/wrap-function.js"() {
    init_contextual_ee();
    init_bundle_id();
    flag = "nr@original:".concat(bundleId);
    LONG_TASK_THRESHOLD = 50;
    has2 = Object.prototype.hasOwnProperty;
    inWrapper = false;
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/wrap/wrap-events.js
function wrapEvents(sharedEE) {
  var ee2 = scopedEE(sharedEE);
  if (wrapped[ee2.debugId]++) return ee2;
  wrapped[ee2.debugId] = 1;
  var wrapFn = createWrapperWithEmitter(ee2, true);
  if ("getPrototypeOf" in Object) {
    if (isBrowserScope) findEventListenerProtoAndCb(document, wrapNode);
    if (XHR) findEventListenerProtoAndCb(XHR.prototype, wrapNode);
    findEventListenerProtoAndCb(globalScope, wrapNode);
  }
  ee2.on(ADD_EVENT_LISTENER + "-start", function(args, target) {
    var originalListener = args[1];
    if (originalListener === null || typeof originalListener !== "function" && typeof originalListener !== "object" || args[0] === "newrelic") {
      return;
    }
    var wrapped6 = getOrSet(originalListener, flag2, function() {
      var listener = {
        object: wrapHandleEvent,
        function: originalListener
      }[typeof originalListener];
      return listener ? wrapFn(listener, "fn-", null, listener.name || "anonymous") : originalListener;
      function wrapHandleEvent() {
        if (typeof originalListener.handleEvent !== "function") return;
        return originalListener.handleEvent.apply(originalListener, arguments);
      }
    });
    this.wrapped = args[1] = wrapped6;
  });
  ee2.on(REMOVE_EVENT_LISTENER + "-start", function(args) {
    args[1] = this.wrapped || args[1];
  });
  function wrapNode(node2) {
    wrapFn.inPlace(node2, [ADD_EVENT_LISTENER, REMOVE_EVENT_LISTENER], "-", uniqueListener);
  }
  function uniqueListener(args, obj2) {
    return args[1];
  }
  return ee2;
}
function findEventListenerProtoAndCb(object, cb, ...rest) {
  let step = object;
  while (typeof step === "object" && !Object.prototype.hasOwnProperty.call(step, ADD_EVENT_LISTENER)) {
    step = Object.getPrototypeOf(step);
  }
  if (step) cb(step, ...rest);
}
function scopedEE(sharedEE) {
  return (sharedEE || globalInstance).get("events");
}
var wrapped, XHR, ADD_EVENT_LISTENER, REMOVE_EVENT_LISTENER, flag2;
var init_wrap_events = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/wrap/wrap-events.js"() {
    init_contextual_ee();
    init_wrap_function();
    init_get_or_set();
    init_runtime();
    wrapped = {};
    XHR = globalScope.XMLHttpRequest;
    ADD_EVENT_LISTENER = "addEventListener";
    REMOVE_EVENT_LISTENER = "removeEventListener";
    flag2 = "nr@wrapped:".concat(contextId);
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/logging/constants.js
var LOG_LEVELS, LOGGING_MODE, LOGGING_EVENT_EMITTER_CHANNEL, FEATURE_NAME3;
var init_constants5 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/logging/constants.js"() {
    init_features();
    LOG_LEVELS = {
      ERROR: "ERROR",
      WARN: "WARN",
      INFO: "INFO",
      DEBUG: "DEBUG",
      TRACE: "TRACE"
    };
    LOGGING_MODE = {
      OFF: 0,
      ERROR: 1,
      WARN: 2,
      INFO: 3,
      DEBUG: 4,
      TRACE: 5
    };
    LOGGING_EVENT_EMITTER_CHANNEL = "log";
    FEATURE_NAME3 = FEATURE_NAMES.logging;
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/session/session-entity.js
var model, SessionEntity;
var init_session_entity = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/session/session-entity.js"() {
    init_unique_id();
    init_console();
    init_stringify();
    init_contextual_ee();
    init_timer();
    init_runtime();
    init_constants3();
    init_interaction_timer();
    init_wrap_events();
    init_configurable();
    init_handle();
    init_constants4();
    init_features();
    init_event_listener_opts();
    init_constants5();
    model = {
      value: "",
      inactiveAt: 0,
      expiresAt: 0,
      updatedAt: Date.now(),
      sessionReplayMode: MODE.OFF,
      sessionReplaySentFirstChunk: false,
      sessionTraceMode: MODE.OFF,
      traceHarvestStarted: false,
      loggingMode: LOGGING_MODE.OFF,
      logApiMode: LOGGING_MODE.OFF,
      serverTimeDiff: null,
      // set by TimeKeeper; "undefined" value will not be stringified and stored but "null" will
      custom: {},
      numOfResets: 0,
      consent: false
      // set by consent() API call
    };
    SessionEntity = class {
      /**
       * Create a self-managing Session Entity. This entity is scoped to the agent identifier which triggered it, allowing for multiple simultaneous session objects to exist.
       * There is one "namespace" an agent can store data in LS -- NRBA_{key}. If there are two agents on one page, and they both use the same key, they could overwrite each other since they would both use the same namespace in LS by default.
       * The value can be overridden in the constructor, but will default to a unique 16 character hex string
       * expiresMs and inactiveMs are used to "expire" the session, but can be overridden in the constructor. Pass 0 to disable expiration timers.
       */
      constructor(opts) {
        const {
          agentIdentifier,
          key,
          storage
        } = opts;
        if (!agentIdentifier || !key || !storage) {
          throw new Error("Missing required field(s):".concat(!agentIdentifier ? " agentID" : "").concat(!key ? " key" : "").concat(!storage ? " storage" : ""));
        }
        this.agentIdentifier = agentIdentifier;
        this.storage = storage;
        this.state = {};
        this.key = key;
        this.ee = globalInstance.get(agentIdentifier);
        wrapEvents(this.ee);
        this.setup(opts);
        if (isBrowserScope) {
          windowAddEventListener("storage", (event) => {
            if (event.key === this.lookupKey) {
              const obj2 = typeof event.newValue === "string" ? JSON.parse(event.newValue) : event.newValue;
              this.sync(obj2);
              this.ee.emit(SESSION_EVENTS.UPDATE, [SESSION_EVENT_TYPES.CROSS_TAB, this.state]);
            }
          });
        }
      }
      setup({
        value = generateRandomHexString(16),
        expiresMs = DEFAULT_EXPIRES_MS,
        inactiveMs = DEFAULT_INACTIVE_MS,
        numOfResets = 0
      }) {
        const persistentAttributes = {
          serverTimeDiff: this.state.serverTimeDiff || model.serverTimeDiff,
          consent: this.state.consent || model.consent
        };
        this.state = {};
        this.sync({
          ...model,
          ...persistentAttributes
        });
        this.state.value = value;
        this.expiresMs = expiresMs;
        this.inactiveMs = inactiveMs;
        const initialRead = this.read();
        if (expiresMs) {
          this.state.expiresAt = initialRead?.expiresAt || this.getFutureTimestamp(expiresMs);
          this.state.numOfResets = initialRead?.numOfResets || numOfResets;
          this.expiresTimer = new Timer({
            // When the inactive timer ends, collect a SM and reset the session
            onEnd: () => {
              this.collectSM("expired");
              this.collectSM("duration");
              this.reset();
            }
          }, this.state.expiresAt - Date.now());
        } else {
          this.state.expiresAt = Infinity;
        }
        if (inactiveMs) {
          this.state.inactiveAt = initialRead?.inactiveAt || this.getFutureTimestamp(inactiveMs);
          this.inactiveTimer = new InteractionTimer({
            // When the inactive timer ends, collect a SM and reset the session
            onEnd: () => {
              this.collectSM("inactive");
              this.collectSM("duration");
              this.reset();
            },
            // When the inactive timer refreshes, it will update the storage values with an update timestamp
            onRefresh: this.refresh.bind(this),
            onResume: () => {
              this.ee.emit(SESSION_EVENTS.RESUME);
            },
            // When the inactive timer pauses, update the storage values with an update timestamp
            onPause: () => {
              if (this.initialized) this.ee.emit(SESSION_EVENTS.PAUSE);
              this.write(getModeledObject(this.state, model));
            },
            ee: this.ee,
            refreshEvents: ["click", "keydown", "scroll"],
            readStorage: () => this.storage.get(this.lookupKey)
          }, this.state.inactiveAt - Date.now());
        } else {
          this.state.inactiveAt = Infinity;
        }
        this.isNew ||= !Object.keys(initialRead).length;
        if (this.isNew) this.write(getModeledObject(this.state, model), true);
        else this.sync(initialRead);
        this.initialized = true;
        this.ee.emit(SESSION_EVENTS.STARTED, [this.isNew]);
      }
      // This is the actual key appended to the storage API
      get lookupKey() {
        return "".concat(PREFIX, "_").concat(this.key);
      }
      sync(data) {
        Object.assign(this.state, data);
      }
      /**
       * Fetch the stored values from the storage API tied to this entity
       * @returns {Object}
       */
      read() {
        try {
          const val = this.storage.get(this.lookupKey);
          if (!val) return {};
          const obj2 = typeof val === "string" ? JSON.parse(val) : val;
          if (this.isInvalid(obj2)) return {};
          if (this.isExpired(obj2.expiresAt)) {
            this.collectSM("expired");
            this.collectSM("duration", obj2, true);
            return this.reset();
          }
          if (this.isExpired(obj2.inactiveAt)) {
            this.collectSM("inactive");
            this.collectSM("duration", obj2, true);
            return this.reset();
          }
          return obj2;
        } catch (e2) {
          warn(10, e2);
          return {};
        }
      }
      /**
       * Store data to the storage API tied to this entity
       * To preseve existing attributes, the output of ...session.read()
       * should be appended to the data argument
       * @param {Object} data
       * @returns {Object}
       */
      write(data) {
        try {
          if (!data || typeof data !== "object") return;
          data.updatedAt = Date.now();
          this.sync(data);
          this.storage.set(this.lookupKey, stringify(this.state));
          this.ee.emit(SESSION_EVENTS.UPDATE, [SESSION_EVENT_TYPES.SAME_TAB, this.state]);
          return data;
        } catch (e2) {
          warn(11, e2);
          return null;
        }
      }
      reset() {
        try {
          warn(66);
          if (this.initialized) {
            this.ee.emit(SESSION_EVENTS.RESET);
            this.state.numOfResets++;
          }
          this.storage.remove(this.lookupKey);
          this.inactiveTimer?.abort?.();
          this.expiresTimer?.clear?.();
          delete this.isNew;
          this.setup({
            agentIdentifier: this.agentIdentifier,
            key: this.key,
            storage: this.storage,
            expiresMs: this.expiresMs,
            inactiveMs: this.inactiveMs,
            numOfResets: this.state.numOfResets
          });
          return this.read();
        } catch (e2) {
          return {};
        }
      }
      /**
       * Refresh the inactivity timer data
       */
      refresh() {
        const existingData = this.read();
        this.write({
          ...existingData,
          inactiveAt: this.getFutureTimestamp(this.inactiveMs)
        });
      }
      /**
       * @param {number} timestamp
       * @returns {boolean}
       */
      isExpired(timestamp) {
        return Date.now() > timestamp;
      }
      /**
       * @param {Object} data
       * @returns {boolean}
       */
      isInvalid(data) {
        const requiredKeys = Object.keys(model);
        return !requiredKeys.every((x3) => Object.keys(data).includes(x3));
      }
      collectSM(type, data, useUpdatedAt) {
        let value, tag;
        if (type === "duration") {
          value = this.getDuration(data, useUpdatedAt);
          tag = "Session/Duration/Ms";
        }
        if (type === "expired") tag = "Session/Expired/Seen";
        if (type === "inactive") tag = "Session/Inactive/Seen";
        if (tag) handle(SUPPORTABILITY_METRIC_CHANNEL, [tag, value], void 0, FEATURE_NAMES.metrics, this.ee);
      }
      getDuration(data = this.state, useUpdatedAt) {
        const startingTimestamp = data.expiresAt - this.expiresMs;
        const endingTimestamp = !useUpdatedAt ? data.updatedAt : Date.now();
        return endingTimestamp - startingTimestamp;
      }
      /**
       * @param {number} futureMs - The number of ms to use to generate a future timestamp
       * @returns {number}
       */
      getFutureTimestamp(futureMs) {
        return Date.now() + futureMs;
      }
      syncCustomAttribute(key, value) {
        if (!isBrowserScope) return;
        if (value === null) {
          const curr = this.read();
          if (curr.custom) {
            delete curr.custom[key];
            this.write({
              ...curr
            });
          }
        } else {
          const curr = this.read();
          this.custom = {
            ...curr?.custom || {},
            [key]: value
          };
          this.write({
            ...curr,
            custom: this.custom
          });
        }
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/storage/local-storage.js
var LocalStorage;
var init_local_storage = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/storage/local-storage.js"() {
    LocalStorage = class {
      get(key) {
        try {
          return localStorage.getItem(key) || void 0;
        } catch (err2) {
          return "";
        }
      }
      set(key, value) {
        try {
          if (value === void 0 || value === null) return this.remove(key);
          return localStorage.setItem(key, value);
        } catch (err2) {
        }
      }
      remove(key) {
        try {
          localStorage.removeItem(key);
        } catch (err2) {
        }
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/util/attribute-size.js
function trackObjectAttributeSize(parent, object) {
  const originalAttribute = parent[object] ??= {};
  const output = {
    bytes: Object.keys(originalAttribute).reduce((acc, key) => acc + key.length + stringify(originalAttribute[key]).length, 0)
  };
  parent[object] = new Proxy(originalAttribute, {
    set(target, prop2, value) {
      output.bytes += prop2.length + stringify(value).length;
      target[prop2] = value;
      return true;
    },
    deleteProperty(target, prop2) {
      output.bytes -= prop2.length + stringify(target[prop2]).length;
      return delete target[prop2];
    }
  });
  return output;
}
var init_attribute_size = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/util/attribute-size.js"() {
    init_stringify();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/utils/agent-session.js
var agent_session_exports = {};
__export(agent_session_exports, {
  setupAgentSession: () => setupAgentSession
});
function setupAgentSession(agentRef) {
  if (agentRef.runtime.session) return agentRef.runtime.session;
  const sessionInit = agentRef.init.session;
  agentRef.runtime.session = new SessionEntity({
    agentIdentifier: agentRef.agentIdentifier,
    key: DEFAULT_KEY,
    storage: new LocalStorage(),
    expiresMs: sessionInit?.expiresMs,
    inactiveMs: sessionInit?.inactiveMs
  });
  const customSessionData = agentRef.runtime.session.state.custom;
  if (customSessionData && Object.keys(customSessionData).length) {
    agentRef.info = mergeInfo({
      ...agentRef.info,
      jsAttributes: {
        ...customSessionData,
        ...agentRef.info.jsAttributes
      }
    });
  }
  agentRef.runtime.jsAttributesMetadata = trackObjectAttributeSize(agentRef.info, "jsAttributes");
  const sharedEE = globalInstance.get(agentRef.agentIdentifier);
  defaultRegister("api-setCustomAttribute", (time, key, value) => {
    agentRef.runtime.session.syncCustomAttribute(key, value);
  }, "session", sharedEE);
  defaultRegister("api-setUserId", (time, key, value) => {
    agentRef.runtime.session.syncCustomAttribute(key, value);
  }, "session", sharedEE);
  defaultRegister("api-setUserIdAndResetSession", (value) => {
    agentRef.runtime.session.reset();
    handle(SUPPORTABILITY_METRIC_CHANNEL, ["API/" + SET_USER_ID + "/resetSession/called"], void 0, FEATURE_NAMES.metrics, sharedEE);
    appendJsAttribute(agentRef, "enduser.id", value, SET_USER_ID, true);
  }, "session", sharedEE);
  defaultRegister("api-consent", (accept) => {
    agentRef.runtime.session.write({
      consent: accept === void 0 ? true : accept
    });
  }, "session", sharedEE);
  drain(agentRef.agentIdentifier, "session");
  return agentRef.runtime.session;
}
var init_agent_session = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/utils/agent-session.js"() {
    init_drain();
    init_contextual_ee();
    init_register_handler();
    init_session_entity();
    init_local_storage();
    init_constants3();
    init_info();
    init_attribute_size();
    init_handle();
    init_constants();
    init_constants4();
    init_features();
    init_sharedHandlers();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/page_view_event/constants.js
var FEATURE_NAME4;
var init_constants6 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/page_view_event/constants.js"() {
    init_features();
    FEATURE_NAME4 = FEATURE_NAMES.pageViewEvent;
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/timing/nav-timing.js
function getPntType(type) {
  if (typeof type === "number") return type;
  const types = {
    navigate: void 0,
    reload: 1,
    back_forward: 2,
    prerender: 3
  };
  return types[type];
}
function addPT(offset, pt, v2 = {}, isL1Api = false) {
  if (!pt) return;
  v2.of = offset;
  handleValue(v2.of, v2, "n", true);
  handleValue(pt[UNLOAD_EVENT + START2], v2, "u", isL1Api);
  handleValue(pt[REDIRECT + START2], v2, "r", isL1Api);
  handleValue(pt[UNLOAD_EVENT + END], v2, "ue", isL1Api);
  handleValue(pt[REDIRECT + END], v2, "re", isL1Api);
  handleValue(pt["fetch" + START2], v2, "f", isL1Api);
  handleValue(pt[DOMAIN_LOOKUP + START2], v2, "dn", isL1Api);
  handleValue(pt[DOMAIN_LOOKUP + END], v2, "dne", isL1Api);
  handleValue(pt["c" + ONNECT + START2], v2, "c", isL1Api);
  handleValue(pt["secureC" + ONNECT + "ion" + START2], v2, "s", isL1Api);
  handleValue(pt["c" + ONNECT + END], v2, "ce", isL1Api);
  handleValue(pt[REQUEST + START2], v2, "rq", isL1Api);
  handleValue(pt[RESPONSE + START2], v2, "rp", isL1Api);
  handleValue(pt[RESPONSE + END], v2, "rpe", isL1Api);
  handleValue(pt.domLoading, v2, "dl", isL1Api);
  handleValue(pt.domInteractive, v2, "di", isL1Api);
  handleValue(pt[DOM_CONTENT_LOAD_EVENT + START2], v2, "ds", isL1Api);
  handleValue(pt[DOM_CONTENT_LOAD_EVENT + END], v2, "de", isL1Api);
  handleValue(pt.domComplete, v2, "dc", isL1Api);
  handleValue(pt[LOAD_EVENT + START2], v2, "l", isL1Api);
  handleValue(pt[LOAD_EVENT + END], v2, "le", isL1Api);
  return v2;
}
function addPN(pn, v2) {
  try {
    handleValue(getPntType(pn.type), v2, "ty");
    handleValue(pn.redirectCount, v2, "rc");
  } catch (e2) {
    v2.ty = 0;
    v2.rc = 0;
  }
  return v2;
}
function handleValue(value, obj2, prop2, isOldApi) {
  if (typeof value === "number" && value > 0) {
    if (isOldApi) {
      const offset = obj2?.of > 0 ? obj2.of : 0;
      value = Math.max(value - offset, 0);
    }
    value = Math.round(value);
    obj2[prop2] = value;
    navTimingValues.push(value);
  } else navTimingValues.push(void 0);
}
var START2, END, UNLOAD_EVENT, REDIRECT, DOMAIN_LOOKUP, ONNECT, REQUEST, RESPONSE, LOAD_EVENT, DOM_CONTENT_LOAD_EVENT, navTimingValues;
var init_nav_timing = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/timing/nav-timing.js"() {
    START2 = "Start";
    END = "End";
    UNLOAD_EVENT = "unloadEvent";
    REDIRECT = "redirect";
    DOMAIN_LOOKUP = "domainLookup";
    ONNECT = "onnect";
    REQUEST = "request";
    RESPONSE = "response";
    LOAD_EVENT = "loadEvent";
    DOM_CONTENT_LOAD_EVENT = "domContentLoadedEvent";
    navTimingValues = [];
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/page_view_event/aggregate/initialized-features.js
function getActivatedFeaturesFlags(agentId) {
  const flagArr = [];
  const newrelic2 = gosNREUM();
  try {
    Object.keys(newrelic2.initializedAgents[agentId].features).forEach((featName) => {
      switch (featName) {
        case FEATURE_NAMES.ajax:
          flagArr.push("xhr");
          break;
        case FEATURE_NAMES.jserrors:
          flagArr.push("err");
          break;
        case FEATURE_NAMES.genericEvents:
          flagArr.push("ins");
          break;
        case FEATURE_NAMES.sessionTrace:
          flagArr.push("stn");
          break;
        case FEATURE_NAMES.softNav:
          flagArr.push("spa");
          break;
      }
    });
  } catch (e2) {
  }
  return flagArr;
}
var init_initialized_features = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/page_view_event/aggregate/initialized-features.js"() {
    init_features();
    init_nreum();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/url/protocol.js
function isFileProtocol() {
  return Boolean(globalScope?.location?.protocol === "file:");
}
var init_protocol = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/url/protocol.js"() {
    init_runtime();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/util/obfuscate.js
var Obfuscator;
var init_obfuscate = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/util/obfuscate.js"() {
    init_protocol();
    init_console();
    Obfuscator = class {
      constructor(agentRef) {
        this.agentRef = agentRef;
        this.warnedRegexMissing = false;
        this.warnedInvalidRegex = false;
        this.warnedInvalidReplacement = false;
      }
      get obfuscateConfigRules() {
        return this.agentRef.init.obfuscate || [];
      }
      /**
       * Applies all valid obfuscation rules to the provided input string
       * @param {string} input String to obfuscate
       * @returns {string}
       */
      obfuscateString(input2) {
        if (typeof input2 !== "string" || input2.trim().length === 0) return input2;
        const rules = this.obfuscateConfigRules.map((rule2) => this.validateObfuscationRule(rule2));
        if (isFileProtocol()) {
          rules.push({
            regex: /^file:\/\/(.*)/,
            replacement: atob("ZmlsZTovL09CRlVTQ0FURUQ=")
          });
        }
        return rules.filter((ruleValidation) => ruleValidation.isValid).reduce((input3, ruleValidation) => {
          const {
            rule: rule2
          } = ruleValidation;
          return input3.replace(rule2.regex, rule2.replacement || "*");
        }, input2);
      }
      /**
       * Validates an obfuscation rule and provides errors if any are found.
       * @param {ObfuscationRule} rule The rule to validate
       * @returns {ObfuscationRuleValidation} The validation state of the rule
       */
      validateObfuscationRule(rule2) {
        const regexMissingDetected = Boolean(rule2.regex === void 0);
        const invalidRegexDetected = Boolean(rule2.regex !== void 0 && typeof rule2.regex !== "string" && !(rule2.regex instanceof RegExp));
        const invalidReplacementDetected = Boolean(rule2.replacement && typeof rule2.replacement !== "string");
        if (regexMissingDetected && !this.warnedRegexMissing) {
          warn(12, rule2);
          this.warnedRegexMissing = true;
        } else if (invalidRegexDetected && !this.warnedInvalidRegex) {
          warn(13, rule2);
          this.warnedInvalidRegex = true;
        }
        if (invalidReplacementDetected && !this.warnedInvalidReplacement) {
          warn(14, rule2);
          this.warnedInvalidReplacement = true;
        }
        return {
          rule: rule2,
          isValid: !regexMissingDetected && !invalidRegexDetected && !invalidReplacementDetected,
          errors: {
            regexMissingDetected,
            invalidRegexDetected,
            invalidReplacementDetected
          }
        };
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/unload/eol.js
function subscribeToEOL(cb, capturePhase) {
  if (isBrowserScope) {
    subscribeToVisibilityChange(cb, true, capturePhase);
  } else if (isWorkerScope) {
    globalScope.cleanupTasks.push(cb);
  }
}
var init_eol = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/unload/eol.js"() {
    init_runtime();
    init_page_visibility();
    if (isWorkerScope) {
      globalScope.cleanupTasks = [];
      const origClose = globalScope.close;
      globalScope.close = () => {
        for (let task of globalScope.cleanupTasks) {
          task();
        }
        origClose();
      };
    }
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/url/clean-url.js
function cleanURL(url, keepHash) {
  if (!url) return url;
  return url.replace(keepHash ? patternWithHash : patternWithoutHash, "$1$2");
}
var patternWithHash, patternWithoutHash;
var init_clean_url = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/url/clean-url.js"() {
    patternWithHash = /([^?#]*)[^#]*(#[^?]*|$).*/;
    patternWithoutHash = /([^?#]*)().*/;
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/url/encode.js
function real(c2) {
  return charMap[c2];
}
function qs(value) {
  if (value === null || value === void 0) return "null";
  return encodeURIComponent(value).replace(safeEncoded, real);
}
function obj(payload, maxBytes) {
  var total = 0;
  var result2 = "";
  Object.entries(payload || {}).forEach(([feature, dataArray]) => {
    var intermediate = [];
    var next;
    var i2;
    if (typeof dataArray === "string" || !Array.isArray(dataArray) && dataArray !== null && dataArray !== void 0 && dataArray.toString().length) {
      next = "&" + feature + "=" + qs(dataArray);
      total += next.length;
      result2 += next;
    } else if (Array.isArray(dataArray) && dataArray.length) {
      total += 9;
      for (i2 = 0; i2 < dataArray.length; i2++) {
        next = qs(stringify(dataArray[i2]));
        total += next.length;
        if (typeof maxBytes !== "undefined" && total >= maxBytes) break;
        intermediate.push(next);
      }
      result2 += "&" + feature + "=%5B" + intermediate.join(",") + "%5D";
    }
  });
  return result2;
}
function param(name, value, base = {}) {
  if (Object.keys(base).includes(name)) return "";
  if (value && typeof value === "string") {
    return "&" + name + "=" + qs(value);
  }
  return "";
}
var charMap, charList, safeEncoded;
var init_encode = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/url/encode.js"() {
    init_stringify();
    charMap = {
      "%2C": ",",
      "%3A": ":",
      "%2F": "/",
      "%40": "@",
      "%24": "$",
      "%3B": ";"
    };
    charList = Object.keys(charMap);
    safeEncoded = new RegExp(charList.join("|"), "g");
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/util/submit-data.js
function getSubmitMethod({
  isFinalHarvest = false
} = {}) {
  if (isFinalHarvest && isBrowserScope) {
    return beacon;
  }
  if (typeof XMLHttpRequest !== "undefined") {
    return xhr;
  }
  return xhrFetch;
}
function xhrFetch({
  url,
  body = null,
  method = "POST",
  headers = [{
    key: "content-type",
    value: "text/plain"
  }]
}) {
  const objHeaders = {};
  for (const header of headers) {
    objHeaders[header.key] = header.value;
  }
  return fetch(url, {
    headers: objHeaders,
    method,
    body,
    credentials: "include"
  });
}
function xhr({
  url,
  body = null,
  sync,
  method = "POST",
  headers = [{
    key: "content-type",
    value: "text/plain"
  }]
}) {
  const request = new XMLHttpRequest();
  request.open(method, url, !sync);
  try {
    if ("withCredentials" in request) request.withCredentials = true;
  } catch (e2) {
  }
  headers.forEach((header) => {
    request.setRequestHeader(header.key, header.value);
  });
  request.send(body);
  return request;
}
function beacon({
  url,
  body
}) {
  try {
    const send2 = window.navigator.sendBeacon.bind(window.navigator);
    return send2(url, body);
  } catch (err2) {
    return false;
  }
}
var init_submit_data = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/util/submit-data.js"() {
    init_runtime();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/harvest/harvester.js
function send(agentRef, {
  endpoint,
  payload,
  localOpts = {},
  submitMethod,
  cbFinished,
  raw,
  featureName,
  endpointVersion = 1
}) {
  if (!agentRef.info.errorBeacon) return false;
  let {
    body,
    qs: qs2
  } = cleanPayload(payload);
  if (Object.keys(body).length === 0 && !localOpts.sendEmptyBody) {
    if (cbFinished) cbFinished({
      sent: false
    });
    return false;
  }
  const protocol = agentRef.init.ssl === false ? "http" : "https";
  const perceivedBeacon = agentRef.init.proxy.beacon || agentRef.info.errorBeacon;
  const url = raw ? "".concat(protocol, "://").concat(perceivedBeacon, "/").concat(endpoint) : "".concat(protocol, "://").concat(perceivedBeacon).concat(endpoint !== RUM ? "/" + endpoint : "", "/").concat(endpointVersion, "/").concat(agentRef.info.licenseKey);
  const baseParams = !raw ? baseQueryString(agentRef, qs2, endpoint) : "";
  let payloadParams = obj(qs2, agentRef.runtime.maxBytes);
  if (baseParams === "" && payloadParams.startsWith("&")) {
    payloadParams = payloadParams.substring(1);
  }
  const fullUrl = "".concat(url, "?").concat(baseParams).concat(payloadParams);
  const gzip2 = !!qs2?.attributes?.includes("gzip");
  let stringBody = gzip2 || endpoint === EVENTS ? body : stringify(body);
  if (!stringBody || stringBody.length === 0 || stringBody === "{}" || stringBody === "[]") stringBody = "";
  if (endpoint !== BLOBS && stringBody.length > 75e4 && (warnings[endpoint] = (warnings[endpoint] || 0) + 1) === 1) warn(28, endpoint);
  const headers = [{
    key: "content-type",
    value: "text/plain"
  }];
  let result2 = submitMethod({
    url: fullUrl,
    body: stringBody,
    sync: localOpts.isFinalHarvest && isWorkerScope,
    headers
  });
  if (!localOpts.isFinalHarvest && cbFinished) {
    let trackHarvestMetadata = function() {
      try {
        if (featureName === FEATURE_NAMES.jserrors && !body?.err) return;
        const hasReplay = baseParams.includes("hr=1");
        const hasTrace = baseParams.includes("ht=1");
        const hasError = qs2?.attributes?.includes("hasError=true");
        handle("harvest-metadata", [{
          [featureName]: {
            ...hasReplay && {
              hasReplay
            },
            ...hasTrace && {
              hasTrace
            },
            ...hasError && {
              hasError
            }
          }
        }], void 0, FEATURE_NAMES.metrics, agentRef.ee);
      } catch (err2) {
      }
    };
    if (submitMethod === xhr) {
      result2.addEventListener("loadend", function() {
        const cbResult = {
          sent: this.status !== 0,
          status: this.status,
          retry: shouldRetry(this.status),
          fullUrl,
          xhr: this,
          responseText: this.responseText
        };
        cbFinished(cbResult);
        if (!shouldRetry(this.status)) trackHarvestMetadata();
      }, eventListenerOpts(false));
    } else if (submitMethod === xhrFetch) {
      result2.then(async function(response) {
        const status = response.status;
        const cbResult = {
          sent: true,
          status,
          retry: shouldRetry(status),
          fullUrl,
          fetchResponse: response,
          responseText: await response.text()
        };
        cbFinished(cbResult);
        if (!shouldRetry(status)) trackHarvestMetadata();
      });
    }
  }
  dispatchGlobalEvent({
    agentIdentifier: agentRef.agentIdentifier,
    drained: !!activatedFeatures?.[agentRef.agentIdentifier],
    type: "data",
    name: "harvest",
    feature: featureName,
    data: {
      endpoint,
      headers,
      payload,
      submitMethod: getSubmitMethodName(),
      raw,
      synchronousXhr: !!(localOpts.isFinalHarvest && isWorkerScope)
    }
  });
  return true;
  function shouldRetry(status) {
    switch (status) {
      case 408:
      case 429:
      case 500:
        return true;
    }
    return status >= 502 && status <= 504 || status >= 512 && status <= 530;
  }
  function getSubmitMethodName() {
    if (submitMethod === xhr) return "xhr";
    if (submitMethod === xhrFetch) return "fetch";
    return "beacon";
  }
}
function cleanPayload(payload = {}) {
  const clean = (input2) => {
    if (typeof Uint8Array !== "undefined" && input2 instanceof Uint8Array || Array.isArray(input2)) return input2;
    if (typeof input2 === "string") return input2;
    return Object.entries(input2 || {}).reduce((accumulator, [key, value]) => {
      if (typeof value === "number" || typeof value === "string" && value.length > 0 || typeof value === "object" && Object.keys(value || {}).length > 0) {
        accumulator[key] = value;
      }
      return accumulator;
    }, {});
  };
  return {
    body: clean(payload.body),
    qs: clean(payload.qs)
  };
}
function baseQueryString(agentRef, qs2, endpoint) {
  const ref = agentRef.runtime.obfuscator.obfuscateString(cleanURL("" + globalScope.location));
  const session = agentRef.runtime.session;
  const hr = !!session?.state.sessionReplaySentFirstChunk && session?.state.sessionReplayMode === 1 && endpoint !== JSERRORS;
  const ht = !!session?.state.traceHarvestStarted && session?.state.sessionTraceMode === 1 && ![LOGS, BLOBS].includes(endpoint);
  const qps = [
    "a=" + agentRef.info.applicationID,
    param("sa", agentRef.info.sa ? "" + agentRef.info.sa : ""),
    param("v", VERSION),
    transactionNameParam(),
    param("ct", agentRef.runtime.customTransaction),
    "&rst=" + now(),
    "&ck=0",
    // ck param DEPRECATED - still expected by backend
    "&s=" + (session?.state.value || "0"),
    // the 0 id encaps all untrackable and default traffic
    param("ref", ref),
    param("ptid", agentRef.runtime.ptid ? "" + agentRef.runtime.ptid : "")
  ];
  if (hr) qps.push(param("hr", "1", qs2));
  if (ht) qps.push(param("ht", "1", qs2));
  return qps.join("");
  function transactionNameParam() {
    if (agentRef.info.transactionName) return param("to", agentRef.info.transactionName);
    return param("t", agentRef.info.tNamePlain || "Unnamed Transaction");
  }
}
var RETRY, RETRY_ATTEMPTED, RETRY_FAILED, RETRY_SUCCEEDED, Harvester, warnings;
var init_harvester = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/harvest/harvester.js"() {
    init_constants4();
    init_features();
    init_env_npm();
    init_runtime();
    init_handle();
    init_event_listener_opts();
    init_now();
    init_eol();
    init_clean_url();
    init_encode();
    init_console();
    init_stringify();
    init_submit_data();
    init_feature_flags();
    init_global_event();
    RETRY = "Harvester/Retry/";
    RETRY_ATTEMPTED = RETRY + "Attempted/";
    RETRY_FAILED = RETRY + "Failed/";
    RETRY_SUCCEEDED = RETRY + "Succeeded/";
    Harvester = class {
      #started = false;
      initializedAggregates = [];
      constructor(agentRef) {
        this.agentRef = agentRef;
        subscribeToEOL(() => {
          this.initializedAggregates.forEach((aggregateInst) => {
            if (typeof aggregateInst.harvestOpts.beforeUnload === "function") aggregateInst.harvestOpts.beforeUnload();
          });
          this.initializedAggregates.forEach((aggregateInst) => this.triggerHarvestFor(aggregateInst, {
            isFinalHarvest: true
          }));
        }, false);
      }
      startTimer(harvestInterval = this.agentRef.init.harvest.interval) {
        if (this.#started) return;
        this.#started = true;
        const onHarvestInterval = () => {
          this.initializedAggregates.forEach((aggregateInst) => this.triggerHarvestFor(aggregateInst));
          setTimeout(onHarvestInterval, harvestInterval * 1e3);
        };
        setTimeout(onHarvestInterval, harvestInterval * 1e3);
      }
      /**
       * Given a feature (aggregate), execute a harvest on-demand.
       * @param {object} aggregateInst
       * @param {object} localOpts
       * @returns {boolean} True if 1+ network call was made. Note that this does not mean or guarantee that it was successful (or that all were in the case of more than 1).
       */
      triggerHarvestFor(aggregateInst, localOpts = {}) {
        const output = {
          ranSend: false,
          payload: void 0,
          endpointVersion: aggregateInst.harvestEndpointVersion || 1
        };
        if (aggregateInst.blocked) return output;
        if (this.agentRef.init?.browser_consent_mode?.enabled && !this.agentRef.runtime.consented) return output;
        const submitMethod = getSubmitMethod(localOpts);
        if (!submitMethod) return output;
        const shouldRetryOnFail = !localOpts.isFinalHarvest && submitMethod === xhr;
        output.payload = aggregateInst.makeHarvestPayload(shouldRetryOnFail, localOpts);
        if (!output.payload) return output;
        send(this.agentRef, {
          endpoint: FEATURE_TO_ENDPOINT[aggregateInst.featureName],
          payload: output.payload,
          localOpts,
          submitMethod,
          cbFinished,
          raw: aggregateInst.harvestOpts.raw,
          featureName: aggregateInst.featureName,
          endpointVersion: output.endpointVersion
        });
        output.ranSend = true;
        return output;
        function cbFinished(result2) {
          if (aggregateInst.harvestOpts.prevAttemptCode) {
            const reportSM = (message) => handle(SUPPORTABILITY_METRIC_CHANNEL, [message], void 0, FEATURE_NAMES.metrics, aggregateInst.ee);
            reportSM(RETRY_ATTEMPTED + aggregateInst.featureName);
            reportSM((result2.retry ? RETRY_FAILED : RETRY_SUCCEEDED) + aggregateInst.harvestOpts.prevAttemptCode);
            delete aggregateInst.harvestOpts.prevAttemptCode;
          }
          if (result2.retry) aggregateInst.harvestOpts.prevAttemptCode = result2.status;
          if (localOpts.forceNoRetry) result2.retry = false;
          aggregateInst.postHarvestCleanup(result2);
        }
      }
    };
    warnings = {};
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/utils/event-buffer.js
var EventBuffer;
var init_event_buffer = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/utils/event-buffer.js"() {
    init_stringify();
    init_agent_constants();
    EventBuffer = class {
      #buffer = [];
      #rawBytes = 0;
      #bufferBackup;
      #rawBytesBackup;
      /**
       * Creates an event buffer that can hold feature-processed events.
       * @param {Number} maxPayloadSize The maximum size of the payload that can be stored in this buffer.
       * @param {Object} [featureAgg] - the feature aggregate instance
       */
      constructor(maxPayloadSize = MAX_PAYLOAD_SIZE, featureAgg) {
        this.maxPayloadSize = maxPayloadSize;
        this.featureAgg = featureAgg;
      }
      get length() {
        return this.#buffer.length;
      }
      isEmpty() {
        return this.#buffer.length === 0;
      }
      get() {
        return this.#buffer;
      }
      byteSize() {
        return this.#rawBytes;
      }
      wouldExceedMaxSize(incomingSize) {
        return this.#rawBytes + incomingSize > this.maxPayloadSize;
      }
      /**
       * Add feature-processed event to our buffer. If this event would cause our total raw size to exceed the set max payload size, it is dropped.
       * @param {any} event - any primitive type or object
       * @param {number} [evaluatedSize] - the evalated size of the event, if already done so before storing in the event buffer
       * @returns {Boolean} true if successfully added; false otherwise
       */
      add(event, evaluatedSize) {
        const addSize = evaluatedSize || stringify(event)?.length || 0;
        if (this.#rawBytes + addSize > this.maxPayloadSize) {
          const smTag = (inject) => "EventBuffer/".concat(inject, "/Dropped/Bytes");
          this.featureAgg?.reportSupportabilityMetric(smTag(this.featureAgg.featureName), addSize);
          this.featureAgg?.reportSupportabilityMetric(smTag("Combined"), addSize);
          return false;
        }
        this.#buffer.push(event);
        this.#rawBytes += addSize;
        this.featureAgg?.decideEarlyHarvest();
        return true;
      }
      /**
      * Merges events in the buffer that match the given criteria.
      * @param {Function} matcher - A function that takes an event and returns true if it should be merged.
      * @param {Object} data - The data to merge into the matching events.
      * @returns {boolean} true if a match was found and merged; false otherwise.
      */
      merge(matcher, data) {
        if (this.isEmpty() || !matcher) return false;
        const matchIdx = this.#buffer.findIndex(matcher);
        if (matchIdx < 0) return false;
        this.#buffer[matchIdx] = {
          ...this.#buffer[matchIdx],
          ...data
        };
        return true;
      }
      /**
       * Wipes the main buffer
       * @param {Object} [opts] - options for clearing the buffer
       * @param {Number} [opts.clearBeforeTime] - timestamp before which all events should be cleared
       * @param {String} [opts.timestampKey] - the key in the event object that contains the timestamp to compare against `clearBefore`
       * @param {Number} [opts.clearBeforeIndex] - index before which all events should be cleared
       * @returns {void}
       */
      clear(opts = {}) {
        if (opts.clearBeforeTime !== void 0 && opts.timestampKey) {
          this.#buffer = this.#buffer.filter((event) => event[opts.timestampKey] >= opts.clearBeforeTime);
        } else if (opts.clearBeforeIndex !== void 0) {
          this.#buffer = this.#buffer.slice(opts.clearBeforeIndex);
        } else {
          this.#buffer = [];
        }
        this.#rawBytes = this.#buffer.length ? stringify(this.#buffer)?.length || 0 : 0;
      }
      /**
       * Backup the buffered data and clear the main buffer
       */
      save() {
        this.#bufferBackup = this.#buffer;
        this.#rawBytesBackup = this.#rawBytes;
      }
      /**
       * Wipes the backup buffer
       */
      clearSave() {
        this.#bufferBackup = void 0;
        this.#rawBytesBackup = void 0;
      }
      /**
       * Prepend the backup buffer back into the main buffer
       */
      reloadSave() {
        if (!this.#bufferBackup) return;
        if (this.#rawBytesBackup + this.#rawBytes > this.maxPayloadSize) return;
        this.#buffer = [...this.#bufferBackup, ...this.#buffer];
        this.#rawBytes = this.#rawBytesBackup + this.#rawBytes;
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/aggregate/aggregator.js
function aggregateMetrics(newMetrics, oldMetrics) {
  if (!oldMetrics) oldMetrics = {
    count: 0
  };
  oldMetrics.count += 1;
  Object.entries(newMetrics || {}).forEach(([key, value]) => {
    oldMetrics[key] = updateMetric(value, oldMetrics[key]);
  });
  return oldMetrics;
}
function updateMetric(value, metric) {
  if (value == null) {
    return updateCounterMetric(metric);
  }
  if (!metric) return {
    t: value
  };
  if (!metric.c) {
    metric = createMetricObject(metric.t);
  }
  metric.c += 1;
  metric.t += value;
  metric.sos += value * value;
  if (value > metric.max) metric.max = value;
  if (value < metric.min) metric.min = value;
  return metric;
}
function updateCounterMetric(metric) {
  if (!metric) {
    metric = {
      c: 1
    };
  } else {
    metric.c++;
  }
  return metric;
}
function mergeMetric(newMetric, oldMetric) {
  if (!oldMetric) return newMetric;
  if (!oldMetric.c) {
    oldMetric = createMetricObject(oldMetric.t);
  }
  oldMetric.min = Math.min(newMetric.min, oldMetric.min);
  oldMetric.max = Math.max(newMetric.max, oldMetric.max);
  oldMetric.t += newMetric.t;
  oldMetric.sos += newMetric.sos;
  oldMetric.c += newMetric.c;
  return oldMetric;
}
function createMetricObject(value) {
  return {
    t: value,
    min: value,
    max: value,
    sos: value * value,
    c: 1
  };
}
var Aggregator;
var init_aggregator = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/aggregate/aggregator.js"() {
    Aggregator = class {
      constructor() {
        this.aggregatedData = {};
      }
      // Items with the same type and name get aggregated together
      // params are example data from the aggregated items
      // metrics are the numeric values to be aggregated
      store(type, name, params, newMetrics, customParams) {
        var bucket = this.#getBucket(type, name, params, customParams);
        bucket.metrics = aggregateMetrics(newMetrics, bucket.metrics);
        return bucket;
      }
      merge(type, name, metrics, params, customParams, overwriteParams = false) {
        var bucket = this.#getBucket(type, name, params, customParams);
        if (overwriteParams) bucket.params = params;
        if (!bucket.metrics) {
          bucket.metrics = metrics;
          return;
        }
        var oldMetrics = bucket.metrics;
        oldMetrics.count += metrics.count;
        Object.keys(metrics || {}).forEach((key) => {
          if (key === "count") return;
          var oldMetric = oldMetrics[key];
          var newMetric = metrics[key];
          if (newMetric && !newMetric.c) {
            oldMetrics[key] = updateMetric(newMetric.t, oldMetric);
          } else {
            oldMetrics[key] = mergeMetric(newMetric, oldMetrics[key]);
          }
        });
      }
      storeMetric(type, name, params, value) {
        var bucket = this.#getBucket(type, name, params);
        bucket.stats = updateMetric(value, bucket.stats);
        return bucket;
      }
      // Get all listed types buckets and it deletes the retrieved content from the aggregatedData
      take(types, deleteWhenRetrieved = true) {
        var results = {};
        var type = "";
        var hasData = false;
        for (var i2 = 0; i2 < types.length; i2++) {
          type = types[i2];
          results[type] = Object.values(this.aggregatedData[type] || {});
          if (results[type].length) hasData = true;
          if (deleteWhenRetrieved) delete this.aggregatedData[type];
        }
        return hasData ? results : null;
      }
      #getBucket(type, name, params, customParams) {
        if (!this.aggregatedData[type]) this.aggregatedData[type] = {};
        var bucket = this.aggregatedData[type][name];
        if (!bucket) {
          bucket = this.aggregatedData[type][name] = {
            params: params || {}
          };
          if (customParams) {
            bucket.custom = customParams;
          }
        }
        return bucket;
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/aggregate/event-aggregator.js
var EventAggregator;
var init_event_aggregator = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/aggregate/event-aggregator.js"() {
    init_aggregator();
    EventAggregator = class {
      #aggregator = new Aggregator();
      #savedNamesToBuckets = {};
      byteSize() {
        return 0;
      }
      isEmpty({
        aggregatorTypes
      }) {
        if (!aggregatorTypes) return Object.keys(this.#aggregator.aggregatedData).length === 0;
        return aggregatorTypes.every((type) => !this.#aggregator.aggregatedData[type]);
      }
      add([type, name, params, newMetrics, customParams]) {
        this.#aggregator.store(type, name, params, newMetrics, customParams);
        return true;
      }
      addMetric(type, name, params, value) {
        this.#aggregator.storeMetric(type, name, params, value);
        return true;
      }
      save({
        aggregatorTypes
      }) {
        const key = aggregatorTypes.toString();
        const backupAggregatedDataSubset = {};
        aggregatorTypes.forEach((type) => backupAggregatedDataSubset[type] = this.#aggregator.aggregatedData[type]);
        this.#savedNamesToBuckets[key] = backupAggregatedDataSubset;
      }
      get(opts) {
        const aggregatorTypes = Array.isArray(opts) ? opts : opts.aggregatorTypes;
        return this.#aggregator.take(aggregatorTypes, false);
      }
      clear({
        aggregatorTypes
      } = {}) {
        if (!aggregatorTypes) {
          this.#aggregator.aggregatedData = {};
          return;
        }
        aggregatorTypes.forEach((type) => delete this.#aggregator.aggregatedData[type]);
      }
      reloadSave({
        aggregatorTypes
      }) {
        const key = aggregatorTypes.toString();
        const backupAggregatedDataSubset = this.#savedNamesToBuckets[key];
        aggregatorTypes.forEach((type) => {
          Object.keys(backupAggregatedDataSubset[type] || {}).forEach((name) => {
            const bucket = backupAggregatedDataSubset[type][name];
            this.#aggregator.merge(type, name, bucket.metrics, bucket.params, bucket.custom, true);
          });
        });
      }
      clearSave({
        aggregatorTypes
      }) {
        const key = aggregatorTypes.toString();
        delete this.#savedNamesToBuckets[key];
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/utils/aggregate-base.js
var AggregateBase;
var init_aggregate_base = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/utils/aggregate-base.js"() {
    init_feature_base();
    init_info();
    init_configure();
    init_nreum();
    init_drain();
    init_feature_flags();
    init_obfuscate();
    init_features();
    init_harvester();
    init_event_buffer();
    init_handle();
    init_constants4();
    init_event_aggregator();
    init_agent_constants();
    AggregateBase = class extends FeatureBase {
      /**
       * Create an AggregateBase instance.
       * @param {Object} agentRef The reference to the agent instance.
       * @param {string} featureName The name of the feature creating the instance.
       */
      constructor(agentRef, featureName) {
        super(agentRef.agentIdentifier, featureName);
        this.agentRef = agentRef;
        this.checkConfiguration(agentRef);
        this.doOnceForAllAggregate(agentRef);
        this.customAttributesAreSeparate = false;
        this.canHarvestEarly = true;
        this.isRetrying = false;
        this.harvestOpts = {};
        this.#setupEventStore();
        this.waitForDrain();
      }
      /**
       * sets up the event store for the feature.  It must wait for the entity guid to be available before setting up the event store.  This is called once the rum response is received with an entityGuid.
       * @param {string} entityGuid
       * @returns {void}
       */
      #setupEventStore() {
        if (this.events) return;
        switch (this.featureName) {
          // SessionReplay has its own storage mechanisms.
          case FEATURE_NAMES.sessionReplay:
            break;
          // Jserror and Metric features uses a singleton EventAggregator instead of a regular EventBuffer.
          case FEATURE_NAMES.jserrors:
          case FEATURE_NAMES.metrics:
            this.events = this.agentRef.sharedAggregator ??= new EventAggregator();
            break;
          /** All other features get EventBuffer by default. Note: PVE is included here, but event buffer will always be empty so future harvests will still not happen by interval or EOL.
          This was necessary to prevent race cond. issues where the event buffer was checked before the feature could "block" itself.
          Its easier to just keep an empty event buffer in place. */
          default:
            this.events = new EventBuffer(MAX_PAYLOAD_SIZE, this);
            break;
        }
      }
      /** @type {Boolean} indicates if the feature supports registered entities and the harvest requirements therein. Also read by getter "harvestEndpointVersion". Controlled by feature flag in pre-release phase. */
      get supportsRegisteredEntities() {
        return this.featureName in SUPPORTS_REGISTERED_ENTITIES && (SUPPORTS_REGISTERED_ENTITIES[this.featureName] || this.agentRef.init.feature_flags.includes("register." + this.featureName));
      }
      /**
       * the endpoint version the feature uses during harvests
       * @type {number}
       * @returns {boolean}
       */
      get harvestEndpointVersion() {
        return this.supportsRegisteredEntities && !!this.agentRef.runtime.registeredEntities.length ? 2 : 1;
      }
      waitForDrain() {
        this.ee.on("drain-" + this.featureName, () => {
          if (!this.drained) setTimeout(() => this.agentRef.runtime.harvester.triggerHarvestFor(this), 1);
          this.drained = true;
        });
      }
      /**
       * Evaluates whether a harvest should be made early by estimating the size of the current payload.  Currently, this only happens if the event storage is EventBuffer, since that triggers this method directly.
       * If conditions are met, a new harvest will be triggered immediately.
       * @returns void
       */
      decideEarlyHarvest() {
        if (!this.canHarvestEarly || this.blocked || this.isRetrying) return;
        const estimatedSize = this.events.byteSize() + (this.customAttributesAreSeparate ? this.agentRef.runtime.jsAttributesMetadata.bytes : 0);
        if (estimatedSize > IDEAL_PAYLOAD_SIZE) {
          this.agentRef.runtime.harvester.triggerHarvestFor(this);
          this.reportSupportabilityMetric("".concat(this.featureName, "/Harvest/Early/Seen"), estimatedSize);
        }
      }
      /**
       * New handler for waiting for multiple flags. Useful when expecting multiple flags simultaneously (ex. stn vs sr)
       * @param {string[]} flagNames
       * @returns {Promise}
       */
      waitForFlags(flagNames = []) {
        const flagsPromise = new Promise((resolve2, reject) => {
          if (activatedFeatures[this.agentIdentifier]) {
            resolve2(buildOutput(activatedFeatures[this.agentIdentifier]));
          } else {
            this.ee.on("rumresp", (resp = {}) => {
              resolve2(buildOutput(resp));
            });
          }
          function buildOutput(ref) {
            return flagNames.map((flag3) => {
              if (!ref[flag3]) return 0;
              return ref[flag3];
            });
          }
        });
        return flagsPromise.catch((err2) => {
          this.ee.emit("internal-error", [err2]);
          this.blocked = true;
          this.deregisterDrain();
        });
      }
      /**
       * Stages the feature to be drained
       */
      drain() {
        drain(this.agentIdentifier, this.featureName);
      }
      preHarvestChecks(opts) {
        return !this.blocked && !this.ee.aborted;
      }
      /**
       * Return harvest payload. A "serializer" function can be defined on a derived class to format the payload.
       * @param {Boolean} shouldRetryOnFail - harvester flag to backup payload for retry later if harvest request fails; this should be moved to harvester logic
       * @param {object|undefined} opts - opts passed from the harvester to help form the payload
       * @param {string} opts.target - the target app metadata
       * @returns {Array} Final payload tagged with their targeting browser app. The value of `payload` can be undefined if there are no pending events for an app. This should be a minimum length of 1.
       */
      makeHarvestPayload(shouldRetryOnFail = false, opts = {}) {
        if (!this.events || this.events.isEmpty(this.harvestOpts)) return;
        if (this.preHarvestChecks && !this.preHarvestChecks(opts)) return;
        if (shouldRetryOnFail) this.events.save(this.harvestOpts);
        const data = this.events.get(this.harvestOpts);
        if (!data) return;
        this.events.clear(this.harvestOpts);
        const body = this.serializer ? this.serializer(data) : data;
        const payload = {
          body
        };
        if (this.queryStringsBuilder) payload.qs = this.queryStringsBuilder(data);
        return payload;
      }
      /**
       * Cleanup task after a harvest.
       * @param {object} result - the cbResult object from the harvester's send method
       * @param {boolean=} result.sent - whether the harvest was sent successfully
       * @param {boolean=} result.retry - whether the harvest should be retried
       */
      postHarvestCleanup(result2 = {}) {
        this.isRetrying = result2.sent && result2.retry;
        if (this.isRetrying) this.events.reloadSave(this.harvestOpts);
        this.events.clearSave(this.harvestOpts);
      }
      /**
       * Checks for additional `jsAttributes` items to support backward compatibility with implementations of the agent where
       * loader configurations may appear after the loader code is executed.
       */
      checkConfiguration(existingAgent) {
        if (!isValid(existingAgent.info)) {
          const cdn = gosCDN();
          let jsAttributes = {
            ...cdn.info?.jsAttributes
          };
          try {
            jsAttributes = {
              ...jsAttributes,
              ...existingAgent.info?.jsAttributes
            };
          } catch (err2) {
          }
          configure(existingAgent, {
            ...cdn,
            info: {
              ...cdn.info,
              jsAttributes
            },
            runtime: existingAgent.runtime
          }, existingAgent.runtime.loaderType);
        }
      }
      /**
       * These are actions related to shared resources that should be initialized once by whichever feature Aggregate subclass loads first.
       * This method should run after checkConfiguration, which may reset the agent's info/runtime object that is used here.
       */
      doOnceForAllAggregate(agentRef) {
        if (!agentRef.runtime.obfuscator) agentRef.runtime.obfuscator = new Obfuscator(agentRef);
        this.obfuscator = agentRef.runtime.obfuscator;
        if (!agentRef.runtime.harvester) agentRef.runtime.harvester = new Harvester(agentRef);
      }
      /**
       * Report a supportability metric
       * @param {*} metricName The tag of the name matching the Angler aggregation tag
       * @param {*} [value] An optional value to supply. If not supplied, the metric count will be incremented by 1 for every call.
       */
      reportSupportabilityMetric(metricName, value) {
        handle(SUPPORTABILITY_METRIC_CHANNEL, [metricName, value], void 0, FEATURE_NAMES.metrics, this.ee);
      }
    };
  }
});

// node_modules/web-vitals/dist/web-vitals.attribution.js
var t, e, n, r, i, a, o, c, u, s, f, d, l, m, p, v, g, h, T, y, E, S, b, L, C, M, D, w, x, I, k, A, F, P, B, O, R, j, q, H, N, W, z, U, V, _, G, J, K, Q, X, Y, nt, rt, it, at, ot, ct, ut, st, ft;
var init_web_vitals_attribution = __esm({
  "node_modules/web-vitals/dist/web-vitals.attribution.js"() {
    n = function() {
      var t3 = self.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
      if (t3 && t3.responseStart > 0 && t3.responseStart < performance.now()) return t3;
    };
    r = function(t3) {
      if ("loading" === document.readyState) return "loading";
      var e2 = n();
      if (e2) {
        if (t3 < e2.domInteractive) return "loading";
        if (0 === e2.domContentLoadedEventStart || t3 < e2.domContentLoadedEventStart) return "dom-interactive";
        if (0 === e2.domComplete || t3 < e2.domComplete) return "dom-content-loaded";
      }
      return "complete";
    };
    i = function(t3) {
      var e2 = t3.nodeName;
      return 1 === t3.nodeType ? e2.toLowerCase() : e2.toUpperCase().replace(/^#/, "");
    };
    a = function(t3, e2) {
      var n3 = "";
      try {
        for (; t3 && 9 !== t3.nodeType; ) {
          var r2 = t3, a2 = r2.id ? "#" + r2.id : i(r2) + (r2.classList && r2.classList.value && r2.classList.value.trim() && r2.classList.value.trim().length ? "." + r2.classList.value.trim().replace(/\s+/g, ".") : "");
          if (n3.length + a2.length > (e2 || 100) - 1) return n3 || a2;
          if (n3 = n3 ? a2 + ">" + n3 : a2, r2.id) break;
          t3 = r2.parentNode;
        }
      } catch (t4) {
      }
      return n3;
    };
    o = -1;
    c = function() {
      return o;
    };
    u = function(t3) {
      addEventListener("pageshow", (function(e2) {
        e2.persisted && (o = e2.timeStamp, t3(e2));
      }), true);
    };
    s = function() {
      var t3 = n();
      return t3 && t3.activationStart || 0;
    };
    f = function(t3, e2) {
      var r2 = n(), i2 = "navigate";
      c() >= 0 ? i2 = "back-forward-cache" : r2 && (document.prerendering || s() > 0 ? i2 = "prerender" : document.wasDiscarded ? i2 = "restore" : r2.type && (i2 = r2.type.replace(/_/g, "-")));
      return { name: t3, value: void 0 === e2 ? -1 : e2, rating: "good", delta: 0, entries: [], id: "v4-".concat(Date.now(), "-").concat(Math.floor(8999999999999 * Math.random()) + 1e12), navigationType: i2 };
    };
    d = function(t3, e2, n3) {
      try {
        if (PerformanceObserver.supportedEntryTypes.includes(t3)) {
          var r2 = new PerformanceObserver((function(t4) {
            Promise.resolve().then((function() {
              e2(t4.getEntries());
            }));
          }));
          return r2.observe(Object.assign({ type: t3, buffered: true }, n3 || {})), r2;
        }
      } catch (t4) {
      }
    };
    l = function(t3, e2, n3, r2) {
      var i2, a2;
      return function(o2) {
        e2.value >= 0 && (o2 || r2) && ((a2 = e2.value - (i2 || 0)) || void 0 === i2) && (i2 = e2.value, e2.delta = a2, e2.rating = (function(t4, e3) {
          return t4 > e3[1] ? "poor" : t4 > e3[0] ? "needs-improvement" : "good";
        })(e2.value, n3), t3(e2));
      };
    };
    m = function(t3) {
      requestAnimationFrame((function() {
        return requestAnimationFrame((function() {
          return t3();
        }));
      }));
    };
    p = function(t3) {
      document.addEventListener("visibilitychange", (function() {
        "hidden" === document.visibilityState && t3();
      }));
    };
    v = function(t3) {
      var e2 = false;
      return function() {
        e2 || (t3(), e2 = true);
      };
    };
    g = -1;
    h = function() {
      return "hidden" !== document.visibilityState || document.prerendering ? 1 / 0 : 0;
    };
    T = function(t3) {
      "hidden" === document.visibilityState && g > -1 && (g = "visibilitychange" === t3.type ? t3.timeStamp : 0, E());
    };
    y = function() {
      addEventListener("visibilitychange", T, true), addEventListener("prerenderingchange", T, true);
    };
    E = function() {
      removeEventListener("visibilitychange", T, true), removeEventListener("prerenderingchange", T, true);
    };
    S = function() {
      return g < 0 && (g = h(), y(), u((function() {
        setTimeout((function() {
          g = h(), y();
        }), 0);
      }))), { get firstHiddenTime() {
        return g;
      } };
    };
    b = function(t3) {
      document.prerendering ? addEventListener("prerenderingchange", (function() {
        return t3();
      }), true) : t3();
    };
    L = [1800, 3e3];
    C = function(t3, e2) {
      e2 = e2 || {}, b((function() {
        var n3, r2 = S(), i2 = f("FCP"), a2 = d("paint", (function(t4) {
          t4.forEach((function(t5) {
            "first-contentful-paint" === t5.name && (a2.disconnect(), t5.startTime < r2.firstHiddenTime && (i2.value = Math.max(t5.startTime - s(), 0), i2.entries.push(t5), n3(true)));
          }));
        }));
        a2 && (n3 = l(t3, i2, L, e2.reportAllChanges), u((function(r3) {
          i2 = f("FCP"), n3 = l(t3, i2, L, e2.reportAllChanges), m((function() {
            i2.value = performance.now() - r3.timeStamp, n3(true);
          }));
        })));
      }));
    };
    M = [0.1, 0.25];
    D = function(t3, e2) {
      !(function(t4, e3) {
        e3 = e3 || {}, C(v((function() {
          var n3, r2 = f("CLS", 0), i2 = 0, a2 = [], o2 = function(t5) {
            t5.forEach((function(t6) {
              if (!t6.hadRecentInput) {
                var e4 = a2[0], n4 = a2[a2.length - 1];
                i2 && t6.startTime - n4.startTime < 1e3 && t6.startTime - e4.startTime < 5e3 ? (i2 += t6.value, a2.push(t6)) : (i2 = t6.value, a2 = [t6]);
              }
            })), i2 > r2.value && (r2.value = i2, r2.entries = a2, n3());
          }, c2 = d("layout-shift", o2);
          c2 && (n3 = l(t4, r2, M, e3.reportAllChanges), p((function() {
            o2(c2.takeRecords()), n3(true);
          })), u((function() {
            i2 = 0, r2 = f("CLS", 0), n3 = l(t4, r2, M, e3.reportAllChanges), m((function() {
              return n3();
            }));
          })), setTimeout(n3, 0));
        })));
      })((function(e3) {
        var n3 = (function(t4) {
          var e4, n4 = {};
          if (t4.entries.length) {
            var i2 = t4.entries.reduce((function(t5, e5) {
              return t5 && t5.value > e5.value ? t5 : e5;
            }));
            if (i2 && i2.sources && i2.sources.length) {
              var o2 = (e4 = i2.sources).find((function(t5) {
                return t5.node && 1 === t5.node.nodeType;
              })) || e4[0];
              o2 && (n4 = { largestShiftTarget: a(o2.node), largestShiftTime: i2.startTime, largestShiftValue: i2.value, largestShiftSource: o2, largestShiftEntry: i2, loadState: r(i2.startTime) });
            }
          }
          return Object.assign(t4, { attribution: n4 });
        })(e3);
        t3(n3);
      }), e2);
    };
    w = function(t3, e2) {
      C((function(e3) {
        var i2 = (function(t4) {
          var e4 = { timeToFirstByte: 0, firstByteToFCP: t4.value, loadState: r(c()) };
          if (t4.entries.length) {
            var i3 = n(), a2 = t4.entries[t4.entries.length - 1];
            if (i3) {
              var o2 = i3.activationStart || 0, u2 = Math.max(0, i3.responseStart - o2);
              e4 = { timeToFirstByte: u2, firstByteToFCP: t4.value - u2, loadState: r(t4.entries[0].startTime), navigationEntry: i3, fcpEntry: a2 };
            }
          }
          return Object.assign(t4, { attribution: e4 });
        })(e3);
        t3(i2);
      }), e2);
    };
    x = 0;
    I = 1 / 0;
    k = 0;
    A = function(t3) {
      t3.forEach((function(t4) {
        t4.interactionId && (I = Math.min(I, t4.interactionId), k = Math.max(k, t4.interactionId), x = k ? (k - I) / 7 + 1 : 0);
      }));
    };
    F = function() {
      return t ? x : performance.interactionCount || 0;
    };
    P = function() {
      "interactionCount" in performance || t || (t = d("event", A, { type: "event", buffered: true, durationThreshold: 0 }));
    };
    B = [];
    O = /* @__PURE__ */ new Map();
    R = 0;
    j = function() {
      var t3 = Math.min(B.length - 1, Math.floor((F() - R) / 50));
      return B[t3];
    };
    q = [];
    H = function(t3) {
      if (q.forEach((function(e3) {
        return e3(t3);
      })), t3.interactionId || "first-input" === t3.entryType) {
        var e2 = B[B.length - 1], n3 = O.get(t3.interactionId);
        if (n3 || B.length < 10 || t3.duration > e2.latency) {
          if (n3) t3.duration > n3.latency ? (n3.entries = [t3], n3.latency = t3.duration) : t3.duration === n3.latency && t3.startTime === n3.entries[0].startTime && n3.entries.push(t3);
          else {
            var r2 = { id: t3.interactionId, latency: t3.duration, entries: [t3] };
            O.set(r2.id, r2), B.push(r2);
          }
          B.sort((function(t4, e3) {
            return e3.latency - t4.latency;
          })), B.length > 10 && B.splice(10).forEach((function(t4) {
            return O.delete(t4.id);
          }));
        }
      }
    };
    N = function(t3) {
      var e2 = self.requestIdleCallback || self.setTimeout, n3 = -1;
      return t3 = v(t3), "hidden" === document.visibilityState ? t3() : (n3 = e2(t3), p(t3)), n3;
    };
    W = [200, 500];
    z = function(t3, e2) {
      "PerformanceEventTiming" in self && "interactionId" in PerformanceEventTiming.prototype && (e2 = e2 || {}, b((function() {
        var n3;
        P();
        var r2, i2 = f("INP"), a2 = function(t4) {
          N((function() {
            t4.forEach(H);
            var e3 = j();
            e3 && e3.latency !== i2.value && (i2.value = e3.latency, i2.entries = e3.entries, r2());
          }));
        }, o2 = d("event", a2, { durationThreshold: null !== (n3 = e2.durationThreshold) && void 0 !== n3 ? n3 : 40 });
        r2 = l(t3, i2, W, e2.reportAllChanges), o2 && (o2.observe({ type: "first-input", buffered: true }), p((function() {
          a2(o2.takeRecords()), r2(true);
        })), u((function() {
          R = F(), B.length = 0, O.clear(), i2 = f("INP"), r2 = l(t3, i2, W, e2.reportAllChanges);
        })));
      })));
    };
    U = [];
    V = [];
    _ = 0;
    G = /* @__PURE__ */ new WeakMap();
    J = /* @__PURE__ */ new Map();
    K = -1;
    Q = function(t3) {
      U = U.concat(t3), X();
    };
    X = function() {
      K < 0 && (K = N(Y));
    };
    Y = function() {
      J.size > 10 && J.forEach((function(t4, e3) {
        O.has(e3) || J.delete(e3);
      }));
      var t3 = B.map((function(t4) {
        return G.get(t4.entries[0]);
      })), e2 = V.length - 50;
      V = V.filter((function(n4, r3) {
        return r3 >= e2 || t3.includes(n4);
      }));
      for (var n3 = /* @__PURE__ */ new Set(), r2 = 0; r2 < V.length; r2++) {
        var i2 = V[r2];
        nt(i2.startTime, i2.processingEnd).forEach((function(t4) {
          n3.add(t4);
        }));
      }
      var a2 = U.length - 1 - 50;
      U = U.filter((function(t4, e3) {
        return t4.startTime > _ && e3 > a2 || n3.has(t4);
      })), K = -1;
    };
    q.push((function(t3) {
      t3.interactionId && t3.target && !J.has(t3.interactionId) && J.set(t3.interactionId, t3.target);
    }), (function(t3) {
      var e2, n3 = t3.startTime + t3.duration;
      _ = Math.max(_, t3.processingEnd);
      for (var r2 = V.length - 1; r2 >= 0; r2--) {
        var i2 = V[r2];
        if (Math.abs(n3 - i2.renderTime) <= 8) {
          (e2 = i2).startTime = Math.min(t3.startTime, e2.startTime), e2.processingStart = Math.min(t3.processingStart, e2.processingStart), e2.processingEnd = Math.max(t3.processingEnd, e2.processingEnd), e2.entries.push(t3);
          break;
        }
      }
      e2 || (e2 = { startTime: t3.startTime, processingStart: t3.processingStart, processingEnd: t3.processingEnd, renderTime: n3, entries: [t3] }, V.push(e2)), (t3.interactionId || "first-input" === t3.entryType) && G.set(t3, e2), X();
    }));
    nt = function(t3, e2) {
      for (var n3, r2 = [], i2 = 0; n3 = U[i2]; i2++) if (!(n3.startTime + n3.duration < t3)) {
        if (n3.startTime > e2) break;
        r2.push(n3);
      }
      return r2;
    };
    rt = function(t3, n3) {
      e || (e = d("long-animation-frame", Q)), z((function(e2) {
        var n4 = (function(t4) {
          var e3 = t4.entries[0], n5 = G.get(e3), i2 = e3.processingStart, o2 = n5.processingEnd, c2 = n5.entries.sort((function(t5, e4) {
            return t5.processingStart - e4.processingStart;
          })), u2 = nt(e3.startTime, o2), s2 = t4.entries.find((function(t5) {
            return t5.target;
          })), f2 = s2 && s2.target || J.get(e3.interactionId), d2 = [e3.startTime + e3.duration, o2].concat(u2.map((function(t5) {
            return t5.startTime + t5.duration;
          }))), l2 = Math.max.apply(Math, d2), m2 = { interactionTarget: a(f2), interactionTargetElement: f2, interactionType: e3.name.startsWith("key") ? "keyboard" : "pointer", interactionTime: e3.startTime, nextPaintTime: l2, processedEventEntries: c2, longAnimationFrameEntries: u2, inputDelay: i2 - e3.startTime, processingDuration: o2 - i2, presentationDelay: Math.max(l2 - o2, 0), loadState: r(e3.startTime) };
          return Object.assign(t4, { attribution: m2 });
        })(e2);
        t3(n4);
      }), n3);
    };
    it = [2500, 4e3];
    at = {};
    ot = function(t3, e2) {
      !(function(t4, e3) {
        e3 = e3 || {}, b((function() {
          var n3, r2 = S(), i2 = f("LCP"), a2 = function(t5) {
            e3.reportAllChanges || (t5 = t5.slice(-1)), t5.forEach((function(t6) {
              t6.startTime < r2.firstHiddenTime && (i2.value = Math.max(t6.startTime - s(), 0), i2.entries = [t6], n3());
            }));
          }, o2 = d("largest-contentful-paint", a2);
          if (o2) {
            n3 = l(t4, i2, it, e3.reportAllChanges);
            var c2 = v((function() {
              at[i2.id] || (a2(o2.takeRecords()), o2.disconnect(), at[i2.id] = true, n3(true));
            }));
            ["keydown", "click"].forEach((function(t5) {
              addEventListener(t5, (function() {
                return N(c2);
              }), { once: true, capture: true });
            })), p(c2), u((function(r3) {
              i2 = f("LCP"), n3 = l(t4, i2, it, e3.reportAllChanges), m((function() {
                i2.value = performance.now() - r3.timeStamp, at[i2.id] = true, n3(true);
              }));
            }));
          }
        }));
      })((function(e3) {
        var r2 = (function(t4) {
          var e4 = { timeToFirstByte: 0, resourceLoadDelay: 0, resourceLoadDuration: 0, elementRenderDelay: t4.value };
          if (t4.entries.length) {
            var r3 = n();
            if (r3) {
              var i2 = r3.activationStart || 0, o2 = t4.entries[t4.entries.length - 1], c2 = o2.url && performance.getEntriesByType("resource").filter((function(t5) {
                return t5.name === o2.url;
              }))[0], u2 = Math.max(0, r3.responseStart - i2), s2 = Math.max(u2, c2 ? (c2.requestStart || c2.startTime) - i2 : 0), f2 = Math.max(s2, c2 ? c2.responseEnd - i2 : 0), d2 = Math.max(f2, o2.startTime - i2);
              e4 = { element: a(o2.element), timeToFirstByte: u2, resourceLoadDelay: s2 - u2, resourceLoadDuration: f2 - s2, elementRenderDelay: d2 - f2, navigationEntry: r3, lcpEntry: o2 }, o2.url && (e4.url = o2.url), c2 && (e4.lcpResourceEntry = c2);
            }
          }
          return Object.assign(t4, { attribution: e4 });
        })(e3);
        t3(r2);
      }), e2);
    };
    ct = [800, 1800];
    ut = function t2(e2) {
      document.prerendering ? b((function() {
        return t2(e2);
      })) : "complete" !== document.readyState ? addEventListener("load", (function() {
        return t2(e2);
      }), true) : setTimeout(e2, 0);
    };
    st = function(t3, e2) {
      e2 = e2 || {};
      var r2 = f("TTFB"), i2 = l(t3, r2, ct, e2.reportAllChanges);
      ut((function() {
        var a2 = n();
        a2 && (r2.value = Math.max(a2.responseStart - s(), 0), r2.entries = [a2], i2(true), u((function() {
          r2 = f("TTFB", 0), (i2 = l(t3, r2, ct, e2.reportAllChanges))(true);
        })));
      }));
    };
    ft = function(t3, e2) {
      st((function(e3) {
        var n3 = (function(t4) {
          var e4 = { waitingDuration: 0, cacheDuration: 0, dnsDuration: 0, connectionDuration: 0, requestDuration: 0 };
          if (t4.entries.length) {
            var n4 = t4.entries[0], r2 = n4.activationStart || 0, i2 = Math.max((n4.workerStart || n4.fetchStart) - r2, 0), a2 = Math.max(n4.domainLookupStart - r2, 0), o2 = Math.max(n4.connectStart - r2, 0), c2 = Math.max(n4.connectEnd - r2, 0);
            e4 = { waitingDuration: i2, cacheDuration: a2 - i2, dnsDuration: o2 - a2, connectionDuration: c2 - o2, requestDuration: t4.value - c2, navigationEntry: n4 };
          }
          return Object.assign(t4, { attribution: e4 });
        })(e3);
        t3(n3);
      }), e2);
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/vitals/constants.js
var VITAL_NAMES;
var init_constants7 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/vitals/constants.js"() {
    VITAL_NAMES = {
      FIRST_PAINT: "fp",
      FIRST_CONTENTFUL_PAINT: "fcp",
      FIRST_INTERACTION: "fi",
      LARGEST_CONTENTFUL_PAINT: "lcp",
      LOAD_TIME: "load",
      CUMULATIVE_LAYOUT_SHIFT: "cls",
      INTERACTION_TO_NEXT_PAINT: "inp",
      TIME_TO_FIRST_BYTE: "ttfb"
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/vitals/vital-metric.js
var VitalMetric;
var init_vital_metric = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/vitals/vital-metric.js"() {
    VitalMetric = class {
      #subscribers = /* @__PURE__ */ new Set();
      history = [];
      constructor(name, roundingMethod) {
        this.name = name;
        this.attrs = {};
        this.roundingMethod = typeof roundingMethod === "function" ? roundingMethod : Math.floor;
      }
      update({
        value,
        attrs = {}
      }) {
        if (value === void 0 || value === null || value < 0) return;
        const state = {
          value: this.roundingMethod(value),
          name: this.name,
          attrs
        };
        this.history.push(state);
        this.#subscribers.forEach((cb) => {
          try {
            cb(state);
          } catch (e2) {
          }
        });
      }
      get current() {
        return this.history[this.history.length - 1] || {
          value: void 0,
          name: this.name,
          attrs: {}
        };
      }
      get isValid() {
        return this.current.value >= 0;
      }
      subscribe(callback, buffered = true) {
        if (typeof callback !== "function") return;
        this.#subscribers.add(callback);
        if (this.isValid && !!buffered) this.history.forEach((state) => {
          callback(state);
        });
        return () => {
          this.#subscribers.delete(callback);
        };
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/vitals/first-contentful-paint.js
var firstContentfulPaint;
var init_first_contentful_paint = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/vitals/first-contentful-paint.js"() {
    init_web_vitals_attribution();
    init_runtime();
    init_constants7();
    init_vital_metric();
    firstContentfulPaint = new VitalMetric(VITAL_NAMES.FIRST_CONTENTFUL_PAINT);
    if (isBrowserScope) {
      if (iOSBelow16) {
        try {
          if (!initiallyHidden) {
            const paintEntries = performance.getEntriesByType("paint");
            paintEntries.forEach((entry) => {
              if (entry.name === "first-contentful-paint") {
                firstContentfulPaint.update({
                  value: Math.floor(entry.startTime)
                });
              }
            });
          }
        } catch (e2) {
        }
      } else {
        w(({
          value,
          attribution
        }) => {
          if (initiallyHidden || firstContentfulPaint.isValid) return;
          const attrs = {
            timeToFirstByte: attribution.timeToFirstByte,
            firstByteToFCP: attribution.firstByteToFCP,
            loadState: attribution.loadState
          };
          firstContentfulPaint.update({
            value,
            attrs
          });
        });
      }
    }
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/vitals/first-paint.js
var firstPaint;
var init_first_paint = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/vitals/first-paint.js"() {
    init_runtime();
    init_constants7();
    init_vital_metric();
    firstPaint = new VitalMetric(VITAL_NAMES.FIRST_PAINT);
    if (isBrowserScope) {
      const handleEntries = (entries) => {
        entries.forEach((entry) => {
          if (entry.name === "first-paint" && !firstPaint.isValid) {
            observer.disconnect();
            firstPaint.update({
              value: entry.startTime
            });
          }
        });
      };
      let observer;
      try {
        if (PerformanceObserver.supportedEntryTypes.includes("paint") && !initiallyHidden) {
          observer = new PerformanceObserver((list2) => {
            Promise.resolve().then(() => {
              handleEntries(list2.getEntries());
            });
          });
          observer.observe({
            type: "paint",
            buffered: true
          });
        }
      } catch (e2) {
      }
    }
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/vitals/time-to-first-byte.js
var timeToFirstByte;
var init_time_to_first_byte = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/vitals/time-to-first-byte.js"() {
    init_runtime();
    init_constants7();
    init_vital_metric();
    init_web_vitals_attribution();
    timeToFirstByte = new VitalMetric(VITAL_NAMES.TIME_TO_FIRST_BYTE);
    if (isBrowserScope && supportsNavTimingL2() && !isiOS && window === window.parent) {
      ft(({
        value,
        attribution
      }) => {
        if (timeToFirstByte.isValid) return;
        timeToFirstByte.update({
          value,
          attrs: {
            navigationEntry: attribution.navigationEntry
          }
        });
      });
    } else {
      if (!timeToFirstByte.isValid) {
        const entry = {};
        for (let key in globalScope?.performance?.timing || {}) entry[key] = Math.max(globalScope?.performance?.timing[key] - originTime, 0);
        timeToFirstByte.update({
          value: entry.responseStart,
          attrs: {
            navigationEntry: entry
          }
        });
      }
    }
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/timing/time-keeper.js
var TimeKeeper;
var init_time_keeper = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/timing/time-keeper.js"() {
    init_runtime();
    init_monkey_patched();
    TimeKeeper = class {
      /**
       * Pointer to the current agent session if it exists.
       * @type {import('../session/session-entity').SessionEntity}
       */
      #session;
      /**
       * Represents the browser origin time corrected to NR server time.
       * @type {number}
       */
      #correctedOriginTime;
      /**
       * Represents the difference in milliseconds between the calculated NR server time and
       * the local time.
       * @type {number}
       */
      #localTimeDiff;
      /**
       * Represents whether the timekeeper is in a state that it can accurately convert
       * timestamps.
       * @type {boolean}
       */
      #ready = false;
      constructor(sessionObj) {
        this.#session = sessionObj;
        this.processStoredDiff();
        isNative(performance.now, Date.now);
      }
      get ready() {
        return this.#ready;
      }
      get correctedOriginTime() {
        return this.#correctedOriginTime;
      }
      get localTimeDiff() {
        return this.#localTimeDiff;
      }
      /**
       * Process a rum request to calculate NR server time.
       * @param rumRequest {XMLHttpRequest} The xhr for the rum request
       * @param startTime {number} The start time of the RUM request
       * @param endTime {number} The end time of the RUM request
       * @param nrServerTime {number} the unix number value of the NR server time in MS, returned in the RUM request body
       */
      processRumRequest(rumRequest, startTime, endTime, nrServerTime) {
        this.processStoredDiff();
        if (this.#ready) return;
        if (!nrServerTime) throw new Error("nrServerTime not found");
        const medianRumOffset = (endTime - startTime) / 2;
        const serverOffset = startTime + medianRumOffset;
        this.#correctedOriginTime = Math.floor(nrServerTime - serverOffset);
        this.#localTimeDiff = originTime - this.#correctedOriginTime;
        if (isNaN(this.#correctedOriginTime)) {
          throw new Error("Failed to correct browser time to server time");
        }
        this.#session?.write({
          serverTimeDiff: this.#localTimeDiff
        });
        this.#ready = true;
      }
      /**
       * Converts a page origin relative time to an absolute timestamp
       * using the user's local clock.
       * @param relativeTime {number} The relative time of the event in milliseconds
       * @returns {number} Corrected unix/epoch timestamp
       */
      convertRelativeTimestamp(relativeTime) {
        return originTime + relativeTime;
      }
      /**
       * Converts an absolute timestamp to a relative timestamp using the
       * user's local clock.
       * @param timestamp
       * @returns {number}
       */
      convertAbsoluteTimestamp(timestamp) {
        return timestamp - originTime;
      }
      /**
       * Corrects an absolute timestamp to NR server time.
       * @param timestamp {number} The unix/epoch timestamp of the event with milliseconds
       * @return {number} Corrected unix/epoch timestamp
       */
      correctAbsoluteTimestamp(timestamp) {
        return timestamp - this.#localTimeDiff;
      }
      /**
       * Corrects relative timestamp to NR server time (epoch).
       * @param {DOMHighResTimeStamp} relativeTime
       * @returns {number}
       */
      correctRelativeTimestamp(relativeTime) {
        return this.correctAbsoluteTimestamp(this.convertRelativeTimestamp(relativeTime));
      }
      /** Process the session entity and use the info to set the main time calculations if present */
      processStoredDiff() {
        if (this.#ready) return;
        const storedServerTimeDiff = this.#session?.read()?.serverTimeDiff;
        if (typeof storedServerTimeDiff === "number" && !isNaN(storedServerTimeDiff)) {
          this.#localTimeDiff = storedServerTimeDiff;
          this.#correctedOriginTime = originTime - this.#localTimeDiff;
          this.#ready = true;
        }
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/util/traverse.js
function applyFnToProps(obj2, fn, type = "string", ignoreKeys = []) {
  if (!obj2 || typeof obj2 !== "object") return obj2;
  Object.keys(obj2).forEach((property) => {
    if (typeof obj2[property] === "object") {
      applyFnToProps(obj2[property], fn, type, ignoreKeys);
    } else {
      if (typeof obj2[property] === type && !ignoreKeys.includes(property)) obj2[property] = fn(obj2[property]);
    }
  });
  return obj2;
}
var init_traverse = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/util/traverse.js"() {
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/util/webdriver-detection.js
var webdriverDetected;
var init_webdriver_detection = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/util/webdriver-detection.js"() {
    init_runtime();
    webdriverDetected = (() => {
      try {
        if (typeof navigator !== "undefined" && navigator.webdriver === true) {
          return true;
        }
        if (isBrowserScope) {
          if (document.__webdriver_evaluate || document.__selenium_unwrapped || document.__driver_evaluate || document.__webdriver_script_function) {
            return true;
          }
          if (window.callPhantom || window._phantom) {
            return true;
          }
          if (window.__nightmare) {
            return true;
          }
        }
        return false;
      } catch (err2) {
        return false;
      }
    })();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/page_view_event/aggregate/index.js
var aggregate_exports = {};
__export(aggregate_exports, {
  Aggregate: () => Aggregate
});
var Aggregate;
var init_aggregate = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/page_view_event/aggregate/index.js"() {
    init_runtime();
    init_nav_timing();
    init_stringify();
    init_info();
    init_constants6();
    init_initialized_features();
    init_feature_flags();
    init_console();
    init_aggregate_base();
    init_first_contentful_paint();
    init_first_paint();
    init_time_to_first_byte();
    init_now();
    init_time_keeper();
    init_traverse();
    init_harvester();
    init_features();
    init_submit_data();
    init_webdriver_detection();
    Aggregate = class extends AggregateBase {
      static featureName = FEATURE_NAME4;
      constructor(agentRef) {
        super(agentRef, FEATURE_NAME4);
        this.sentRum = false;
        this.timeToFirstByte = 0;
        this.firstByteToWindowLoad = 0;
        this.firstByteToDomContent = 0;
        this.retries = 0;
        if (!isValid(agentRef.info)) {
          this.ee.abort();
          return warn(43);
        }
        agentRef.runtime.timeKeeper = new TimeKeeper(agentRef.runtime.session);
        if (isBrowserScope) {
          timeToFirstByte.subscribe(({
            value,
            attrs
          }) => {
            const navEntry = attrs.navigationEntry;
            this.timeToFirstByte = Math.max(value, this.timeToFirstByte);
            this.firstByteToWindowLoad = Math.max(Math.round(navEntry.loadEventEnd - this.timeToFirstByte), this.firstByteToWindowLoad);
            this.firstByteToDomContent = Math.max(Math.round(navEntry.domContentLoadedEventEnd - this.timeToFirstByte), this.firstByteToDomContent);
          });
          setTimeout(this.sendRum.bind(this), 0);
        } else {
          this.sendRum();
        }
      }
      /**
       *
       * @param {Function} cb A function to run once the RUM call has finished - Defaults to activateFeatures
       * @param {*} customAttributes custom attributes to attach to the RUM call - Defaults to info.js
       */
      sendRum(customAttributes = this.agentRef.info.jsAttributes) {
        const info = this.agentRef.info;
        const measures = {};
        if (info.queueTime) measures.qt = info.queueTime;
        if (info.applicationTime) measures.ap = info.applicationTime;
        measures.be = this.timeToFirstByte;
        measures.fe = this.firstByteToWindowLoad;
        measures.dc = this.firstByteToDomContent;
        const queryParameters = {
          tt: info.ttGuid,
          us: info.user,
          ac: info.account,
          pr: info.product,
          af: getActivatedFeaturesFlags(this.agentIdentifier).join(","),
          ...measures,
          xx: info.extra,
          ua: info.userAttributes,
          at: info.atts
        };
        if (this.agentRef.runtime.session) queryParameters.fsh = Number(this.agentRef.runtime.session.isNew);
        let body = applyFnToProps({
          ja: {
            ...customAttributes,
            webdriverDetected
          }
        }, this.obfuscator.obfuscateString.bind(this.obfuscator), "string");
        if (globalScope.performance) {
          if (supportsNavTimingL2()) {
            const navTimingEntry = globalScope?.performance?.getEntriesByType("navigation")?.[0];
            const perf = {
              timing: addPT(originTime, navTimingEntry, {}),
              navigation: addPN(navTimingEntry, {})
            };
            queryParameters.perf = stringify(perf);
          } else if (typeof PerformanceTiming !== "undefined") {
            const perf = {
              timing: addPT(originTime, globalScope.performance.timing, {}, true),
              navigation: addPN(globalScope.performance.navigation, {})
            };
            queryParameters.perf = stringify(perf);
          }
        }
        queryParameters.fp = firstPaint.current.value;
        queryParameters.fcp = firstContentfulPaint.current.value;
        this.queryStringsBuilder = () => {
          this.rumStartTime = now();
          const timeKeeper = this.agentRef.runtime.timeKeeper;
          if (timeKeeper?.ready) {
            queryParameters.timestamp = Math.floor(timeKeeper.correctRelativeTimestamp(this.rumStartTime));
          }
          return queryParameters;
        };
        this.events.add(body);
        if (this.agentRef.runtime.harvester.triggerHarvestFor(this, {
          sendEmptyBody: true
        }).ranSend) this.sentRum = true;
      }
      serializer(eventBuffer) {
        return eventBuffer[0];
      }
      postHarvestCleanup({
        sent,
        status,
        responseText,
        xhr: xhr2,
        retry
      }) {
        const rumEndTime = now();
        let app, flags;
        try {
          ({
            app,
            ...flags
          } = JSON.parse(responseText));
        } catch (error) {
          warn(53, error);
        }
        super.postHarvestCleanup({
          sent,
          retry
        });
        if (this.isRetrying && this.retries++ < 1) {
          setTimeout(() => this.agentRef.runtime.harvester.triggerHarvestFor(this, {
            sendEmptyBody: true
          }), 5e3);
          return;
        }
        if (status >= 400 || status === 0) {
          warn(18, status);
          this.blocked = true;
          const textEncoder = new TextEncoder();
          const payloadSize = Object.values(newrelic.ee.backlog).reduce((acc, value) => {
            if (!value) return acc;
            const encoded = textEncoder.encode(value);
            return acc + encoded.byteLength;
          }, 0);
          const BCSError = "BCS/Error/";
          const body = {
            sm: [{
              params: {
                name: BCSError + status
              },
              stats: {
                c: 1
              }
            }, {
              params: {
                name: BCSError + "Dropped/Bytes"
              },
              stats: {
                c: 1,
                t: payloadSize
              }
            }, {
              params: {
                name: BCSError + "Duration/Ms"
              },
              stats: {
                c: 1,
                t: rumEndTime - this.rumStartTime
              }
            }]
          };
          send(this.agentRef, {
            endpoint: FEATURE_TO_ENDPOINT[FEATURE_NAMES.metrics],
            payload: {
              body
            },
            submitMethod: getSubmitMethod(),
            featureName: FEATURE_NAMES.metrics
          });
          this.ee.abort();
          return;
        }
        try {
          const wasReady = this.agentRef.runtime.timeKeeper.ready;
          this.agentRef.runtime.timeKeeper.processRumRequest(xhr2, this.rumStartTime, rumEndTime, app.nrServerTime);
          if (!this.agentRef.runtime.timeKeeper.ready) throw new Error("TimeKeeper not ready");
          const timeDiff = this.agentRef.runtime.timeKeeper.correctedOriginTime - app.nrServerTime;
          if (wasReady && timeDiff > 0) {
            this.reportSupportabilityMetric("Generic/TimeKeeper/InvalidTimestamp/Seen", timeDiff);
          }
        } catch (error) {
          this.ee.abort();
          this.blocked = true;
          warn(17, error);
          return;
        }
        if (!Object.keys(this.agentRef.runtime.appMetadata).length) this.agentRef.runtime.appMetadata = app;
        this.drain();
        this.agentRef.runtime.harvester.startTimer();
        activateFeatures(flags, this.agentRef);
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/page_view_timing/constants.js
var FEATURE_NAME5;
var init_constants8 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/page_view_timing/constants.js"() {
    init_features();
    FEATURE_NAME5 = FEATURE_NAMES.pageViewTiming;
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/serialize/bel-serializer.js
function nullable(val, fn, comma) {
  return val || val === 0 || val === "" ? fn(val) + (comma ? "," : "") : "!";
}
function numeric(n3, noDefault) {
  if (noDefault) {
    return Math.floor(n3).toString(36);
  }
  return n3 === void 0 || n3 === 0 ? "" : Math.floor(n3).toString(36);
}
function getAddStringContext(obfuscator) {
  let stringTableIdx = 0;
  const stringTable = Object.prototype.hasOwnProperty.call(Object, "create") ? /* @__PURE__ */ Object.create(null) : {};
  return addString;
  function addString(str) {
    if (typeof str === "undefined" || str === "") return "";
    str = obfuscator.obfuscateString(String(str));
    if (hasOwnProp.call(stringTable, str)) {
      return numeric(stringTable[str], true);
    } else {
      stringTable[str] = stringTableIdx++;
      return quoteString(str);
    }
  }
}
function addCustomAttributes(attrs, addString) {
  var attrParts = [];
  Object.entries(attrs || {}).forEach(([key, val]) => {
    if (attrParts.length >= MAX_ATTRIBUTES) return;
    var type = 5;
    var serializedValue;
    key = addString(key);
    switch (typeof val) {
      case "object":
        if (val) {
          serializedValue = addString(stringify(val));
        } else {
          type = 9;
        }
        break;
      case "number":
        type = 6;
        serializedValue = val % 1 ? val : val + ".";
        break;
      case "boolean":
        type = val ? 7 : 8;
        break;
      case "undefined":
        type = 9;
        break;
      default:
        serializedValue = addString(val);
    }
    attrParts.push([type, key + (serializedValue ? "," + serializedValue : "")]);
  });
  return attrParts;
}
function quoteString(str) {
  return "'" + str.replace(escapable, "\\$1");
}
var hasOwnProp, MAX_ATTRIBUTES, escapable;
var init_bel_serializer = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/serialize/bel-serializer.js"() {
    init_stringify();
    hasOwnProp = Object.prototype.hasOwnProperty;
    MAX_ATTRIBUTES = 64;
    escapable = /([,\\;])/g;
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/vitals/cumulative-layout-shift.js
var cumulativeLayoutShift;
var init_cumulative_layout_shift = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/vitals/cumulative-layout-shift.js"() {
    init_web_vitals_attribution();
    init_constants7();
    init_vital_metric();
    init_runtime();
    cumulativeLayoutShift = new VitalMetric(VITAL_NAMES.CUMULATIVE_LAYOUT_SHIFT, (x3) => x3);
    if (isBrowserScope) {
      D(({
        value,
        attribution,
        id: id2
      }) => {
        const attrs = {
          metricId: id2,
          largestShiftTarget: attribution.largestShiftTarget,
          largestShiftTime: attribution.largestShiftTime,
          largestShiftValue: attribution.largestShiftValue,
          loadState: attribution.loadState
        };
        cumulativeLayoutShift.update({
          value,
          attrs
        });
      }, {
        reportAllChanges: true
      });
    }
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/vitals/interaction-to-next-paint.js
var interactionToNextPaint;
var init_interaction_to_next_paint = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/vitals/interaction-to-next-paint.js"() {
    init_web_vitals_attribution();
    init_vital_metric();
    init_constants7();
    init_runtime();
    interactionToNextPaint = new VitalMetric(VITAL_NAMES.INTERACTION_TO_NEXT_PAINT);
    if (isBrowserScope) {
      rt(({
        value,
        attribution,
        id: id2
      }) => {
        const attrs = {
          metricId: id2,
          eventTarget: attribution.interactionTarget,
          // event* attrs deprecated in v4, kept for NR backwards compatibility
          eventTime: attribution.interactionTime,
          // event* attrs deprecated in v4, kept for NR backwards compatibility
          interactionTarget: attribution.interactionTarget,
          interactionTime: attribution.interactionTime,
          interactionType: attribution.interactionType,
          inputDelay: attribution.inputDelay,
          nextPaintTime: attribution.nextPaintTime,
          processingDuration: attribution.processingDuration,
          presentationDelay: attribution.presentationDelay,
          loadState: attribution.loadState
        };
        interactionToNextPaint.update({
          value,
          attrs
        });
      });
    }
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/vitals/largest-contentful-paint.js
var largestContentfulPaint;
var init_largest_contentful_paint = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/vitals/largest-contentful-paint.js"() {
    init_web_vitals_attribution();
    init_vital_metric();
    init_constants7();
    init_runtime();
    init_clean_url();
    largestContentfulPaint = new VitalMetric(VITAL_NAMES.LARGEST_CONTENTFUL_PAINT);
    if (isBrowserScope) {
      ot(({
        value,
        attribution
      }) => {
        if (initiallyHidden || largestContentfulPaint.isValid) return;
        let attrs = {
          timeToFirstByte: attribution.timeToFirstByte,
          resourceLoadDelay: attribution.resourceLoadDelay,
          resourceLoadDuration: attribution.resourceLoadDuration,
          resourceLoadTime: attribution.resourceLoadDuration,
          // kept for NR backwards compatibility, deprecated in v3->v4
          elementRenderDelay: attribution.elementRenderDelay
        };
        const lcpEntry = attribution.lcpEntry;
        if (lcpEntry) {
          attrs.size = lcpEntry.size;
          attrs.eid = lcpEntry.id;
          if (lcpEntry.element?.tagName) attrs.elTag = lcpEntry.element.tagName;
        }
        if (attribution.element) attrs.element = attribution.element;
        if (attribution.navigationEntry) attrs.pageUrl = cleanURL(attribution.navigationEntry.name);
        if (attribution.url) attrs.elUrl = cleanURL(attribution.url);
        largestContentfulPaint.update({
          value,
          attrs
        });
      });
    }
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/util/event-origin.js
function eventOrigin(t3, target, ee2) {
  let origin = "unknown";
  if (t3 && t3 instanceof XMLHttpRequest) {
    const params = ee2.context(t3).params;
    if (!params || !params.status || !params.method || !params.host || !params.pathname) return "xhrOriginMissing";
    origin = params.status + " " + params.method + ": " + params.host + params.pathname;
  } else if (t3 && typeof t3.tagName === "string") {
    origin = t3.tagName.toLowerCase();
    if (t3.id) origin += "#" + t3.id;
    if (t3.className) {
      for (let i2 = 0; i2 < t3.classList.length; i2++) origin += "." + t3.classList[i2];
    }
  }
  if (origin === "unknown") {
    if (typeof target === "string") origin = target;
    else if (target === document) origin = "document";
    else if (target === window) origin = "window";
    else if (target instanceof FileReader) origin = "FileReader";
  }
  return origin;
}
var init_event_origin = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/util/event-origin.js"() {
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/vitals/load-time.js
var loadTime;
var init_load_time = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/vitals/load-time.js"() {
    init_runtime();
    init_load();
    init_constants7();
    init_vital_metric();
    loadTime = new VitalMetric(VITAL_NAMES.LOAD_TIME);
    if (isBrowserScope) {
      const perf = globalScope.performance;
      const handler = () => {
        if (!loadTime.isValid && perf) {
          loadTime.update({
            value: supportsNavTimingL2() ? perf.getEntriesByType("navigation")?.[0]?.loadEventEnd : perf.timing?.loadEventEnd - originTime
          });
        }
      };
      onWindowLoad(handler, true);
    }
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/page_view_timing/aggregate/index.js
var aggregate_exports2 = {};
__export(aggregate_exports2, {
  Aggregate: () => Aggregate2
});
function addConnectionAttributes(obj2) {
  var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return;
  if (connection.type) obj2["net-type"] = connection.type;
  if (connection.effectiveType) obj2["net-etype"] = connection.effectiveType;
  if (connection.rtt) obj2["net-rtt"] = connection.rtt;
  if (connection.downlink) obj2["net-dlink"] = connection.downlink;
}
var Aggregate2;
var init_aggregate2 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/page_view_timing/aggregate/index.js"() {
    init_bel_serializer();
    init_register_handler();
    init_handle();
    init_constants8();
    init_features();
    init_aggregate_base();
    init_cumulative_layout_shift();
    init_first_contentful_paint();
    init_first_paint();
    init_interaction_to_next_paint();
    init_largest_contentful_paint();
    init_page_visibility();
    init_constants7();
    init_runtime();
    init_event_origin();
    init_load_time();
    init_webdriver_detection();
    Aggregate2 = class extends AggregateBase {
      static featureName = FEATURE_NAME5;
      #handleVitalMetric = ({
        name,
        value,
        attrs
      }) => {
        this.addTiming(name, value, attrs);
      };
      constructor(agentRef) {
        super(agentRef, FEATURE_NAME5);
        this.curSessEndRecorded = false;
        this.firstIxnRecorded = false;
        super.customAttributesAreSeparate = true;
        defaultRegister("docHidden", (msTimestamp) => this.endCurrentSession(msTimestamp), this.featureName, this.ee);
        defaultRegister("winPagehide", (msTimestamp) => this.addTiming("unload", msTimestamp, null), this.featureName, this.ee);
        this.waitForFlags([]).then(() => {
          firstPaint.subscribe(this.#handleVitalMetric);
          firstContentfulPaint.subscribe(this.#handleVitalMetric);
          largestContentfulPaint.subscribe(this.#handleVitalMetric);
          interactionToNextPaint.subscribe(this.#handleVitalMetric);
          loadTime.subscribe(({
            name,
            value
          }) => {
            this.addTiming(name, Math.round(value));
          });
          subscribeToVisibilityChange(() => {
            const {
              name,
              value,
              attrs
            } = cumulativeLayoutShift.current;
            if (value === void 0) return;
            this.addTiming(name, value * 1e3, attrs);
          }, true, true);
          this.drain();
        });
      }
      /**
       * Add the time of _document visibilitychange to hidden_ to the next PVT harvest == NRDB pageHide attr.
       * @param {number} timestamp
       */
      endCurrentSession(timestamp) {
        if (!this.curSessEndRecorded) {
          this.addTiming("pageHide", timestamp, null);
          this.curSessEndRecorded = true;
        }
      }
      addTiming(name, value, attrs) {
        attrs = attrs || {};
        addConnectionAttributes(attrs);
        if (name !== VITAL_NAMES.CUMULATIVE_LAYOUT_SHIFT && cumulativeLayoutShift.current.value >= 0) {
          attrs.cls = cumulativeLayoutShift.current.value;
        }
        const timing = {
          name,
          value,
          attrs
        };
        this.events.add(timing);
        handle("pvtAdded", [name, value, attrs], void 0, FEATURE_NAMES.sessionTrace, this.ee);
        this.checkForFirstInteraction();
        return timing;
      }
      /**
       * Checks the performance API to see if the agent can set a first interaction event value
       * @returns {void}
       */
      checkForFirstInteraction() {
        if (this.firstIxnRecorded || initiallyHidden || !performance) return;
        const firstInput = performance.getEntriesByType("first-input")[0];
        if (!firstInput) return;
        this.firstIxnRecorded = true;
        this.addTiming("fi", firstInput.startTime, {
          type: firstInput.name,
          eventTarget: eventOrigin(firstInput.target),
          loadState: document.readyState
        });
      }
      appendGlobalCustomAttributes(timing) {
        var timingAttributes = timing.attrs || {};
        var reservedAttributes = ["size", "eid", "cls", "type", "fid", "elTag", "elUrl", "net-type", "net-etype", "net-rtt", "net-dlink"];
        Object.entries(this.agentRef.info.jsAttributes || {}).forEach(([key, val]) => {
          if (reservedAttributes.indexOf(key) < 0) {
            timingAttributes[key] = val;
          }
        });
        timingAttributes.webdriverDetected = webdriverDetected;
      }
      preHarvestChecks() {
        this.checkForFirstInteraction();
        return super.preHarvestChecks();
      }
      // serialize array of timing data
      serializer(eventBuffer) {
        if (!eventBuffer?.length) return "";
        var addString = getAddStringContext(this.agentRef.runtime.obfuscator);
        var payload = "bel.6;";
        for (var i2 = 0; i2 < eventBuffer.length; i2++) {
          var timing = eventBuffer[i2];
          payload += "e,";
          payload += addString(timing.name) + ",";
          payload += nullable(timing.value, numeric, false) + ",";
          this.appendGlobalCustomAttributes(timing);
          var attrParts = addCustomAttributes(timing.attrs, addString);
          if (attrParts && attrParts.length > 0) {
            payload += numeric(attrParts.length) + ";" + attrParts.join(";");
          }
          if (i2 + 1 < eventBuffer.length) payload += ";";
        }
        return payload;
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/metrics/aggregate/framework-detection.js
function getFrameworks() {
  if (!isBrowserScope) return [];
  const frameworks = [];
  try {
    if (detectReact()) {
      frameworks.push(FRAMEWORKS.REACT);
      if (detectNextJS()) frameworks.push(FRAMEWORKS.NEXTJS);
    }
    if (detectVue()) {
      frameworks.push(FRAMEWORKS.VUE);
      if (detectNuxtJS()) frameworks.push(FRAMEWORKS.NUXTJS);
    }
    if (detectAngular()) {
      frameworks.push(FRAMEWORKS.ANGULAR);
      if (detectAngularUniversal()) frameworks.push(FRAMEWORKS.ANGULARUNIVERSAL);
    }
    if (detectSvelte()) {
      frameworks.push(FRAMEWORKS.SVELTE);
      if (detectSvelteKit()) frameworks.push(FRAMEWORKS.SVELTEKIT);
    }
    if (detectPreact()) {
      frameworks.push(FRAMEWORKS.PREACT);
      if (detectPreactSSR()) frameworks.push(FRAMEWORKS.PREACTSSR);
    }
    if (detectAngularJs()) frameworks.push(FRAMEWORKS.ANGULARJS);
    if (Object.prototype.hasOwnProperty.call(window, "Backbone")) frameworks.push(FRAMEWORKS.BACKBONE);
    if (Object.prototype.hasOwnProperty.call(window, "Ember")) frameworks.push(FRAMEWORKS.EMBER);
    if (Object.prototype.hasOwnProperty.call(window, "Meteor")) frameworks.push(FRAMEWORKS.METEOR);
    if (Object.prototype.hasOwnProperty.call(window, "Zepto")) frameworks.push(FRAMEWORKS.ZEPTO);
    if (Object.prototype.hasOwnProperty.call(window, "jQuery")) frameworks.push(FRAMEWORKS.JQUERY);
    if (Object.prototype.hasOwnProperty.call(window, "MooTools")) frameworks.push(FRAMEWORKS.MOOTOOLS);
    if (Object.prototype.hasOwnProperty.call(window, "qwikevents")) frameworks.push(FRAMEWORKS.QWIK);
    if (Object.hasOwn(window, "_flutter")) frameworks.push(FRAMEWORKS.FLUTTER);
    if (detectElectron()) frameworks.push(FRAMEWORKS.ELECTRON);
  } catch (err2) {
  }
  return frameworks;
}
function detectReact() {
  try {
    return Object.prototype.hasOwnProperty.call(window, "React") || Object.prototype.hasOwnProperty.call(window, "ReactDOM") || Object.prototype.hasOwnProperty.call(window, "ReactRedux") || document.querySelector("[data-reactroot], [data-reactid]") || (() => {
      const divs = document.querySelectorAll("body > div");
      for (let i2 = 0; i2 < divs.length; i2++) {
        if (Object.prototype.hasOwnProperty.call(divs[i2], "_reactRootContainer")) {
          return true;
        }
      }
    })();
  } catch (err2) {
    return false;
  }
}
function detectNextJS() {
  try {
    return Object.prototype.hasOwnProperty.call(window, "next") && Object.prototype.hasOwnProperty.call(window.next, "version");
  } catch (err2) {
    return false;
  }
}
function detectVue() {
  try {
    return Object.prototype.hasOwnProperty.call(window, "Vue");
  } catch (err2) {
    return false;
  }
}
function detectNuxtJS() {
  try {
    return Object.prototype.hasOwnProperty.call(window, "$nuxt") && Object.prototype.hasOwnProperty.call(window.$nuxt, "nuxt");
  } catch (err2) {
    return false;
  }
}
function detectAngular() {
  try {
    return Object.prototype.hasOwnProperty.call(window, "ng") || document.querySelector("[ng-version]");
  } catch (err2) {
    return false;
  }
}
function detectAngularUniversal() {
  try {
    return document.querySelector("[ng-server-context]");
  } catch (err2) {
    return false;
  }
}
function detectSvelte() {
  try {
    return Object.prototype.hasOwnProperty.call(window, "__svelte");
  } catch (err2) {
    return false;
  }
}
function detectSvelteKit() {
  try {
    return !!Object.keys(window).find((prop2) => prop2.startsWith("__sveltekit"));
  } catch (err2) {
    return false;
  }
}
function detectPreact() {
  try {
    return Object.prototype.hasOwnProperty.call(window, "preact");
  } catch (err2) {
    return false;
  }
}
function detectPreactSSR() {
  try {
    return document.querySelector('script[type="__PREACT_CLI_DATA__"]');
  } catch (err2) {
    return false;
  }
}
function detectAngularJs() {
  try {
    return Object.prototype.hasOwnProperty.call(window, "angular") || document.querySelector(".ng-binding, [ng-app], [data-ng-app], [ng-controller], [data-ng-controller], [ng-repeat], [data-ng-repeat]") || document.querySelector('script[src*="angular.js"], script[src*="angular.min.js"]');
  } catch (err2) {
    return false;
  }
}
function detectElectron() {
  try {
    return typeof navigator === "object" && typeof navigator.userAgent === "string" && navigator.userAgent.indexOf("Electron") >= 0;
  } catch (err2) {
    return false;
  }
}
var FRAMEWORKS;
var init_framework_detection = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/metrics/aggregate/framework-detection.js"() {
    init_runtime();
    FRAMEWORKS = {
      REACT: "React",
      NEXTJS: "NextJS",
      VUE: "Vue",
      NUXTJS: "NuxtJS",
      ANGULAR: "Angular",
      ANGULARUNIVERSAL: "AngularUniversal",
      SVELTE: "Svelte",
      SVELTEKIT: "SvelteKit",
      PREACT: "Preact",
      PREACTSSR: "PreactSSR",
      ANGULARJS: "AngularJS",
      BACKBONE: "Backbone",
      EMBER: "Ember",
      METEOR: "Meteor",
      ZEPTO: "Zepto",
      JQUERY: "Jquery",
      MOOTOOLS: "MooTools",
      QWIK: "Qwik",
      FLUTTER: "Flutter",
      ELECTRON: "Electron"
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/dom/iframe.js
function isIFrameWindow(windowObject) {
  if (!windowObject) return false;
  return windowObject.self !== windowObject.top;
}
var init_iframe = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/dom/iframe.js"() {
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/metrics/aggregate/harvest-metadata.js
function evaluateHarvestMetadata(pageMetadata) {
  try {
    let evaluateTag = function(feature, flag3, hasFlag, hasHarvest) {
      const AUDIT = "audit";
      if (hasFlag) {
        if (!hasHarvest) supportabilityTags.push(formTag(AUDIT, feature, flag3, "false", "positive"));
        else supportabilityTags.push(formTag(AUDIT, feature, flag3, "true", "positive"));
      } else {
        if (hasHarvest) supportabilityTags.push(formTag(AUDIT, feature, flag3, "false", "negative"));
        else supportabilityTags.push(formTag(AUDIT, feature, flag3, "true", "negative"));
      }
    };
    const supportabilityTags = [];
    const formTag = (...strings) => strings.join("/");
    if (pageMetadata.page_view_event) {
      evaluateTag("page_view", "hasReplay", pageMetadata.page_view_event.hasReplay, !!pageMetadata.session_replay);
      evaluateTag("page_view", "hasTrace", pageMetadata.page_view_event.hasTrace, !!pageMetadata.session_trace);
    }
    if (pageMetadata.session_replay) {
      evaluateTag("session_replay", "hasError", pageMetadata.session_replay.hasError, !!pageMetadata.jserrors);
    }
    return supportabilityTags;
  } catch (err2) {
    return [];
  }
}
var init_harvest_metadata = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/metrics/aggregate/harvest-metadata.js"() {
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/metrics/aggregate/index.js
var aggregate_exports3 = {};
__export(aggregate_exports3, {
  Aggregate: () => Aggregate3
});
var Aggregate3;
var init_aggregate3 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/metrics/aggregate/index.js"() {
    init_register_handler();
    init_constants4();
    init_framework_detection();
    init_protocol();
    init_load();
    init_event_listener_opts();
    init_runtime();
    init_aggregate_base();
    init_iframe();
    init_harvest_metadata();
    Aggregate3 = class extends AggregateBase {
      static featureName = FEATURE_NAME2;
      constructor(agentRef) {
        super(agentRef, FEATURE_NAME2);
        this.harvestOpts.aggregatorTypes = ["cm", "sm"];
        this.harvestMetadata = {};
        this.harvestOpts.beforeUnload = () => {
          evaluateHarvestMetadata(this.harvestMetadata).forEach((smTag) => {
            this.storeSupportabilityMetrics(smTag);
          });
        };
        this.agentNonce = isBrowserScope && document.currentScript?.nonce;
        this.waitForFlags(["err"]).then(([errFlag]) => {
          if (errFlag) {
            this.singleChecks();
            this.eachSessionChecks();
            this.drain();
          } else {
            this.blocked = true;
            this.deregisterDrain();
          }
        });
        defaultRegister(SUPPORTABILITY_METRIC_CHANNEL, this.storeSupportabilityMetrics.bind(this), this.featureName, this.ee);
        defaultRegister(CUSTOM_METRIC_CHANNEL, this.storeEventMetrics.bind(this), this.featureName, this.ee);
      }
      preHarvestChecks(opts) {
        return this.drained && opts.isFinalHarvest;
      }
      // only allow any metrics to be sent after we get the right RUM flag and only on EoL
      storeSupportabilityMetrics(name, value) {
        if (this.blocked) return;
        const type = SUPPORTABILITY_METRIC;
        const params = {
          name
        };
        this.events.addMetric(type, name, params, value);
      }
      storeEventMetrics(name, metrics) {
        if (this.blocked) return;
        const type = CUSTOM_METRIC;
        const params = {
          name
        };
        this.events.add([type, name, params, metrics]);
      }
      singleChecks() {
        const {
          distMethod,
          loaderType
        } = this.agentRef.runtime;
        const {
          proxy,
          privacy
        } = this.agentRef.init;
        if (loaderType) this.storeSupportabilityMetrics("Generic/LoaderType/".concat(loaderType, "/Detected"));
        if (distMethod) this.storeSupportabilityMetrics("Generic/DistMethod/".concat(distMethod, "/Detected"));
        if (isBrowserScope) {
          this.storeSupportabilityMetrics("Generic/Runtime/Browser/Detected");
          if (this.agentNonce && this.agentNonce !== "") {
            this.storeSupportabilityMetrics("Generic/Runtime/Nonce/Detected");
          }
          onDOMContentLoaded(() => {
            getFrameworks().forEach((framework) => {
              this.storeSupportabilityMetrics("Framework/" + framework + "/Detected");
            });
          });
          if (!privacy.cookies_enabled) this.storeSupportabilityMetrics("Config/SessionTracking/Disabled");
        } else if (isWorkerScope) {
          this.storeSupportabilityMetrics("Generic/Runtime/Worker/Detected");
        } else {
          this.storeSupportabilityMetrics("Generic/Runtime/Unknown/Detected");
        }
        if (isFileProtocol()) {
          this.storeSupportabilityMetrics("Generic/FileProtocol/Detected");
        }
        if (this.obfuscator.obfuscateConfigRules.length > 0) {
          this.storeSupportabilityMetrics("Generic/Obfuscate/Detected");
        }
        if (proxy.assets) this.storeSupportabilityMetrics("Config/AssetsUrl/Changed");
        if (proxy.beacon) this.storeSupportabilityMetrics("Config/BeaconUrl/Changed");
        if (isBrowserScope && window.MutationObserver) {
          if (isIFrameWindow(window)) {
            this.storeSupportabilityMetrics("Generic/Runtime/IFrame/Detected");
          }
          const preExistingVideos = window.document.querySelectorAll("video").length;
          if (preExistingVideos) this.storeSupportabilityMetrics("Generic/VideoElement/Added", preExistingVideos);
          const preExistingIframes = window.document.querySelectorAll("iframe").length;
          if (preExistingIframes) this.storeSupportabilityMetrics("Generic/IFrame/Added", preExistingIframes);
          const mo = new MutationObserver((records) => {
            records.forEach((record2) => {
              record2.addedNodes.forEach((addedNode) => {
                if (addedNode instanceof HTMLVideoElement) {
                  this.storeSupportabilityMetrics("Generic/VideoElement/Added", 1);
                }
                if (addedNode instanceof HTMLIFrameElement) {
                  this.storeSupportabilityMetrics("Generic/IFrame/Added", 1);
                }
              });
            });
          });
          mo.observe(window.document.body, {
            childList: true,
            subtree: true
          });
        }
        if (navigator.webdriver) this.storeSupportabilityMetrics("Generic/WebDriver/Detected");
        defaultRegister("harvest-metadata", (harvestMetadataObject = {}) => {
          try {
            Object.keys(harvestMetadataObject).forEach((key) => {
              Object.assign(this.harvestMetadata[key] ??= {}, harvestMetadataObject[key]);
            });
          } catch (e2) {
          }
        }, this.featureName, this.ee);
      }
      eachSessionChecks() {
        if (!isBrowserScope) return;
        windowAddEventListener("pageshow", (evt) => {
          if (evt?.persisted) {
            this.storeSupportabilityMetrics("Generic/BFCache/PageRestored");
          }
        });
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/constants.js
var FEATURE_NAME6;
var init_constants9 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/constants.js"() {
    init_features();
    FEATURE_NAME6 = FEATURE_NAMES.jserrors;
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/util/v2.js
function getVersion2Attributes(target, aggregateInstance) {
  if (aggregateInstance?.harvestEndpointVersion !== 2) return {};
  const containerAgentEntityGuid = aggregateInstance.agentRef.runtime.appMetadata.agents[0].entityGuid;
  if (!target) {
    return {
      "entity.guid": containerAgentEntityGuid,
      appId: aggregateInstance.agentRef.info.applicationID
    };
  }
  return {
    "source.id": target.id,
    "source.name": target.name,
    "source.type": target.type,
    "parent.id": target.parent?.id || containerAgentEntityGuid,
    "parent.type": target.parent?.type || V2_TYPES.BA
  };
}
var V2_TYPES;
var init_v2 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/util/v2.js"() {
    V2_TYPES = {
      /** Micro Frontend */
      MFE: "MFE",
      /** Browser Application */
      BA: "BA"
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/logging/shared/utils.js
function bufferLog(ee2, message, customAttributes = {}, level = LOG_LEVELS.INFO, autoCaptured = true, target, timestamp = now()) {
  handle(SUPPORTABILITY_METRIC_CHANNEL, ["API/logging/".concat(level.toLowerCase(), "/called")], void 0, FEATURE_NAMES.metrics, ee2);
  handle(LOGGING_EVENT_EMITTER_CHANNEL, [timestamp, message, customAttributes, level, autoCaptured, target], void 0, FEATURE_NAMES.logging, ee2);
}
function isValidLogLevel(level) {
  if (typeof level !== "string") return false;
  return Object.values(LOG_LEVELS).some((logLevel) => logLevel === level.toUpperCase().trim());
}
var init_utils2 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/logging/shared/utils.js"() {
    init_handle();
    init_now();
    init_features();
    init_constants4();
    init_constants5();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/util/browser-stack-matchers.js
var classNameRegex, chromeEval, ieEval, chrome, gecko;
var init_browser_stack_matchers = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/util/browser-stack-matchers.js"() {
    classNameRegex = /function (.+?)\s*\(/;
    chromeEval = /^\s*at .+ \(eval at \S+ \((?:(?:file|http|https):[^)]+)?\)(?:, [^:]*:\d+:\d+)?\)$/i;
    ieEval = /^\s*at Function code \(Function code:\d+:\d+\)\s*/i;
    chrome = /^\s*at (?:((?:\[object object\])?(?:[^(]*\([^)]*\))*[^()]*(?: \[as \S+\])?) )?\(?((?:file|http|https|chrome-extension):.*?)?:(\d+)(?::(\d+))?\)?\s*$/i;
    gecko = /^\s*(?:([^@]*)(?:\(.*?\))?@)?((?:file|http|https|chrome|safari-extension).*?):(\d+)(?::(\d+))?\s*$/i;
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/aggregate/canonical-function-name.js
function canonicalFunctionName(functionNameString) {
  if (!functionNameString) return;
  const match = functionNameString.match(canonicalFunctionNameRe);
  if (match) return match[1];
}
var canonicalFunctionNameRe;
var init_canonical_function_name = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/aggregate/canonical-function-name.js"() {
    canonicalFunctionNameRe = /([a-z0-9]+)$/i;
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/aggregate/format-stack-trace.js
function formatStackTrace(stackLines) {
  return truncateStackLines(stackLines).replace(stripNewlinesRegex, "");
}
function truncateStackLines(stackLines) {
  var stackString;
  if (stackLines.length > 100) {
    var truncatedLines = stackLines.length - 100;
    stackString = stackLines.slice(0, 50).join("\n");
    stackString += "\n< ...truncated " + truncatedLines + " lines... >\n";
    stackString += stackLines.slice(-50).join("\n");
  } else {
    stackString = stackLines.join("\n");
  }
  return stackString;
}
function truncateSize(stackString) {
  return stackString.length > MAX_STACK_TRACE_LENGTH ? stackString.substr(0, MAX_STACK_TRACE_LENGTH) : stackString;
}
var stripNewlinesRegex, MAX_STACK_TRACE_LENGTH;
var init_format_stack_trace = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/aggregate/format-stack-trace.js"() {
    stripNewlinesRegex = /^\n+|\n+$/g;
    MAX_STACK_TRACE_LENGTH = 65530;
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/url/canonicalize-url.js
function canonicalizeUrl(url) {
  if (typeof url !== "string") return "";
  const cleanedUrl = cleanURL(url);
  const cleanedGlobalScopeUrl = cleanURL(initialLocation);
  if (cleanedUrl === cleanedGlobalScopeUrl) {
    return "<inline>";
  } else {
    return cleanedUrl;
  }
}
var init_canonicalize_url = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/url/canonicalize-url.js"() {
    init_runtime();
    init_clean_url();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/aggregate/compute-stack-trace.js
function computeStackTrace(ex) {
  var stack = null;
  try {
    stack = computeStackTraceFromStackProp(ex);
    if (stack) {
      return stack;
    }
  } catch (e2) {
    if (debug) {
      throw e2;
    }
  }
  try {
    stack = computeStackTraceBySourceAndLine(ex);
    if (stack) {
      return stack;
    }
  } catch (e2) {
    if (debug) {
      throw e2;
    }
  }
  try {
    stack = computeStackTraceWithMessageOnly(ex);
    if (stack) {
      return stack;
    }
  } catch (e2) {
    if (debug) {
      throw e2;
    }
  }
  return {
    mode: "failed",
    stackString: "",
    frames: []
  };
}
function computeStackTraceFromStackProp(ex) {
  if (!ex.stack) {
    return null;
  }
  var errorInfo = ex.stack.split("\n").reduce(parseStackProp, {
    frames: [],
    stackLines: [],
    wrapperSeen: false
  });
  if (!errorInfo.frames.length) return null;
  return {
    mode: "stack",
    name: ex.name || getClassName(ex),
    message: ex.message,
    stackString: formatStackTrace(errorInfo.stackLines),
    frames: errorInfo.frames
  };
}
function parseStackProp(info, line) {
  let element = getStackElement(line);
  if (!element) {
    info.stackLines.push(line);
    return info;
  }
  if (isNrWrapper(element.func)) info.wrapperSeen = true;
  if (!info.wrapperSeen) {
    let canonicalUrl = canonicalizeUrl(element.url);
    if (canonicalUrl !== element.url) {
      line = line.replace(element.url, canonicalUrl);
      element.url = canonicalUrl;
    }
    info.stackLines.push(line);
    info.frames.push(element);
  }
  return info;
}
function getStackElement(line) {
  var parts = line.match(gecko);
  if (!parts) parts = line.match(chrome);
  if (parts) {
    return {
      url: parts[2],
      func: parts[1] !== "Anonymous function" && parts[1] !== "global code" && parts[1] || null,
      line: +parts[3],
      column: parts[4] ? +parts[4] : null
    };
  }
  if (line.match(chromeEval) || line.match(ieEval) || line === "anonymous") {
    return {
      func: "evaluated code"
    };
  }
}
function computeStackTraceBySourceAndLine(ex) {
  if (!("line" in ex)) return null;
  var className = ex.name || getClassName(ex);
  if (!ex.sourceURL) {
    return {
      mode: "sourceline",
      name: className,
      message: ex.message,
      stackString: className + ": " + ex.message + "\n    in evaluated code",
      frames: [{
        func: "evaluated code"
      }]
    };
  }
  var canonicalUrl = canonicalizeUrl(ex.sourceURL);
  var stackString = className + ": " + ex.message + "\n    at " + canonicalUrl;
  if (ex.line) {
    stackString += ":" + ex.line;
    if (ex.column) {
      stackString += ":" + ex.column;
    }
  }
  return {
    mode: "sourceline",
    name: className,
    message: ex.message,
    stackString,
    frames: [{
      url: canonicalUrl,
      line: ex.line,
      column: ex.column
    }]
  };
}
function computeStackTraceWithMessageOnly(ex) {
  var className = ex.name || getClassName(ex);
  if (!className) return null;
  return {
    mode: "nameonly",
    name: className,
    message: ex.message,
    stackString: className + ": " + ex.message,
    frames: []
  };
}
function getClassName(obj2) {
  var results = classNameRegex.exec(String(obj2.constructor));
  return results && results.length > 1 ? results[1] : "unknown";
}
function isNrWrapper(functionName) {
  return functionName && functionName.indexOf("nrWrapper") >= 0;
}
var debug;
var init_compute_stack_trace = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/aggregate/compute-stack-trace.js"() {
    init_format_stack_trace();
    init_canonicalize_url();
    init_browser_stack_matchers();
    debug = false;
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/aggregate/string-hash-code.js
function stringHashCode(string) {
  var hash = 0;
  var charVal;
  if (!string || !string.length) return hash;
  for (var i2 = 0; i2 < string.length; i2++) {
    charVal = string.charCodeAt(i2);
    hash = (hash << 5) - hash + charVal;
    hash = hash | 0;
  }
  return hash;
}
var init_string_hash_code = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/aggregate/string-hash-code.js"() {
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/aggregate/internal-errors.js
function evaluateInternalError(stackInfo, internal, reason) {
  const output = {
    shouldSwallow: internal || false,
    reason: reason || "Other"
  };
  const leadingFrame = stackInfo.frames?.[0];
  if (!leadingFrame || typeof stackInfo?.message !== "string") return output;
  const isNrRecorder = leadingFrame?.url?.match(/nr-(.*)-recorder.min.js/);
  const isRrweb = leadingFrame?.url?.match(/rrweb/);
  const isMaybeNrRecorder = leadingFrame?.url?.match(/recorder/);
  const isSecurityPolicyAPIError = stackInfo.message.toLowerCase().match(/an attempt was made to break through the security policy of the user agent/);
  if (!!isNrRecorder || !!isRrweb) {
    output.shouldSwallow = true;
    output.reason = REASON_RRWEB;
    if (isSecurityPolicyAPIError) output.reason += "-" + REASON_SECURITY_POLICY;
  } else if (!!isMaybeNrRecorder && isSecurityPolicyAPIError) {
    output.shouldSwallow = true;
    output.reason = REASON_RRWEB + "-" + REASON_SECURITY_POLICY;
  }
  return output;
}
var REASON_RRWEB, REASON_SECURITY_POLICY;
var init_internal_errors = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/aggregate/internal-errors.js"() {
    REASON_RRWEB = "Rrweb";
    REASON_SECURITY_POLICY = "Security-Policy";
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/aggregate/cause-string.js
function buildCauseString(err2) {
  let causeStackString = "";
  if (!err2?.cause) return causeStackString;
  if (err2.cause instanceof Error) {
    const stackInfo = computeStackTrace(err2.cause);
    causeStackString = stackInfo.stackString || err2.cause.stack;
    if (stackInfo.message && !causeStackString.includes(stackInfo.message)) causeStackString = stackInfo.message + "\n" + causeStackString;
    if (stackInfo.name && !causeStackString.includes(stackInfo.name)) causeStackString = stackInfo.name + ": " + causeStackString;
  } else causeStackString = typeof err2.cause === "string" ? err2.cause : stringify(err2.cause);
  causeStackString ||= err2.cause.toString();
  return causeStackString;
}
var init_cause_string = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/aggregate/cause-string.js"() {
    init_stringify();
    init_compute_stack_trace();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/aggregate/index.js
var aggregate_exports4 = {};
__export(aggregate_exports4, {
  Aggregate: () => Aggregate4
});
var Aggregate4;
var init_aggregate4 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/aggregate/index.js"() {
    init_canonical_function_name();
    init_compute_stack_trace();
    init_string_hash_code();
    init_format_stack_trace();
    init_register_handler();
    init_stringify();
    init_handle();
    init_runtime();
    init_constants9();
    init_features();
    init_aggregate_base();
    init_now();
    init_traverse();
    init_internal_errors();
    init_v2();
    init_cause_string();
    Aggregate4 = class extends AggregateBase {
      static featureName = FEATURE_NAME6;
      constructor(agentRef) {
        super(agentRef, FEATURE_NAME6);
        this.harvestOpts.aggregatorTypes = ["err", "ierr", "xhr"];
        this.stackReported = {};
        this.observedAt = {};
        this.pageviewReported = {};
        this.errorOnPage = false;
        defaultRegister("err", (...args) => this.storeError(...args), this.featureName, this.ee);
        defaultRegister("ierr", (...args) => this.storeError(...args), this.featureName, this.ee);
        defaultRegister("returnJserror", (jsErrorEvent, softNavAttrs) => this.#storeJserrorForHarvest(jsErrorEvent, softNavAttrs), this.featureName, this.ee);
        this.waitForFlags(["err"]).then(([errFlag]) => {
          if (errFlag) {
            this.drain();
          } else {
            this.blocked = true;
            this.deregisterDrain();
          }
        });
      }
      serializer(aggregatorTypeToBucketsMap) {
        return applyFnToProps(aggregatorTypeToBucketsMap, this.obfuscator.obfuscateString.bind(this.obfuscator), "string");
      }
      queryStringsBuilder(aggregatorTakeReturnedData) {
        const qs2 = {};
        const releaseIds = stringify(this.agentRef.runtime.releaseIds);
        if (releaseIds !== "{}") qs2.ri = releaseIds;
        if (aggregatorTakeReturnedData?.err?.length) {
          if (!this.errorOnPage) {
            qs2.pve = "1";
            this.errorOnPage = true;
          }
          if (!this.agentRef.features?.[FEATURE_NAMES.sessionReplay]?.featAggregate?.replayIsActive()) aggregatorTakeReturnedData.err.forEach((error) => delete error.params.hasReplay);
        }
        return qs2;
      }
      /**
       * Builds a standardized stack trace string from the frames in the given `stackInfo` object, with each frame separated
       * by a newline character. Lines take the form `<functionName>@<url>:<lineNumber>`.
       *
       * @param {StackInfo} stackInfo - An object specifying a stack string and individual frames.
       * @returns {string} A canonical stack string built from the URLs and function names in the given `stackInfo` object.
       */
      buildCanonicalStackString(stackInfo) {
        var canonicalStackString = "";
        for (var i2 = 0; i2 < stackInfo.frames.length; i2++) {
          var frame = stackInfo.frames[i2];
          var func = canonicalFunctionName(frame.func);
          if (canonicalStackString) canonicalStackString += "\n";
          if (func) canonicalStackString += func + "@";
          if (typeof frame.url === "string") canonicalStackString += frame.url;
          if (frame.line) canonicalStackString += ":" + frame.line;
        }
        return canonicalStackString;
      }
      /**
       *
       * @param {Error|UncaughtError} err The error instance to be processed
       * @param {number} time the relative ms (to origin) timestamp of occurrence
       * @param {boolean=} internal if the error was "caught" and deemed "internal" before reporting to the jserrors feature
       * @param {object=} customAttributes  any custom attributes to be included in the error payload
       * @param {boolean=} hasReplay a flag indicating if the error occurred during a replay session
       * @param {string=} swallowReason a string indicating pre-defined reason if swallowing the error.  Mainly used by the internal error SMs.
       * @param {object=} target the target to buffer and harvest to, if undefined the default configuration target is used
       * @returns
       */
      storeError(err2, time, internal, customAttributes, hasReplay, swallowReason, target) {
        if (!err2) return;
        time = time || now();
        let filterOutput;
        if (!internal && this.agentRef.runtime.onerror) {
          filterOutput = this.agentRef.runtime.onerror(err2);
          if (filterOutput && !(typeof filterOutput.group === "string" && filterOutput.group.length)) {
            return;
          }
        }
        var stackInfo = computeStackTrace(err2);
        const {
          shouldSwallow,
          reason
        } = evaluateInternalError(stackInfo, internal, swallowReason);
        if (shouldSwallow) {
          this.reportSupportabilityMetric("Internal/Error/" + reason);
          return;
        }
        var canonicalStackString = this.buildCanonicalStackString(stackInfo);
        const causeStackString = buildCauseString(err2);
        const params = {
          stackHash: stringHashCode(canonicalStackString),
          exceptionClass: stackInfo.name,
          request_uri: globalScope?.location.pathname,
          ...causeStackString && {
            cause: causeStackString
          }
        };
        if (stackInfo.message) params.message = "" + stackInfo.message;
        if (filterOutput?.group) params.errorGroup = filterOutput.group;
        if (hasReplay && !target) params.hasReplay = hasReplay;
        var bucketHash = stringHashCode("".concat(stackInfo.name, "_").concat(stackInfo.message, "_").concat(stackInfo.stackString, "_").concat(params.hasReplay ? 1 : 0, "_").concat(target?.id || "container"));
        if (!this.stackReported[bucketHash]) {
          this.stackReported[bucketHash] = true;
          params.stack_trace = truncateSize(stackInfo.stackString);
          this.observedAt[bucketHash] = Math.floor(this.agentRef.runtime.timeKeeper.correctRelativeTimestamp(time));
        } else {
          params.browser_stack_hash = stringHashCode(stackInfo.stackString);
        }
        params.releaseIds = stringify(this.agentRef.runtime.releaseIds);
        if (!this.pageviewReported[bucketHash]) {
          params.pageview = 1;
          this.pageviewReported[bucketHash] = true;
        }
        params.firstOccurrenceTimestamp = this.observedAt[bucketHash];
        params.timestamp = Math.floor(this.agentRef.runtime.timeKeeper.correctRelativeTimestamp(time));
        var type = "err";
        var newMetrics = {
          time
        };
        const jsErrorEvent = [type, bucketHash, params, newMetrics, customAttributes];
        if (!target) handle("trace-jserror", jsErrorEvent, void 0, FEATURE_NAMES.sessionTrace, this.ee);
        if (this.blocked) return;
        if (err2.__newrelic?.[this.agentIdentifier]) {
          params._interactionId = err2.__newrelic[this.agentIdentifier].interactionId;
          params._interactionNodeId = err2.__newrelic[this.agentIdentifier].interactionNodeId;
        }
        if (err2.__newrelic?.socketId) {
          customAttributes.socketId = err2.__newrelic.socketId;
        }
        if (!target) {
          const softNavInUse = Boolean(this.agentRef.features?.[FEATURE_NAMES.softNav]);
          if (softNavInUse) {
            handle("jserror", [jsErrorEvent], void 0, FEATURE_NAMES.softNav, this.ee);
          } else {
            this.#storeJserrorForHarvest(jsErrorEvent, false);
          }
        }
        if (target) this.#storeJserrorForHarvest([...jsErrorEvent, target], false, params._softNavAttributes);
      }
      #storeJserrorForHarvest(errorInfoArr, softNavCustomAttrs = {}) {
        let [type, bucketHash, params, newMetrics, localAttrs, target] = errorInfoArr;
        const allCustomAttrs = {
          /** MFE specific attributes if in "multiple" mode (ie consumer version 2) */
          ...getVersion2Attributes(target, this)
        };
        Object.entries(this.agentRef.info.jsAttributes).forEach(([k2, v2]) => setCustom(k2, v2));
        Object.entries(softNavCustomAttrs).forEach(([k2, v2]) => setCustom(k2, v2));
        if (params.browserInteractionId) bucketHash += params.browserInteractionId;
        if (localAttrs) Object.entries(localAttrs).forEach(([k2, v2]) => setCustom(k2, v2));
        const jsAttributesHash = stringHashCode(stringify(allCustomAttrs));
        const aggregateHash = bucketHash + ":" + jsAttributesHash;
        this.events.add([type, aggregateHash, params, newMetrics, allCustomAttrs]);
        function setCustom(key, val) {
          allCustomAttrs[key] = val && typeof val === "object" ? stringify(val) : val;
        }
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/url/parse-url.js
function parseUrl(url) {
  if ((url || "").indexOf("data:") === 0) {
    return {
      protocol: "data"
    };
  }
  try {
    const parsedUrl = new URL(url, location.href);
    const returnVal = {
      port: parsedUrl.port,
      hostname: parsedUrl.hostname,
      pathname: parsedUrl.pathname,
      search: parsedUrl.search,
      protocol: parsedUrl.protocol.slice(0, parsedUrl.protocol.indexOf(":")),
      sameOrigin: parsedUrl.protocol === globalScope?.location?.protocol && parsedUrl.host === globalScope?.location?.host
    };
    if (!returnVal.port || returnVal.port === "") {
      if (parsedUrl.protocol === "http:") returnVal.port = "80";
      if (parsedUrl.protocol === "https:") returnVal.port = "443";
    }
    if (!returnVal.pathname || returnVal.pathname === "") {
      returnVal.pathname = "/";
    } else if (!returnVal.pathname.startsWith("/")) {
      returnVal.pathname = "/".concat(returnVal.pathname);
    }
    return returnVal;
  } catch (err2) {
    return {};
  }
}
var init_parse_url = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/url/parse-url.js"() {
    init_runtime();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/ajax/constants.js
var FEATURE_NAME7;
var init_constants10 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/ajax/constants.js"() {
    init_features();
    FEATURE_NAME7 = FEATURE_NAMES.ajax;
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/deny-list/deny-list.js
function shouldCollectEvent(params) {
  if (!params || hasUndefinedHostname(params)) return false;
  if (denyList.length === 0) return true;
  if (denyList[0].hostname === "*") return false;
  for (var i2 = 0; i2 < denyList.length; i2++) {
    var parsed = denyList[i2];
    if (parsed.hostname.test(params.hostname) && parsed.pathname.test(params.pathname)) {
      return false;
    }
  }
  return true;
}
function hasUndefinedHostname(params) {
  return params.hostname === void 0;
}
function setDenyList(denyListConfig) {
  denyList = [];
  if (!denyListConfig || !denyListConfig.length) {
    return;
  }
  for (var i2 = 0; i2 < denyListConfig.length; i2++) {
    let url = denyListConfig[i2];
    if (!url) continue;
    if (url === "*") {
      denyList = [{
        hostname: "*"
      }];
      return;
    }
    if (url.indexOf("http://") === 0) {
      url = url.substring(7);
    } else if (url.indexOf("https://") === 0) {
      url = url.substring(8);
    }
    const firstSlash = url.indexOf("/");
    let host2, pathname;
    if (firstSlash > 0) {
      host2 = url.substring(0, firstSlash);
      pathname = url.substring(firstSlash);
    } else {
      host2 = url;
      pathname = "*";
    }
    let [hostname] = host2.split(":");
    denyList.push({
      hostname: convertToRegularExpression(hostname),
      pathname: convertToRegularExpression(pathname, true)
    });
  }
}
function convertToRegularExpression(filter, isPathname = false) {
  const newFilter = filter.replace(/[.+?^${}()|[\]\\]/g, (m2) => "\\" + m2).replace(/\*/g, ".*?");
  return new RegExp((isPathname ? "^" : "") + newFilter + "$");
}
var denyList;
var init_deny_list = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/deny-list/deny-list.js"() {
    denyList = [];
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/util/type-check.js
function isPureObject(obj2) {
  return obj2?.constructor === {}.constructor;
}
var init_type_check = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/util/type-check.js"() {
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/ajax/aggregate/gql.js
function parseGQL({
  body,
  query
} = {}) {
  if (!body && !query) return;
  try {
    const gqlBody = parseBatchGQL(parseGQLContents(body));
    if (gqlBody) return gqlBody;
    const gqlQuery = parseSingleGQL(parseGQLQueryString(query));
    if (gqlQuery) return gqlQuery;
  } catch (err2) {
  }
}
function parseSingleGQL(contents) {
  if (typeof contents !== "object" || !contents.query || typeof contents.query !== "string") return;
  const matches = contents.query.trim().match(/^(query|mutation|subscription)\s?(\w*)/);
  const operationType = matches?.[1];
  if (!operationType) return;
  const operationName = contents.operationName || matches?.[2] || "Anonymous";
  return {
    operationName,
    // the operation name of the indiv query
    operationType,
    // query, mutation, or subscription,
    operationFramework: "GraphQL"
  };
}
function parseBatchGQL(contents) {
  if (!contents) return;
  if (!Array.isArray(contents)) contents = [contents];
  const opNames = [];
  const opTypes = [];
  for (let content of contents) {
    const operation = parseSingleGQL(content);
    if (!operation) continue;
    opNames.push(operation.operationName);
    opTypes.push(operation.operationType);
  }
  if (!opTypes.length) return;
  return {
    operationName: opNames.join(","),
    // the operation name of the indiv query -- joined by ',' for batched results
    operationType: opTypes.join(","),
    // query, mutation, or subscription -- joined by ',' for batched results
    operationFramework: "GraphQL"
  };
}
function parseGQLContents(gqlContents) {
  let contents;
  if (!gqlContents || typeof gqlContents !== "string" && typeof gqlContents !== "object") return;
  else if (typeof gqlContents === "string") contents = JSON.parse(gqlContents);
  else contents = gqlContents;
  if (!isPureObject(contents) && !Array.isArray(contents)) return;
  let isValid2 = false;
  if (Array.isArray(contents)) isValid2 = contents.some((x3) => validateGQLObject(x3));
  else isValid2 = validateGQLObject(contents);
  if (!isValid2) return;
  return contents;
}
function parseGQLQueryString(gqlQueryString) {
  if (!gqlQueryString || typeof gqlQueryString !== "string") return;
  const params = new URLSearchParams(gqlQueryString);
  return parseGQLContents(Object.fromEntries(params));
}
function validateGQLObject(obj2) {
  return !(typeof obj2 !== "object" || !obj2.query || typeof obj2.query !== "string");
}
var init_gql = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/ajax/aggregate/gql.js"() {
    init_type_check();
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/ajax/aggregate/index.js
var aggregate_exports5 = {};
__export(aggregate_exports5, {
  Aggregate: () => Aggregate5
});
var Aggregate5;
var init_aggregate5 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/ajax/aggregate/index.js"() {
    init_register_handler();
    init_stringify();
    init_handle();
    init_deny_list();
    init_constants10();
    init_features();
    init_aggregate_base();
    init_gql();
    init_bel_serializer();
    init_nreum();
    Aggregate5 = class extends AggregateBase {
      static featureName = FEATURE_NAME7;
      constructor(agentRef) {
        super(agentRef, FEATURE_NAME7);
        setDenyList(agentRef.runtime.denyList);
        const classThis = this;
        if (!agentRef.init.ajax.block_internal) {
          super.canHarvestEarly = false;
        } else {
          super.customAttributesAreSeparate = true;
        }
        defaultRegister("returnAjax", (event) => this.events.add(event), this.featureName, this.ee);
        defaultRegister("xhr", function() {
          classThis.storeXhr(...arguments, this);
        }, this.featureName, this.ee);
        this.ee.on("long-task", (task, originator) => {
          if (originator instanceof gosNREUMOriginals().o.XHR) {
            const xhrMetadata = this.ee.context(originator);
            xhrMetadata.latestLongtaskEnd = task.end;
          }
        });
        this.waitForFlags([]).then(() => this.drain());
      }
      storeXhr(params, metrics, startTime, endTime, type, ctx) {
        metrics.time = startTime;
        let hash;
        if (params.cat) {
          hash = stringify([params.status, params.cat]);
        } else {
          hash = stringify([params.status, params.host, params.pathname]);
        }
        const shouldCollect = shouldCollectEvent(params);
        const shouldOmitAjaxMetrics = this.agentRef.init.feature_flags?.includes("ajax_metrics_deny_list");
        const jserrorsInUse = Boolean(this.agentRef.features?.[FEATURE_NAMES.jserrors]);
        if (jserrorsInUse && (shouldCollect || !shouldOmitAjaxMetrics)) {
          this.agentRef.sharedAggregator?.add(["xhr", hash, params, metrics]);
        }
        if (!shouldCollect) {
          if (params.hostname === this.agentRef.info.errorBeacon || this.agentRef.init.proxy?.beacon && params.hostname === this.agentRef.init.proxy.beacon) {
            this.reportSupportabilityMetric("Ajax/Events/Excluded/Agent");
            if (shouldOmitAjaxMetrics) this.reportSupportabilityMetric("Ajax/Metrics/Excluded/Agent");
          } else {
            this.reportSupportabilityMetric("Ajax/Events/Excluded/App");
            if (shouldOmitAjaxMetrics) this.reportSupportabilityMetric("Ajax/Metrics/Excluded/App");
          }
          return;
        }
        handle("bstXhrAgg", ["xhr", hash, params, metrics], void 0, FEATURE_NAMES.sessionTrace, this.ee);
        const event = {
          method: params.method,
          status: params.status,
          domain: params.host,
          path: params.pathname,
          requestSize: metrics.txSize,
          responseSize: metrics.rxSize,
          type,
          startTime,
          endTime,
          callbackDuration: metrics.cbTime
        };
        if (ctx.dt) {
          event.spanId = ctx.dt.spanId;
          event.traceId = ctx.dt.traceId;
          event.spanTimestamp = Math.floor(this.agentRef.runtime.timeKeeper.correctAbsoluteTimestamp(ctx.dt.timestamp));
        }
        event.gql = params.gql = parseGQL({
          body: ctx.body,
          query: ctx.parsedOrigin?.search
        });
        if (event.gql) this.reportSupportabilityMetric("Ajax/Events/GraphQL/Bytes-Added", stringify(event.gql).length);
        const softNavInUse = Boolean(this.agentRef.features?.[FEATURE_NAMES.softNav]);
        if (softNavInUse) {
          handle("ajax", [event, ctx], void 0, FEATURE_NAMES.softNav, this.ee);
        } else {
          this.events.add(event);
        }
      }
      serializer(eventBuffer) {
        if (!eventBuffer.length) return;
        const addString = getAddStringContext(this.agentRef.runtime.obfuscator);
        let payload = "bel.7;";
        let firstTimestamp = 0;
        for (let i2 = 0; i2 < eventBuffer.length; i2++) {
          const event = eventBuffer[i2];
          const relativeStartTime = event.startTime - firstTimestamp;
          if (i2 === 0) firstTimestamp = event.startTime;
          const fields = [
            numeric(relativeStartTime),
            numeric(event.endTime - event.startTime),
            numeric(0),
            // callbackEnd
            numeric(0),
            // no callbackDuration for non-SPA events
            addString(event.method),
            numeric(event.status),
            addString(event.domain),
            addString(event.path),
            numeric(event.requestSize),
            numeric(event.responseSize),
            event.type === "fetch" ? 1 : "",
            addString(0),
            // nodeId
            nullable(event.spanId, addString, true) + // guid
            nullable(event.traceId, addString, true) + // traceId
            nullable(event.spanTimestamp, numeric, false)
            // timestamp
          ];
          let insert = "2,";
          const jsAttributes = this.agentRef.info.jsAttributes;
          const attrParts = addCustomAttributes({
            ...jsAttributes || {},
            ...event.gql || {}
          }, addString);
          fields.unshift(numeric(attrParts.length));
          insert += fields.join(",");
          if (attrParts && attrParts.length > 0) {
            insert += ";" + attrParts.join(";");
          }
          if (i2 + 1 < eventBuffer.length) insert += ";";
          payload += insert;
        }
        return payload;
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/session_trace/constants.js
var constants_exports2 = {};
__export(constants_exports2, {
  BST_RESOURCE: () => BST_RESOURCE,
  END: () => END2,
  ERROR_MODE_SECONDS_WINDOW: () => ERROR_MODE_SECONDS_WINDOW,
  FEATURE_NAME: () => FEATURE_NAME8,
  FN_END: () => FN_END,
  FN_START: () => FN_START,
  MAX_NODES_PER_HARVEST: () => MAX_NODES_PER_HARVEST,
  PUSH_STATE: () => PUSH_STATE,
  RESOURCE: () => RESOURCE,
  START: () => START3
});
var FEATURE_NAME8, BST_RESOURCE, RESOURCE, START3, END2, FN_START, FN_END, PUSH_STATE, MAX_NODES_PER_HARVEST, ERROR_MODE_SECONDS_WINDOW;
var init_constants11 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/session_trace/constants.js"() {
    init_features();
    FEATURE_NAME8 = FEATURE_NAMES.sessionTrace;
    BST_RESOURCE = "bstResource";
    RESOURCE = "resource";
    START3 = "-start";
    END2 = "-end";
    FN_START = "fn" + START3;
    FN_END = "fn" + END2;
    PUSH_STATE = "pushState";
    MAX_NODES_PER_HARVEST = 1e3;
    ERROR_MODE_SECONDS_WINDOW = 30 * 1e3;
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/session_trace/aggregate/trace/node.js
var TraceNode;
var init_node = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/session_trace/aggregate/trace/node.js"() {
    TraceNode = class {
      constructor(name, start, end, origin, type) {
        this.n = name;
        this.s = start;
        this.e = end;
        this.o = origin;
        this.t = type;
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/session_trace/aggregate/trace/utils.js
function evtName(type) {
  switch (type) {
    case "keydown":
    case "keyup":
    case "keypress":
      return "typing";
    case "mousemove":
    case "mouseenter":
    case "mouseleave":
    case "mouseover":
    case "mouseout":
      return "mousing";
    case "touchstart":
    case "touchmove":
    case "touchend":
    case "touchcancel":
    case "touchenter":
    case "touchleave":
      return "touching";
    case "scroll":
    case "scrollend":
      return "scrolling";
    default:
      return type;
  }
}
var init_utils3 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/session_trace/aggregate/trace/utils.js"() {
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/session_trace/aggregate/trace/storage.js
var ignoredEvents, SMEARABLES, GAPS, LENGTHS, TraceStorage;
var init_storage = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/session_trace/aggregate/trace/storage.js"() {
    init_constants3();
    init_now();
    init_parse_url();
    init_event_origin();
    init_constants11();
    init_node();
    init_utils3();
    ignoredEvents = {
      // we find that certain events are noisy (and not easily smearable like mousemove) and/or duplicative (like with click vs mousedown/mouseup).
      // These would ONLY ever be tracked in ST if the application has event listeners defined for these events... however, just in case - ignore these anyway.
      global: {
        mouseup: true,
        mousedown: true
      },
      // certain events are present both in the window and in PVT metrics.  PVT metrics are prefered so the window events should be ignored
      window: {
        load: true,
        pagehide: true
      },
      // when ajax instrumentation is disabled, all XMLHttpRequest events will return with origin = xhrOriginMissing and should be ignored
      xhrOriginMissing: {
        ignoreAll: true
      }
    };
    SMEARABLES = {
      typing: "typing",
      scrolling: "scrolling",
      mousing: "mousing",
      touching: "touching"
    };
    GAPS = {
      [SMEARABLES.typing]: 1e3,
      // 1 second gap between typing events
      [SMEARABLES.scrolling]: 100,
      // 100ms gap between scrolling events
      [SMEARABLES.mousing]: 1e3,
      // 1 second gap between mousing events
      [SMEARABLES.touching]: 1e3
      // 1 second gap between touching events
    };
    LENGTHS = {
      [SMEARABLES.typing]: 2e3,
      // 2 seconds max length for typing events
      [SMEARABLES.scrolling]: 1e3,
      // 1 second max length for scrolling events
      [SMEARABLES.mousing]: 2e3,
      // 2 seconds max length for mousing events
      [SMEARABLES.touching]: 2e3
      // 2 seconds max length for touching events
    };
    TraceStorage = class {
      /** prevents duplication of event nodes by keeping a reference of each one seen per harvest cycle */
      prevStoredEvents = /* @__PURE__ */ new Set();
      constructor(parent) {
        this.parent = parent;
      }
      /**
       * Checks if a trace node is smearable with previously stored nodes.
       * @param {TraceNode} stn
       * @returns {boolean} true if the node is smearable, false otherwise
       */
      #isSmearable(stn) {
        return stn.n in SMEARABLES;
      }
      /**
       * Attempts to smear the current trace node with the last stored event in the event buffer.
       * If the last stored event is smearable and matches the current node's origin and type, it will merge the two nodes and return true.
       * If not, it will return false.
       * This is used to reduce the number of smearable trace nodes created for events that occur in quick succession.
       * @param {TraceNode} stn
       * @returns {boolean} true if the node was successfully smeared, false otherwise
       */
      #smear(stn) {
        const matcher = (storedEvent) => {
          return !(storedEvent.o !== stn.o || storedEvent.n !== stn.n || stn.s - storedEvent.s < LENGTHS[stn.o] || storedEvent.e > stn.s - GAPS[stn.o]);
        };
        const smearableData = {
          e: stn.e
        };
        return this.parent.events.merge(matcher, smearableData);
      }
      /**
       * Checks if the event should be ignored based on rules around its type and/or origin.
       * @param {TraceNode} stn
       * @returns {boolean} true if the event should be ignored, false otherwise
       */
      #shouldIgnoreEvent(stn) {
        if (stn.n in ignoredEvents.global) return true;
        const origin = stn.o;
        if (ignoredEvents[origin]?.ignoreAll || ignoredEvents[origin]?.[stn.n]) return true;
        return origin === "xhrOriginMissing" && stn.n === "Ajax";
      }
      /**
       * Checks if a new node can be stored based on the current state of the trace storage class itself as well as the parent class.
       * @returns {boolean} true if a new node can be stored, false otherwise
       */
      #canStoreNewNode() {
        if (this.parent.blocked) return false;
        if (this.parent.events.length >= MAX_NODES_PER_HARVEST) {
          if (this.parent.mode !== MODE.ERROR) return false;
          this.trimSTNsByTime();
          if (this.parent.events.length >= MAX_NODES_PER_HARVEST) this.trimSTNsByIndex(1);
        }
        return true;
      }
      /**
      * Attempts to store a new trace node in the event buffer.
      * @param {TraceNode} stn
      * @returns {boolean} true if the node was successfully stored, false otherwise
      */
      #storeSTN(stn) {
        if (this.#shouldIgnoreEvent(stn) || !this.#canStoreNewNode()) return false;
        if (!this.#isSmearable(stn) || !this.#smear(stn)) this.parent.events.add(stn);
        return true;
      }
      /**
       * Stores a new trace node in the event buffer.
       * @param {TraceNode} node
       * @returns {boolean} true if the node was successfully stored, false otherwise
       */
      storeNode(node2) {
        return this.#storeSTN(node2);
      }
      /**
       * Processes a PVT (Page Visibility Timing) entry.
       * @param {*} name
       * @param {*} value
       * @param {*} attrs
       * @returns {boolean} true if the node was successfully stored, false otherwise
       */
      processPVT(name, value, attrs) {
        return this.storeTiming({
          [name]: value
        });
      }
      /**
       * Stores a timing entry in the event buffer.
       * @param {*} timingEntry
       * @param {*} isAbsoluteTimestamp
       * @returns {boolean} true if ALL possible nodes were successfully stored, false otherwise
       */
      storeTiming(timingEntry, isAbsoluteTimestamp = false) {
        if (!timingEntry) return false;
        let allStored = true;
        for (let key in timingEntry) {
          let val = timingEntry[key];
          const lck = key.toLowerCase();
          if (lck.indexOf("size") >= 0 || lck.indexOf("status") >= 0) continue;
          if (!(typeof val === "number" && val >= 0)) continue;
          val = Math.round(val);
          if (this.parent.timeKeeper && this.parent.timeKeeper.ready && isAbsoluteTimestamp) {
            val = this.parent.timeKeeper.convertAbsoluteTimestamp(Math.floor(this.parent.timeKeeper.correctAbsoluteTimestamp(val)));
          }
          if (!this.#storeSTN(new TraceNode(key, val, val, "document", "timing"))) allStored = false;
        }
        return allStored;
      }
      /**
       * Tracks the events and their listener's duration on objects wrapped by wrap-events.
       * @param {*} currentEvent - the event to be stored
       * @param {*} target - the target of the event
       * @param {*} start - the start time of the event
       * @param {*} end - the end time of the event
       * @returns {boolean} true if the event was successfully stored, false otherwise
       */
      storeEvent(currentEvent, target, start, end) {
        if (this.prevStoredEvents.has(currentEvent) || !this.#canStoreNewNode()) return false;
        this.prevStoredEvents.add(currentEvent);
        const evt = new TraceNode(evtName(currentEvent.type), start, end, void 0, "event");
        try {
          evt.o = eventOrigin(currentEvent.target, target, this.parent.ee);
        } catch (e2) {
          evt.o = eventOrigin(null, target, this.parent.ee);
        }
        return this.#storeSTN(evt);
      }
      /**
       * Tracks when the window history API specified by wrap-history is used.
       * @param {*} path
       * @param {*} old
       * @param {*} time
       * @returns {boolean} true if the history node was successfully stored, false otherwise
       */
      storeHist(path, old, time) {
        return this.#storeSTN(new TraceNode("history.pushState", time, time, path, old));
      }
      /**
       * Processes all the PerformanceResourceTiming entries captured (by observer).
       * @param {*[]} resources
       * @returns {boolean} true if all resource nodes were successfully stored, false otherwise
       */
      storeResources(resources) {
        if (!resources || resources.length === 0) return false;
        let allStored = true;
        for (let i2 = 0; i2 < resources.length; i2++) {
          const currentResource = resources[i2];
          if (!this.#canStoreNewNode()) break;
          const {
            initiatorType,
            fetchStart,
            responseEnd,
            entryType
          } = currentResource;
          const {
            protocol,
            hostname,
            port,
            pathname
          } = parseUrl(currentResource.name);
          const res = new TraceNode(initiatorType, fetchStart | 0, responseEnd | 0, "".concat(protocol, "://").concat(hostname, ":").concat(port).concat(pathname), entryType);
          if (!this.#storeSTN(res)) allStored = false;
        }
        return allStored;
      }
      /**
       * JavascriptError (FEATURE) events pipes into ST here.
       * @param {*} type
       * @param {*} name
       * @param {*} params
       * @param {*} metrics
       * @returns {boolean} true if the error node was successfully stored, false otherwise
       */
      storeErrorAgg(type, name, params, metrics) {
        if (type !== "err") return false;
        return this.#storeSTN(new TraceNode("error", metrics.time, metrics.time, params.message, params.stackHash));
      }
      /**
       * Ajax (FEATURE) events--XML & fetches--pipes into ST here.
       * @param {*} type
       * @param {*} name
       * @param {*} params
       * @param {*} metrics
       * @returns {boolean} true if the Ajax node was successfully stored, false otherwise
       */
      storeXhrAgg(type, name, params, metrics) {
        if (type !== "xhr") return false;
        return this.#storeSTN(new TraceNode("Ajax", metrics.time, metrics.time + metrics.duration, "".concat(params.status, " ").concat(params.method, ": ").concat(params.host).concat(params.pathname), "ajax"));
      }
      /**
       * Trims stored trace nodes in the event buffer by start time.
       * @param {number} lookbackDuration
       * @returns {void}
       */
      trimSTNsByTime(lookbackDuration = ERROR_MODE_SECONDS_WINDOW) {
        this.parent.events.clear({
          clearBeforeTime: Math.max(now - lookbackDuration, 0),
          timestampKey: "e"
        });
      }
      /**
       * Trims stored trace nodes in the event buffer before a given index value.
       * @param {number} index
       * @returns {void}
       */
      trimSTNsByIndex(index3 = 0) {
        this.parent.events.clear({
          clearBeforeIndex: index3
          // trims before index value
        });
      }
      /**
       * clears the stored events in the event buffer.
       * This is used to release references to past events for garbage collection.
       * @returns {void}
       */
      clear() {
        this.prevStoredEvents.clear();
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/session_trace/aggregate/index.js
var aggregate_exports6 = {};
__export(aggregate_exports6, {
  Aggregate: () => Aggregate6
});
var QUERY_PARAM_PADDING, Aggregate6;
var init_aggregate6 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/session_trace/aggregate/index.js"() {
    init_register_handler();
    init_constants11();
    init_aggregate_base();
    init_storage();
    init_encode();
    init_runtime();
    init_constants3();
    init_traverse();
    init_clean_url();
    init_console();
    QUERY_PARAM_PADDING = 5e3;
    Aggregate6 = class extends AggregateBase {
      static featureName = FEATURE_NAME8;
      constructor(agentRef) {
        super(agentRef, FEATURE_NAME8);
        this.harvestOpts.raw = true;
        this.entitled = void 0;
        this.everHarvested = false;
        this.harvesting = false;
        this.traceStorage = new TraceStorage(this);
        this.waitForFlags(["sts", "st"]).then(([stMode, stEntitled]) => this.initialize(stMode, stEntitled));
      }
      /** Sets up event listeners, and initializes this module to run in the correct "mode".  Can be triggered from a few places, but makes an effort to only set up listeners once */
      initialize(stMode, stEntitled, ignoreSession) {
        this.entitled ??= stEntitled;
        if (!this.entitled) this.blocked = true;
        if (this.blocked) return this.deregisterDrain();
        if (!this.initialized) {
          this.initialized = true;
          this.ptid = this.agentRef.runtime.ptid;
          this.sessionId = this.agentRef.runtime.session?.state.value;
          this.ee.on(SESSION_EVENTS.RESET, () => {
            if (this.blocked) return;
            this.abort(1);
          });
          this.ee.on(SESSION_EVENTS.UPDATE, (eventType, sessionState) => {
            if (this.blocked) return;
            if (this.mode !== MODE.FULL && (sessionState.sessionReplayMode === MODE.FULL || sessionState.sessionTraceMode === MODE.FULL)) this.switchToFull();
            if (this.sessionId !== sessionState.value || eventType === "cross-tab" && sessionState.sessionTraceMode === MODE.OFF) this.abort(2);
          });
          if (supportsNavTimingL2()) {
            this.traceStorage.storeTiming(globalScope.performance?.getEntriesByType?.("navigation")[0]);
          } else {
            this.traceStorage.storeTiming(globalScope.performance?.timing, true);
          }
        }
        if (!this.agentRef.runtime.session.isNew && !ignoreSession) this.mode = this.agentRef.runtime.session.state.sessionTraceMode;
        else this.mode = stMode;
        if (this.mode === MODE.OFF) return this.deregisterDrain();
        this.timeKeeper ??= this.agentRef.runtime.timeKeeper;
        defaultRegister("bst", (...args) => this.traceStorage.storeEvent(...args), this.featureName, this.ee);
        defaultRegister("bstResource", (...args) => this.traceStorage.storeResources(...args), this.featureName, this.ee);
        defaultRegister("bstHist", (...args) => this.traceStorage.storeHist(...args), this.featureName, this.ee);
        defaultRegister("bstXhrAgg", (...args) => this.traceStorage.storeXhrAgg(...args), this.featureName, this.ee);
        defaultRegister("bstApi", (...args) => this.traceStorage.storeNode(...args), this.featureName, this.ee);
        defaultRegister("trace-jserror", (...args) => this.traceStorage.storeErrorAgg(...args), this.featureName, this.ee);
        defaultRegister("pvtAdded", (...args) => this.traceStorage.processPVT(...args), this.featureName, this.ee);
        if (this.mode !== MODE.FULL) {
          defaultRegister("trace-jserror", () => {
            if (this.mode === MODE.ERROR) this.switchToFull();
          }, this.featureName, this.ee);
        }
        this.agentRef.runtime.session.write({
          sessionTraceMode: this.mode
        });
        this.drain();
      }
      preHarvestChecks() {
        if (this.blocked || this.mode !== MODE.FULL) return;
        if (!this.timeKeeper?.ready) return;
        if (!this.agentRef.runtime.session) return;
        if (this.sessionId !== this.agentRef.runtime.session.state.value || this.ptid !== this.agentRef.runtime.ptid) {
          this.abort(3);
          return;
        }
        return true;
      }
      serializer(stns) {
        if (!stns.length) return;
        this.everHarvested = true;
        return applyFnToProps(stns, this.obfuscator.obfuscateString.bind(this.obfuscator), "string");
      }
      queryStringsBuilder(stns) {
        const firstSessionHarvest = !this.agentRef.runtime.session.state.traceHarvestStarted;
        if (firstSessionHarvest) this.agentRef.runtime.session.write({
          traceHarvestStarted: true
        });
        const hasReplay = this.agentRef.runtime.session.state.sessionReplayMode === 1;
        const endUserId = this.agentRef.info.jsAttributes["enduser.id"];
        const entityGuid = this.agentRef.runtime.appMetadata.agents?.[0]?.entityGuid;
        const earliestTimeStamp = stns.reduce((earliest, stn) => Math.min(earliest, stn.s), Infinity);
        const latestTimeStamp = stns.reduce((latest, stn) => Math.max(latest, stn.s), -Infinity);
        return {
          browser_monitoring_key: this.agentRef.info.licenseKey,
          type: "BrowserSessionChunk",
          app_id: this.agentRef.info.applicationID,
          protocol_version: "0",
          timestamp: Math.floor(this.timeKeeper.correctRelativeTimestamp(earliestTimeStamp)),
          attributes: obj({
            ...entityGuid && {
              entityGuid
            },
            harvestId: "".concat(this.agentRef.runtime.session.state.value, "_").concat(this.agentRef.runtime.ptid, "_").concat(this.agentRef.runtime.harvestCount),
            // this section of attributes must be controllable and stay below the query param padding limit -- see QUERY_PARAM_PADDING
            // if not, data could be lost to truncation at time of sending, potentially breaking parsing / API behavior in NR1
            // trace payload metadata
            "trace.firstTimestamp": Math.floor(this.timeKeeper.correctRelativeTimestamp(earliestTimeStamp)),
            "trace.lastTimestamp": Math.floor(this.timeKeeper.correctRelativeTimestamp(latestTimeStamp)),
            "trace.nodes": stns.length,
            "trace.originTimestamp": this.timeKeeper.correctedOriginTime,
            // other payload metadata
            agentVersion: this.agentRef.runtime.version,
            ...firstSessionHarvest && {
              firstSessionHarvest
            },
            ...hasReplay && {
              hasReplay
            },
            ptid: "".concat(this.ptid),
            session: "".concat(this.sessionId),
            // customer-defined data should go last so that if it exceeds the query param padding limit it will be truncated instead of important attrs
            ...endUserId && {
              "enduser.id": this.obfuscator.obfuscateString(endUserId)
            },
            currentUrl: this.obfuscator.obfuscateString(cleanURL("" + location))
            // The Query Param is being arbitrarily limited in length here.  It is also applied when estimating the size of the payload in getPayloadSize()
          }, QUERY_PARAM_PADDING).substring(1)
          // remove the leading '&'
        };
      }
      /** Switch from "off" or "error" to full mode (if entitled) */
      switchToFull() {
        if (this.mode === MODE.FULL || !this.entitled || this.blocked) return;
        const prevMode = this.mode;
        this.mode = MODE.FULL;
        this.agentRef.runtime.session.write({
          sessionTraceMode: this.mode
        });
        if (prevMode === MODE.OFF || !this.initialized) return this.initialize(this.mode, this.entitled);
        if (this.initialized) {
          this.traceStorage.trimSTNsByTime();
          this.agentRef.runtime.harvester.triggerHarvestFor(this);
        }
      }
      /** Stop running for the remainder of the page lifecycle */
      abort(code) {
        warn(60, code);
        this.blocked = true;
        this.mode = MODE.OFF;
        this.agentRef.runtime.session.write({
          sessionTraceMode: this.mode
        });
        this.events.clear();
      }
      postHarvestCleanup(result2) {
        this.traceStorage.clear();
        super.postHarvestCleanup(result2);
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/session_replay/constants.js
var FEATURE_NAME10, ERROR_DURING_REPLAY, AVG_COMPRESSION, RRWEB_EVENT_TYPES, CHECKOUT_MS, ABORT_REASONS, QUERY_PARAM_PADDING2, TRIGGERS;
var init_constants12 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/session_replay/constants.js"() {
    init_constants3();
    init_features();
    FEATURE_NAME10 = FEATURE_NAMES.sessionReplay;
    ERROR_DURING_REPLAY = "errorDuringReplay";
    AVG_COMPRESSION = 0.12;
    RRWEB_EVENT_TYPES = {
      DomContentLoaded: 0,
      Load: 1,
      FullSnapshot: 2,
      IncrementalSnapshot: 3,
      Meta: 4,
      Custom: 5
    };
    CHECKOUT_MS = {
      [MODE.ERROR]: 15e3,
      [MODE.FULL]: 3e5,
      [MODE.OFF]: 0
    };
    ABORT_REASONS = {
      RESET: {
        message: "Session was reset",
        sm: "Reset"
      },
      IMPORT: {
        message: "Recorder failed to import",
        sm: "Import"
      },
      TOO_MANY: {
        message: "429: Too Many Requests",
        sm: "Too-Many"
      },
      TOO_BIG: {
        message: "Payload was too large",
        sm: "Too-Big"
      },
      CROSS_TAB: {
        message: "Session Entity was set to OFF on another tab",
        sm: "Cross-Tab"
      },
      ENTITLEMENTS: {
        message: "Session Replay is not allowed and will not be started",
        sm: "Entitlement"
      }
    };
    QUERY_PARAM_PADDING2 = 5e3;
    TRIGGERS = {
      API: "api",
      RESUME: "resume",
      SWITCH_TO_FULL: "switchToFull",
      INITIALIZE: "initialize",
      PRELOAD: "preload"
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/constants/shared-channel.js
var onReplayReady, sessionReplayInitialized, sharedChannel;
var init_shared_channel = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/constants/shared-channel.js"() {
    sessionReplayInitialized = new Promise((resolve2) => {
      onReplayReady = resolve2;
    });
    sharedChannel = Object.freeze({
      onReplayReady,
      sessionReplayInitialized
    });
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/session_replay/shared/stylesheet-evaluator.js
var StylesheetEvaluator, stylesheetEvaluator;
var init_stylesheet_evaluator = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/session_replay/shared/stylesheet-evaluator.js"() {
    init_nreum();
    init_runtime();
    StylesheetEvaluator = class {
      #evaluated = /* @__PURE__ */ new WeakSet();
      #brokenSheets = [];
      /**
      * Flipped to true if stylesheets that cannot be natively inlined are detected by the stylesheetEvaluator class
      * Used at harvest time to denote that all subsequent payloads are subject to this and customers should be advised to handle crossorigin decoration
      * */
      invalidStylesheetsDetected = false;
      failedToFix = 0;
      /**
       * this works by checking (only ever once) each cssRules obj in the style sheets array. The try/catch will catch an error if the cssRules obj blocks access, triggering the module to try to "fix" the asset`. Returns the count of incomplete assets discovered.
       * @returns {Number}
       */
      evaluate() {
        let incompletes = 0;
        this.#brokenSheets = [];
        if (isBrowserScope) {
          for (let i2 = 0; i2 < Object.keys(document.styleSheets).length; i2++) {
            if (!this.#evaluated.has(document.styleSheets[i2]) && document.styleSheets[i2] instanceof CSSStyleSheet) {
              this.#evaluated.add(document.styleSheets[i2]);
              try {
                const temp = document.styleSheets[i2].cssRules;
              } catch (err2) {
                if (!document.styleSheets[i2].href) return;
                incompletes++;
                this.#brokenSheets.push(document.styleSheets[i2]);
              }
            }
          }
        }
        if (incompletes) this.invalidStylesheetsDetected = true;
        return incompletes;
      }
      /**
       * Resolves promise once all stylesheets have been fetched and overridden
       * @returns {Promise}
       */
      async fix() {
        await Promise.all(this.#brokenSheets.map((sheet) => this.#fetchAndOverride(sheet)));
        this.#brokenSheets = [];
        const failedToFix = this.failedToFix;
        this.failedToFix = 0;
        return failedToFix;
      }
      /**
      * Fetches stylesheet contents and overrides the target getters
      * @param {*} target - The stylesheet object target - ex. document.styleSheets[0]
      * @param {*} href - The asset href to fetch
      * @returns {Promise}
      */
      async #fetchAndOverride(target) {
        if (!target?.href) return;
        try {
          const stylesheetContents = await gosNREUMOriginals().o.FETCH.bind(window)(target.href);
          if (!stylesheetContents.ok) {
            this.failedToFix++;
            return;
          }
          const stylesheetText = await stylesheetContents.text();
          try {
            const cssSheet = new CSSStyleSheet();
            await cssSheet.replace(stylesheetText);
            Object.defineProperty(target, "cssRules", {
              get() {
                return cssSheet.cssRules;
              }
            });
            Object.defineProperty(target, "rules", {
              get() {
                return cssSheet.rules;
              }
            });
          } catch (err2) {
            Object.defineProperty(target, "cssText", {
              get() {
                return stylesheetText;
              }
            });
            this.failedToFix++;
          }
        } catch (err2) {
          this.failedToFix++;
        }
      }
    };
    stylesheetEvaluator = new StylesheetEvaluator();
  }
});

// node_modules/fflate/esm/browser.js
var browser_exports = {};
__export(browser_exports, {
  AsyncCompress: () => AsyncGzip,
  AsyncDecompress: () => AsyncDecompress,
  AsyncDeflate: () => AsyncDeflate,
  AsyncGunzip: () => AsyncGunzip,
  AsyncGzip: () => AsyncGzip,
  AsyncInflate: () => AsyncInflate,
  AsyncUnzipInflate: () => AsyncUnzipInflate,
  AsyncUnzlib: () => AsyncUnzlib,
  AsyncZipDeflate: () => AsyncZipDeflate,
  AsyncZlib: () => AsyncZlib,
  Compress: () => Gzip,
  DecodeUTF8: () => DecodeUTF8,
  Decompress: () => Decompress,
  Deflate: () => Deflate,
  EncodeUTF8: () => EncodeUTF8,
  FlateErrorCode: () => FlateErrorCode,
  Gunzip: () => Gunzip,
  Gzip: () => Gzip,
  Inflate: () => Inflate,
  Unzip: () => Unzip,
  UnzipInflate: () => UnzipInflate,
  UnzipPassThrough: () => UnzipPassThrough,
  Unzlib: () => Unzlib,
  Zip: () => Zip,
  ZipDeflate: () => ZipDeflate,
  ZipPassThrough: () => ZipPassThrough,
  Zlib: () => Zlib,
  compress: () => gzip,
  compressSync: () => gzipSync,
  decompress: () => decompress,
  decompressSync: () => decompressSync,
  deflate: () => deflate,
  deflateSync: () => deflateSync,
  gunzip: () => gunzip,
  gunzipSync: () => gunzipSync,
  gzip: () => gzip,
  gzipSync: () => gzipSync,
  inflate: () => inflate,
  inflateSync: () => inflateSync,
  strFromU8: () => strFromU8,
  strToU8: () => strToU8,
  unzip: () => unzip,
  unzipSync: () => unzipSync,
  unzlib: () => unzlib,
  unzlibSync: () => unzlibSync,
  zip: () => zip,
  zipSync: () => zipSync,
  zlib: () => zlib,
  zlibSync: () => zlibSync
});
function StrmOpt(opts, cb) {
  if (typeof opts == "function")
    cb = opts, opts = {};
  this.ondata = cb;
  return opts;
}
function deflate(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bDflt
  ], function(ev) {
    return pbf(deflateSync(ev.data[0], ev.data[1]));
  }, 0, cb);
}
function deflateSync(data, opts) {
  return dopt(data, opts || {}, 0, 0);
}
function inflate(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bInflt
  ], function(ev) {
    return pbf(inflateSync(ev.data[0], gopt(ev.data[1])));
  }, 1, cb);
}
function inflateSync(data, opts) {
  return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
function gzip(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bDflt,
    gze,
    function() {
      return [gzipSync];
    }
  ], function(ev) {
    return pbf(gzipSync(ev.data[0], ev.data[1]));
  }, 2, cb);
}
function gzipSync(data, opts) {
  if (!opts)
    opts = {};
  var c2 = crc(), l2 = data.length;
  c2.p(data);
  var d2 = dopt(data, opts, gzhl(opts), 8), s2 = d2.length;
  return gzh(d2, opts), wbytes(d2, s2 - 8, c2.d()), wbytes(d2, s2 - 4, l2), d2;
}
function gunzip(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bInflt,
    guze,
    function() {
      return [gunzipSync];
    }
  ], function(ev) {
    return pbf(gunzipSync(ev.data[0], ev.data[1]));
  }, 3, cb);
}
function gunzipSync(data, opts) {
  var st2 = gzs(data);
  if (st2 + 8 > data.length)
    err(6, "invalid gzip data");
  return inflt(data.subarray(st2, -8), { i: 2 }, opts && opts.out || new u8(gzl(data)), opts && opts.dictionary);
}
function zlib(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bDflt,
    zle,
    function() {
      return [zlibSync];
    }
  ], function(ev) {
    return pbf(zlibSync(ev.data[0], ev.data[1]));
  }, 4, cb);
}
function zlibSync(data, opts) {
  if (!opts)
    opts = {};
  var a2 = adler();
  a2.p(data);
  var d2 = dopt(data, opts, opts.dictionary ? 6 : 2, 4);
  return zlh(d2, opts), wbytes(d2, d2.length - 4, a2.d()), d2;
}
function unzlib(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bInflt,
    zule,
    function() {
      return [unzlibSync];
    }
  ], function(ev) {
    return pbf(unzlibSync(ev.data[0], gopt(ev.data[1])));
  }, 5, cb);
}
function unzlibSync(data, opts) {
  return inflt(data.subarray(zls(data, opts && opts.dictionary), -4), { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
function decompress(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return data[0] == 31 && data[1] == 139 && data[2] == 8 ? gunzip(data, opts, cb) : (data[0] & 15) != 8 || data[0] >> 4 > 7 || (data[0] << 8 | data[1]) % 31 ? inflate(data, opts, cb) : unzlib(data, opts, cb);
}
function decompressSync(data, opts) {
  return data[0] == 31 && data[1] == 139 && data[2] == 8 ? gunzipSync(data, opts) : (data[0] & 15) != 8 || data[0] >> 4 > 7 || (data[0] << 8 | data[1]) % 31 ? inflateSync(data, opts) : unzlibSync(data, opts);
}
function strToU8(str, latin1) {
  if (latin1) {
    var ar_1 = new u8(str.length);
    for (var i2 = 0; i2 < str.length; ++i2)
      ar_1[i2] = str.charCodeAt(i2);
    return ar_1;
  }
  if (te)
    return te.encode(str);
  var l2 = str.length;
  var ar = new u8(str.length + (str.length >> 1));
  var ai = 0;
  var w2 = function(v2) {
    ar[ai++] = v2;
  };
  for (var i2 = 0; i2 < l2; ++i2) {
    if (ai + 5 > ar.length) {
      var n3 = new u8(ai + 8 + (l2 - i2 << 1));
      n3.set(ar);
      ar = n3;
    }
    var c2 = str.charCodeAt(i2);
    if (c2 < 128 || latin1)
      w2(c2);
    else if (c2 < 2048)
      w2(192 | c2 >> 6), w2(128 | c2 & 63);
    else if (c2 > 55295 && c2 < 57344)
      c2 = 65536 + (c2 & 1023 << 10) | str.charCodeAt(++i2) & 1023, w2(240 | c2 >> 18), w2(128 | c2 >> 12 & 63), w2(128 | c2 >> 6 & 63), w2(128 | c2 & 63);
    else
      w2(224 | c2 >> 12), w2(128 | c2 >> 6 & 63), w2(128 | c2 & 63);
  }
  return slc(ar, 0, ai);
}
function strFromU8(dat, latin1) {
  if (latin1) {
    var r2 = "";
    for (var i2 = 0; i2 < dat.length; i2 += 16384)
      r2 += String.fromCharCode.apply(null, dat.subarray(i2, i2 + 16384));
    return r2;
  } else if (td) {
    return td.decode(dat);
  } else {
    var _a3 = dutf8(dat), s2 = _a3.s, r2 = _a3.r;
    if (r2.length)
      err(8);
    return s2;
  }
}
function zip(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  var r2 = {};
  fltn(data, "", r2, opts);
  var k2 = Object.keys(r2);
  var lft = k2.length, o2 = 0, tot = 0;
  var slft = lft, files = new Array(lft);
  var term = [];
  var tAll = function() {
    for (var i3 = 0; i3 < term.length; ++i3)
      term[i3]();
  };
  var cbd = function(a2, b3) {
    mt(function() {
      cb(a2, b3);
    });
  };
  mt(function() {
    cbd = cb;
  });
  var cbf = function() {
    var out = new u8(tot + 22), oe = o2, cdl = tot - o2;
    tot = 0;
    for (var i3 = 0; i3 < slft; ++i3) {
      var f2 = files[i3];
      try {
        var l2 = f2.c.length;
        wzh(out, tot, f2, f2.f, f2.u, l2);
        var badd = 30 + f2.f.length + exfl(f2.extra);
        var loc = tot + badd;
        out.set(f2.c, loc);
        wzh(out, o2, f2, f2.f, f2.u, l2, tot, f2.m), o2 += 16 + badd + (f2.m ? f2.m.length : 0), tot = loc + l2;
      } catch (e2) {
        return cbd(e2, null);
      }
    }
    wzf(out, o2, files.length, cdl, oe);
    cbd(null, out);
  };
  if (!lft)
    cbf();
  var _loop_1 = function(i3) {
    var fn = k2[i3];
    var _a3 = r2[fn], file = _a3[0], p2 = _a3[1];
    var c2 = crc(), size = file.length;
    c2.p(file);
    var f2 = strToU8(fn), s2 = f2.length;
    var com = p2.comment, m2 = com && strToU8(com), ms = m2 && m2.length;
    var exl = exfl(p2.extra);
    var compression = p2.level == 0 ? 0 : 8;
    var cbl = function(e2, d2) {
      if (e2) {
        tAll();
        cbd(e2, null);
      } else {
        var l2 = d2.length;
        files[i3] = mrg(p2, {
          size,
          crc: c2.d(),
          c: d2,
          f: f2,
          m: m2,
          u: s2 != fn.length || m2 && com.length != ms,
          compression
        });
        o2 += 30 + s2 + exl + l2;
        tot += 76 + 2 * (s2 + exl) + (ms || 0) + l2;
        if (!--lft)
          cbf();
      }
    };
    if (s2 > 65535)
      cbl(err(11, 0, 1), null);
    if (!compression)
      cbl(null, file);
    else if (size < 16e4) {
      try {
        cbl(null, deflateSync(file, p2));
      } catch (e2) {
        cbl(e2, null);
      }
    } else
      term.push(deflate(file, p2, cbl));
  };
  for (var i2 = 0; i2 < slft; ++i2) {
    _loop_1(i2);
  }
  return tAll;
}
function zipSync(data, opts) {
  if (!opts)
    opts = {};
  var r2 = {};
  var files = [];
  fltn(data, "", r2, opts);
  var o2 = 0;
  var tot = 0;
  for (var fn in r2) {
    var _a3 = r2[fn], file = _a3[0], p2 = _a3[1];
    var compression = p2.level == 0 ? 0 : 8;
    var f2 = strToU8(fn), s2 = f2.length;
    var com = p2.comment, m2 = com && strToU8(com), ms = m2 && m2.length;
    var exl = exfl(p2.extra);
    if (s2 > 65535)
      err(11);
    var d2 = compression ? deflateSync(file, p2) : file, l2 = d2.length;
    var c2 = crc();
    c2.p(file);
    files.push(mrg(p2, {
      size: file.length,
      crc: c2.d(),
      c: d2,
      f: f2,
      m: m2,
      u: s2 != fn.length || m2 && com.length != ms,
      o: o2,
      compression
    }));
    o2 += 30 + s2 + exl + l2;
    tot += 76 + 2 * (s2 + exl) + (ms || 0) + l2;
  }
  var out = new u8(tot + 22), oe = o2, cdl = tot - o2;
  for (var i2 = 0; i2 < files.length; ++i2) {
    var f2 = files[i2];
    wzh(out, f2.o, f2, f2.f, f2.u, f2.c.length);
    var badd = 30 + f2.f.length + exfl(f2.extra);
    out.set(f2.c, f2.o + badd);
    wzh(out, o2, f2, f2.f, f2.u, f2.c.length, f2.o, f2.m), o2 += 16 + badd + (f2.m ? f2.m.length : 0);
  }
  wzf(out, o2, files.length, cdl, oe);
  return out;
}
function unzip(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  var term = [];
  var tAll = function() {
    for (var i3 = 0; i3 < term.length; ++i3)
      term[i3]();
  };
  var files = {};
  var cbd = function(a2, b3) {
    mt(function() {
      cb(a2, b3);
    });
  };
  mt(function() {
    cbd = cb;
  });
  var e2 = data.length - 22;
  for (; b4(data, e2) != 101010256; --e2) {
    if (!e2 || data.length - e2 > 65558) {
      cbd(err(13, 0, 1), null);
      return tAll;
    }
  }
  ;
  var lft = b2(data, e2 + 8);
  if (lft) {
    var c2 = lft;
    var o2 = b4(data, e2 + 16);
    var z2 = o2 == 4294967295 || c2 == 65535;
    if (z2) {
      var ze = b4(data, e2 - 12);
      z2 = b4(data, ze) == 101075792;
      if (z2) {
        c2 = lft = b4(data, ze + 32);
        o2 = b4(data, ze + 48);
      }
    }
    var fltr = opts && opts.filter;
    var _loop_3 = function(i3) {
      var _a3 = zh(data, o2, z2), c_1 = _a3[0], sc = _a3[1], su = _a3[2], fn = _a3[3], no = _a3[4], off = _a3[5], b3 = slzh(data, off);
      o2 = no;
      var cbl = function(e3, d2) {
        if (e3) {
          tAll();
          cbd(e3, null);
        } else {
          if (d2)
            files[fn] = d2;
          if (!--lft)
            cbd(null, files);
        }
      };
      if (!fltr || fltr({
        name: fn,
        size: sc,
        originalSize: su,
        compression: c_1
      })) {
        if (!c_1)
          cbl(null, slc(data, b3, b3 + sc));
        else if (c_1 == 8) {
          var infl = data.subarray(b3, b3 + sc);
          if (su < 524288 || sc > 0.8 * su) {
            try {
              cbl(null, inflateSync(infl, { out: new u8(su) }));
            } catch (e3) {
              cbl(e3, null);
            }
          } else
            term.push(inflate(infl, { size: su }, cbl));
        } else
          cbl(err(14, "unknown compression type " + c_1, 1), null);
      } else
        cbl(null, null);
    };
    for (var i2 = 0; i2 < c2; ++i2) {
      _loop_3(i2);
    }
  } else
    cbd(null, {});
  return tAll;
}
function unzipSync(data, opts) {
  var files = {};
  var e2 = data.length - 22;
  for (; b4(data, e2) != 101010256; --e2) {
    if (!e2 || data.length - e2 > 65558)
      err(13);
  }
  ;
  var c2 = b2(data, e2 + 8);
  if (!c2)
    return {};
  var o2 = b4(data, e2 + 16);
  var z2 = o2 == 4294967295 || c2 == 65535;
  if (z2) {
    var ze = b4(data, e2 - 12);
    z2 = b4(data, ze) == 101075792;
    if (z2) {
      c2 = b4(data, ze + 32);
      o2 = b4(data, ze + 48);
    }
  }
  var fltr = opts && opts.filter;
  for (var i2 = 0; i2 < c2; ++i2) {
    var _a3 = zh(data, o2, z2), c_2 = _a3[0], sc = _a3[1], su = _a3[2], fn = _a3[3], no = _a3[4], off = _a3[5], b3 = slzh(data, off);
    o2 = no;
    if (!fltr || fltr({
      name: fn,
      size: sc,
      originalSize: su,
      compression: c_2
    })) {
      if (!c_2)
        files[fn] = slc(data, b3, b3 + sc);
      else if (c_2 == 8)
        files[fn] = inflateSync(data.subarray(b3, b3 + sc), { out: new u8(su) });
      else
        err(14, "unknown compression type " + c_2);
    }
  }
  return files;
}
var ch2, wk, u8, u16, i32, fleb, fdeb, clim, freb, _a, fl, revfl, _b, fd, revfd, rev, x3, i2, hMap, flt, i2, i2, i2, i2, fdt, i2, flm, flrm, fdm, fdrm, max, bits, bits16, shft, slc, FlateErrorCode, ec, err, inflt, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, deo, et, dflt, crct, crc, adler, dopt, mrg, wcln, ch, cbfs, wrkr, bInflt, bDflt, gze, guze, zle, zule, pbf, gopt, cbify, astrm, astrmify, b2, b4, b8, wbytes, gzh, gzs, gzl, gzhl, zlh, zls, Deflate, AsyncDeflate, Inflate, AsyncInflate, Gzip, AsyncGzip, Gunzip, AsyncGunzip, Zlib, AsyncZlib, Unzlib, AsyncUnzlib, Decompress, AsyncDecompress, fltn, te, td, tds, dutf8, DecodeUTF8, EncodeUTF8, dbf, slzh, zh, z64e, exfl, wzh, wzf, ZipPassThrough, ZipDeflate, AsyncZipDeflate, Zip, UnzipPassThrough, UnzipInflate, AsyncUnzipInflate, Unzip, mt;
var init_browser = __esm({
  "node_modules/fflate/esm/browser.js"() {
    ch2 = {};
    wk = (function(c2, id2, msg, transfer, cb) {
      var w2 = new Worker(ch2[id2] || (ch2[id2] = URL.createObjectURL(new Blob([
        c2 + ';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'
      ], { type: "text/javascript" }))));
      w2.onmessage = function(e2) {
        var d2 = e2.data, ed = d2.$e$;
        if (ed) {
          var err2 = new Error(ed[0]);
          err2["code"] = ed[1];
          err2.stack = ed[2];
          cb(err2, null);
        } else
          cb(null, d2);
      };
      w2.postMessage(msg, transfer);
      return w2;
    });
    u8 = Uint8Array;
    u16 = Uint16Array;
    i32 = Int32Array;
    fleb = new u8([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      3,
      3,
      3,
      3,
      4,
      4,
      4,
      4,
      5,
      5,
      5,
      5,
      0,
      /* unused */
      0,
      0,
      /* impossible */
      0
    ]);
    fdeb = new u8([
      0,
      0,
      0,
      0,
      1,
      1,
      2,
      2,
      3,
      3,
      4,
      4,
      5,
      5,
      6,
      6,
      7,
      7,
      8,
      8,
      9,
      9,
      10,
      10,
      11,
      11,
      12,
      12,
      13,
      13,
      /* unused */
      0,
      0
    ]);
    clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
    freb = function(eb, start) {
      var b3 = new u16(31);
      for (var i2 = 0; i2 < 31; ++i2) {
        b3[i2] = start += 1 << eb[i2 - 1];
      }
      var r2 = new i32(b3[30]);
      for (var i2 = 1; i2 < 30; ++i2) {
        for (var j2 = b3[i2]; j2 < b3[i2 + 1]; ++j2) {
          r2[j2] = j2 - b3[i2] << 5 | i2;
        }
      }
      return { b: b3, r: r2 };
    };
    _a = freb(fleb, 2);
    fl = _a.b;
    revfl = _a.r;
    fl[28] = 258, revfl[258] = 28;
    _b = freb(fdeb, 0);
    fd = _b.b;
    revfd = _b.r;
    rev = new u16(32768);
    for (i2 = 0; i2 < 32768; ++i2) {
      x3 = (i2 & 43690) >> 1 | (i2 & 21845) << 1;
      x3 = (x3 & 52428) >> 2 | (x3 & 13107) << 2;
      x3 = (x3 & 61680) >> 4 | (x3 & 3855) << 4;
      rev[i2] = ((x3 & 65280) >> 8 | (x3 & 255) << 8) >> 1;
    }
    hMap = (function(cd, mb, r2) {
      var s2 = cd.length;
      var i2 = 0;
      var l2 = new u16(mb);
      for (; i2 < s2; ++i2) {
        if (cd[i2])
          ++l2[cd[i2] - 1];
      }
      var le = new u16(mb);
      for (i2 = 1; i2 < mb; ++i2) {
        le[i2] = le[i2 - 1] + l2[i2 - 1] << 1;
      }
      var co;
      if (r2) {
        co = new u16(1 << mb);
        var rvb = 15 - mb;
        for (i2 = 0; i2 < s2; ++i2) {
          if (cd[i2]) {
            var sv = i2 << 4 | cd[i2];
            var r_1 = mb - cd[i2];
            var v2 = le[cd[i2] - 1]++ << r_1;
            for (var m2 = v2 | (1 << r_1) - 1; v2 <= m2; ++v2) {
              co[rev[v2] >> rvb] = sv;
            }
          }
        }
      } else {
        co = new u16(s2);
        for (i2 = 0; i2 < s2; ++i2) {
          if (cd[i2]) {
            co[i2] = rev[le[cd[i2] - 1]++] >> 15 - cd[i2];
          }
        }
      }
      return co;
    });
    flt = new u8(288);
    for (i2 = 0; i2 < 144; ++i2)
      flt[i2] = 8;
    for (i2 = 144; i2 < 256; ++i2)
      flt[i2] = 9;
    for (i2 = 256; i2 < 280; ++i2)
      flt[i2] = 7;
    for (i2 = 280; i2 < 288; ++i2)
      flt[i2] = 8;
    fdt = new u8(32);
    for (i2 = 0; i2 < 32; ++i2)
      fdt[i2] = 5;
    flm = /* @__PURE__ */ hMap(flt, 9, 0);
    flrm = /* @__PURE__ */ hMap(flt, 9, 1);
    fdm = /* @__PURE__ */ hMap(fdt, 5, 0);
    fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
    max = function(a2) {
      var m2 = a2[0];
      for (var i2 = 1; i2 < a2.length; ++i2) {
        if (a2[i2] > m2)
          m2 = a2[i2];
      }
      return m2;
    };
    bits = function(d2, p2, m2) {
      var o2 = p2 / 8 | 0;
      return (d2[o2] | d2[o2 + 1] << 8) >> (p2 & 7) & m2;
    };
    bits16 = function(d2, p2) {
      var o2 = p2 / 8 | 0;
      return (d2[o2] | d2[o2 + 1] << 8 | d2[o2 + 2] << 16) >> (p2 & 7);
    };
    shft = function(p2) {
      return (p2 + 7) / 8 | 0;
    };
    slc = function(v2, s2, e2) {
      if (s2 == null || s2 < 0)
        s2 = 0;
      if (e2 == null || e2 > v2.length)
        e2 = v2.length;
      return new u8(v2.subarray(s2, e2));
    };
    FlateErrorCode = {
      UnexpectedEOF: 0,
      InvalidBlockType: 1,
      InvalidLengthLiteral: 2,
      InvalidDistance: 3,
      StreamFinished: 4,
      NoStreamHandler: 5,
      InvalidHeader: 6,
      NoCallback: 7,
      InvalidUTF8: 8,
      ExtraFieldTooLong: 9,
      InvalidDate: 10,
      FilenameTooLong: 11,
      StreamFinishing: 12,
      InvalidZipData: 13,
      UnknownCompressionMethod: 14
    };
    ec = [
      "unexpected EOF",
      "invalid block type",
      "invalid length/literal",
      "invalid distance",
      "stream finished",
      "no stream handler",
      ,
      "no callback",
      "invalid UTF-8 data",
      "extra field too long",
      "date not in range 1980-2099",
      "filename too long",
      "stream finishing",
      "invalid zip data"
      // determined by unknown compression method
    ];
    err = function(ind, msg, nt2) {
      var e2 = new Error(msg || ec[ind]);
      e2.code = ind;
      if (Error.captureStackTrace)
        Error.captureStackTrace(e2, err);
      if (!nt2)
        throw e2;
      return e2;
    };
    inflt = function(dat, st2, buf, dict) {
      var sl = dat.length, dl = dict ? dict.length : 0;
      if (!sl || st2.f && !st2.l)
        return buf || new u8(0);
      var noBuf = !buf;
      var resize = noBuf || st2.i != 2;
      var noSt = st2.i;
      if (noBuf)
        buf = new u8(sl * 3);
      var cbuf = function(l3) {
        var bl = buf.length;
        if (l3 > bl) {
          var nbuf = new u8(Math.max(bl * 2, l3));
          nbuf.set(buf);
          buf = nbuf;
        }
      };
      var final = st2.f || 0, pos = st2.p || 0, bt = st2.b || 0, lm = st2.l, dm = st2.d, lbt = st2.m, dbt = st2.n;
      var tbts = sl * 8;
      do {
        if (!lm) {
          final = bits(dat, pos, 1);
          var type = bits(dat, pos + 1, 3);
          pos += 3;
          if (!type) {
            var s2 = shft(pos) + 4, l2 = dat[s2 - 4] | dat[s2 - 3] << 8, t3 = s2 + l2;
            if (t3 > sl) {
              if (noSt)
                err(0);
              break;
            }
            if (resize)
              cbuf(bt + l2);
            buf.set(dat.subarray(s2, t3), bt);
            st2.b = bt += l2, st2.p = pos = t3 * 8, st2.f = final;
            continue;
          } else if (type == 1)
            lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
          else if (type == 2) {
            var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
            var tl = hLit + bits(dat, pos + 5, 31) + 1;
            pos += 14;
            var ldt = new u8(tl);
            var clt = new u8(19);
            for (var i2 = 0; i2 < hcLen; ++i2) {
              clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
            }
            pos += hcLen * 3;
            var clb = max(clt), clbmsk = (1 << clb) - 1;
            var clm = hMap(clt, clb, 1);
            for (var i2 = 0; i2 < tl; ) {
              var r2 = clm[bits(dat, pos, clbmsk)];
              pos += r2 & 15;
              var s2 = r2 >> 4;
              if (s2 < 16) {
                ldt[i2++] = s2;
              } else {
                var c2 = 0, n3 = 0;
                if (s2 == 16)
                  n3 = 3 + bits(dat, pos, 3), pos += 2, c2 = ldt[i2 - 1];
                else if (s2 == 17)
                  n3 = 3 + bits(dat, pos, 7), pos += 3;
                else if (s2 == 18)
                  n3 = 11 + bits(dat, pos, 127), pos += 7;
                while (n3--)
                  ldt[i2++] = c2;
              }
            }
            var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
            lbt = max(lt);
            dbt = max(dt);
            lm = hMap(lt, lbt, 1);
            dm = hMap(dt, dbt, 1);
          } else
            err(1);
          if (pos > tbts) {
            if (noSt)
              err(0);
            break;
          }
        }
        if (resize)
          cbuf(bt + 131072);
        var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
        var lpos = pos;
        for (; ; lpos = pos) {
          var c2 = lm[bits16(dat, pos) & lms], sym = c2 >> 4;
          pos += c2 & 15;
          if (pos > tbts) {
            if (noSt)
              err(0);
            break;
          }
          if (!c2)
            err(2);
          if (sym < 256)
            buf[bt++] = sym;
          else if (sym == 256) {
            lpos = pos, lm = null;
            break;
          } else {
            var add = sym - 254;
            if (sym > 264) {
              var i2 = sym - 257, b3 = fleb[i2];
              add = bits(dat, pos, (1 << b3) - 1) + fl[i2];
              pos += b3;
            }
            var d2 = dm[bits16(dat, pos) & dms], dsym = d2 >> 4;
            if (!d2)
              err(3);
            pos += d2 & 15;
            var dt = fd[dsym];
            if (dsym > 3) {
              var b3 = fdeb[dsym];
              dt += bits16(dat, pos) & (1 << b3) - 1, pos += b3;
            }
            if (pos > tbts) {
              if (noSt)
                err(0);
              break;
            }
            if (resize)
              cbuf(bt + 131072);
            var end = bt + add;
            if (bt < dt) {
              var shift = dl - dt, dend = Math.min(dt, end);
              if (shift + bt < 0)
                err(3);
              for (; bt < dend; ++bt)
                buf[bt] = dict[shift + bt];
            }
            for (; bt < end; ++bt)
              buf[bt] = buf[bt - dt];
          }
        }
        st2.l = lm, st2.p = lpos, st2.b = bt, st2.f = final;
        if (lm)
          final = 1, st2.m = lbt, st2.d = dm, st2.n = dbt;
      } while (!final);
      return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
    };
    wbits = function(d2, p2, v2) {
      v2 <<= p2 & 7;
      var o2 = p2 / 8 | 0;
      d2[o2] |= v2;
      d2[o2 + 1] |= v2 >> 8;
    };
    wbits16 = function(d2, p2, v2) {
      v2 <<= p2 & 7;
      var o2 = p2 / 8 | 0;
      d2[o2] |= v2;
      d2[o2 + 1] |= v2 >> 8;
      d2[o2 + 2] |= v2 >> 16;
    };
    hTree = function(d2, mb) {
      var t3 = [];
      for (var i2 = 0; i2 < d2.length; ++i2) {
        if (d2[i2])
          t3.push({ s: i2, f: d2[i2] });
      }
      var s2 = t3.length;
      var t22 = t3.slice();
      if (!s2)
        return { t: et, l: 0 };
      if (s2 == 1) {
        var v2 = new u8(t3[0].s + 1);
        v2[t3[0].s] = 1;
        return { t: v2, l: 1 };
      }
      t3.sort(function(a2, b3) {
        return a2.f - b3.f;
      });
      t3.push({ s: -1, f: 25001 });
      var l2 = t3[0], r2 = t3[1], i0 = 0, i1 = 1, i22 = 2;
      t3[0] = { s: -1, f: l2.f + r2.f, l: l2, r: r2 };
      while (i1 != s2 - 1) {
        l2 = t3[t3[i0].f < t3[i22].f ? i0++ : i22++];
        r2 = t3[i0 != i1 && t3[i0].f < t3[i22].f ? i0++ : i22++];
        t3[i1++] = { s: -1, f: l2.f + r2.f, l: l2, r: r2 };
      }
      var maxSym = t22[0].s;
      for (var i2 = 1; i2 < s2; ++i2) {
        if (t22[i2].s > maxSym)
          maxSym = t22[i2].s;
      }
      var tr = new u16(maxSym + 1);
      var mbt = ln(t3[i1 - 1], tr, 0);
      if (mbt > mb) {
        var i2 = 0, dt = 0;
        var lft = mbt - mb, cst = 1 << lft;
        t22.sort(function(a2, b3) {
          return tr[b3.s] - tr[a2.s] || a2.f - b3.f;
        });
        for (; i2 < s2; ++i2) {
          var i2_1 = t22[i2].s;
          if (tr[i2_1] > mb) {
            dt += cst - (1 << mbt - tr[i2_1]);
            tr[i2_1] = mb;
          } else
            break;
        }
        dt >>= lft;
        while (dt > 0) {
          var i2_2 = t22[i2].s;
          if (tr[i2_2] < mb)
            dt -= 1 << mb - tr[i2_2]++ - 1;
          else
            ++i2;
        }
        for (; i2 >= 0 && dt; --i2) {
          var i2_3 = t22[i2].s;
          if (tr[i2_3] == mb) {
            --tr[i2_3];
            ++dt;
          }
        }
        mbt = mb;
      }
      return { t: new u8(tr), l: mbt };
    };
    ln = function(n3, l2, d2) {
      return n3.s == -1 ? Math.max(ln(n3.l, l2, d2 + 1), ln(n3.r, l2, d2 + 1)) : l2[n3.s] = d2;
    };
    lc = function(c2) {
      var s2 = c2.length;
      while (s2 && !c2[--s2])
        ;
      var cl = new u16(++s2);
      var cli = 0, cln = c2[0], cls = 1;
      var w2 = function(v2) {
        cl[cli++] = v2;
      };
      for (var i2 = 1; i2 <= s2; ++i2) {
        if (c2[i2] == cln && i2 != s2)
          ++cls;
        else {
          if (!cln && cls > 2) {
            for (; cls > 138; cls -= 138)
              w2(32754);
            if (cls > 2) {
              w2(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
              cls = 0;
            }
          } else if (cls > 3) {
            w2(cln), --cls;
            for (; cls > 6; cls -= 6)
              w2(8304);
            if (cls > 2)
              w2(cls - 3 << 5 | 8208), cls = 0;
          }
          while (cls--)
            w2(cln);
          cls = 1;
          cln = c2[i2];
        }
      }
      return { c: cl.subarray(0, cli), n: s2 };
    };
    clen = function(cf, cl) {
      var l2 = 0;
      for (var i2 = 0; i2 < cl.length; ++i2)
        l2 += cf[i2] * cl[i2];
      return l2;
    };
    wfblk = function(out, pos, dat) {
      var s2 = dat.length;
      var o2 = shft(pos + 2);
      out[o2] = s2 & 255;
      out[o2 + 1] = s2 >> 8;
      out[o2 + 2] = out[o2] ^ 255;
      out[o2 + 3] = out[o2 + 1] ^ 255;
      for (var i2 = 0; i2 < s2; ++i2)
        out[o2 + i2 + 4] = dat[i2];
      return (o2 + 4 + s2) * 8;
    };
    wblk = function(dat, out, final, syms, lf, df, eb, li, bs, bl, p2) {
      wbits(out, p2++, final);
      ++lf[256];
      var _a3 = hTree(lf, 15), dlt = _a3.t, mlb = _a3.l;
      var _b2 = hTree(df, 15), ddt = _b2.t, mdb = _b2.l;
      var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
      var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
      var lcfreq = new u16(19);
      for (var i2 = 0; i2 < lclt.length; ++i2)
        ++lcfreq[lclt[i2] & 31];
      for (var i2 = 0; i2 < lcdt.length; ++i2)
        ++lcfreq[lcdt[i2] & 31];
      var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
      var nlcc = 19;
      for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
        ;
      var flen = bl + 5 << 3;
      var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
      var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
      if (bs >= 0 && flen <= ftlen && flen <= dtlen)
        return wfblk(out, p2, dat.subarray(bs, bs + bl));
      var lm, ll, dm, dl;
      wbits(out, p2, 1 + (dtlen < ftlen)), p2 += 2;
      if (dtlen < ftlen) {
        lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
        var llm = hMap(lct, mlcb, 0);
        wbits(out, p2, nlc - 257);
        wbits(out, p2 + 5, ndc - 1);
        wbits(out, p2 + 10, nlcc - 4);
        p2 += 14;
        for (var i2 = 0; i2 < nlcc; ++i2)
          wbits(out, p2 + 3 * i2, lct[clim[i2]]);
        p2 += 3 * nlcc;
        var lcts = [lclt, lcdt];
        for (var it2 = 0; it2 < 2; ++it2) {
          var clct = lcts[it2];
          for (var i2 = 0; i2 < clct.length; ++i2) {
            var len = clct[i2] & 31;
            wbits(out, p2, llm[len]), p2 += lct[len];
            if (len > 15)
              wbits(out, p2, clct[i2] >> 5 & 127), p2 += clct[i2] >> 12;
          }
        }
      } else {
        lm = flm, ll = flt, dm = fdm, dl = fdt;
      }
      for (var i2 = 0; i2 < li; ++i2) {
        var sym = syms[i2];
        if (sym > 255) {
          var len = sym >> 18 & 31;
          wbits16(out, p2, lm[len + 257]), p2 += ll[len + 257];
          if (len > 7)
            wbits(out, p2, sym >> 23 & 31), p2 += fleb[len];
          var dst = sym & 31;
          wbits16(out, p2, dm[dst]), p2 += dl[dst];
          if (dst > 3)
            wbits16(out, p2, sym >> 5 & 8191), p2 += fdeb[dst];
        } else {
          wbits16(out, p2, lm[sym]), p2 += ll[sym];
        }
      }
      wbits16(out, p2, lm[256]);
      return p2 + ll[256];
    };
    deo = /* @__PURE__ */ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
    et = /* @__PURE__ */ new u8(0);
    dflt = function(dat, lvl, plvl, pre, post, st2) {
      var s2 = st2.z || dat.length;
      var o2 = new u8(pre + s2 + 5 * (1 + Math.ceil(s2 / 7e3)) + post);
      var w2 = o2.subarray(pre, o2.length - post);
      var lst = st2.l;
      var pos = (st2.r || 0) & 7;
      if (lvl) {
        if (pos)
          w2[0] = st2.r >> 3;
        var opt = deo[lvl - 1];
        var n3 = opt >> 13, c2 = opt & 8191;
        var msk_1 = (1 << plvl) - 1;
        var prev = st2.p || new u16(32768), head = st2.h || new u16(msk_1 + 1);
        var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
        var hsh = function(i3) {
          return (dat[i3] ^ dat[i3 + 1] << bs1_1 ^ dat[i3 + 2] << bs2_1) & msk_1;
        };
        var syms = new i32(25e3);
        var lf = new u16(288), df = new u16(32);
        var lc_1 = 0, eb = 0, i2 = st2.i || 0, li = 0, wi = st2.w || 0, bs = 0;
        for (; i2 + 2 < s2; ++i2) {
          var hv = hsh(i2);
          var imod = i2 & 32767, pimod = head[hv];
          prev[imod] = pimod;
          head[hv] = imod;
          if (wi <= i2) {
            var rem = s2 - i2;
            if ((lc_1 > 7e3 || li > 24576) && (rem > 423 || !lst)) {
              pos = wblk(dat, w2, 0, syms, lf, df, eb, li, bs, i2 - bs, pos);
              li = lc_1 = eb = 0, bs = i2;
              for (var j2 = 0; j2 < 286; ++j2)
                lf[j2] = 0;
              for (var j2 = 0; j2 < 30; ++j2)
                df[j2] = 0;
            }
            var l2 = 2, d2 = 0, ch_1 = c2, dif = imod - pimod & 32767;
            if (rem > 2 && hv == hsh(i2 - dif)) {
              var maxn = Math.min(n3, rem) - 1;
              var maxd = Math.min(32767, i2);
              var ml = Math.min(258, rem);
              while (dif <= maxd && --ch_1 && imod != pimod) {
                if (dat[i2 + l2] == dat[i2 + l2 - dif]) {
                  var nl = 0;
                  for (; nl < ml && dat[i2 + nl] == dat[i2 + nl - dif]; ++nl)
                    ;
                  if (nl > l2) {
                    l2 = nl, d2 = dif;
                    if (nl > maxn)
                      break;
                    var mmd = Math.min(dif, nl - 2);
                    var md = 0;
                    for (var j2 = 0; j2 < mmd; ++j2) {
                      var ti = i2 - dif + j2 & 32767;
                      var pti = prev[ti];
                      var cd = ti - pti & 32767;
                      if (cd > md)
                        md = cd, pimod = ti;
                    }
                  }
                }
                imod = pimod, pimod = prev[imod];
                dif += imod - pimod & 32767;
              }
            }
            if (d2) {
              syms[li++] = 268435456 | revfl[l2] << 18 | revfd[d2];
              var lin = revfl[l2] & 31, din = revfd[d2] & 31;
              eb += fleb[lin] + fdeb[din];
              ++lf[257 + lin];
              ++df[din];
              wi = i2 + l2;
              ++lc_1;
            } else {
              syms[li++] = dat[i2];
              ++lf[dat[i2]];
            }
          }
        }
        for (i2 = Math.max(i2, wi); i2 < s2; ++i2) {
          syms[li++] = dat[i2];
          ++lf[dat[i2]];
        }
        pos = wblk(dat, w2, lst, syms, lf, df, eb, li, bs, i2 - bs, pos);
        if (!lst) {
          st2.r = pos & 7 | w2[pos / 8 | 0] << 3;
          pos -= 7;
          st2.h = head, st2.p = prev, st2.i = i2, st2.w = wi;
        }
      } else {
        for (var i2 = st2.w || 0; i2 < s2 + lst; i2 += 65535) {
          var e2 = i2 + 65535;
          if (e2 >= s2) {
            w2[pos / 8 | 0] = lst;
            e2 = s2;
          }
          pos = wfblk(w2, pos + 1, dat.subarray(i2, e2));
        }
        st2.i = s2;
      }
      return slc(o2, 0, pre + shft(pos) + post);
    };
    crct = /* @__PURE__ */ (function() {
      var t3 = new Int32Array(256);
      for (var i2 = 0; i2 < 256; ++i2) {
        var c2 = i2, k2 = 9;
        while (--k2)
          c2 = (c2 & 1 && -306674912) ^ c2 >>> 1;
        t3[i2] = c2;
      }
      return t3;
    })();
    crc = function() {
      var c2 = -1;
      return {
        p: function(d2) {
          var cr = c2;
          for (var i2 = 0; i2 < d2.length; ++i2)
            cr = crct[cr & 255 ^ d2[i2]] ^ cr >>> 8;
          c2 = cr;
        },
        d: function() {
          return ~c2;
        }
      };
    };
    adler = function() {
      var a2 = 1, b3 = 0;
      return {
        p: function(d2) {
          var n3 = a2, m2 = b3;
          var l2 = d2.length | 0;
          for (var i2 = 0; i2 != l2; ) {
            var e2 = Math.min(i2 + 2655, l2);
            for (; i2 < e2; ++i2)
              m2 += n3 += d2[i2];
            n3 = (n3 & 65535) + 15 * (n3 >> 16), m2 = (m2 & 65535) + 15 * (m2 >> 16);
          }
          a2 = n3, b3 = m2;
        },
        d: function() {
          a2 %= 65521, b3 %= 65521;
          return (a2 & 255) << 24 | (a2 & 65280) << 8 | (b3 & 255) << 8 | b3 >> 8;
        }
      };
    };
    dopt = function(dat, opt, pre, post, st2) {
      if (!st2) {
        st2 = { l: 1 };
        if (opt.dictionary) {
          var dict = opt.dictionary.subarray(-32768);
          var newDat = new u8(dict.length + dat.length);
          newDat.set(dict);
          newDat.set(dat, dict.length);
          dat = newDat;
          st2.w = dict.length;
        }
      }
      return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? st2.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20 : 12 + opt.mem, pre, post, st2);
    };
    mrg = function(a2, b3) {
      var o2 = {};
      for (var k2 in a2)
        o2[k2] = a2[k2];
      for (var k2 in b3)
        o2[k2] = b3[k2];
      return o2;
    };
    wcln = function(fn, fnStr, td2) {
      var dt = fn();
      var st2 = fn.toString();
      var ks = st2.slice(st2.indexOf("[") + 1, st2.lastIndexOf("]")).replace(/\s+/g, "").split(",");
      for (var i2 = 0; i2 < dt.length; ++i2) {
        var v2 = dt[i2], k2 = ks[i2];
        if (typeof v2 == "function") {
          fnStr += ";" + k2 + "=";
          var st_1 = v2.toString();
          if (v2.prototype) {
            if (st_1.indexOf("[native code]") != -1) {
              var spInd = st_1.indexOf(" ", 8) + 1;
              fnStr += st_1.slice(spInd, st_1.indexOf("(", spInd));
            } else {
              fnStr += st_1;
              for (var t3 in v2.prototype)
                fnStr += ";" + k2 + ".prototype." + t3 + "=" + v2.prototype[t3].toString();
            }
          } else
            fnStr += st_1;
        } else
          td2[k2] = v2;
      }
      return fnStr;
    };
    ch = [];
    cbfs = function(v2) {
      var tl = [];
      for (var k2 in v2) {
        if (v2[k2].buffer) {
          tl.push((v2[k2] = new v2[k2].constructor(v2[k2])).buffer);
        }
      }
      return tl;
    };
    wrkr = function(fns, init, id2, cb) {
      if (!ch[id2]) {
        var fnStr = "", td_1 = {}, m2 = fns.length - 1;
        for (var i2 = 0; i2 < m2; ++i2)
          fnStr = wcln(fns[i2], fnStr, td_1);
        ch[id2] = { c: wcln(fns[m2], fnStr, td_1), e: td_1 };
      }
      var td2 = mrg({}, ch[id2].e);
      return wk(ch[id2].c + ";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=" + init.toString() + "}", id2, td2, cbfs(td2), cb);
    };
    bInflt = function() {
      return [u8, u16, i32, fleb, fdeb, clim, fl, fd, flrm, fdrm, rev, ec, hMap, max, bits, bits16, shft, slc, err, inflt, inflateSync, pbf, gopt];
    };
    bDflt = function() {
      return [u8, u16, i32, fleb, fdeb, clim, revfl, revfd, flm, flt, fdm, fdt, rev, deo, et, hMap, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, shft, slc, dflt, dopt, deflateSync, pbf];
    };
    gze = function() {
      return [gzh, gzhl, wbytes, crc, crct];
    };
    guze = function() {
      return [gzs, gzl];
    };
    zle = function() {
      return [zlh, wbytes, adler];
    };
    zule = function() {
      return [zls];
    };
    pbf = function(msg) {
      return postMessage(msg, [msg.buffer]);
    };
    gopt = function(o2) {
      return o2 && {
        out: o2.size && new u8(o2.size),
        dictionary: o2.dictionary
      };
    };
    cbify = function(dat, opts, fns, init, id2, cb) {
      var w2 = wrkr(fns, init, id2, function(err2, dat2) {
        w2.terminate();
        cb(err2, dat2);
      });
      w2.postMessage([dat, opts], opts.consume ? [dat.buffer] : []);
      return function() {
        w2.terminate();
      };
    };
    astrm = function(strm) {
      strm.ondata = function(dat, final) {
        return postMessage([dat, final], [dat.buffer]);
      };
      return function(ev) {
        if (ev.data.length) {
          strm.push(ev.data[0], ev.data[1]);
          postMessage([ev.data[0].length]);
        } else
          strm.flush();
      };
    };
    astrmify = function(fns, strm, opts, init, id2, flush, ext) {
      var t3;
      var w2 = wrkr(fns, init, id2, function(err2, dat) {
        if (err2)
          w2.terminate(), strm.ondata.call(strm, err2);
        else if (!Array.isArray(dat))
          ext(dat);
        else if (dat.length == 1) {
          strm.queuedSize -= dat[0];
          if (strm.ondrain)
            strm.ondrain(dat[0]);
        } else {
          if (dat[1])
            w2.terminate();
          strm.ondata.call(strm, err2, dat[0], dat[1]);
        }
      });
      w2.postMessage(opts);
      strm.queuedSize = 0;
      strm.push = function(d2, f2) {
        if (!strm.ondata)
          err(5);
        if (t3)
          strm.ondata(err(4, 0, 1), null, !!f2);
        strm.queuedSize += d2.length;
        w2.postMessage([d2, t3 = f2], [d2.buffer]);
      };
      strm.terminate = function() {
        w2.terminate();
      };
      if (flush) {
        strm.flush = function() {
          w2.postMessage([]);
        };
      }
    };
    b2 = function(d2, b3) {
      return d2[b3] | d2[b3 + 1] << 8;
    };
    b4 = function(d2, b3) {
      return (d2[b3] | d2[b3 + 1] << 8 | d2[b3 + 2] << 16 | d2[b3 + 3] << 24) >>> 0;
    };
    b8 = function(d2, b3) {
      return b4(d2, b3) + b4(d2, b3 + 4) * 4294967296;
    };
    wbytes = function(d2, b3, v2) {
      for (; v2; ++b3)
        d2[b3] = v2, v2 >>>= 8;
    };
    gzh = function(c2, o2) {
      var fn = o2.filename;
      c2[0] = 31, c2[1] = 139, c2[2] = 8, c2[8] = o2.level < 2 ? 4 : o2.level == 9 ? 2 : 0, c2[9] = 3;
      if (o2.mtime != 0)
        wbytes(c2, 4, Math.floor(new Date(o2.mtime || Date.now()) / 1e3));
      if (fn) {
        c2[3] = 8;
        for (var i2 = 0; i2 <= fn.length; ++i2)
          c2[i2 + 10] = fn.charCodeAt(i2);
      }
    };
    gzs = function(d2) {
      if (d2[0] != 31 || d2[1] != 139 || d2[2] != 8)
        err(6, "invalid gzip data");
      var flg = d2[3];
      var st2 = 10;
      if (flg & 4)
        st2 += (d2[10] | d2[11] << 8) + 2;
      for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d2[st2++])
        ;
      return st2 + (flg & 2);
    };
    gzl = function(d2) {
      var l2 = d2.length;
      return (d2[l2 - 4] | d2[l2 - 3] << 8 | d2[l2 - 2] << 16 | d2[l2 - 1] << 24) >>> 0;
    };
    gzhl = function(o2) {
      return 10 + (o2.filename ? o2.filename.length + 1 : 0);
    };
    zlh = function(c2, o2) {
      var lv = o2.level, fl2 = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
      c2[0] = 120, c2[1] = fl2 << 6 | (o2.dictionary && 32);
      c2[1] |= 31 - (c2[0] << 8 | c2[1]) % 31;
      if (o2.dictionary) {
        var h2 = adler();
        h2.p(o2.dictionary);
        wbytes(c2, 2, h2.d());
      }
    };
    zls = function(d2, dict) {
      if ((d2[0] & 15) != 8 || d2[0] >> 4 > 7 || (d2[0] << 8 | d2[1]) % 31)
        err(6, "invalid zlib data");
      if ((d2[1] >> 5 & 1) == +!dict)
        err(6, "invalid zlib data: " + (d2[1] & 32 ? "need" : "unexpected") + " dictionary");
      return (d2[1] >> 3 & 4) + 2;
    };
    Deflate = /* @__PURE__ */ (function() {
      function Deflate2(opts, cb) {
        if (typeof opts == "function")
          cb = opts, opts = {};
        this.ondata = cb;
        this.o = opts || {};
        this.s = { l: 0, i: 32768, w: 32768, z: 32768 };
        this.b = new u8(98304);
        if (this.o.dictionary) {
          var dict = this.o.dictionary.subarray(-32768);
          this.b.set(dict, 32768 - dict.length);
          this.s.i = 32768 - dict.length;
        }
      }
      Deflate2.prototype.p = function(c2, f2) {
        this.ondata(dopt(c2, this.o, 0, 0, this.s), f2);
      };
      Deflate2.prototype.push = function(chunk, final) {
        if (!this.ondata)
          err(5);
        if (this.s.l)
          err(4);
        var endLen = chunk.length + this.s.z;
        if (endLen > this.b.length) {
          if (endLen > 2 * this.b.length - 32768) {
            var newBuf = new u8(endLen & -32768);
            newBuf.set(this.b.subarray(0, this.s.z));
            this.b = newBuf;
          }
          var split = this.b.length - this.s.z;
          this.b.set(chunk.subarray(0, split), this.s.z);
          this.s.z = this.b.length;
          this.p(this.b, false);
          this.b.set(this.b.subarray(-32768));
          this.b.set(chunk.subarray(split), 32768);
          this.s.z = chunk.length - split + 32768;
          this.s.i = 32766, this.s.w = 32768;
        } else {
          this.b.set(chunk, this.s.z);
          this.s.z += chunk.length;
        }
        this.s.l = final & 1;
        if (this.s.z > this.s.w + 8191 || final) {
          this.p(this.b, final || false);
          this.s.w = this.s.i, this.s.i -= 2;
        }
      };
      Deflate2.prototype.flush = function() {
        if (!this.ondata)
          err(5);
        if (this.s.l)
          err(4);
        this.p(this.b, false);
        this.s.w = this.s.i, this.s.i -= 2;
      };
      return Deflate2;
    })();
    AsyncDeflate = /* @__PURE__ */ (function() {
      function AsyncDeflate2(opts, cb) {
        astrmify([
          bDflt,
          function() {
            return [astrm, Deflate];
          }
        ], this, StrmOpt.call(this, opts, cb), function(ev) {
          var strm = new Deflate(ev.data);
          onmessage = astrm(strm);
        }, 6, 1);
      }
      return AsyncDeflate2;
    })();
    Inflate = /* @__PURE__ */ (function() {
      function Inflate2(opts, cb) {
        if (typeof opts == "function")
          cb = opts, opts = {};
        this.ondata = cb;
        var dict = opts && opts.dictionary && opts.dictionary.subarray(-32768);
        this.s = { i: 0, b: dict ? dict.length : 0 };
        this.o = new u8(32768);
        this.p = new u8(0);
        if (dict)
          this.o.set(dict);
      }
      Inflate2.prototype.e = function(c2) {
        if (!this.ondata)
          err(5);
        if (this.d)
          err(4);
        if (!this.p.length)
          this.p = c2;
        else if (c2.length) {
          var n3 = new u8(this.p.length + c2.length);
          n3.set(this.p), n3.set(c2, this.p.length), this.p = n3;
        }
      };
      Inflate2.prototype.c = function(final) {
        this.s.i = +(this.d = final || false);
        var bts = this.s.b;
        var dt = inflt(this.p, this.s, this.o);
        this.ondata(slc(dt, bts, this.s.b), this.d);
        this.o = slc(dt, this.s.b - 32768), this.s.b = this.o.length;
        this.p = slc(this.p, this.s.p / 8 | 0), this.s.p &= 7;
      };
      Inflate2.prototype.push = function(chunk, final) {
        this.e(chunk), this.c(final);
      };
      return Inflate2;
    })();
    AsyncInflate = /* @__PURE__ */ (function() {
      function AsyncInflate2(opts, cb) {
        astrmify([
          bInflt,
          function() {
            return [astrm, Inflate];
          }
        ], this, StrmOpt.call(this, opts, cb), function(ev) {
          var strm = new Inflate(ev.data);
          onmessage = astrm(strm);
        }, 7, 0);
      }
      return AsyncInflate2;
    })();
    Gzip = /* @__PURE__ */ (function() {
      function Gzip2(opts, cb) {
        this.c = crc();
        this.l = 0;
        this.v = 1;
        Deflate.call(this, opts, cb);
      }
      Gzip2.prototype.push = function(chunk, final) {
        this.c.p(chunk);
        this.l += chunk.length;
        Deflate.prototype.push.call(this, chunk, final);
      };
      Gzip2.prototype.p = function(c2, f2) {
        var raw = dopt(c2, this.o, this.v && gzhl(this.o), f2 && 8, this.s);
        if (this.v)
          gzh(raw, this.o), this.v = 0;
        if (f2)
          wbytes(raw, raw.length - 8, this.c.d()), wbytes(raw, raw.length - 4, this.l);
        this.ondata(raw, f2);
      };
      Gzip2.prototype.flush = function() {
        Deflate.prototype.flush.call(this);
      };
      return Gzip2;
    })();
    AsyncGzip = /* @__PURE__ */ (function() {
      function AsyncGzip2(opts, cb) {
        astrmify([
          bDflt,
          gze,
          function() {
            return [astrm, Deflate, Gzip];
          }
        ], this, StrmOpt.call(this, opts, cb), function(ev) {
          var strm = new Gzip(ev.data);
          onmessage = astrm(strm);
        }, 8, 1);
      }
      return AsyncGzip2;
    })();
    Gunzip = /* @__PURE__ */ (function() {
      function Gunzip2(opts, cb) {
        this.v = 1;
        this.r = 0;
        Inflate.call(this, opts, cb);
      }
      Gunzip2.prototype.push = function(chunk, final) {
        Inflate.prototype.e.call(this, chunk);
        this.r += chunk.length;
        if (this.v) {
          var p2 = this.p.subarray(this.v - 1);
          var s2 = p2.length > 3 ? gzs(p2) : 4;
          if (s2 > p2.length) {
            if (!final)
              return;
          } else if (this.v > 1 && this.onmember) {
            this.onmember(this.r - p2.length);
          }
          this.p = p2.subarray(s2), this.v = 0;
        }
        Inflate.prototype.c.call(this, final);
        if (this.s.f && !this.s.l && !final) {
          this.v = shft(this.s.p) + 9;
          this.s = { i: 0 };
          this.o = new u8(0);
          this.push(new u8(0), final);
        }
      };
      return Gunzip2;
    })();
    AsyncGunzip = /* @__PURE__ */ (function() {
      function AsyncGunzip2(opts, cb) {
        var _this = this;
        astrmify([
          bInflt,
          guze,
          function() {
            return [astrm, Inflate, Gunzip];
          }
        ], this, StrmOpt.call(this, opts, cb), function(ev) {
          var strm = new Gunzip(ev.data);
          strm.onmember = function(offset) {
            return postMessage(offset);
          };
          onmessage = astrm(strm);
        }, 9, 0, function(offset) {
          return _this.onmember && _this.onmember(offset);
        });
      }
      return AsyncGunzip2;
    })();
    Zlib = /* @__PURE__ */ (function() {
      function Zlib2(opts, cb) {
        this.c = adler();
        this.v = 1;
        Deflate.call(this, opts, cb);
      }
      Zlib2.prototype.push = function(chunk, final) {
        this.c.p(chunk);
        Deflate.prototype.push.call(this, chunk, final);
      };
      Zlib2.prototype.p = function(c2, f2) {
        var raw = dopt(c2, this.o, this.v && (this.o.dictionary ? 6 : 2), f2 && 4, this.s);
        if (this.v)
          zlh(raw, this.o), this.v = 0;
        if (f2)
          wbytes(raw, raw.length - 4, this.c.d());
        this.ondata(raw, f2);
      };
      Zlib2.prototype.flush = function() {
        Deflate.prototype.flush.call(this);
      };
      return Zlib2;
    })();
    AsyncZlib = /* @__PURE__ */ (function() {
      function AsyncZlib2(opts, cb) {
        astrmify([
          bDflt,
          zle,
          function() {
            return [astrm, Deflate, Zlib];
          }
        ], this, StrmOpt.call(this, opts, cb), function(ev) {
          var strm = new Zlib(ev.data);
          onmessage = astrm(strm);
        }, 10, 1);
      }
      return AsyncZlib2;
    })();
    Unzlib = /* @__PURE__ */ (function() {
      function Unzlib2(opts, cb) {
        Inflate.call(this, opts, cb);
        this.v = opts && opts.dictionary ? 2 : 1;
      }
      Unzlib2.prototype.push = function(chunk, final) {
        Inflate.prototype.e.call(this, chunk);
        if (this.v) {
          if (this.p.length < 6 && !final)
            return;
          this.p = this.p.subarray(zls(this.p, this.v - 1)), this.v = 0;
        }
        if (final) {
          if (this.p.length < 4)
            err(6, "invalid zlib data");
          this.p = this.p.subarray(0, -4);
        }
        Inflate.prototype.c.call(this, final);
      };
      return Unzlib2;
    })();
    AsyncUnzlib = /* @__PURE__ */ (function() {
      function AsyncUnzlib2(opts, cb) {
        astrmify([
          bInflt,
          zule,
          function() {
            return [astrm, Inflate, Unzlib];
          }
        ], this, StrmOpt.call(this, opts, cb), function(ev) {
          var strm = new Unzlib(ev.data);
          onmessage = astrm(strm);
        }, 11, 0);
      }
      return AsyncUnzlib2;
    })();
    Decompress = /* @__PURE__ */ (function() {
      function Decompress2(opts, cb) {
        this.o = StrmOpt.call(this, opts, cb) || {};
        this.G = Gunzip;
        this.I = Inflate;
        this.Z = Unzlib;
      }
      Decompress2.prototype.i = function() {
        var _this = this;
        this.s.ondata = function(dat, final) {
          _this.ondata(dat, final);
        };
      };
      Decompress2.prototype.push = function(chunk, final) {
        if (!this.ondata)
          err(5);
        if (!this.s) {
          if (this.p && this.p.length) {
            var n3 = new u8(this.p.length + chunk.length);
            n3.set(this.p), n3.set(chunk, this.p.length);
          } else
            this.p = chunk;
          if (this.p.length > 2) {
            this.s = this.p[0] == 31 && this.p[1] == 139 && this.p[2] == 8 ? new this.G(this.o) : (this.p[0] & 15) != 8 || this.p[0] >> 4 > 7 || (this.p[0] << 8 | this.p[1]) % 31 ? new this.I(this.o) : new this.Z(this.o);
            this.i();
            this.s.push(this.p, final);
            this.p = null;
          }
        } else
          this.s.push(chunk, final);
      };
      return Decompress2;
    })();
    AsyncDecompress = /* @__PURE__ */ (function() {
      function AsyncDecompress2(opts, cb) {
        Decompress.call(this, opts, cb);
        this.queuedSize = 0;
        this.G = AsyncGunzip;
        this.I = AsyncInflate;
        this.Z = AsyncUnzlib;
      }
      AsyncDecompress2.prototype.i = function() {
        var _this = this;
        this.s.ondata = function(err2, dat, final) {
          _this.ondata(err2, dat, final);
        };
        this.s.ondrain = function(size) {
          _this.queuedSize -= size;
          if (_this.ondrain)
            _this.ondrain(size);
        };
      };
      AsyncDecompress2.prototype.push = function(chunk, final) {
        this.queuedSize += chunk.length;
        Decompress.prototype.push.call(this, chunk, final);
      };
      return AsyncDecompress2;
    })();
    fltn = function(d2, p2, t3, o2) {
      for (var k2 in d2) {
        var val = d2[k2], n3 = p2 + k2, op = o2;
        if (Array.isArray(val))
          op = mrg(o2, val[1]), val = val[0];
        if (val instanceof u8)
          t3[n3] = [val, op];
        else {
          t3[n3 += "/"] = [new u8(0), op];
          fltn(val, n3, t3, o2);
        }
      }
    };
    te = typeof TextEncoder != "undefined" && /* @__PURE__ */ new TextEncoder();
    td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
    tds = 0;
    try {
      td.decode(et, { stream: true });
      tds = 1;
    } catch (e2) {
    }
    dutf8 = function(d2) {
      for (var r2 = "", i2 = 0; ; ) {
        var c2 = d2[i2++];
        var eb = (c2 > 127) + (c2 > 223) + (c2 > 239);
        if (i2 + eb > d2.length)
          return { s: r2, r: slc(d2, i2 - 1) };
        if (!eb)
          r2 += String.fromCharCode(c2);
        else if (eb == 3) {
          c2 = ((c2 & 15) << 18 | (d2[i2++] & 63) << 12 | (d2[i2++] & 63) << 6 | d2[i2++] & 63) - 65536, r2 += String.fromCharCode(55296 | c2 >> 10, 56320 | c2 & 1023);
        } else if (eb & 1)
          r2 += String.fromCharCode((c2 & 31) << 6 | d2[i2++] & 63);
        else
          r2 += String.fromCharCode((c2 & 15) << 12 | (d2[i2++] & 63) << 6 | d2[i2++] & 63);
      }
    };
    DecodeUTF8 = /* @__PURE__ */ (function() {
      function DecodeUTF82(cb) {
        this.ondata = cb;
        if (tds)
          this.t = new TextDecoder();
        else
          this.p = et;
      }
      DecodeUTF82.prototype.push = function(chunk, final) {
        if (!this.ondata)
          err(5);
        final = !!final;
        if (this.t) {
          this.ondata(this.t.decode(chunk, { stream: true }), final);
          if (final) {
            if (this.t.decode().length)
              err(8);
            this.t = null;
          }
          return;
        }
        if (!this.p)
          err(4);
        var dat = new u8(this.p.length + chunk.length);
        dat.set(this.p);
        dat.set(chunk, this.p.length);
        var _a3 = dutf8(dat), s2 = _a3.s, r2 = _a3.r;
        if (final) {
          if (r2.length)
            err(8);
          this.p = null;
        } else
          this.p = r2;
        this.ondata(s2, final);
      };
      return DecodeUTF82;
    })();
    EncodeUTF8 = /* @__PURE__ */ (function() {
      function EncodeUTF82(cb) {
        this.ondata = cb;
      }
      EncodeUTF82.prototype.push = function(chunk, final) {
        if (!this.ondata)
          err(5);
        if (this.d)
          err(4);
        this.ondata(strToU8(chunk), this.d = final || false);
      };
      return EncodeUTF82;
    })();
    dbf = function(l2) {
      return l2 == 1 ? 3 : l2 < 6 ? 2 : l2 == 9 ? 1 : 0;
    };
    slzh = function(d2, b3) {
      return b3 + 30 + b2(d2, b3 + 26) + b2(d2, b3 + 28);
    };
    zh = function(d2, b3, z2) {
      var fnl = b2(d2, b3 + 28), fn = strFromU8(d2.subarray(b3 + 46, b3 + 46 + fnl), !(b2(d2, b3 + 8) & 2048)), es = b3 + 46 + fnl, bs = b4(d2, b3 + 20);
      var _a3 = z2 && bs == 4294967295 ? z64e(d2, es) : [bs, b4(d2, b3 + 24), b4(d2, b3 + 42)], sc = _a3[0], su = _a3[1], off = _a3[2];
      return [b2(d2, b3 + 10), sc, su, fn, es + b2(d2, b3 + 30) + b2(d2, b3 + 32), off];
    };
    z64e = function(d2, b3) {
      for (; b2(d2, b3) != 1; b3 += 4 + b2(d2, b3 + 2))
        ;
      return [b8(d2, b3 + 12), b8(d2, b3 + 4), b8(d2, b3 + 20)];
    };
    exfl = function(ex) {
      var le = 0;
      if (ex) {
        for (var k2 in ex) {
          var l2 = ex[k2].length;
          if (l2 > 65535)
            err(9);
          le += l2 + 4;
        }
      }
      return le;
    };
    wzh = function(d2, b3, f2, fn, u2, c2, ce, co) {
      var fl2 = fn.length, ex = f2.extra, col = co && co.length;
      var exl = exfl(ex);
      wbytes(d2, b3, ce != null ? 33639248 : 67324752), b3 += 4;
      if (ce != null)
        d2[b3++] = 20, d2[b3++] = f2.os;
      d2[b3] = 20, b3 += 2;
      d2[b3++] = f2.flag << 1 | (c2 < 0 && 8), d2[b3++] = u2 && 8;
      d2[b3++] = f2.compression & 255, d2[b3++] = f2.compression >> 8;
      var dt = new Date(f2.mtime == null ? Date.now() : f2.mtime), y2 = dt.getFullYear() - 1980;
      if (y2 < 0 || y2 > 119)
        err(10);
      wbytes(d2, b3, y2 << 25 | dt.getMonth() + 1 << 21 | dt.getDate() << 16 | dt.getHours() << 11 | dt.getMinutes() << 5 | dt.getSeconds() >> 1), b3 += 4;
      if (c2 != -1) {
        wbytes(d2, b3, f2.crc);
        wbytes(d2, b3 + 4, c2 < 0 ? -c2 - 2 : c2);
        wbytes(d2, b3 + 8, f2.size);
      }
      wbytes(d2, b3 + 12, fl2);
      wbytes(d2, b3 + 14, exl), b3 += 16;
      if (ce != null) {
        wbytes(d2, b3, col);
        wbytes(d2, b3 + 6, f2.attrs);
        wbytes(d2, b3 + 10, ce), b3 += 14;
      }
      d2.set(fn, b3);
      b3 += fl2;
      if (exl) {
        for (var k2 in ex) {
          var exf = ex[k2], l2 = exf.length;
          wbytes(d2, b3, +k2);
          wbytes(d2, b3 + 2, l2);
          d2.set(exf, b3 + 4), b3 += 4 + l2;
        }
      }
      if (col)
        d2.set(co, b3), b3 += col;
      return b3;
    };
    wzf = function(o2, b3, c2, d2, e2) {
      wbytes(o2, b3, 101010256);
      wbytes(o2, b3 + 8, c2);
      wbytes(o2, b3 + 10, c2);
      wbytes(o2, b3 + 12, d2);
      wbytes(o2, b3 + 16, e2);
    };
    ZipPassThrough = /* @__PURE__ */ (function() {
      function ZipPassThrough2(filename) {
        this.filename = filename;
        this.c = crc();
        this.size = 0;
        this.compression = 0;
      }
      ZipPassThrough2.prototype.process = function(chunk, final) {
        this.ondata(null, chunk, final);
      };
      ZipPassThrough2.prototype.push = function(chunk, final) {
        if (!this.ondata)
          err(5);
        this.c.p(chunk);
        this.size += chunk.length;
        if (final)
          this.crc = this.c.d();
        this.process(chunk, final || false);
      };
      return ZipPassThrough2;
    })();
    ZipDeflate = /* @__PURE__ */ (function() {
      function ZipDeflate2(filename, opts) {
        var _this = this;
        if (!opts)
          opts = {};
        ZipPassThrough.call(this, filename);
        this.d = new Deflate(opts, function(dat, final) {
          _this.ondata(null, dat, final);
        });
        this.compression = 8;
        this.flag = dbf(opts.level);
      }
      ZipDeflate2.prototype.process = function(chunk, final) {
        try {
          this.d.push(chunk, final);
        } catch (e2) {
          this.ondata(e2, null, final);
        }
      };
      ZipDeflate2.prototype.push = function(chunk, final) {
        ZipPassThrough.prototype.push.call(this, chunk, final);
      };
      return ZipDeflate2;
    })();
    AsyncZipDeflate = /* @__PURE__ */ (function() {
      function AsyncZipDeflate2(filename, opts) {
        var _this = this;
        if (!opts)
          opts = {};
        ZipPassThrough.call(this, filename);
        this.d = new AsyncDeflate(opts, function(err2, dat, final) {
          _this.ondata(err2, dat, final);
        });
        this.compression = 8;
        this.flag = dbf(opts.level);
        this.terminate = this.d.terminate;
      }
      AsyncZipDeflate2.prototype.process = function(chunk, final) {
        this.d.push(chunk, final);
      };
      AsyncZipDeflate2.prototype.push = function(chunk, final) {
        ZipPassThrough.prototype.push.call(this, chunk, final);
      };
      return AsyncZipDeflate2;
    })();
    Zip = /* @__PURE__ */ (function() {
      function Zip2(cb) {
        this.ondata = cb;
        this.u = [];
        this.d = 1;
      }
      Zip2.prototype.add = function(file) {
        var _this = this;
        if (!this.ondata)
          err(5);
        if (this.d & 2)
          this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, false);
        else {
          var f2 = strToU8(file.filename), fl_1 = f2.length;
          var com = file.comment, o2 = com && strToU8(com);
          var u2 = fl_1 != file.filename.length || o2 && com.length != o2.length;
          var hl_1 = fl_1 + exfl(file.extra) + 30;
          if (fl_1 > 65535)
            this.ondata(err(11, 0, 1), null, false);
          var header = new u8(hl_1);
          wzh(header, 0, file, f2, u2, -1);
          var chks_1 = [header];
          var pAll_1 = function() {
            for (var _i = 0, chks_2 = chks_1; _i < chks_2.length; _i++) {
              var chk = chks_2[_i];
              _this.ondata(null, chk, false);
            }
            chks_1 = [];
          };
          var tr_1 = this.d;
          this.d = 0;
          var ind_1 = this.u.length;
          var uf_1 = mrg(file, {
            f: f2,
            u: u2,
            o: o2,
            t: function() {
              if (file.terminate)
                file.terminate();
            },
            r: function() {
              pAll_1();
              if (tr_1) {
                var nxt = _this.u[ind_1 + 1];
                if (nxt)
                  nxt.r();
                else
                  _this.d = 1;
              }
              tr_1 = 1;
            }
          });
          var cl_1 = 0;
          file.ondata = function(err2, dat, final) {
            if (err2) {
              _this.ondata(err2, dat, final);
              _this.terminate();
            } else {
              cl_1 += dat.length;
              chks_1.push(dat);
              if (final) {
                var dd = new u8(16);
                wbytes(dd, 0, 134695760);
                wbytes(dd, 4, file.crc);
                wbytes(dd, 8, cl_1);
                wbytes(dd, 12, file.size);
                chks_1.push(dd);
                uf_1.c = cl_1, uf_1.b = hl_1 + cl_1 + 16, uf_1.crc = file.crc, uf_1.size = file.size;
                if (tr_1)
                  uf_1.r();
                tr_1 = 1;
              } else if (tr_1)
                pAll_1();
            }
          };
          this.u.push(uf_1);
        }
      };
      Zip2.prototype.end = function() {
        var _this = this;
        if (this.d & 2) {
          this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, true);
          return;
        }
        if (this.d)
          this.e();
        else
          this.u.push({
            r: function() {
              if (!(_this.d & 1))
                return;
              _this.u.splice(-1, 1);
              _this.e();
            },
            t: function() {
            }
          });
        this.d = 3;
      };
      Zip2.prototype.e = function() {
        var bt = 0, l2 = 0, tl = 0;
        for (var _i = 0, _a3 = this.u; _i < _a3.length; _i++) {
          var f2 = _a3[_i];
          tl += 46 + f2.f.length + exfl(f2.extra) + (f2.o ? f2.o.length : 0);
        }
        var out = new u8(tl + 22);
        for (var _b2 = 0, _c = this.u; _b2 < _c.length; _b2++) {
          var f2 = _c[_b2];
          wzh(out, bt, f2, f2.f, f2.u, -f2.c - 2, l2, f2.o);
          bt += 46 + f2.f.length + exfl(f2.extra) + (f2.o ? f2.o.length : 0), l2 += f2.b;
        }
        wzf(out, bt, this.u.length, tl, l2);
        this.ondata(null, out, true);
        this.d = 2;
      };
      Zip2.prototype.terminate = function() {
        for (var _i = 0, _a3 = this.u; _i < _a3.length; _i++) {
          var f2 = _a3[_i];
          f2.t();
        }
        this.d = 2;
      };
      return Zip2;
    })();
    UnzipPassThrough = /* @__PURE__ */ (function() {
      function UnzipPassThrough2() {
      }
      UnzipPassThrough2.prototype.push = function(data, final) {
        this.ondata(null, data, final);
      };
      UnzipPassThrough2.compression = 0;
      return UnzipPassThrough2;
    })();
    UnzipInflate = /* @__PURE__ */ (function() {
      function UnzipInflate2() {
        var _this = this;
        this.i = new Inflate(function(dat, final) {
          _this.ondata(null, dat, final);
        });
      }
      UnzipInflate2.prototype.push = function(data, final) {
        try {
          this.i.push(data, final);
        } catch (e2) {
          this.ondata(e2, null, final);
        }
      };
      UnzipInflate2.compression = 8;
      return UnzipInflate2;
    })();
    AsyncUnzipInflate = /* @__PURE__ */ (function() {
      function AsyncUnzipInflate2(_2, sz) {
        var _this = this;
        if (sz < 32e4) {
          this.i = new Inflate(function(dat, final) {
            _this.ondata(null, dat, final);
          });
        } else {
          this.i = new AsyncInflate(function(err2, dat, final) {
            _this.ondata(err2, dat, final);
          });
          this.terminate = this.i.terminate;
        }
      }
      AsyncUnzipInflate2.prototype.push = function(data, final) {
        if (this.i.terminate)
          data = slc(data, 0);
        this.i.push(data, final);
      };
      AsyncUnzipInflate2.compression = 8;
      return AsyncUnzipInflate2;
    })();
    Unzip = /* @__PURE__ */ (function() {
      function Unzip2(cb) {
        this.onfile = cb;
        this.k = [];
        this.o = {
          0: UnzipPassThrough
        };
        this.p = et;
      }
      Unzip2.prototype.push = function(chunk, final) {
        var _this = this;
        if (!this.onfile)
          err(5);
        if (!this.p)
          err(4);
        if (this.c > 0) {
          var len = Math.min(this.c, chunk.length);
          var toAdd = chunk.subarray(0, len);
          this.c -= len;
          if (this.d)
            this.d.push(toAdd, !this.c);
          else
            this.k[0].push(toAdd);
          chunk = chunk.subarray(len);
          if (chunk.length)
            return this.push(chunk, final);
        } else {
          var f2 = 0, i2 = 0, is = void 0, buf = void 0;
          if (!this.p.length)
            buf = chunk;
          else if (!chunk.length)
            buf = this.p;
          else {
            buf = new u8(this.p.length + chunk.length);
            buf.set(this.p), buf.set(chunk, this.p.length);
          }
          var l2 = buf.length, oc = this.c, add = oc && this.d;
          var _loop_2 = function() {
            var _a3;
            var sig = b4(buf, i2);
            if (sig == 67324752) {
              f2 = 1, is = i2;
              this_1.d = null;
              this_1.c = 0;
              var bf = b2(buf, i2 + 6), cmp_1 = b2(buf, i2 + 8), u2 = bf & 2048, dd = bf & 8, fnl = b2(buf, i2 + 26), es = b2(buf, i2 + 28);
              if (l2 > i2 + 30 + fnl + es) {
                var chks_3 = [];
                this_1.k.unshift(chks_3);
                f2 = 2;
                var sc_1 = b4(buf, i2 + 18), su_1 = b4(buf, i2 + 22);
                var fn_1 = strFromU8(buf.subarray(i2 + 30, i2 += 30 + fnl), !u2);
                if (sc_1 == 4294967295) {
                  _a3 = dd ? [-2] : z64e(buf, i2), sc_1 = _a3[0], su_1 = _a3[1];
                } else if (dd)
                  sc_1 = -1;
                i2 += es;
                this_1.c = sc_1;
                var d_1;
                var file_1 = {
                  name: fn_1,
                  compression: cmp_1,
                  start: function() {
                    if (!file_1.ondata)
                      err(5);
                    if (!sc_1)
                      file_1.ondata(null, et, true);
                    else {
                      var ctr = _this.o[cmp_1];
                      if (!ctr)
                        file_1.ondata(err(14, "unknown compression type " + cmp_1, 1), null, false);
                      d_1 = sc_1 < 0 ? new ctr(fn_1) : new ctr(fn_1, sc_1, su_1);
                      d_1.ondata = function(err2, dat3, final2) {
                        file_1.ondata(err2, dat3, final2);
                      };
                      for (var _i = 0, chks_4 = chks_3; _i < chks_4.length; _i++) {
                        var dat2 = chks_4[_i];
                        d_1.push(dat2, false);
                      }
                      if (_this.k[0] == chks_3 && _this.c)
                        _this.d = d_1;
                      else
                        d_1.push(et, true);
                    }
                  },
                  terminate: function() {
                    if (d_1 && d_1.terminate)
                      d_1.terminate();
                  }
                };
                if (sc_1 >= 0)
                  file_1.size = sc_1, file_1.originalSize = su_1;
                this_1.onfile(file_1);
              }
              return "break";
            } else if (oc) {
              if (sig == 134695760) {
                is = i2 += 12 + (oc == -2 && 8), f2 = 3, this_1.c = 0;
                return "break";
              } else if (sig == 33639248) {
                is = i2 -= 4, f2 = 3, this_1.c = 0;
                return "break";
              }
            }
          };
          var this_1 = this;
          for (; i2 < l2 - 4; ++i2) {
            var state_1 = _loop_2();
            if (state_1 === "break")
              break;
          }
          this.p = et;
          if (oc < 0) {
            var dat = f2 ? buf.subarray(0, is - 12 - (oc == -2 && 8) - (b4(buf, is - 16) == 134695760 && 4)) : buf.subarray(0, i2);
            if (add)
              add.push(dat, !!f2);
            else
              this.k[+(f2 == 2)].push(dat);
          }
          if (f2 & 2)
            return this.push(buf.subarray(i2), final);
          this.p = buf.subarray(i2);
        }
        if (final) {
          if (this.c)
            err(13);
          this.p = null;
        }
      };
      Unzip2.prototype.register = function(decoder) {
        this.o[decoder.compression] = decoder;
      };
      return Unzip2;
    })();
    mt = typeof queueMicrotask == "function" ? queueMicrotask : typeof setTimeout == "function" ? setTimeout : function(fn) {
      fn();
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/session_replay/aggregate/index.js
var aggregate_exports7 = {};
__export(aggregate_exports7, {
  Aggregate: () => Aggregate7
});
var Aggregate7;
var init_aggregate7 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/session_replay/aggregate/index.js"() {
    init_register_handler();
    init_constants12();
    init_aggregate_base();
    init_shared_channel();
    init_encode();
    init_console();
    init_runtime();
    init_env_npm();
    init_constants3();
    init_stringify();
    init_stylesheet_evaluator();
    init_now();
    init_agent_constants();
    init_clean_url();
    init_feature_gates();
    init_constants();
    Aggregate7 = class extends AggregateBase {
      static featureName = FEATURE_NAME10;
      mode = MODE.OFF;
      // pass the recorder into the aggregator
      constructor(agentRef, args) {
        super(agentRef, FEATURE_NAME10);
        this.initialized = false;
        this.blocked = false;
        this.gzipper = void 0;
        this.u8 = void 0;
        this.shouldCompress = true;
        this.entitled = false;
        this.timeKeeper = void 0;
        this.instrumentClass = args;
        this.recorder = this.instrumentClass?.recorder;
        this.harvestOpts.raw = true;
        this.isSessionTrackingEnabled = canEnableSessionTracking(agentRef.init) && !!agentRef.runtime.session;
        this.reportSupportabilityMetric("Config/SessionReplay/Enabled");
        this.ee.on(SESSION_EVENTS.RESET, () => {
          this.abort(ABORT_REASONS.RESET);
        });
        this.ee.on(SESSION_EVENTS.PAUSE, () => {
          this.recorder?.stopRecording();
        });
        this.ee.on(SESSION_EVENTS.RESUME, () => {
          if (!this.recorder) return;
          this.mode = agentRef.runtime.session.state.sessionReplayMode;
          if (!this.initialized || this.mode === MODE.OFF) return;
          this.recorder?.startRecording(TRIGGERS.RESUME, this.mode);
        });
        this.ee.on(SESSION_EVENTS.UPDATE, (type, data) => {
          if (!this.recorder || !this.initialized || this.blocked || type !== SESSION_EVENT_TYPES.CROSS_TAB) return;
          if (this.mode !== MODE.OFF && data.sessionReplayMode === MODE.OFF) this.abort(ABORT_REASONS.CROSS_TAB);
          this.mode = data.sessionReplayMode;
        });
        defaultRegister(PAUSE_REPLAY, () => {
          this.forceStop(this.mode === MODE.FULL);
        }, this.featureName, this.ee);
        defaultRegister(ERROR_DURING_REPLAY, (e2) => {
          this.handleError(e2);
        }, this.featureName, this.ee);
        const {
          error_sampling_rate,
          sampling_rate,
          autoStart,
          block_selector,
          mask_text_selector,
          mask_all_inputs,
          inline_images,
          collect_fonts
        } = agentRef.init.session_replay;
        this.waitForFlags(["srs", "sr"]).then(([srMode, entitled]) => {
          this.entitled = !!entitled;
          if (!this.entitled) {
            this.deregisterDrain();
            if (this.agentRef.runtime.isRecording) {
              this.abort(ABORT_REASONS.ENTITLEMENTS);
              this.reportSupportabilityMetric("SessionReplay/EnabledNotEntitled/Detected");
            }
            return;
          }
          this.initializeRecording(srMode).then(() => {
            this.drain();
          });
        }).then(() => {
          if (this.mode === MODE.OFF) {
            this.recorder?.stopRecording();
            while (this.recorder?.getEvents().events.length) this.recorder?.clearBuffer?.();
          }
          sharedChannel.onReplayReady(this.mode);
        });
        if (!autoStart) this.reportSupportabilityMetric("Config/SessionReplay/AutoStart/Modified");
        if (collect_fonts === true) this.reportSupportabilityMetric("Config/SessionReplay/CollectFonts/Modified");
        if (inline_images === true) this.reportSupportabilityMetric("Config/SessionReplay/InlineImages/Modifed");
        if (mask_all_inputs !== true) this.reportSupportabilityMetric("Config/SessionReplay/MaskAllInputs/Modified");
        if (block_selector !== "[data-nr-block]") this.reportSupportabilityMetric("Config/SessionReplay/BlockSelector/Modified");
        if (mask_text_selector !== "*") this.reportSupportabilityMetric("Config/SessionReplay/MaskTextSelector/Modified");
        this.reportSupportabilityMetric("Config/SessionReplay/SamplingRate/Value", sampling_rate);
        this.reportSupportabilityMetric("Config/SessionReplay/ErrorSamplingRate/Value", error_sampling_rate);
      }
      replayIsActive() {
        return Boolean(this.recorder && this.mode === MODE.FULL && !this.blocked && this.entitled);
      }
      handleError(e2) {
        if (this.recorder) this.recorder.events.hasError = true;
        if (this.mode === MODE.ERROR && globalScope?.document.visibilityState === "visible") {
          this.switchToFull();
        }
      }
      switchToFull() {
        if (!this.entitled || this.blocked) return;
        this.mode = MODE.FULL;
        if (this.recorder && this.initialized) {
          if (!this.agentRef.runtime.isRecording) this.recorder.startRecording(TRIGGERS.SWITCH_TO_FULL, this.mode);
          this.syncWithSessionManager({
            sessionReplayMode: this.mode
          });
        } else {
          this.initializeRecording(MODE.FULL, true, TRIGGERS.SWITCH_TO_FULL);
        }
      }
      /**
       * Evaluate entitlements and sampling before starting feature mechanics, importing and configuring recording library, and setting storage state
       * @param {boolean} srMode - the true/false state of the "sr" flag (aka. entitlements) from RUM response
       * @param {boolean} ignoreSession - whether to force the method to ignore the session state and use just the sample flags
       * @param {TRIGGERS} [trigger=TRIGGERS.INITIALIZE] - the trigger that initiated the recording.  Usually TRIGGERS.INITIALIZE, but could be TRIGGERS.API since in certain cases that trigger calls this method
       * @returns {void}
       */
      async initializeRecording(srMode, ignoreSession, trigger = TRIGGERS.INITIALIZE) {
        this.initialized = true;
        if (!this.entitled) return;
        const {
          session,
          timeKeeper
        } = this.agentRef.runtime;
        this.timeKeeper = timeKeeper;
        if (this.recorder?.trigger === TRIGGERS.API && this.agentRef.runtime.isRecording) {
          this.mode = MODE.FULL;
        } else if (!session.isNew && !ignoreSession) {
          this.mode = session.state.sessionReplayMode;
        } else {
          this.mode = srMode;
        }
        if (this.mode === MODE.OFF) return;
        try {
          this.recorder ??= await this.instrumentClass.importRecorder();
        } catch (err2) {
          return this.abort(ABORT_REASONS.IMPORT, err2);
        }
        if (this.mode === MODE.ERROR && this.instrumentClass.errorNoticed) {
          this.mode = MODE.FULL;
        }
        await this.prepUtils();
        if (!this.agentRef.runtime.isRecording) this.recorder.startRecording(trigger, this.mode);
        this.syncWithSessionManager({
          sessionReplayMode: this.mode
        });
      }
      async prepUtils() {
        try {
          const {
            gzipSync: gzipSync2,
            strToU8: strToU82
          } = await Promise.resolve().then(() => (init_browser(), browser_exports));
          this.gzipper = gzipSync2;
          this.u8 = strToU82;
        } catch (err2) {
          this.shouldCompress = false;
        }
      }
      makeHarvestPayload() {
        if (this.mode !== MODE.FULL || this.blocked) return;
        if (this.shouldCompress && !this.gzipper) return;
        if (!this.recorder || !this.timeKeeper?.ready || !(this.recorder.hasSeenSnapshot && this.recorder.hasSeenMeta)) return;
        const recorderEvents = this.recorder.getEvents();
        if (!recorderEvents.events.length) return;
        const payload = this.getHarvestContents(recorderEvents);
        if (!payload.body.length) {
          this.recorder.clearBuffer();
          return;
        }
        this.reportSupportabilityMetric("SessionReplay/Harvest/Attempts");
        let len = 0;
        if (!!this.gzipper && !!this.u8) {
          payload.body = this.gzipper(this.u8("[".concat(payload.body.map(({
            __serialized
          }) => __serialized).join(","), "]")));
          len = payload.body.length;
        } else {
          for (let idx in payload.body) delete payload.body[idx].__serialized;
          len = stringify(payload.body).length;
        }
        if (len > MAX_PAYLOAD_SIZE) {
          this.abort(ABORT_REASONS.TOO_BIG, len);
          return;
        }
        if (!this.agentRef.runtime.session.state.sessionReplaySentFirstChunk) this.syncWithSessionManager({
          sessionReplaySentFirstChunk: true
        });
        this.recorder.clearBuffer();
        if (!this.agentRef.runtime.session.state.traceHarvestStarted) {
          warn(59, JSON.stringify(this.agentRef.runtime.session.state));
        }
        return payload;
      }
      /**
       * returns the timestamps for the earliest and latest nodes in the provided array, even if out of order
       * @param {Object[]} [nodes] - the nodes to evaluate
       * @returns {{ firstEvent: Object|undefined, lastEvent: Object|undefined }} - the earliest and latest nodes. Defaults to undefined if no nodes are provided or if no timestamps are found in the nodes.
       */
      getFirstAndLastNodes(nodes = []) {
        const output = {
          firstEvent: nodes[0],
          lastEvent: nodes[nodes.length - 1]
        };
        nodes.forEach((node2) => {
          const timestamp = node2?.timestamp;
          if (!output.firstEvent?.timestamp || (timestamp || Infinity) < output.firstEvent.timestamp) output.firstEvent = node2;
          if (!output.lastEvent?.timestamp || (timestamp || -Infinity) > output.lastEvent.timestamp) output.lastEvent = node2;
        });
        return output;
      }
      getHarvestContents(recorderEvents) {
        recorderEvents ??= this.recorder.getEvents();
        let events = recorderEvents.events;
        const agentRuntime = this.agentRef.runtime;
        const endUserId = this.agentRef.info.jsAttributes?.["enduser.id"];
        const payloadStartsWithFullSnapshot = events?.[0]?.type === RRWEB_EVENT_TYPES.FullSnapshot;
        if (payloadStartsWithFullSnapshot && !!this.recorder.lastMeta) {
          recorderEvents.hasMeta = true;
          events.unshift(this.recorder.lastMeta);
          this.recorder.lastMeta = void 0;
        }
        const payloadEndsWithMeta = events[events.length - 1]?.type === RRWEB_EVENT_TYPES.Meta;
        if (payloadEndsWithMeta) {
          this.recorder.lastMeta = events[events.length - 1];
          events = events.slice(0, events.length - 1);
          recorderEvents.hasMeta = !!events.find((x3) => x3.type === RRWEB_EVENT_TYPES.Meta);
        }
        const relativeNow = now();
        const {
          firstEvent,
          lastEvent
        } = this.getFirstAndLastNodes(events);
        const firstTimestamp = firstEvent?.timestamp || Math.floor(this.timeKeeper.correctAbsoluteTimestamp(recorderEvents.cycleTimestamp));
        const lastTimestamp = lastEvent?.timestamp || Math.floor(this.timeKeeper.correctRelativeTimestamp(relativeNow));
        const agentMetadata = agentRuntime.appMetadata?.agents?.[0] || {};
        return {
          qs: {
            browser_monitoring_key: this.agentRef.info.licenseKey,
            type: "SessionReplay",
            app_id: this.agentRef.info.applicationID,
            protocol_version: "0",
            timestamp: firstTimestamp,
            attributes: obj({
              // this section of attributes must be controllable and stay below the query param padding limit -- see QUERY_PARAM_PADDING
              // if not, data could be lost to truncation at time of sending, potentially breaking parsing / API behavior in NR1
              ...!!this.gzipper && !!this.u8 && {
                content_encoding: "gzip"
              },
              ...agentMetadata.entityGuid && {
                entityGuid: agentMetadata.entityGuid
              },
              harvestId: [agentRuntime.session?.state.value, agentRuntime.ptid, agentRuntime.harvestCount].filter((x3) => x3).join("_"),
              "replay.firstTimestamp": firstTimestamp,
              "replay.lastTimestamp": lastTimestamp,
              "replay.nodes": events.length,
              "session.durationMs": agentRuntime.session.getDuration(),
              agentVersion: agentRuntime.version,
              session: agentRuntime.session.state.value,
              rst: relativeNow,
              hasMeta: recorderEvents.hasMeta || false,
              hasSnapshot: recorderEvents.hasSnapshot || false,
              hasError: recorderEvents.hasError || false,
              isFirstChunk: agentRuntime.session.state.sessionReplaySentFirstChunk === false,
              decompressedBytes: recorderEvents.payloadBytesEstimation,
              invalidStylesheetsDetected: stylesheetEvaluator.invalidStylesheetsDetected,
              inlinedAllStylesheets: recorderEvents.inlinedAllStylesheets,
              "rrweb.version": RRWEB_PACKAGE_NAME + "@" + RRWEB_VERSION,
              "payload.type": recorderEvents.type,
              // customer-defined data should go last so that if it exceeds the query param padding limit it will be truncated instead of important attrs
              ...endUserId && {
                "enduser.id": this.obfuscator.obfuscateString(endUserId)
              },
              currentUrl: this.obfuscator.obfuscateString(cleanURL("" + location))
              // The Query Param is being arbitrarily limited in length here.  It is also applied when estimating the size of the payload in getPayloadSize()
            }, QUERY_PARAM_PADDING2).substring(1)
            // remove the leading '&'
          },
          body: events
        };
      }
      postHarvestCleanup(result2) {
        if (result2.status === 429) {
          this.abort(ABORT_REASONS.TOO_MANY);
        }
      }
      /**
       * Forces the agent into OFF mode so that changing tabs or navigating
       * does not restart the recording. This is used when the customer calls
       * the stopRecording API.
       */
      forceStop(forceHarvest) {
        if (forceHarvest) this.agentRef.runtime.harvester.triggerHarvestFor(this);
        this.mode = MODE.OFF;
        this.recorder?.stopRecording?.();
        this.syncWithSessionManager({
          sessionReplayMode: this.mode
        });
      }
      /** Abort the feature, once aborted it will not resume */
      abort(reason = {}, data) {
        warn(33, reason.message);
        this.reportSupportabilityMetric("SessionReplay/Abort/".concat(reason.sm), data);
        this.blocked = true;
        this.mode = MODE.OFF;
        this.recorder?.stopRecording?.();
        this.syncWithSessionManager({
          sessionReplayMode: this.mode
        });
        this.recorder?.clearTimestamps?.();
        while (this.recorder?.getEvents().events.length) this.recorder?.clearBuffer?.();
      }
      syncWithSessionManager(state = {}) {
        if (this.isSessionTrackingEnabled) {
          this.agentRef.runtime.session.write(state);
        }
      }
    };
  }
});

// node_modules/@newrelic/rrweb/dist/rrweb.js
function getUntaintedPrototype$1(key) {
  if (untaintedBasePrototype$1[key])
    return untaintedBasePrototype$1[key];
  const defaultObj = globalThis[key];
  const defaultPrototype = defaultObj.prototype;
  const accessorNames = key in testableAccessors$1 ? testableAccessors$1[key] : void 0;
  const isUntaintedAccessors = Boolean(
    accessorNames && accessorNames.every(
      (accessor) => {
        var _a22, _b2;
        return Boolean(
          (_b2 = (_a22 = Object.getOwnPropertyDescriptor(defaultPrototype, accessor)) == null ? void 0 : _a22.get) == null ? void 0 : _b2.toString().includes("[native code]")
        );
      }
    )
  );
  const methodNames = key in testableMethods$1 ? testableMethods$1[key] : void 0;
  const isUntaintedMethods = Boolean(
    methodNames && methodNames.every(
      (method) => {
        var _a22;
        return typeof defaultPrototype[method] === "function" && ((_a22 = defaultPrototype[method]) == null ? void 0 : _a22.toString().includes("[native code]"));
      }
    )
  );
  if (isUntaintedAccessors && isUntaintedMethods && !isAngularZonePresent$1()) {
    untaintedBasePrototype$1[key] = defaultObj.prototype;
    return defaultObj.prototype;
  }
  try {
    const iframeEl = document.createElement("iframe");
    document.body.appendChild(iframeEl);
    const win = iframeEl.contentWindow;
    if (!win) return defaultObj.prototype;
    const untaintedObject = win[key].prototype;
    document.body.removeChild(iframeEl);
    if (!untaintedObject) return defaultPrototype;
    return untaintedBasePrototype$1[key] = untaintedObject;
  } catch {
    return defaultPrototype;
  }
}
function getUntaintedAccessor$1(key, instance, accessor) {
  var _a22;
  const cacheKey = `${key}.${String(accessor)}`;
  if (untaintedAccessorCache$1[cacheKey])
    return untaintedAccessorCache$1[cacheKey].call(
      instance
    );
  const untaintedPrototype = getUntaintedPrototype$1(key);
  const untaintedAccessor = (_a22 = Object.getOwnPropertyDescriptor(
    untaintedPrototype,
    accessor
  )) == null ? void 0 : _a22.get;
  if (!untaintedAccessor) return instance[accessor];
  untaintedAccessorCache$1[cacheKey] = untaintedAccessor;
  return untaintedAccessor.call(instance);
}
function getUntaintedMethod$1(key, instance, method) {
  const cacheKey = `${key}.${String(method)}`;
  if (untaintedMethodCache$1[cacheKey])
    return untaintedMethodCache$1[cacheKey].bind(
      instance
    );
  const untaintedPrototype = getUntaintedPrototype$1(key);
  const untaintedMethod = untaintedPrototype[method];
  if (typeof untaintedMethod !== "function") return instance[method];
  untaintedMethodCache$1[cacheKey] = untaintedMethod;
  return untaintedMethod.bind(instance);
}
function childNodes$1(n22) {
  return getUntaintedAccessor$1("Node", n22, "childNodes");
}
function parentNode$1(n22) {
  return getUntaintedAccessor$1("Node", n22, "parentNode");
}
function parentElement$1(n22) {
  return getUntaintedAccessor$1("Node", n22, "parentElement");
}
function textContent$1(n22) {
  return getUntaintedAccessor$1("Node", n22, "textContent");
}
function contains$1(n22, other) {
  return getUntaintedMethod$1("Node", n22, "contains")(other);
}
function getRootNode$1(n22) {
  return getUntaintedMethod$1("Node", n22, "getRootNode")();
}
function host$1(n22) {
  if (!n22 || !("host" in n22)) return null;
  return getUntaintedAccessor$1("ShadowRoot", n22, "host");
}
function styleSheets$1(n22) {
  return n22.styleSheets;
}
function shadowRoot$1(n22) {
  if (!n22 || !("shadowRoot" in n22)) return null;
  return getUntaintedAccessor$1("Element", n22, "shadowRoot");
}
function querySelector$1(n22, selectors) {
  return getUntaintedAccessor$1("Element", n22, "querySelector")(selectors);
}
function querySelectorAll$1(n22, selectors) {
  return getUntaintedAccessor$1("Element", n22, "querySelectorAll")(selectors);
}
function mutationObserverCtor$1() {
  return getUntaintedPrototype$1("MutationObserver").constructor;
}
function patch$1(source, name, replacement) {
  try {
    if (!(name in source)) {
      return () => {
      };
    }
    const original = source[name];
    const wrapped6 = replacement(original);
    if (typeof wrapped6 === "function") {
      wrapped6.prototype = wrapped6.prototype || {};
      Object.defineProperties(wrapped6, {
        __rrweb_original__: {
          enumerable: false,
          value: original
        }
      });
    }
    source[name] = wrapped6;
    return () => {
      source[name] = original;
    };
  } catch {
    return () => {
    };
  }
}
function isElement(n22) {
  return n22.nodeType === n22.ELEMENT_NODE;
}
function isShadowRoot(n22) {
  const hostEl = n22 && "host" in n22 && "mode" in n22 && index$1.host(n22) || null;
  return Boolean(hostEl && "shadowRoot" in hostEl && index$1.shadowRoot(hostEl) === n22);
}
function isNativeShadowDom(shadowRoot2) {
  return Object.prototype.toString.call(shadowRoot2) === "[object ShadowRoot]";
}
function fixBrowserCompatibilityIssuesInCSS(cssText) {
  if (cssText.includes(" background-clip: text;") && !cssText.includes(" -webkit-background-clip: text;")) {
    cssText = cssText.replace(/\sbackground-clip:\s*text;/g, " -webkit-background-clip: text; background-clip: text;");
  }
  return cssText;
}
function escapeImportStatement(rule2) {
  const { cssText } = rule2;
  if (cssText.split('"').length < 3)
    return cssText;
  const statement = ["@import", `url(${JSON.stringify(rule2.href)})`];
  if (rule2.layerName === "") {
    statement.push(`layer`);
  } else if (rule2.layerName) {
    statement.push(`layer(${rule2.layerName})`);
  }
  if (rule2.supportsText) {
    statement.push(`supports(${rule2.supportsText})`);
  }
  if (rule2.media.length) {
    statement.push(rule2.media.mediaText);
  }
  return statement.join(" ") + ";";
}
function stringifyStylesheet(s2) {
  try {
    const rules2 = s2.rules || s2.cssRules;
    if (!rules2) {
      return null;
    }
    let sheetHref = s2.href;
    if (!sheetHref && s2.ownerNode) {
      sheetHref = s2.ownerNode.baseURI;
    }
    const stringifiedRules = Array.from(rules2, (rule2) => stringifyRule(rule2, sheetHref)).join("");
    return fixBrowserCompatibilityIssuesInCSS(stringifiedRules);
  } catch (error) {
    return null;
  }
}
function stringifyRule(rule2, sheetHref) {
  if (isCSSImportRule(rule2)) {
    let importStringified;
    try {
      importStringified = stringifyStylesheet(rule2.styleSheet) || escapeImportStatement(rule2);
    } catch (error) {
      importStringified = rule2.cssText;
    }
    if (rule2.styleSheet.href) {
      return absolutifyURLs(importStringified, rule2.styleSheet.href);
    }
    return importStringified;
  } else {
    let ruleStringified = rule2.cssText;
    if (isCSSStyleRule(rule2) && rule2.selectorText.includes(":")) {
      ruleStringified = fixSafariColons(ruleStringified);
    }
    if (sheetHref) {
      return absolutifyURLs(ruleStringified, sheetHref);
    }
    return ruleStringified;
  }
}
function fixSafariColons(cssStringified) {
  const regex = /(\[(?:[\w-]+)[^\\])(:(?:[\w-]+)\])/gm;
  return cssStringified.replace(regex, "$1\\$2");
}
function isCSSImportRule(rule2) {
  return "styleSheet" in rule2;
}
function isCSSStyleRule(rule2) {
  return "selectorText" in rule2;
}
function createMirror$2() {
  return new Mirror();
}
function maskInputValue({ element, maskInputOptions, tagName, type, value, maskInputFn }) {
  let text = value || "";
  const actualType = type && toLowerCase(type);
  if (maskInputOptions[tagName.toLowerCase()] || actualType && maskInputOptions[actualType]) {
    if (maskInputFn) {
      text = maskInputFn(text, element);
    } else {
      text = "*".repeat(text.length);
    }
  }
  return text;
}
function toLowerCase(str) {
  return str.toLowerCase();
}
function is2DCanvasBlank(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx)
    return true;
  const chunkSize = 50;
  for (let x22 = 0; x22 < canvas.width; x22 += chunkSize) {
    for (let y2 = 0; y2 < canvas.height; y2 += chunkSize) {
      const getImageData = ctx.getImageData;
      const originalGetImageData = ORIGINAL_ATTRIBUTE_NAME in getImageData ? getImageData[ORIGINAL_ATTRIBUTE_NAME] : getImageData;
      const pixelBuffer = new Uint32Array(originalGetImageData.call(ctx, x22, y2, Math.min(chunkSize, canvas.width - x22), Math.min(chunkSize, canvas.height - y2)).data.buffer);
      if (pixelBuffer.some((pixel) => pixel !== 0))
        return false;
    }
  }
  return true;
}
function getInputType(element) {
  const type = element.type;
  return element.hasAttribute("data-rr-is-password") ? "password" : type ? toLowerCase(type) : null;
}
function extractFileExtension(path, baseURL) {
  let url;
  try {
    url = new URL(path, baseURL ?? window.location.href);
  } catch (err2) {
    return null;
  }
  const regex = /\.([0-9a-z]+)(?:$)/i;
  const match = url.pathname.match(regex);
  return (match == null ? void 0 : match[1]) ?? null;
}
function extractOrigin(url) {
  let origin = "";
  if (url.indexOf("//") > -1) {
    origin = url.split("/").slice(0, 3).join("/");
  } else {
    origin = url.split("/")[0];
  }
  origin = origin.split("?")[0];
  return origin;
}
function absolutifyURLs(cssText, href) {
  return (cssText || "").replace(URL_IN_CSS_REF, (origin, quote1, path1, quote2, path2, path3) => {
    const filePath = path1 || path2 || path3;
    const maybeQuote = quote1 || quote2 || "";
    if (!filePath) {
      return origin;
    }
    if (URL_PROTOCOL_MATCH.test(filePath) || URL_WWW_MATCH.test(filePath)) {
      return `url(${maybeQuote}${filePath}${maybeQuote})`;
    }
    if (DATA_URI.test(filePath)) {
      return `url(${maybeQuote}${filePath}${maybeQuote})`;
    }
    if (filePath[0] === "/") {
      return `url(${maybeQuote}${extractOrigin(href) + filePath}${maybeQuote})`;
    }
    const stack = href.split("/");
    const parts = filePath.split("/");
    stack.pop();
    for (const part of parts) {
      if (part === ".") {
        continue;
      } else if (part === "..") {
        stack.pop();
      } else {
        stack.push(part);
      }
    }
    return `url(${maybeQuote}${stack.join("/")}${maybeQuote})`;
  });
}
function normalizeCssString(cssText, _testNoPxNorm = false) {
  if (_testNoPxNorm) {
    return cssText.replace(/(\/\*[^*]*\*\/)|[\s;]/g, "");
  } else {
    return cssText.replace(/(\/\*[^*]*\*\/)|[\s;]/g, "").replace(/0px/g, "0");
  }
}
function splitCssText(cssText, style, _testNoPxNorm = false) {
  const childNodes2 = Array.from(style.childNodes);
  const splits = [];
  let iterCount = 0;
  if (childNodes2.length > 1 && cssText && typeof cssText === "string") {
    let cssTextNorm = normalizeCssString(cssText, _testNoPxNorm);
    const normFactor = cssTextNorm.length / cssText.length;
    for (let i2 = 1; i2 < childNodes2.length; i2++) {
      if (childNodes2[i2].textContent && typeof childNodes2[i2].textContent === "string") {
        const textContentNorm = normalizeCssString(childNodes2[i2].textContent, _testNoPxNorm);
        const jLimit = 100;
        let j2 = 3;
        for (; j2 < textContentNorm.length; j2++) {
          if (textContentNorm[j2].match(/[a-zA-Z0-9]/) || textContentNorm.indexOf(textContentNorm.substring(0, j2), 1) !== -1) {
            continue;
          }
          break;
        }
        for (; j2 < textContentNorm.length; j2++) {
          let startSubstring = textContentNorm.substring(0, j2);
          let cssNormSplits = cssTextNorm.split(startSubstring);
          let splitNorm = -1;
          if (cssNormSplits.length === 2) {
            splitNorm = cssNormSplits[0].length;
          } else if (cssNormSplits.length > 2 && cssNormSplits[0] === "" && childNodes2[i2 - 1].textContent !== "") {
            splitNorm = cssTextNorm.indexOf(startSubstring, 1);
          } else if (cssNormSplits.length === 1) {
            startSubstring = startSubstring.substring(0, startSubstring.length - 1);
            cssNormSplits = cssTextNorm.split(startSubstring);
            if (cssNormSplits.length <= 1) {
              splits.push(cssText);
              return splits;
            }
            j2 = jLimit + 1;
          } else if (j2 === textContentNorm.length - 1) {
            splitNorm = cssTextNorm.indexOf(startSubstring);
          }
          if (cssNormSplits.length >= 2 && j2 > jLimit) {
            const prevTextContent = childNodes2[i2 - 1].textContent;
            if (prevTextContent && typeof prevTextContent === "string") {
              const prevMinLength = normalizeCssString(prevTextContent).length;
              splitNorm = cssTextNorm.indexOf(startSubstring, prevMinLength);
            }
            if (splitNorm === -1) {
              splitNorm = cssNormSplits[0].length;
            }
          }
          if (splitNorm !== -1) {
            let k2 = Math.floor(splitNorm / normFactor);
            for (; k2 > 0 && k2 < cssText.length; ) {
              iterCount += 1;
              if (iterCount > 50 * childNodes2.length) {
                splits.push(cssText);
                return splits;
              }
              const normPart = normalizeCssString(cssText.substring(0, k2), _testNoPxNorm);
              if (normPart.length === splitNorm) {
                splits.push(cssText.substring(0, k2));
                cssText = cssText.substring(k2);
                cssTextNorm = cssTextNorm.substring(splitNorm);
                break;
              } else if (normPart.length < splitNorm) {
                k2 += Math.max(1, Math.floor((splitNorm - normPart.length) / normFactor));
              } else {
                k2 -= Math.max(1, Math.floor((normPart.length - splitNorm) * normFactor));
              }
            }
            break;
          }
        }
      }
    }
  }
  splits.push(cssText);
  return splits;
}
function markCssSplits(cssText, style) {
  return splitCssText(cssText, style).join("/* rr_split */");
}
function genId() {
  return _id++;
}
function getValidTagName$1(element) {
  if (element instanceof HTMLFormElement) {
    return "form";
  }
  const processedTagName = toLowerCase(element.tagName);
  if (tagNameRegex.test(processedTagName)) {
    return "div";
  }
  return processedTagName;
}
function getAbsoluteSrcsetString(doc, attributeValue) {
  if (attributeValue.trim() === "") {
    return attributeValue;
  }
  let pos = 0;
  function collectCharacters(regEx) {
    let chars2;
    const match = regEx.exec(attributeValue.substring(pos));
    if (match) {
      chars2 = match[0];
      pos += chars2.length;
      return chars2;
    }
    return "";
  }
  const output = [];
  while (true) {
    collectCharacters(SRCSET_COMMAS_OR_SPACES);
    if (pos >= attributeValue.length) {
      break;
    }
    let url = collectCharacters(SRCSET_NOT_SPACES);
    if (url.slice(-1) === ",") {
      url = absoluteToDoc(doc, url.substring(0, url.length - 1));
      output.push(url);
    } else {
      let descriptorsStr = "";
      url = absoluteToDoc(doc, url);
      let inParens = false;
      while (true) {
        const c2 = attributeValue.charAt(pos);
        if (c2 === "") {
          output.push((url + descriptorsStr).trim());
          break;
        } else if (!inParens) {
          if (c2 === ",") {
            pos += 1;
            output.push((url + descriptorsStr).trim());
            break;
          } else if (c2 === "(") {
            inParens = true;
          }
        } else {
          if (c2 === ")") {
            inParens = false;
          }
        }
        descriptorsStr += c2;
        pos += 1;
      }
    }
  }
  return output.join(", ");
}
function absoluteToDoc(doc, attributeValue) {
  if (!attributeValue || attributeValue.trim() === "") {
    return attributeValue;
  }
  return getHref(doc, attributeValue);
}
function isSVGElement(el) {
  return Boolean(el.tagName === "svg" || el.ownerSVGElement);
}
function getHref(doc, customHref) {
  let a2 = cachedDocument.get(doc);
  if (!a2) {
    a2 = doc.createElement("a");
    cachedDocument.set(doc, a2);
  }
  if (!customHref) {
    customHref = "";
  } else if (customHref.startsWith("blob:") || customHref.startsWith("data:")) {
    return customHref;
  }
  a2.setAttribute("href", customHref);
  return a2.href;
}
function transformAttribute(doc, tagName, name, value) {
  if (!value) {
    return value;
  }
  if (name === "src" || name === "href" && !(tagName === "use" && value[0] === "#")) {
    return absoluteToDoc(doc, value);
  } else if (name === "xlink:href" && value[0] !== "#") {
    return absoluteToDoc(doc, value);
  } else if (name === "background" && (tagName === "table" || tagName === "td" || tagName === "th")) {
    return absoluteToDoc(doc, value);
  } else if (name === "srcset") {
    return getAbsoluteSrcsetString(doc, value);
  } else if (name === "style") {
    return absolutifyURLs(value, getHref(doc));
  } else if (tagName === "object" && name === "data") {
    return absoluteToDoc(doc, value);
  }
  return value;
}
function ignoreAttribute(tagName, name, _value) {
  return (tagName === "video" || tagName === "audio") && name === "autoplay";
}
function _isBlockedElement(element, blockClass, blockSelector) {
  try {
    if (typeof blockClass === "string") {
      if (element.classList.contains(blockClass)) {
        return true;
      }
    } else {
      for (let eIndex = element.classList.length; eIndex--; ) {
        const className = element.classList[eIndex];
        if (blockClass.test(className)) {
          return true;
        }
      }
    }
    if (blockSelector) {
      return element.matches(blockSelector);
    }
  } catch (e2) {
  }
  return false;
}
function classMatchesRegex(node2, regex, checkAncestors) {
  if (!node2)
    return false;
  if (node2.nodeType !== node2.ELEMENT_NODE) {
    if (!checkAncestors)
      return false;
    return classMatchesRegex(index$1.parentNode(node2), regex, checkAncestors);
  }
  for (let eIndex = node2.classList.length; eIndex--; ) {
    const className = node2.classList[eIndex];
    if (regex.test(className)) {
      return true;
    }
  }
  if (!checkAncestors)
    return false;
  return classMatchesRegex(index$1.parentNode(node2), regex, checkAncestors);
}
function needMaskingText(node2, maskTextClass, maskTextSelector, checkAncestors) {
  let el;
  if (isElement(node2)) {
    el = node2;
    if (!index$1.childNodes(el).length) {
      return false;
    }
  } else if (index$1.parentElement(node2) === null) {
    return false;
  } else {
    el = index$1.parentElement(node2);
  }
  try {
    if (typeof maskTextClass === "string") {
      if (checkAncestors) {
        if (el.closest(`.${maskTextClass}`))
          return true;
      } else {
        if (el.classList.contains(maskTextClass))
          return true;
      }
    } else {
      if (classMatchesRegex(el, maskTextClass, checkAncestors))
        return true;
    }
    if (maskTextSelector) {
      if (checkAncestors) {
        if (el.closest(maskTextSelector))
          return true;
      } else {
        if (el.matches(maskTextSelector))
          return true;
      }
    }
  } catch (e2) {
  }
  return false;
}
function onceIframeLoaded(iframeEl, listener, iframeLoadTimeout) {
  const win = iframeEl.contentWindow;
  if (!win) {
    return;
  }
  let fired = false;
  let readyState;
  try {
    readyState = win.document.readyState;
  } catch (error) {
    return;
  }
  if (readyState !== "complete") {
    const timer = setTimeout(() => {
      if (!fired) {
        listener();
        fired = true;
      }
    }, iframeLoadTimeout);
    iframeEl.addEventListener("load", () => {
      clearTimeout(timer);
      fired = true;
      listener();
    });
    return;
  }
  const blankUrl = "about:blank";
  if (win.location.href !== blankUrl || iframeEl.src === blankUrl || iframeEl.src === "") {
    setTimeout(listener, 0);
    return iframeEl.addEventListener("load", listener);
  }
  iframeEl.addEventListener("load", listener);
}
function onceStylesheetLoaded(link, listener, styleSheetLoadTimeout) {
  let fired = false;
  let styleSheetLoaded;
  try {
    styleSheetLoaded = link.sheet;
  } catch (error) {
    return;
  }
  if (styleSheetLoaded)
    return;
  const timer = setTimeout(() => {
    if (!fired) {
      listener();
      fired = true;
    }
  }, styleSheetLoadTimeout);
  link.addEventListener("load", () => {
    clearTimeout(timer);
    fired = true;
    listener();
  });
}
function serializeNode(n22, options) {
  const { doc, mirror: mirror2, blockClass, blockSelector, needsMask, inlineStylesheet, maskInputOptions = {}, maskTextFn, maskInputFn, dataURLOptions = {}, inlineImages, recordCanvas, keepIframeSrcFn, newlyAddedElement = false, cssCaptured = false } = options;
  const rootId = getRootId(doc, mirror2);
  switch (n22.nodeType) {
    case n22.DOCUMENT_NODE:
      if (n22.compatMode !== "CSS1Compat") {
        return {
          type: NodeType$3.Document,
          childNodes: [],
          compatMode: n22.compatMode
        };
      } else {
        return {
          type: NodeType$3.Document,
          childNodes: []
        };
      }
    case n22.DOCUMENT_TYPE_NODE:
      return {
        type: NodeType$3.DocumentType,
        name: n22.name,
        publicId: n22.publicId,
        systemId: n22.systemId,
        rootId
      };
    case n22.ELEMENT_NODE:
      return serializeElementNode(n22, {
        doc,
        blockClass,
        blockSelector,
        inlineStylesheet,
        maskInputOptions,
        maskInputFn,
        dataURLOptions,
        inlineImages,
        recordCanvas,
        keepIframeSrcFn,
        newlyAddedElement,
        rootId
      });
    case n22.TEXT_NODE:
      return serializeTextNode(n22, {
        doc,
        needsMask,
        maskTextFn,
        rootId,
        cssCaptured
      });
    case n22.CDATA_SECTION_NODE:
      return {
        type: NodeType$3.CDATA,
        textContent: "",
        rootId
      };
    case n22.COMMENT_NODE:
      return {
        type: NodeType$3.Comment,
        textContent: index$1.textContent(n22) || "",
        rootId
      };
    default:
      return false;
  }
}
function getRootId(doc, mirror2) {
  if (!mirror2.hasNode(doc))
    return void 0;
  const docId = mirror2.getId(doc);
  return docId === 1 ? void 0 : docId;
}
function serializeTextNode(n22, options) {
  const { needsMask, maskTextFn, rootId, cssCaptured } = options;
  const parent = index$1.parentNode(n22);
  const parentTagName = parent && parent.tagName;
  let textContent2 = "";
  const isStyle = parentTagName === "STYLE" ? true : void 0;
  const isScript = parentTagName === "SCRIPT" ? true : void 0;
  if (isScript) {
    textContent2 = "SCRIPT_PLACEHOLDER";
  } else if (!cssCaptured) {
    textContent2 = index$1.textContent(n22);
    if (isStyle && textContent2) {
      textContent2 = absolutifyURLs(textContent2, getHref(options.doc));
    }
  }
  if (!isStyle && !isScript && textContent2 && needsMask) {
    textContent2 = maskTextFn ? maskTextFn(textContent2, index$1.parentElement(n22)) : textContent2.replace(/[\S]/g, "*");
  }
  return {
    type: NodeType$3.Text,
    textContent: textContent2 || "",
    rootId
  };
}
function serializeElementNode(n22, options) {
  const { doc, blockClass, blockSelector, inlineStylesheet, maskInputOptions = {}, maskInputFn, dataURLOptions = {}, inlineImages, recordCanvas, keepIframeSrcFn, newlyAddedElement = false, rootId } = options;
  const needBlock = _isBlockedElement(n22, blockClass, blockSelector);
  const tagName = getValidTagName$1(n22);
  let attributes = {};
  const len = n22.attributes.length;
  for (let i2 = 0; i2 < len; i2++) {
    const attr = n22.attributes[i2];
    if (!ignoreAttribute(tagName, attr.name, attr.value)) {
      attributes[attr.name] = transformAttribute(doc, tagName, toLowerCase(attr.name), attr.value);
    }
  }
  if (tagName === "link" && inlineStylesheet) {
    const stylesheet = Array.from(doc.styleSheets).find((s2) => {
      return s2.href === n22.href;
    });
    let cssText = null;
    if (stylesheet) {
      cssText = stringifyStylesheet(stylesheet);
    }
    if (cssText) {
      delete attributes.rel;
      delete attributes.href;
      attributes._cssText = cssText;
    }
  }
  if (tagName === "style" && n22.sheet) {
    let cssText = stringifyStylesheet(n22.sheet);
    if (cssText) {
      if (n22.childNodes.length > 1) {
        cssText = markCssSplits(cssText, n22);
      }
      attributes._cssText = cssText;
    }
  }
  if (tagName === "input" || tagName === "textarea" || tagName === "select") {
    const value = n22.value;
    const checked2 = n22.checked;
    if (attributes.type !== "radio" && attributes.type !== "checkbox" && attributes.type !== "submit" && attributes.type !== "button" && value) {
      attributes.value = maskInputValue({
        element: n22,
        type: getInputType(n22),
        tagName,
        value,
        maskInputOptions,
        maskInputFn
      });
    } else if (checked2) {
      attributes.checked = checked2;
    }
  }
  if (tagName === "option") {
    if (n22.selected && !maskInputOptions["select"]) {
      attributes.selected = true;
    } else {
      delete attributes.selected;
    }
  }
  if (tagName === "dialog" && n22.open) {
    attributes.rr_open_mode = n22.matches("dialog:modal") ? "modal" : "non-modal";
  }
  if (tagName === "canvas" && recordCanvas) {
    if (n22.__context === "2d") {
      if (!is2DCanvasBlank(n22)) {
        attributes.rr_dataURL = n22.toDataURL(dataURLOptions.type, dataURLOptions.quality);
      }
    } else if (!("__context" in n22)) {
      const canvasDataURL = n22.toDataURL(dataURLOptions.type, dataURLOptions.quality);
      const blankCanvas = doc.createElement("canvas");
      blankCanvas.width = n22.width;
      blankCanvas.height = n22.height;
      const blankCanvasDataURL = blankCanvas.toDataURL(dataURLOptions.type, dataURLOptions.quality);
      if (canvasDataURL !== blankCanvasDataURL) {
        attributes.rr_dataURL = canvasDataURL;
      }
    }
  }
  if (tagName === "img" && inlineImages) {
    if (!canvasService) {
      canvasService = doc.createElement("canvas");
      canvasCtx = canvasService.getContext("2d");
    }
    const image = n22;
    const imageSrc = image.currentSrc || image.getAttribute("src") || "<unknown-src>";
    const priorCrossOrigin = image.crossOrigin;
    const recordInlineImage = () => {
      image.removeEventListener("load", recordInlineImage);
      try {
        canvasService.width = image.naturalWidth;
        canvasService.height = image.naturalHeight;
        canvasCtx.drawImage(image, 0, 0);
        attributes.rr_dataURL = canvasService.toDataURL(dataURLOptions.type, dataURLOptions.quality);
      } catch (err2) {
        if (image.crossOrigin !== "anonymous") {
          image.crossOrigin = "anonymous";
          if (image.complete && image.naturalWidth !== 0)
            recordInlineImage();
          else
            image.addEventListener("load", recordInlineImage);
          return;
        } else {
          console.warn(`Cannot inline img src=${imageSrc}! Error: ${err2}`);
        }
      }
      if (image.crossOrigin === "anonymous") {
        priorCrossOrigin ? attributes.crossOrigin = priorCrossOrigin : image.removeAttribute("crossorigin");
      }
    };
    if (image.complete && image.naturalWidth !== 0)
      recordInlineImage();
    else
      image.addEventListener("load", recordInlineImage);
  }
  if (tagName === "audio" || tagName === "video") {
    const mediaAttributes = attributes;
    mediaAttributes.rr_mediaState = n22.paused ? "paused" : "played";
    mediaAttributes.rr_mediaCurrentTime = n22.currentTime;
    mediaAttributes.rr_mediaPlaybackRate = n22.playbackRate;
    mediaAttributes.rr_mediaMuted = n22.muted;
    mediaAttributes.rr_mediaLoop = n22.loop;
    mediaAttributes.rr_mediaVolume = n22.volume;
  }
  if (!newlyAddedElement) {
    if (n22.scrollLeft) {
      attributes.rr_scrollLeft = n22.scrollLeft;
    }
    if (n22.scrollTop) {
      attributes.rr_scrollTop = n22.scrollTop;
    }
  }
  if (needBlock) {
    const { width, height } = n22.getBoundingClientRect();
    attributes = {
      class: attributes.class,
      rr_width: `${width}px`,
      rr_height: `${height}px`
    };
  }
  if (tagName === "iframe" && !keepIframeSrcFn(attributes.src)) {
    if (!n22.contentDocument) {
      attributes.rr_src = attributes.src;
    }
    delete attributes.src;
  }
  let isCustomElement;
  try {
    if (customElements.get(tagName))
      isCustomElement = true;
  } catch (e2) {
  }
  return {
    type: NodeType$3.Element,
    tagName,
    attributes,
    childNodes: [],
    isSVG: isSVGElement(n22) || void 0,
    needBlock,
    rootId,
    isCustom: isCustomElement
  };
}
function lowerIfExists(maybeAttr) {
  if (maybeAttr === void 0 || maybeAttr === null) {
    return "";
  } else {
    return maybeAttr.toLowerCase();
  }
}
function slimDOMExcluded(sn, slimDOMOptions) {
  if (slimDOMOptions.comment && sn.type === NodeType$3.Comment) {
    return true;
  } else if (sn.type === NodeType$3.Element) {
    if (slimDOMOptions.script && (sn.tagName === "script" || sn.tagName === "link" && (sn.attributes.rel === "preload" && sn.attributes.as === "script" || sn.attributes.rel === "modulepreload") || sn.tagName === "link" && sn.attributes.rel === "prefetch" && typeof sn.attributes.href === "string" && extractFileExtension(sn.attributes.href) === "js")) {
      return true;
    } else if (slimDOMOptions.headFavicon && (sn.tagName === "link" && sn.attributes.rel === "shortcut icon" || sn.tagName === "meta" && (lowerIfExists(sn.attributes.name).match(/^msapplication-tile(image|color)$/) || lowerIfExists(sn.attributes.name) === "application-name" || lowerIfExists(sn.attributes.rel) === "icon" || lowerIfExists(sn.attributes.rel) === "apple-touch-icon" || lowerIfExists(sn.attributes.rel) === "shortcut icon"))) {
      return true;
    } else if (sn.tagName === "meta") {
      if (slimDOMOptions.headMetaDescKeywords && lowerIfExists(sn.attributes.name).match(/^description|keywords$/)) {
        return true;
      } else if (slimDOMOptions.headMetaSocial && (lowerIfExists(sn.attributes.property).match(/^(og|twitter|fb):/) || lowerIfExists(sn.attributes.name).match(/^(og|twitter):/) || lowerIfExists(sn.attributes.name) === "pinterest")) {
        return true;
      } else if (slimDOMOptions.headMetaRobots && (lowerIfExists(sn.attributes.name) === "robots" || lowerIfExists(sn.attributes.name) === "googlebot" || lowerIfExists(sn.attributes.name) === "bingbot")) {
        return true;
      } else if (slimDOMOptions.headMetaHttpEquiv && sn.attributes["http-equiv"] !== void 0) {
        return true;
      } else if (slimDOMOptions.headMetaAuthorship && (lowerIfExists(sn.attributes.name) === "author" || lowerIfExists(sn.attributes.name) === "generator" || lowerIfExists(sn.attributes.name) === "framework" || lowerIfExists(sn.attributes.name) === "publisher" || lowerIfExists(sn.attributes.name) === "progid" || lowerIfExists(sn.attributes.property).match(/^article:/) || lowerIfExists(sn.attributes.property).match(/^product:/))) {
        return true;
      } else if (slimDOMOptions.headMetaVerification && (lowerIfExists(sn.attributes.name) === "google-site-verification" || lowerIfExists(sn.attributes.name) === "yandex-verification" || lowerIfExists(sn.attributes.name) === "csrf-token" || lowerIfExists(sn.attributes.name) === "p:domain_verify" || lowerIfExists(sn.attributes.name) === "verify-v1" || lowerIfExists(sn.attributes.name) === "verification" || lowerIfExists(sn.attributes.name) === "shopify-checkout-api-token")) {
        return true;
      }
    }
  }
  return false;
}
function serializeNodeWithId(n22, options) {
  const { doc, mirror: mirror2, blockClass, blockSelector, maskTextClass, maskTextSelector, skipChild = false, inlineStylesheet = true, maskInputOptions = {}, maskTextFn, maskInputFn, slimDOMOptions, dataURLOptions = {}, inlineImages = false, recordCanvas = false, onSerialize, onIframeLoad, iframeLoadTimeout = 5e3, onStylesheetLoad, stylesheetLoadTimeout = 5e3, keepIframeSrcFn = () => false, newlyAddedElement = false, cssCaptured = false } = options;
  let { needsMask } = options;
  let { preserveWhiteSpace = true } = options;
  if (!needsMask) {
    const checkAncestors = needsMask === void 0;
    needsMask = needMaskingText(n22, maskTextClass, maskTextSelector, checkAncestors);
  }
  const _serializedNode = serializeNode(n22, {
    doc,
    mirror: mirror2,
    blockClass,
    blockSelector,
    needsMask,
    inlineStylesheet,
    maskInputOptions,
    maskTextFn,
    maskInputFn,
    dataURLOptions,
    inlineImages,
    recordCanvas,
    keepIframeSrcFn,
    newlyAddedElement,
    cssCaptured
  });
  if (!_serializedNode) {
    console.warn(n22, "not serialized");
    return null;
  }
  let id2;
  if (mirror2.hasNode(n22)) {
    id2 = mirror2.getId(n22);
  } else if (slimDOMExcluded(_serializedNode, slimDOMOptions) || !preserveWhiteSpace && _serializedNode.type === NodeType$3.Text && !_serializedNode.textContent.replace(/^\s+|\s+$/gm, "").length) {
    id2 = IGNORED_NODE;
  } else {
    id2 = genId();
  }
  const serializedNode = Object.assign(_serializedNode, { id: id2 });
  mirror2.add(n22, serializedNode);
  if (id2 === IGNORED_NODE) {
    return null;
  }
  if (onSerialize) {
    onSerialize(n22);
  }
  let recordChild = !skipChild;
  if (serializedNode.type === NodeType$3.Element) {
    recordChild = recordChild && !serializedNode.needBlock;
    delete serializedNode.needBlock;
    const shadowRootEl = index$1.shadowRoot(n22);
    if (shadowRootEl && isNativeShadowDom(shadowRootEl))
      serializedNode.isShadowHost = true;
  }
  if ((serializedNode.type === NodeType$3.Document || serializedNode.type === NodeType$3.Element) && recordChild) {
    if (slimDOMOptions.headWhitespace && serializedNode.type === NodeType$3.Element && serializedNode.tagName === "head") {
      preserveWhiteSpace = false;
    }
    const bypassOptions = {
      doc,
      mirror: mirror2,
      blockClass,
      blockSelector,
      needsMask,
      maskTextClass,
      maskTextSelector,
      skipChild,
      inlineStylesheet,
      maskInputOptions,
      maskTextFn,
      maskInputFn,
      slimDOMOptions,
      dataURLOptions,
      inlineImages,
      recordCanvas,
      preserveWhiteSpace,
      onSerialize,
      onIframeLoad,
      iframeLoadTimeout,
      onStylesheetLoad,
      stylesheetLoadTimeout,
      keepIframeSrcFn,
      cssCaptured: false
    };
    if (serializedNode.type === NodeType$3.Element && serializedNode.tagName === "textarea" && serializedNode.attributes.value !== void 0) ;
    else {
      if (serializedNode.type === NodeType$3.Element && serializedNode.attributes._cssText !== void 0 && typeof serializedNode.attributes._cssText === "string") {
        bypassOptions.cssCaptured = true;
      }
      for (const childN of Array.from(index$1.childNodes(n22))) {
        const serializedChildNode = serializeNodeWithId(childN, bypassOptions);
        if (serializedChildNode) {
          serializedNode.childNodes.push(serializedChildNode);
        }
      }
    }
    let shadowRootEl = null;
    if (isElement(n22) && (shadowRootEl = index$1.shadowRoot(n22))) {
      for (const childN of Array.from(index$1.childNodes(shadowRootEl))) {
        const serializedChildNode = serializeNodeWithId(childN, bypassOptions);
        if (serializedChildNode) {
          isNativeShadowDom(shadowRootEl) && (serializedChildNode.isShadow = true);
          serializedNode.childNodes.push(serializedChildNode);
        }
      }
    }
  }
  const parent = index$1.parentNode(n22);
  if (parent && isShadowRoot(parent) && isNativeShadowDom(parent)) {
    serializedNode.isShadow = true;
  }
  if (serializedNode.type === NodeType$3.Element && serializedNode.tagName === "iframe") {
    onceIframeLoaded(n22, () => {
      const iframeDoc = n22.contentDocument;
      if (iframeDoc && onIframeLoad) {
        const serializedIframeNode = serializeNodeWithId(iframeDoc, {
          doc: iframeDoc,
          mirror: mirror2,
          blockClass,
          blockSelector,
          needsMask,
          maskTextClass,
          maskTextSelector,
          skipChild: false,
          inlineStylesheet,
          maskInputOptions,
          maskTextFn,
          maskInputFn,
          slimDOMOptions,
          dataURLOptions,
          inlineImages,
          recordCanvas,
          preserveWhiteSpace,
          onSerialize,
          onIframeLoad,
          iframeLoadTimeout,
          onStylesheetLoad,
          stylesheetLoadTimeout,
          keepIframeSrcFn
        });
        if (serializedIframeNode) {
          onIframeLoad(n22, serializedIframeNode);
        }
      }
    }, iframeLoadTimeout);
  }
  if (serializedNode.type === NodeType$3.Element && serializedNode.tagName === "link" && typeof serializedNode.attributes.rel === "string" && (serializedNode.attributes.rel === "stylesheet" || serializedNode.attributes.rel === "preload" && typeof serializedNode.attributes.href === "string" && extractFileExtension(serializedNode.attributes.href) === "css")) {
    onceStylesheetLoaded(n22, () => {
      if (onStylesheetLoad) {
        const serializedLinkNode = serializeNodeWithId(n22, {
          doc,
          mirror: mirror2,
          blockClass,
          blockSelector,
          needsMask,
          maskTextClass,
          maskTextSelector,
          skipChild: false,
          inlineStylesheet,
          maskInputOptions,
          maskTextFn,
          maskInputFn,
          slimDOMOptions,
          dataURLOptions,
          inlineImages,
          recordCanvas,
          preserveWhiteSpace,
          onSerialize,
          onIframeLoad,
          iframeLoadTimeout,
          onStylesheetLoad,
          stylesheetLoadTimeout,
          keepIframeSrcFn
        });
        if (serializedLinkNode) {
          onStylesheetLoad(n22, serializedLinkNode);
        }
      }
    }, stylesheetLoadTimeout);
  }
  return serializedNode;
}
function snapshot(n22, options) {
  const { mirror: mirror2 = new Mirror(), blockClass = "rr-block", blockSelector = null, maskTextClass = "rr-mask", maskTextSelector = null, inlineStylesheet = true, inlineImages = false, recordCanvas = false, maskAllInputs = false, maskTextFn, maskInputFn, slimDOM = false, dataURLOptions, preserveWhiteSpace, onSerialize, onIframeLoad, iframeLoadTimeout, onStylesheetLoad, stylesheetLoadTimeout, keepIframeSrcFn = () => false } = options || {};
  const maskInputOptions = maskAllInputs === true ? {
    color: true,
    date: true,
    "datetime-local": true,
    email: true,
    month: true,
    number: true,
    range: true,
    search: true,
    tel: true,
    text: true,
    time: true,
    url: true,
    week: true,
    textarea: true,
    select: true,
    password: true
  } : maskAllInputs === false ? {
    password: true
  } : maskAllInputs;
  const slimDOMOptions = slimDOM === true || slimDOM === "all" ? {
    script: true,
    comment: true,
    headFavicon: true,
    headWhitespace: true,
    headMetaDescKeywords: slimDOM === "all",
    headMetaSocial: true,
    headMetaRobots: true,
    headMetaHttpEquiv: true,
    headMetaAuthorship: true,
    headMetaVerification: true
  } : slimDOM === false ? {} : slimDOM;
  return serializeNodeWithId(n22, {
    doc: n22,
    mirror: mirror2,
    blockClass,
    blockSelector,
    maskTextClass,
    maskTextSelector,
    skipChild: false,
    inlineStylesheet,
    maskInputOptions,
    maskTextFn,
    maskInputFn,
    slimDOMOptions,
    dataURLOptions,
    inlineImages,
    recordCanvas,
    preserveWhiteSpace,
    onSerialize,
    onIframeLoad,
    iframeLoadTimeout,
    onStylesheetLoad,
    stylesheetLoadTimeout,
    keepIframeSrcFn,
    newlyAddedElement: false
  });
}
function getDefaultExportFromCjs$1(x22) {
  return x22 && x22.__esModule && Object.prototype.hasOwnProperty.call(x22, "default") ? x22["default"] : x22;
}
function getAugmentedNamespace$1(n22) {
  if (n22.__esModule) return n22;
  var f2 = n22.default;
  if (typeof f2 == "function") {
    var a2 = function a22() {
      if (this instanceof a22) {
        return Reflect.construct(f2, arguments, this.constructor);
      }
      return f2.apply(this, arguments);
    };
    a2.prototype = f2.prototype;
  } else a2 = {};
  Object.defineProperty(a2, "__esModule", { value: true });
  Object.keys(n22).forEach(function(k2) {
    var d2 = Object.getOwnPropertyDescriptor(n22, k2);
    Object.defineProperty(a2, k2, d2.get ? d2 : {
      enumerable: true,
      get: function() {
        return n22[k2];
      }
    });
  });
  return a2;
}
function capitalize$1(str) {
  return str[0].toUpperCase() + str.slice(1);
}
function stringify$4$1(node2, builder) {
  let str = new Stringifier$1$1(builder);
  str.stringify(node2);
}
function cloneNode$1(obj2, parent) {
  let cloned = new obj2.constructor();
  for (let i2 in obj2) {
    if (!Object.prototype.hasOwnProperty.call(obj2, i2)) {
      continue;
    }
    if (i2 === "proxyCache") continue;
    let value = obj2[i2];
    let type = typeof value;
    if (i2 === "parent" && type === "object") {
      if (parent) cloned[i2] = parent;
    } else if (i2 === "source") {
      cloned[i2] = value;
    } else if (Array.isArray(value)) {
      cloned[i2] = value.map((j2) => cloneNode$1(j2, cloned));
    } else {
      if (type === "object" && value !== null) value = cloneNode$1(value);
      cloned[i2] = value;
    }
  }
  return cloned;
}
function fromBase64$1(str) {
  if (Buffer) {
    return Buffer.from(str, "base64").toString();
  } else {
    return window.atob(str);
  }
}
function cleanSource$1(nodes) {
  return nodes.map((i2) => {
    if (i2.nodes) i2.nodes = cleanSource$1(i2.nodes);
    delete i2.source;
    return i2;
  });
}
function markDirtyUp$1(node2) {
  node2[isClean$1$1] = false;
  if (node2.proxyOf.nodes) {
    for (let i2 of node2.proxyOf.nodes) {
      markDirtyUp$1(i2);
    }
  }
}
function findLastWithPosition$1(tokens) {
  for (let i2 = tokens.length - 1; i2 >= 0; i2--) {
    let token = tokens[i2];
    let pos = token[3] || token[2];
    if (pos) return pos;
  }
}
function parse$3$1(css, opts) {
  let input2 = new Input$2$1(css, opts);
  let parser2 = new Parser2$1(input2);
  try {
    parser2.parse();
  } catch (e2) {
    if (true) {
      if (e2.name === "CssSyntaxError" && opts && opts.from) {
        if (/\.scss$/i.test(opts.from)) {
          e2.message += "\nYou tried to parse SCSS with the standard CSS parser; try again with the postcss-scss parser";
        } else if (/\.sass/i.test(opts.from)) {
          e2.message += "\nYou tried to parse Sass with the standard CSS parser; try again with the postcss-sass parser";
        } else if (/\.less$/i.test(opts.from)) {
          e2.message += "\nYou tried to parse Less with the standard CSS parser; try again with the postcss-less parser";
        }
      }
    }
    throw e2;
  }
  return parser2.root;
}
function isPromise$1(obj2) {
  return typeof obj2 === "object" && typeof obj2.then === "function";
}
function getEvents$1(node2) {
  let key = false;
  let type = TYPE_TO_CLASS_NAME$1[node2.type];
  if (node2.type === "decl") {
    key = node2.prop.toLowerCase();
  } else if (node2.type === "atrule") {
    key = node2.name.toLowerCase();
  }
  if (key && node2.append) {
    return [
      type,
      type + "-" + key,
      CHILDREN$1,
      type + "Exit",
      type + "Exit-" + key
    ];
  } else if (key) {
    return [type, type + "-" + key, type + "Exit", type + "Exit-" + key];
  } else if (node2.append) {
    return [type, CHILDREN$1, type + "Exit"];
  } else {
    return [type, type + "Exit"];
  }
}
function toStack$1(node2) {
  let events;
  if (node2.type === "document") {
    events = ["Document", CHILDREN$1, "DocumentExit"];
  } else if (node2.type === "root") {
    events = ["Root", CHILDREN$1, "RootExit"];
  } else {
    events = getEvents$1(node2);
  }
  return {
    eventIndex: 0,
    events,
    iterator: 0,
    node: node2,
    visitorIndex: 0,
    visitors: []
  };
}
function cleanMarks$1(node2) {
  node2[isClean$3] = false;
  if (node2.nodes) node2.nodes.forEach((i2) => cleanMarks$1(i2));
  return node2;
}
function fromJSON$1$1(json, inputs) {
  if (Array.isArray(json)) return json.map((n22) => fromJSON$1$1(n22));
  let { inputs: ownInputs, ...defaults2 } = json;
  if (ownInputs) {
    inputs = [];
    for (let input2 of ownInputs) {
      let inputHydrated = { ...input2, __proto__: Input$1$1.prototype };
      if (inputHydrated.map) {
        inputHydrated.map = {
          ...inputHydrated.map,
          __proto__: PreviousMap2$1.prototype
        };
      }
      inputs.push(inputHydrated);
    }
  }
  if (defaults2.nodes) {
    defaults2.nodes = json.nodes.map((n22) => fromJSON$1$1(n22, inputs));
  }
  if (defaults2.source) {
    let { inputId, ...source } = defaults2.source;
    defaults2.source = source;
    if (inputId != null) {
      defaults2.source.input = inputs[inputId];
    }
  }
  if (defaults2.type === "root") {
    return new Root$1$1(defaults2);
  } else if (defaults2.type === "decl") {
    return new Declaration$1$1(defaults2);
  } else if (defaults2.type === "rule") {
    return new Rule$1$1(defaults2);
  } else if (defaults2.type === "comment") {
    return new Comment$1$1(defaults2);
  } else if (defaults2.type === "atrule") {
    return new AtRule$1$1(defaults2);
  } else {
    throw new Error("Unknown node type: " + json.type);
  }
}
function postcss$3(...plugins) {
  if (plugins.length === 1 && Array.isArray(plugins[0])) {
    plugins = plugins[0];
  }
  return new Processor2$1(plugins);
}
function getDefaultExportFromCjs(x22) {
  return x22 && x22.__esModule && Object.prototype.hasOwnProperty.call(x22, "default") ? x22["default"] : x22;
}
function getAugmentedNamespace(n22) {
  if (n22.__esModule) return n22;
  var f2 = n22.default;
  if (typeof f2 == "function") {
    var a2 = function a22() {
      if (this instanceof a22) {
        return Reflect.construct(f2, arguments, this.constructor);
      }
      return f2.apply(this, arguments);
    };
    a2.prototype = f2.prototype;
  } else a2 = {};
  Object.defineProperty(a2, "__esModule", { value: true });
  Object.keys(n22).forEach(function(k2) {
    var d2 = Object.getOwnPropertyDescriptor(n22, k2);
    Object.defineProperty(a2, k2, d2.get ? d2 : {
      enumerable: true,
      get: function() {
        return n22[k2];
      }
    });
  });
  return a2;
}
function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}
function stringify$4(node2, builder) {
  let str = new Stringifier$1(builder);
  str.stringify(node2);
}
function cloneNode(obj2, parent) {
  let cloned = new obj2.constructor();
  for (let i2 in obj2) {
    if (!Object.prototype.hasOwnProperty.call(obj2, i2)) {
      continue;
    }
    if (i2 === "proxyCache") continue;
    let value = obj2[i2];
    let type = typeof value;
    if (i2 === "parent" && type === "object") {
      if (parent) cloned[i2] = parent;
    } else if (i2 === "source") {
      cloned[i2] = value;
    } else if (Array.isArray(value)) {
      cloned[i2] = value.map((j2) => cloneNode(j2, cloned));
    } else {
      if (type === "object" && value !== null) value = cloneNode(value);
      cloned[i2] = value;
    }
  }
  return cloned;
}
function fromBase64(str) {
  if (Buffer) {
    return Buffer.from(str, "base64").toString();
  } else {
    return window.atob(str);
  }
}
function cleanSource(nodes) {
  return nodes.map((i2) => {
    if (i2.nodes) i2.nodes = cleanSource(i2.nodes);
    delete i2.source;
    return i2;
  });
}
function markDirtyUp(node2) {
  node2[isClean$1] = false;
  if (node2.proxyOf.nodes) {
    for (let i2 of node2.proxyOf.nodes) {
      markDirtyUp(i2);
    }
  }
}
function findLastWithPosition(tokens) {
  for (let i2 = tokens.length - 1; i2 >= 0; i2--) {
    let token = tokens[i2];
    let pos = token[3] || token[2];
    if (pos) return pos;
  }
}
function parse$3(css, opts) {
  let input2 = new Input$2(css, opts);
  let parser2 = new Parser22(input2);
  try {
    parser2.parse();
  } catch (e2) {
    if (true) {
      if (e2.name === "CssSyntaxError" && opts && opts.from) {
        if (/\.scss$/i.test(opts.from)) {
          e2.message += "\nYou tried to parse SCSS with the standard CSS parser; try again with the postcss-scss parser";
        } else if (/\.sass/i.test(opts.from)) {
          e2.message += "\nYou tried to parse Sass with the standard CSS parser; try again with the postcss-sass parser";
        } else if (/\.less$/i.test(opts.from)) {
          e2.message += "\nYou tried to parse Less with the standard CSS parser; try again with the postcss-less parser";
        }
      }
    }
    throw e2;
  }
  return parser2.root;
}
function isPromise(obj2) {
  return typeof obj2 === "object" && typeof obj2.then === "function";
}
function getEvents(node2) {
  let key = false;
  let type = TYPE_TO_CLASS_NAME[node2.type];
  if (node2.type === "decl") {
    key = node2.prop.toLowerCase();
  } else if (node2.type === "atrule") {
    key = node2.name.toLowerCase();
  }
  if (key && node2.append) {
    return [
      type,
      type + "-" + key,
      CHILDREN,
      type + "Exit",
      type + "Exit-" + key
    ];
  } else if (key) {
    return [type, type + "-" + key, type + "Exit", type + "Exit-" + key];
  } else if (node2.append) {
    return [type, CHILDREN, type + "Exit"];
  } else {
    return [type, type + "Exit"];
  }
}
function toStack(node2) {
  let events;
  if (node2.type === "document") {
    events = ["Document", CHILDREN, "DocumentExit"];
  } else if (node2.type === "root") {
    events = ["Root", CHILDREN, "RootExit"];
  } else {
    events = getEvents(node2);
  }
  return {
    eventIndex: 0,
    events,
    iterator: 0,
    node: node2,
    visitorIndex: 0,
    visitors: []
  };
}
function cleanMarks(node2) {
  node2[isClean] = false;
  if (node2.nodes) node2.nodes.forEach((i2) => cleanMarks(i2));
  return node2;
}
function fromJSON$1(json, inputs) {
  if (Array.isArray(json)) return json.map((n22) => fromJSON$1(n22));
  let { inputs: ownInputs, ...defaults2 } = json;
  if (ownInputs) {
    inputs = [];
    for (let input2 of ownInputs) {
      let inputHydrated = { ...input2, __proto__: Input$1.prototype };
      if (inputHydrated.map) {
        inputHydrated.map = {
          ...inputHydrated.map,
          __proto__: PreviousMap22.prototype
        };
      }
      inputs.push(inputHydrated);
    }
  }
  if (defaults2.nodes) {
    defaults2.nodes = json.nodes.map((n22) => fromJSON$1(n22, inputs));
  }
  if (defaults2.source) {
    let { inputId, ...source } = defaults2.source;
    defaults2.source = source;
    if (inputId != null) {
      defaults2.source.input = inputs[inputId];
    }
  }
  if (defaults2.type === "root") {
    return new Root$1(defaults2);
  } else if (defaults2.type === "decl") {
    return new Declaration$1(defaults2);
  } else if (defaults2.type === "rule") {
    return new Rule$1(defaults2);
  } else if (defaults2.type === "comment") {
    return new Comment$1(defaults2);
  } else if (defaults2.type === "atrule") {
    return new AtRule$1(defaults2);
  } else {
    throw new Error("Unknown node type: " + json.type);
  }
}
function postcss(...plugins) {
  if (plugins.length === 1 && Array.isArray(plugins[0])) {
    plugins = plugins[0];
  }
  return new Processor22(plugins);
}
function getUntaintedPrototype(key) {
  if (untaintedBasePrototype[key])
    return untaintedBasePrototype[key];
  const defaultObj = globalThis[key];
  const defaultPrototype = defaultObj.prototype;
  const accessorNames = key in testableAccessors ? testableAccessors[key] : void 0;
  const isUntaintedAccessors = Boolean(
    accessorNames && accessorNames.every(
      (accessor) => {
        var _a22, _b2;
        return Boolean(
          (_b2 = (_a22 = Object.getOwnPropertyDescriptor(defaultPrototype, accessor)) == null ? void 0 : _a22.get) == null ? void 0 : _b2.toString().includes("[native code]")
        );
      }
    )
  );
  const methodNames = key in testableMethods ? testableMethods[key] : void 0;
  const isUntaintedMethods = Boolean(
    methodNames && methodNames.every(
      (method) => {
        var _a22;
        return typeof defaultPrototype[method] === "function" && ((_a22 = defaultPrototype[method]) == null ? void 0 : _a22.toString().includes("[native code]"));
      }
    )
  );
  if (isUntaintedAccessors && isUntaintedMethods && !isAngularZonePresent()) {
    untaintedBasePrototype[key] = defaultObj.prototype;
    return defaultObj.prototype;
  }
  try {
    const iframeEl = document.createElement("iframe");
    document.body.appendChild(iframeEl);
    const win = iframeEl.contentWindow;
    if (!win) return defaultObj.prototype;
    const untaintedObject = win[key].prototype;
    document.body.removeChild(iframeEl);
    if (!untaintedObject) return defaultPrototype;
    return untaintedBasePrototype[key] = untaintedObject;
  } catch {
    return defaultPrototype;
  }
}
function getUntaintedAccessor(key, instance, accessor) {
  var _a22;
  const cacheKey = `${key}.${String(accessor)}`;
  if (untaintedAccessorCache[cacheKey])
    return untaintedAccessorCache[cacheKey].call(
      instance
    );
  const untaintedPrototype = getUntaintedPrototype(key);
  const untaintedAccessor = (_a22 = Object.getOwnPropertyDescriptor(
    untaintedPrototype,
    accessor
  )) == null ? void 0 : _a22.get;
  if (!untaintedAccessor) return instance[accessor];
  untaintedAccessorCache[cacheKey] = untaintedAccessor;
  return untaintedAccessor.call(instance);
}
function getUntaintedMethod(key, instance, method) {
  const cacheKey = `${key}.${String(method)}`;
  if (untaintedMethodCache[cacheKey])
    return untaintedMethodCache[cacheKey].bind(
      instance
    );
  const untaintedPrototype = getUntaintedPrototype(key);
  const untaintedMethod = untaintedPrototype[method];
  if (typeof untaintedMethod !== "function") return instance[method];
  untaintedMethodCache[cacheKey] = untaintedMethod;
  return untaintedMethod.bind(instance);
}
function childNodes(n22) {
  return getUntaintedAccessor("Node", n22, "childNodes");
}
function parentNode(n22) {
  return getUntaintedAccessor("Node", n22, "parentNode");
}
function parentElement(n22) {
  return getUntaintedAccessor("Node", n22, "parentElement");
}
function textContent(n22) {
  return getUntaintedAccessor("Node", n22, "textContent");
}
function contains(n22, other) {
  return getUntaintedMethod("Node", n22, "contains")(other);
}
function getRootNode(n22) {
  return getUntaintedMethod("Node", n22, "getRootNode")();
}
function host(n22) {
  if (!n22 || !("host" in n22)) return null;
  return getUntaintedAccessor("ShadowRoot", n22, "host");
}
function styleSheets(n22) {
  return n22.styleSheets;
}
function shadowRoot(n22) {
  if (!n22 || !("shadowRoot" in n22)) return null;
  return getUntaintedAccessor("Element", n22, "shadowRoot");
}
function querySelector(n22, selectors) {
  return getUntaintedAccessor("Element", n22, "querySelector")(selectors);
}
function querySelectorAll(n22, selectors) {
  return getUntaintedAccessor("Element", n22, "querySelectorAll")(selectors);
}
function mutationObserverCtor() {
  return getUntaintedPrototype("MutationObserver").constructor;
}
function patch(source, name, replacement) {
  try {
    if (!(name in source)) {
      return () => {
      };
    }
    const original = source[name];
    const wrapped6 = replacement(original);
    if (typeof wrapped6 === "function") {
      wrapped6.prototype = wrapped6.prototype || {};
      Object.defineProperties(wrapped6, {
        __rrweb_original__: {
          enumerable: false,
          value: original
        }
      });
    }
    source[name] = wrapped6;
    return () => {
      source[name] = original;
    };
  } catch {
    return () => {
    };
  }
}
function on(type, fn, target = document) {
  const options = { capture: true, passive: true };
  target.addEventListener(type, fn, options);
  return () => target.removeEventListener(type, fn, options);
}
function throttle(func, wait, options = {}) {
  let timeout = null;
  let previous = 0;
  return function(...args) {
    const now2 = Date.now();
    if (!previous && options.leading === false) {
      previous = now2;
    }
    const remaining = wait - (now2 - previous);
    const context = this;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now2;
      func.apply(context, args);
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(() => {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}
function hookSetter(target, key, d2, isRevoked, win = window) {
  const original = win.Object.getOwnPropertyDescriptor(target, key);
  win.Object.defineProperty(
    target,
    key,
    isRevoked ? d2 : {
      set(value) {
        setTimeout(() => {
          d2.set.call(this, value);
        }, 0);
        if (original && original.set) {
          original.set.call(this, value);
        }
      }
    }
  );
  return () => hookSetter(target, key, original || {}, true);
}
function getWindowScroll(win) {
  var _a22, _b2, _c, _d;
  const doc = win.document;
  return {
    left: doc.scrollingElement ? doc.scrollingElement.scrollLeft : win.pageXOffset !== void 0 ? win.pageXOffset : doc.documentElement.scrollLeft || (doc == null ? void 0 : doc.body) && ((_a22 = index2.parentElement(doc.body)) == null ? void 0 : _a22.scrollLeft) || ((_b2 = doc == null ? void 0 : doc.body) == null ? void 0 : _b2.scrollLeft) || 0,
    top: doc.scrollingElement ? doc.scrollingElement.scrollTop : win.pageYOffset !== void 0 ? win.pageYOffset : (doc == null ? void 0 : doc.documentElement.scrollTop) || (doc == null ? void 0 : doc.body) && ((_c = index2.parentElement(doc.body)) == null ? void 0 : _c.scrollTop) || ((_d = doc == null ? void 0 : doc.body) == null ? void 0 : _d.scrollTop) || 0
  };
}
function getWindowHeight() {
  return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body && document.body.clientHeight;
}
function getWindowWidth() {
  return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body && document.body.clientWidth;
}
function closestElementOfNode(node2) {
  if (!node2) {
    return null;
  }
  const el = node2.nodeType === node2.ELEMENT_NODE ? node2 : index2.parentElement(node2);
  return el;
}
function isBlocked(node2, blockClass, blockSelector, checkAncestors) {
  if (!node2) {
    return false;
  }
  const el = closestElementOfNode(node2);
  if (!el) {
    return false;
  }
  try {
    if (typeof blockClass === "string") {
      if (el.classList.contains(blockClass)) return true;
      if (checkAncestors && el.closest("." + blockClass) !== null) return true;
    } else {
      if (classMatchesRegex(el, blockClass, checkAncestors)) return true;
    }
  } catch (e2) {
  }
  if (blockSelector) {
    if (el.matches(blockSelector)) return true;
    if (checkAncestors && el.closest(blockSelector) !== null) return true;
  }
  return false;
}
function isSerialized(n22, mirror2) {
  return mirror2.getId(n22) !== -1;
}
function isIgnored(n22, mirror2, slimDOMOptions) {
  if (n22.tagName === "TITLE" && slimDOMOptions.headTitleMutations) {
    return true;
  }
  return mirror2.getId(n22) === IGNORED_NODE;
}
function isAncestorRemoved(target, mirror2) {
  if (isShadowRoot(target)) {
    return false;
  }
  const id2 = mirror2.getId(target);
  if (!mirror2.has(id2)) {
    return true;
  }
  const parent = index2.parentNode(target);
  if (parent && parent.nodeType === target.DOCUMENT_NODE) {
    return false;
  }
  if (!parent) {
    return true;
  }
  return isAncestorRemoved(parent, mirror2);
}
function legacy_isTouchEvent(event) {
  return Boolean(event.changedTouches);
}
function polyfill$1(win = window) {
  if ("NodeList" in win && !win.NodeList.prototype.forEach) {
    win.NodeList.prototype.forEach = Array.prototype.forEach;
  }
  if ("DOMTokenList" in win && !win.DOMTokenList.prototype.forEach) {
    win.DOMTokenList.prototype.forEach = Array.prototype.forEach;
  }
}
function isSerializedIframe(n22, mirror2) {
  return Boolean(n22.nodeName === "IFRAME" && mirror2.getMeta(n22));
}
function isSerializedStylesheet(n22, mirror2) {
  return Boolean(
    n22.nodeName === "LINK" && n22.nodeType === n22.ELEMENT_NODE && n22.getAttribute && n22.getAttribute("rel") === "stylesheet" && mirror2.getMeta(n22)
  );
}
function hasShadowRoot(n22) {
  if (!n22) return false;
  if (n22 instanceof BaseRRNode && "shadowRoot" in n22) {
    return Boolean(n22.shadowRoot);
  }
  return Boolean(index2.shadowRoot(n22));
}
function getShadowHost(n22) {
  var _a22;
  let shadowHost = null;
  if ("getRootNode" in n22 && ((_a22 = index2.getRootNode(n22)) == null ? void 0 : _a22.nodeType) === Node.DOCUMENT_FRAGMENT_NODE && index2.host(index2.getRootNode(n22)))
    shadowHost = index2.host(index2.getRootNode(n22));
  return shadowHost;
}
function getRootShadowHost(n22) {
  let rootShadowHost = n22;
  let shadowHost;
  while (shadowHost = getShadowHost(rootShadowHost))
    rootShadowHost = shadowHost;
  return rootShadowHost;
}
function shadowHostInDom(n22) {
  const doc = n22.ownerDocument;
  if (!doc) return false;
  const shadowHost = getRootShadowHost(n22);
  return index2.contains(doc, shadowHost);
}
function inDom(n22) {
  const doc = n22.ownerDocument;
  if (!doc) return false;
  return index2.contains(doc, n22) || shadowHostInDom(n22);
}
function isNodeInLinkedList(n22) {
  return "__ln" in n22;
}
function deepDelete(addsSet, n22) {
  addsSet.delete(n22);
  index2.childNodes(n22).forEach((childN) => deepDelete(addsSet, childN));
}
function processRemoves(n22, cache) {
  const queue = [n22];
  while (queue.length) {
    const next = queue.pop();
    if (cache.has(next)) continue;
    cache.add(next);
    index2.childNodes(next).forEach((n222) => queue.push(n222));
  }
  return;
}
function isParentRemoved(removes, n22, mirror2) {
  if (removes.size === 0) return false;
  return _isParentRemoved(removes, n22);
}
function _isParentRemoved(removes, n22, _mirror2) {
  const node2 = index2.parentNode(n22);
  if (!node2) return false;
  return removes.has(node2);
}
function isAncestorInSet(set, n22) {
  if (set.size === 0) return false;
  return _isAncestorInSet(set, n22);
}
function _isAncestorInSet(set, n22) {
  const parent = index2.parentNode(n22);
  if (!parent) {
    return false;
  }
  if (set.has(parent)) {
    return true;
  }
  return _isAncestorInSet(set, parent);
}
function registerErrorHandler(handler) {
  errorHandler = handler;
}
function unregisterErrorHandler() {
  errorHandler = void 0;
}
function getEventTarget(event) {
  try {
    if ("composedPath" in event) {
      const path = event.composedPath();
      if (path.length) {
        return path[0];
      }
    } else if ("path" in event && event.path.length) {
      return event.path[0];
    }
  } catch {
  }
  return event && event.target;
}
function initMutationObserver(options, rootEl) {
  const mutationBuffer = new MutationBuffer();
  mutationBuffers.push(mutationBuffer);
  mutationBuffer.init(options);
  const observer = new (mutationObserverCtor())(
    callbackWrapper(mutationBuffer.processMutations.bind(mutationBuffer))
  );
  observer.observe(rootEl, {
    attributes: true,
    attributeOldValue: true,
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true
  });
  return observer;
}
function initMoveObserver({
  mousemoveCb,
  sampling,
  doc,
  mirror: mirror2
}) {
  if (sampling.mousemove === false) {
    return () => {
    };
  }
  const threshold = typeof sampling.mousemove === "number" ? sampling.mousemove : 50;
  const callbackThreshold = typeof sampling.mousemoveCallback === "number" ? sampling.mousemoveCallback : 500;
  let positions = [];
  let timeBaseline;
  const wrappedCb = throttle(
    callbackWrapper(
      (source) => {
        const totalOffset = Date.now() - timeBaseline;
        mousemoveCb(
          positions.map((p2) => {
            p2.timeOffset -= totalOffset;
            return p2;
          }),
          source
        );
        positions = [];
        timeBaseline = null;
      }
    ),
    callbackThreshold
  );
  const updatePosition = callbackWrapper(
    throttle(
      callbackWrapper((evt) => {
        const target = getEventTarget(evt);
        const { clientX, clientY } = legacy_isTouchEvent(evt) ? evt.changedTouches[0] : evt;
        if (!timeBaseline) {
          timeBaseline = nowTimestamp();
        }
        positions.push({
          x: clientX,
          y: clientY,
          id: mirror2.getId(target),
          timeOffset: nowTimestamp() - timeBaseline
        });
        wrappedCb(
          typeof DragEvent !== "undefined" && evt instanceof DragEvent ? IncrementalSource.Drag : evt instanceof MouseEvent ? IncrementalSource.MouseMove : IncrementalSource.TouchMove
        );
      }),
      threshold,
      {
        trailing: false
      }
    )
  );
  const handlers3 = [
    on("mousemove", updatePosition, doc),
    on("touchmove", updatePosition, doc),
    on("drag", updatePosition, doc)
  ];
  return callbackWrapper(() => {
    handlers3.forEach((h2) => h2());
  });
}
function initMouseInteractionObserver({
  mouseInteractionCb,
  doc,
  mirror: mirror2,
  blockClass,
  blockSelector,
  sampling
}) {
  if (sampling.mouseInteraction === false) {
    return () => {
    };
  }
  const disableMap = sampling.mouseInteraction === true || sampling.mouseInteraction === void 0 ? {} : sampling.mouseInteraction;
  const handlers3 = [];
  let currentPointerType = null;
  const getHandler = (eventKey) => {
    return (event) => {
      const target = getEventTarget(event);
      if (isBlocked(target, blockClass, blockSelector, true)) {
        return;
      }
      let pointerType = null;
      let thisEventKey = eventKey;
      if ("pointerType" in event) {
        switch (event.pointerType) {
          case "mouse":
            pointerType = PointerTypes.Mouse;
            break;
          case "touch":
            pointerType = PointerTypes.Touch;
            break;
          case "pen":
            pointerType = PointerTypes.Pen;
            break;
        }
        if (pointerType === PointerTypes.Touch) {
          if (MouseInteractions[eventKey] === MouseInteractions.MouseDown) {
            thisEventKey = "TouchStart";
          } else if (MouseInteractions[eventKey] === MouseInteractions.MouseUp) {
            thisEventKey = "TouchEnd";
          }
        } else if (pointerType === PointerTypes.Pen) ;
      } else if (legacy_isTouchEvent(event)) {
        pointerType = PointerTypes.Touch;
      }
      if (pointerType !== null) {
        currentPointerType = pointerType;
        if (thisEventKey.startsWith("Touch") && pointerType === PointerTypes.Touch || thisEventKey.startsWith("Mouse") && pointerType === PointerTypes.Mouse) {
          pointerType = null;
        }
      } else if (MouseInteractions[eventKey] === MouseInteractions.Click) {
        pointerType = currentPointerType;
        currentPointerType = null;
      }
      const e2 = legacy_isTouchEvent(event) ? event.changedTouches[0] : event;
      if (!e2) {
        return;
      }
      const id2 = mirror2.getId(target);
      const { clientX, clientY } = e2;
      callbackWrapper(mouseInteractionCb)({
        type: MouseInteractions[thisEventKey],
        id: id2,
        x: clientX,
        y: clientY,
        ...pointerType !== null && { pointerType }
      });
    };
  };
  Object.keys(MouseInteractions).filter(
    (key) => Number.isNaN(Number(key)) && !key.endsWith("_Departed") && disableMap[key] !== false
  ).forEach((eventKey) => {
    let eventName = toLowerCase(eventKey);
    const handler = getHandler(eventKey);
    if (window.PointerEvent) {
      switch (MouseInteractions[eventKey]) {
        case MouseInteractions.MouseDown:
        case MouseInteractions.MouseUp:
          eventName = eventName.replace(
            "mouse",
            "pointer"
          );
          break;
        case MouseInteractions.TouchStart:
        case MouseInteractions.TouchEnd:
          return;
      }
    }
    handlers3.push(on(eventName, handler, doc));
  });
  return callbackWrapper(() => {
    handlers3.forEach((h2) => h2());
  });
}
function initScrollObserver({
  scrollCb,
  doc,
  mirror: mirror2,
  blockClass,
  blockSelector,
  sampling
}) {
  const updatePosition = callbackWrapper(
    throttle(
      callbackWrapper((evt) => {
        const target = getEventTarget(evt);
        if (!target || isBlocked(target, blockClass, blockSelector, true)) {
          return;
        }
        const id2 = mirror2.getId(target);
        if (target === doc && doc.defaultView) {
          const scrollLeftTop = getWindowScroll(doc.defaultView);
          scrollCb({
            id: id2,
            x: scrollLeftTop.left,
            y: scrollLeftTop.top
          });
        } else {
          scrollCb({
            id: id2,
            x: target.scrollLeft,
            y: target.scrollTop
          });
        }
      }),
      sampling.scroll || 100
    )
  );
  return on("scroll", updatePosition, doc);
}
function initViewportResizeObserver({ viewportResizeCb }, { win }) {
  let lastH = -1;
  let lastW = -1;
  const updateDimension = callbackWrapper(
    throttle(
      callbackWrapper(() => {
        const height = getWindowHeight();
        const width = getWindowWidth();
        if (lastH !== height || lastW !== width) {
          viewportResizeCb({
            width: Number(width),
            height: Number(height)
          });
          lastH = height;
          lastW = width;
        }
      }),
      200
    )
  );
  return on("resize", updateDimension, win);
}
function initInputObserver({
  inputCb,
  doc,
  mirror: mirror2,
  blockClass,
  blockSelector,
  ignoreClass,
  ignoreSelector,
  maskInputOptions,
  maskInputFn,
  sampling,
  userTriggeredOnInput
}) {
  function eventHandler(event) {
    let target = getEventTarget(event);
    const userTriggered = event.isTrusted;
    const tagName = target && target.tagName;
    if (target && tagName === "OPTION") {
      target = index2.parentElement(target);
    }
    if (!target || !tagName || INPUT_TAGS.indexOf(tagName) < 0 || isBlocked(target, blockClass, blockSelector, true)) {
      return;
    }
    if (target.classList.contains(ignoreClass) || ignoreSelector && target.matches(ignoreSelector)) {
      return;
    }
    let text = target.value;
    let isChecked = false;
    const type = getInputType(target) || "";
    if (type === "radio" || type === "checkbox") {
      isChecked = target.checked;
    } else if (maskInputOptions[tagName.toLowerCase()] || maskInputOptions[type]) {
      text = maskInputValue({
        element: target,
        maskInputOptions,
        tagName,
        type,
        value: text,
        maskInputFn
      });
    }
    cbWithDedup(
      target,
      userTriggeredOnInput ? { text, isChecked, userTriggered } : { text, isChecked }
    );
    const name = target.name;
    if (type === "radio" && name && isChecked) {
      doc.querySelectorAll(`input[type="radio"][name="${name}"]`).forEach((el) => {
        if (el !== target) {
          const text2 = el.value;
          cbWithDedup(
            el,
            userTriggeredOnInput ? { text: text2, isChecked: !isChecked, userTriggered: false } : { text: text2, isChecked: !isChecked }
          );
        }
      });
    }
  }
  function cbWithDedup(target, v2) {
    const lastInputValue = lastInputValueMap.get(target);
    if (!lastInputValue || lastInputValue.text !== v2.text || lastInputValue.isChecked !== v2.isChecked) {
      lastInputValueMap.set(target, v2);
      const id2 = mirror2.getId(target);
      callbackWrapper(inputCb)({
        ...v2,
        id: id2
      });
    }
  }
  const events = sampling.input === "last" ? ["change"] : ["input", "change"];
  const handlers3 = events.map(
    (eventName) => on(eventName, callbackWrapper(eventHandler), doc)
  );
  const currentWindow = doc.defaultView;
  if (!currentWindow) {
    return () => {
      handlers3.forEach((h2) => h2());
    };
  }
  const propertyDescriptor = currentWindow.Object.getOwnPropertyDescriptor(
    currentWindow.HTMLInputElement.prototype,
    "value"
  );
  const hookProperties = [
    [currentWindow.HTMLInputElement.prototype, "value"],
    [currentWindow.HTMLInputElement.prototype, "checked"],
    [currentWindow.HTMLSelectElement.prototype, "value"],
    [currentWindow.HTMLTextAreaElement.prototype, "value"],
    // Some UI library use selectedIndex to set select value
    [currentWindow.HTMLSelectElement.prototype, "selectedIndex"],
    [currentWindow.HTMLOptionElement.prototype, "selected"]
  ];
  if (propertyDescriptor && propertyDescriptor.set) {
    handlers3.push(
      ...hookProperties.map(
        (p2) => hookSetter(
          p2[0],
          p2[1],
          {
            set() {
              callbackWrapper(eventHandler)({
                target: this,
                isTrusted: false
                // userTriggered to false as this could well be programmatic
              });
            }
          },
          false,
          currentWindow
        )
      )
    );
  }
  return callbackWrapper(() => {
    handlers3.forEach((h2) => h2());
  });
}
function getNestedCSSRulePositions(rule2) {
  const positions = [];
  function recurse(childRule, pos) {
    if (hasNestedCSSRule("CSSGroupingRule") && childRule.parentRule instanceof CSSGroupingRule || hasNestedCSSRule("CSSMediaRule") && childRule.parentRule instanceof CSSMediaRule || hasNestedCSSRule("CSSSupportsRule") && childRule.parentRule instanceof CSSSupportsRule || hasNestedCSSRule("CSSConditionRule") && childRule.parentRule instanceof CSSConditionRule) {
      const rules2 = Array.from(
        childRule.parentRule.cssRules
      );
      const index22 = rules2.indexOf(childRule);
      pos.unshift(index22);
    } else if (childRule.parentStyleSheet) {
      const rules2 = Array.from(childRule.parentStyleSheet.cssRules);
      const index22 = rules2.indexOf(childRule);
      pos.unshift(index22);
    }
    return pos;
  }
  return recurse(rule2, positions);
}
function getIdAndStyleId(sheet, mirror2, styleMirror) {
  let id2, styleId;
  if (!sheet) return {};
  if (sheet.ownerNode) id2 = mirror2.getId(sheet.ownerNode);
  else styleId = styleMirror.getId(sheet);
  return {
    styleId,
    id: id2
  };
}
function initStyleSheetObserver({ styleSheetRuleCb, mirror: mirror2, stylesheetManager }, { win }) {
  if (!win.CSSStyleSheet || !win.CSSStyleSheet.prototype) {
    return () => {
    };
  }
  const insertRule = win.CSSStyleSheet.prototype.insertRule;
  win.CSSStyleSheet.prototype.insertRule = new Proxy(insertRule, {
    apply: callbackWrapper(
      (target, thisArg, argumentsList) => {
        const [rule2, index22] = argumentsList;
        const { id: id2, styleId } = getIdAndStyleId(
          thisArg,
          mirror2,
          stylesheetManager.styleMirror
        );
        if (id2 && id2 !== -1 || styleId && styleId !== -1) {
          styleSheetRuleCb({
            id: id2,
            styleId,
            adds: [{ rule: rule2, index: index22 }]
          });
        }
        return target.apply(thisArg, argumentsList);
      }
    )
  });
  win.CSSStyleSheet.prototype.addRule = function(selector, styleBlock, index22 = this.cssRules.length) {
    const rule2 = `${selector} { ${styleBlock} }`;
    return win.CSSStyleSheet.prototype.insertRule.apply(this, [rule2, index22]);
  };
  const deleteRule = win.CSSStyleSheet.prototype.deleteRule;
  win.CSSStyleSheet.prototype.deleteRule = new Proxy(deleteRule, {
    apply: callbackWrapper(
      (target, thisArg, argumentsList) => {
        const [index22] = argumentsList;
        const { id: id2, styleId } = getIdAndStyleId(
          thisArg,
          mirror2,
          stylesheetManager.styleMirror
        );
        if (id2 && id2 !== -1 || styleId && styleId !== -1) {
          styleSheetRuleCb({
            id: id2,
            styleId,
            removes: [{ index: index22 }]
          });
        }
        return target.apply(thisArg, argumentsList);
      }
    )
  });
  win.CSSStyleSheet.prototype.removeRule = function(index22) {
    return win.CSSStyleSheet.prototype.deleteRule.apply(this, [index22]);
  };
  let replace;
  if (win.CSSStyleSheet.prototype.replace) {
    replace = win.CSSStyleSheet.prototype.replace;
    win.CSSStyleSheet.prototype.replace = new Proxy(replace, {
      apply: callbackWrapper(
        (target, thisArg, argumentsList) => {
          const [text] = argumentsList;
          const { id: id2, styleId } = getIdAndStyleId(
            thisArg,
            mirror2,
            stylesheetManager.styleMirror
          );
          if (id2 && id2 !== -1 || styleId && styleId !== -1) {
            styleSheetRuleCb({
              id: id2,
              styleId,
              replace: text
            });
          }
          return target.apply(thisArg, argumentsList);
        }
      )
    });
  }
  let replaceSync;
  if (win.CSSStyleSheet.prototype.replaceSync) {
    replaceSync = win.CSSStyleSheet.prototype.replaceSync;
    win.CSSStyleSheet.prototype.replaceSync = new Proxy(replaceSync, {
      apply: callbackWrapper(
        (target, thisArg, argumentsList) => {
          const [text] = argumentsList;
          const { id: id2, styleId } = getIdAndStyleId(
            thisArg,
            mirror2,
            stylesheetManager.styleMirror
          );
          if (id2 && id2 !== -1 || styleId && styleId !== -1) {
            styleSheetRuleCb({
              id: id2,
              styleId,
              replaceSync: text
            });
          }
          return target.apply(thisArg, argumentsList);
        }
      )
    });
  }
  const supportedNestedCSSRuleTypes = {};
  if (canMonkeyPatchNestedCSSRule("CSSGroupingRule")) {
    supportedNestedCSSRuleTypes.CSSGroupingRule = win.CSSGroupingRule;
  } else {
    if (canMonkeyPatchNestedCSSRule("CSSMediaRule")) {
      supportedNestedCSSRuleTypes.CSSMediaRule = win.CSSMediaRule;
    }
    if (canMonkeyPatchNestedCSSRule("CSSConditionRule")) {
      supportedNestedCSSRuleTypes.CSSConditionRule = win.CSSConditionRule;
    }
    if (canMonkeyPatchNestedCSSRule("CSSSupportsRule")) {
      supportedNestedCSSRuleTypes.CSSSupportsRule = win.CSSSupportsRule;
    }
  }
  const unmodifiedFunctions = {};
  Object.entries(supportedNestedCSSRuleTypes).forEach(([typeKey, type]) => {
    unmodifiedFunctions[typeKey] = {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      insertRule: type.prototype.insertRule,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      deleteRule: type.prototype.deleteRule
    };
    type.prototype.insertRule = new Proxy(
      unmodifiedFunctions[typeKey].insertRule,
      {
        apply: callbackWrapper(
          (target, thisArg, argumentsList) => {
            const [rule2, index22] = argumentsList;
            const { id: id2, styleId } = getIdAndStyleId(
              thisArg.parentStyleSheet,
              mirror2,
              stylesheetManager.styleMirror
            );
            if (id2 && id2 !== -1 || styleId && styleId !== -1) {
              styleSheetRuleCb({
                id: id2,
                styleId,
                adds: [
                  {
                    rule: rule2,
                    index: [
                      ...getNestedCSSRulePositions(thisArg),
                      index22 || 0
                      // defaults to 0
                    ]
                  }
                ]
              });
            }
            return target.apply(thisArg, argumentsList);
          }
        )
      }
    );
    type.prototype.deleteRule = new Proxy(
      unmodifiedFunctions[typeKey].deleteRule,
      {
        apply: callbackWrapper(
          (target, thisArg, argumentsList) => {
            const [index22] = argumentsList;
            const { id: id2, styleId } = getIdAndStyleId(
              thisArg.parentStyleSheet,
              mirror2,
              stylesheetManager.styleMirror
            );
            if (id2 && id2 !== -1 || styleId && styleId !== -1) {
              styleSheetRuleCb({
                id: id2,
                styleId,
                removes: [
                  { index: [...getNestedCSSRulePositions(thisArg), index22] }
                ]
              });
            }
            return target.apply(thisArg, argumentsList);
          }
        )
      }
    );
  });
  return callbackWrapper(() => {
    win.CSSStyleSheet.prototype.insertRule = insertRule;
    win.CSSStyleSheet.prototype.deleteRule = deleteRule;
    replace && (win.CSSStyleSheet.prototype.replace = replace);
    replaceSync && (win.CSSStyleSheet.prototype.replaceSync = replaceSync);
    Object.entries(supportedNestedCSSRuleTypes).forEach(([typeKey, type]) => {
      type.prototype.insertRule = unmodifiedFunctions[typeKey].insertRule;
      type.prototype.deleteRule = unmodifiedFunctions[typeKey].deleteRule;
    });
  });
}
function initAdoptedStyleSheetObserver({
  mirror: mirror2,
  stylesheetManager
}, host2) {
  var _a22, _b2, _c;
  let hostId = null;
  if (host2.nodeName === "#document") hostId = mirror2.getId(host2);
  else hostId = mirror2.getId(index2.host(host2));
  const patchTarget = host2.nodeName === "#document" ? (_a22 = host2.defaultView) == null ? void 0 : _a22.Document : (_c = (_b2 = host2.ownerDocument) == null ? void 0 : _b2.defaultView) == null ? void 0 : _c.ShadowRoot;
  const originalPropertyDescriptor = (patchTarget == null ? void 0 : patchTarget.prototype) ? Object.getOwnPropertyDescriptor(
    patchTarget == null ? void 0 : patchTarget.prototype,
    "adoptedStyleSheets"
  ) : void 0;
  if (hostId === null || hostId === -1 || !patchTarget || !originalPropertyDescriptor)
    return () => {
    };
  Object.defineProperty(host2, "adoptedStyleSheets", {
    configurable: originalPropertyDescriptor.configurable,
    enumerable: originalPropertyDescriptor.enumerable,
    get() {
      var _a3;
      return (_a3 = originalPropertyDescriptor.get) == null ? void 0 : _a3.call(this);
    },
    set(sheets) {
      var _a3;
      const result2 = (_a3 = originalPropertyDescriptor.set) == null ? void 0 : _a3.call(this, sheets);
      if (hostId !== null && hostId !== -1) {
        try {
          stylesheetManager.adoptStyleSheets(sheets, hostId);
        } catch (e2) {
        }
      }
      return result2;
    }
  });
  return callbackWrapper(() => {
    Object.defineProperty(host2, "adoptedStyleSheets", {
      configurable: originalPropertyDescriptor.configurable,
      enumerable: originalPropertyDescriptor.enumerable,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      get: originalPropertyDescriptor.get,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      set: originalPropertyDescriptor.set
    });
  });
}
function initStyleDeclarationObserver({
  styleDeclarationCb,
  mirror: mirror2,
  ignoreCSSAttributes,
  stylesheetManager
}, { win }) {
  const setProperty = win.CSSStyleDeclaration.prototype.setProperty;
  win.CSSStyleDeclaration.prototype.setProperty = new Proxy(setProperty, {
    apply: callbackWrapper(
      (target, thisArg, argumentsList) => {
        var _a22;
        const [property, value, priority] = argumentsList;
        if (ignoreCSSAttributes.has(property)) {
          return setProperty.apply(thisArg, [property, value, priority]);
        }
        const { id: id2, styleId } = getIdAndStyleId(
          (_a22 = thisArg.parentRule) == null ? void 0 : _a22.parentStyleSheet,
          mirror2,
          stylesheetManager.styleMirror
        );
        if (id2 && id2 !== -1 || styleId && styleId !== -1) {
          styleDeclarationCb({
            id: id2,
            styleId,
            set: {
              property,
              value,
              priority
            },
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            index: getNestedCSSRulePositions(thisArg.parentRule)
          });
        }
        return target.apply(thisArg, argumentsList);
      }
    )
  });
  const removeProperty = win.CSSStyleDeclaration.prototype.removeProperty;
  win.CSSStyleDeclaration.prototype.removeProperty = new Proxy(removeProperty, {
    apply: callbackWrapper(
      (target, thisArg, argumentsList) => {
        var _a22;
        const [property] = argumentsList;
        if (ignoreCSSAttributes.has(property)) {
          return removeProperty.apply(thisArg, [property]);
        }
        const { id: id2, styleId } = getIdAndStyleId(
          (_a22 = thisArg.parentRule) == null ? void 0 : _a22.parentStyleSheet,
          mirror2,
          stylesheetManager.styleMirror
        );
        if (id2 && id2 !== -1 || styleId && styleId !== -1) {
          styleDeclarationCb({
            id: id2,
            styleId,
            remove: {
              property
            },
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            index: getNestedCSSRulePositions(thisArg.parentRule)
          });
        }
        return target.apply(thisArg, argumentsList);
      }
    )
  });
  return callbackWrapper(() => {
    win.CSSStyleDeclaration.prototype.setProperty = setProperty;
    win.CSSStyleDeclaration.prototype.removeProperty = removeProperty;
  });
}
function initMediaInteractionObserver({
  mediaInteractionCb,
  blockClass,
  blockSelector,
  mirror: mirror2,
  sampling,
  doc
}) {
  const handler = callbackWrapper(
    (type) => throttle(
      callbackWrapper((event) => {
        const target = getEventTarget(event);
        if (!target || isBlocked(target, blockClass, blockSelector, true)) {
          return;
        }
        const { currentTime, volume, muted, playbackRate, loop } = target;
        mediaInteractionCb({
          type,
          id: mirror2.getId(target),
          currentTime,
          volume,
          muted,
          playbackRate,
          loop
        });
      }),
      sampling.media || 500
    )
  );
  const handlers3 = [
    on("play", handler(MediaInteractions.Play), doc),
    on("pause", handler(MediaInteractions.Pause), doc),
    on("seeked", handler(MediaInteractions.Seeked), doc),
    on("volumechange", handler(MediaInteractions.VolumeChange), doc),
    on("ratechange", handler(MediaInteractions.RateChange), doc)
  ];
  return callbackWrapper(() => {
    handlers3.forEach((h2) => h2());
  });
}
function initFontObserver({ fontCb, doc }) {
  const win = doc.defaultView;
  if (!win) {
    return () => {
    };
  }
  const handlers3 = [];
  const fontMap = /* @__PURE__ */ new WeakMap();
  const originalFontFace = win.FontFace;
  win.FontFace = function FontFace2(family, source, descriptors) {
    const fontFace = new originalFontFace(family, source, descriptors);
    fontMap.set(fontFace, {
      family,
      buffer: typeof source !== "string",
      descriptors,
      fontSource: typeof source === "string" ? source : JSON.stringify(Array.from(new Uint8Array(source)))
    });
    return fontFace;
  };
  const restoreHandler = patch(
    doc.fonts,
    "add",
    function(original) {
      return function(fontFace) {
        setTimeout(
          callbackWrapper(() => {
            const p2 = fontMap.get(fontFace);
            if (p2) {
              fontCb(p2);
              fontMap.delete(fontFace);
            }
          }),
          0
        );
        return original.apply(this, [fontFace]);
      };
    }
  );
  handlers3.push(() => {
    win.FontFace = originalFontFace;
  });
  handlers3.push(restoreHandler);
  return callbackWrapper(() => {
    handlers3.forEach((h2) => h2());
  });
}
function initSelectionObserver(param2) {
  const { doc, mirror: mirror2, blockClass, blockSelector, selectionCb } = param2;
  let collapsed = true;
  const updateSelection = callbackWrapper(() => {
    const selection = doc.getSelection();
    if (!selection || collapsed && (selection == null ? void 0 : selection.isCollapsed)) return;
    collapsed = selection.isCollapsed || false;
    const ranges = [];
    const count = selection.rangeCount || 0;
    for (let i2 = 0; i2 < count; i2++) {
      const range = selection.getRangeAt(i2);
      const { startContainer, startOffset, endContainer, endOffset } = range;
      const blocked = isBlocked(startContainer, blockClass, blockSelector, true) || isBlocked(endContainer, blockClass, blockSelector, true);
      if (blocked) continue;
      ranges.push({
        start: mirror2.getId(startContainer),
        startOffset,
        end: mirror2.getId(endContainer),
        endOffset
      });
    }
    selectionCb({ ranges });
  });
  updateSelection();
  return on("selectionchange", updateSelection);
}
function initCustomElementObserver({
  doc,
  customElementCb
}) {
  const win = doc.defaultView;
  if (!win || !win.customElements) return () => {
  };
  const restoreHandler = patch(
    win.customElements,
    "define",
    function(original) {
      return function(name, constructor, options) {
        try {
          customElementCb({
            define: {
              name
            }
          });
        } catch (e2) {
          console.warn(`Custom element callback failed for ${name}`);
        }
        return original.apply(this, [name, constructor, options]);
      };
    }
  );
  return restoreHandler;
}
function mergeHooks(o2, hooks) {
  const {
    mutationCb,
    mousemoveCb,
    mouseInteractionCb,
    scrollCb,
    viewportResizeCb,
    inputCb,
    mediaInteractionCb,
    styleSheetRuleCb,
    styleDeclarationCb,
    canvasMutationCb,
    fontCb,
    selectionCb,
    customElementCb
  } = o2;
  o2.mutationCb = (...p2) => {
    if (hooks.mutation) {
      hooks.mutation(...p2);
    }
    mutationCb(...p2);
  };
  o2.mousemoveCb = (...p2) => {
    if (hooks.mousemove) {
      hooks.mousemove(...p2);
    }
    mousemoveCb(...p2);
  };
  o2.mouseInteractionCb = (...p2) => {
    if (hooks.mouseInteraction) {
      hooks.mouseInteraction(...p2);
    }
    mouseInteractionCb(...p2);
  };
  o2.scrollCb = (...p2) => {
    if (hooks.scroll) {
      hooks.scroll(...p2);
    }
    scrollCb(...p2);
  };
  o2.viewportResizeCb = (...p2) => {
    if (hooks.viewportResize) {
      hooks.viewportResize(...p2);
    }
    viewportResizeCb(...p2);
  };
  o2.inputCb = (...p2) => {
    if (hooks.input) {
      hooks.input(...p2);
    }
    inputCb(...p2);
  };
  o2.mediaInteractionCb = (...p2) => {
    if (hooks.mediaInteaction) {
      hooks.mediaInteaction(...p2);
    }
    mediaInteractionCb(...p2);
  };
  o2.styleSheetRuleCb = (...p2) => {
    if (hooks.styleSheetRule) {
      hooks.styleSheetRule(...p2);
    }
    styleSheetRuleCb(...p2);
  };
  o2.styleDeclarationCb = (...p2) => {
    if (hooks.styleDeclaration) {
      hooks.styleDeclaration(...p2);
    }
    styleDeclarationCb(...p2);
  };
  o2.canvasMutationCb = (...p2) => {
    if (hooks.canvasMutation) {
      hooks.canvasMutation(...p2);
    }
    canvasMutationCb(...p2);
  };
  o2.fontCb = (...p2) => {
    if (hooks.font) {
      hooks.font(...p2);
    }
    fontCb(...p2);
  };
  o2.selectionCb = (...p2) => {
    if (hooks.selection) {
      hooks.selection(...p2);
    }
    selectionCb(...p2);
  };
  o2.customElementCb = (...c2) => {
    if (hooks.customElement) {
      hooks.customElement(...c2);
    }
    customElementCb(...c2);
  };
}
function initObservers(o2, hooks = {}) {
  const currentWindow = o2.doc.defaultView;
  if (!currentWindow) {
    return () => {
    };
  }
  mergeHooks(o2, hooks);
  let mutationObserver;
  if (o2.recordDOM) {
    mutationObserver = initMutationObserver(o2, o2.doc);
  }
  const mousemoveHandler = initMoveObserver(o2);
  const mouseInteractionHandler = initMouseInteractionObserver(o2);
  const scrollHandler = initScrollObserver(o2);
  const viewportResizeHandler = initViewportResizeObserver(o2, {
    win: currentWindow
  });
  const inputHandler = initInputObserver(o2);
  const mediaInteractionHandler = initMediaInteractionObserver(o2);
  let styleSheetObserver = () => {
  };
  let adoptedStyleSheetObserver = () => {
  };
  let styleDeclarationObserver = () => {
  };
  let fontObserver = () => {
  };
  if (o2.recordDOM) {
    styleSheetObserver = initStyleSheetObserver(o2, { win: currentWindow });
    adoptedStyleSheetObserver = initAdoptedStyleSheetObserver(o2, o2.doc);
    styleDeclarationObserver = initStyleDeclarationObserver(o2, {
      win: currentWindow
    });
    if (o2.collectFonts) {
      fontObserver = initFontObserver(o2);
    }
  }
  const selectionObserver = initSelectionObserver(o2);
  const customElementObserver = initCustomElementObserver(o2);
  const pluginHandlers = [];
  for (const plugin3 of o2.plugins) {
    pluginHandlers.push(
      plugin3.observer(plugin3.callback, currentWindow, plugin3.options)
    );
  }
  return callbackWrapper(() => {
    mutationBuffers.forEach((b3) => b3.reset());
    mutationObserver == null ? void 0 : mutationObserver.disconnect();
    mousemoveHandler();
    mouseInteractionHandler();
    scrollHandler();
    viewportResizeHandler();
    inputHandler();
    mediaInteractionHandler();
    styleSheetObserver();
    adoptedStyleSheetObserver();
    styleDeclarationObserver();
    fontObserver();
    selectionObserver();
    customElementObserver();
    pluginHandlers.forEach((h2) => h2());
  });
}
function hasNestedCSSRule(prop2) {
  return typeof window[prop2] !== "undefined";
}
function canMonkeyPatchNestedCSSRule(prop2) {
  return Boolean(
    typeof window[prop2] !== "undefined" && // Note: Generally, this check _shouldn't_ be necessary
    // However, in some scenarios (e.g. jsdom) this can sometimes fail, so we check for it here
    window[prop2].prototype && "insertRule" in window[prop2].prototype && "deleteRule" in window[prop2].prototype
  );
}
function variableListFor$1(ctx, ctor) {
  let contextMap2 = canvasVarMap.get(ctx);
  if (!contextMap2) {
    contextMap2 = /* @__PURE__ */ new Map();
    canvasVarMap.set(ctx, contextMap2);
  }
  if (!contextMap2.has(ctor)) {
    contextMap2.set(ctor, []);
  }
  return contextMap2.get(ctor);
}
function serializeArg(value, win, ctx) {
  if (value instanceof Array) {
    return value.map((arg) => serializeArg(arg, win, ctx));
  } else if (value === null) {
    return value;
  } else if (value instanceof Float32Array || value instanceof Float64Array || value instanceof Int32Array || value instanceof Uint32Array || value instanceof Uint8Array || value instanceof Uint16Array || value instanceof Int16Array || value instanceof Int8Array || value instanceof Uint8ClampedArray) {
    const name = value.constructor.name;
    return {
      rr_type: name,
      args: [Object.values(value)]
    };
  } else if (
    // SharedArrayBuffer disabled on most browsers due to spectre.
    // More info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer/SharedArrayBuffer
    // value instanceof SharedArrayBuffer ||
    value instanceof ArrayBuffer
  ) {
    const name = value.constructor.name;
    const base64 = encode(value);
    return {
      rr_type: name,
      base64
    };
  } else if (value instanceof DataView) {
    const name = value.constructor.name;
    return {
      rr_type: name,
      args: [
        serializeArg(value.buffer, win, ctx),
        value.byteOffset,
        value.byteLength
      ]
    };
  } else if (value instanceof HTMLImageElement) {
    const name = value.constructor.name;
    const { src } = value;
    return {
      rr_type: name,
      src
    };
  } else if (value instanceof HTMLCanvasElement) {
    const name = "HTMLImageElement";
    const src = value.toDataURL();
    return {
      rr_type: name,
      src
    };
  } else if (value instanceof ImageData) {
    const name = value.constructor.name;
    return {
      rr_type: name,
      args: [serializeArg(value.data, win, ctx), value.width, value.height]
    };
  } else if (isInstanceOfWebGLObject(value, win) || typeof value === "object") {
    const name = value.constructor.name;
    const index22 = saveWebGLVar(value, win, ctx);
    return {
      rr_type: name,
      index: index22
    };
  }
  return value;
}
function initCanvas2DMutationObserver(cb, win, blockClass, blockSelector) {
  const handlers3 = [];
  const props2D = Object.getOwnPropertyNames(
    win.CanvasRenderingContext2D.prototype
  );
  for (const prop2 of props2D) {
    try {
      if (typeof win.CanvasRenderingContext2D.prototype[prop2] !== "function") {
        continue;
      }
      const restoreHandler = patch(
        win.CanvasRenderingContext2D.prototype,
        prop2,
        function(original) {
          return function(...args) {
            if (!isBlocked(this.canvas, blockClass, blockSelector, true)) {
              setTimeout(() => {
                const recordArgs = serializeArgs(args, win, this);
                cb(this.canvas, {
                  type: CanvasContext["2D"],
                  property: prop2,
                  args: recordArgs
                });
              }, 0);
            }
            return original.apply(this, args);
          };
        }
      );
      handlers3.push(restoreHandler);
    } catch {
      const hookHandler = hookSetter(
        win.CanvasRenderingContext2D.prototype,
        prop2,
        {
          set(v2) {
            cb(this.canvas, {
              type: CanvasContext["2D"],
              property: prop2,
              args: [v2],
              setter: true
            });
          }
        }
      );
      handlers3.push(hookHandler);
    }
  }
  return () => {
    handlers3.forEach((h2) => h2());
  };
}
function getNormalizedContextName(contextType) {
  return contextType === "experimental-webgl" ? "webgl" : contextType;
}
function initCanvasContextObserver(win, blockClass, blockSelector, setPreserveDrawingBufferToTrue) {
  const handlers3 = [];
  try {
    const restoreHandler = patch(
      win.HTMLCanvasElement.prototype,
      "getContext",
      function(original) {
        return function(contextType, ...args) {
          if (!isBlocked(this, blockClass, blockSelector, true)) {
            const ctxName = getNormalizedContextName(contextType);
            if (!("__context" in this)) this.__context = ctxName;
            if (setPreserveDrawingBufferToTrue && ["webgl", "webgl2"].includes(ctxName)) {
              if (args[0] && typeof args[0] === "object") {
                const contextAttributes = args[0];
                if (!contextAttributes.preserveDrawingBuffer) {
                  contextAttributes.preserveDrawingBuffer = true;
                }
              } else {
                args.splice(0, 1, {
                  preserveDrawingBuffer: true
                });
              }
            }
          }
          return original.apply(this, [contextType, ...args]);
        };
      }
    );
    handlers3.push(restoreHandler);
  } catch {
    console.error("failed to patch HTMLCanvasElement.prototype.getContext");
  }
  return () => {
    handlers3.forEach((h2) => h2());
  };
}
function patchGLPrototype(prototype, type, cb, blockClass, blockSelector, win) {
  const handlers3 = [];
  const props = Object.getOwnPropertyNames(prototype);
  for (const prop2 of props) {
    if (
      //prop.startsWith('get') ||  // e.g. getProgramParameter, but too risky
      [
        "isContextLost",
        "canvas",
        "drawingBufferWidth",
        "drawingBufferHeight"
      ].includes(prop2)
    ) {
      continue;
    }
    try {
      if (typeof prototype[prop2] !== "function") {
        continue;
      }
      const restoreHandler = patch(
        prototype,
        prop2,
        function(original) {
          return function(...args) {
            const result2 = original.apply(this, args);
            saveWebGLVar(result2, win, this);
            if ("tagName" in this.canvas && !isBlocked(this.canvas, blockClass, blockSelector, true)) {
              const recordArgs = serializeArgs(args, win, this);
              const mutation = {
                type,
                property: prop2,
                args: recordArgs
              };
              cb(this.canvas, mutation);
            }
            return result2;
          };
        }
      );
      handlers3.push(restoreHandler);
    } catch {
      const hookHandler = hookSetter(prototype, prop2, {
        set(v2) {
          cb(this.canvas, {
            type,
            property: prop2,
            args: [v2],
            setter: true
          });
        }
      });
      handlers3.push(hookHandler);
    }
  }
  return handlers3;
}
function initCanvasWebGLMutationObserver(cb, win, blockClass, blockSelector) {
  const handlers3 = [];
  handlers3.push(
    ...patchGLPrototype(
      win.WebGLRenderingContext.prototype,
      CanvasContext.WebGL,
      cb,
      blockClass,
      blockSelector,
      win
    )
  );
  if (typeof win.WebGL2RenderingContext !== "undefined") {
    handlers3.push(
      ...patchGLPrototype(
        win.WebGL2RenderingContext.prototype,
        CanvasContext.WebGL2,
        cb,
        blockClass,
        blockSelector,
        win
      )
    );
  }
  return () => {
    handlers3.forEach((h2) => h2());
  };
}
function WorkerWrapper(options) {
  let objURL;
  try {
    objURL = blob && (window.URL || window.webkitURL).createObjectURL(blob);
    if (!objURL) throw "";
    const worker = new Worker(objURL, {
      name: options == null ? void 0 : options.name
    });
    worker.addEventListener("error", () => {
      (window.URL || window.webkitURL).revokeObjectURL(objURL);
    });
    return worker;
  } catch (e2) {
    return new Worker(
      "data:text/javascript;base64," + encodedJs,
      {
        name: options == null ? void 0 : options.name
      }
    );
  } finally {
    objURL && (window.URL || window.webkitURL).revokeObjectURL(objURL);
  }
}
function record(options = {}) {
  const {
    emit,
    checkoutEveryNms,
    checkoutEveryNth,
    blockClass = "rr-block",
    blockSelector = null,
    ignoreClass = "rr-ignore",
    ignoreSelector = null,
    maskTextClass = "rr-mask",
    maskTextSelector = null,
    inlineStylesheet = true,
    maskAllInputs,
    maskInputOptions: _maskInputOptions,
    slimDOMOptions: _slimDOMOptions,
    maskInputFn,
    maskTextFn,
    hooks,
    packFn,
    sampling = {},
    dataURLOptions = {},
    mousemoveWait,
    recordDOM = true,
    recordCanvas = false,
    recordCrossOriginIframes = false,
    recordAfter = options.recordAfter === "DOMContentLoaded" ? options.recordAfter : "load",
    userTriggeredOnInput = false,
    collectFonts = false,
    inlineImages = false,
    plugins,
    keepIframeSrcFn = () => false,
    ignoreCSSAttributes = /* @__PURE__ */ new Set([]),
    errorHandler: errorHandler2
  } = options;
  registerErrorHandler(errorHandler2);
  const inEmittingFrame = recordCrossOriginIframes ? window.parent === window : true;
  let passEmitsToParent = false;
  if (!inEmittingFrame) {
    try {
      if (window.parent.document) {
        passEmitsToParent = false;
      }
    } catch (e2) {
      passEmitsToParent = true;
    }
  }
  if (inEmittingFrame && !emit) {
    throw new Error("emit function is required");
  }
  if (!inEmittingFrame && !passEmitsToParent) {
    return () => {
    };
  }
  if (mousemoveWait !== void 0 && sampling.mousemove === void 0) {
    sampling.mousemove = mousemoveWait;
  }
  mirror.reset();
  const maskInputOptions = maskAllInputs === true ? {
    color: true,
    date: true,
    "datetime-local": true,
    email: true,
    month: true,
    number: true,
    range: true,
    search: true,
    tel: true,
    text: true,
    time: true,
    url: true,
    week: true,
    textarea: true,
    select: true,
    password: true
  } : _maskInputOptions !== void 0 ? _maskInputOptions : { password: true };
  const slimDOMOptions = _slimDOMOptions === true || _slimDOMOptions === "all" ? {
    script: true,
    comment: true,
    headFavicon: true,
    headWhitespace: true,
    headMetaSocial: true,
    headMetaRobots: true,
    headMetaHttpEquiv: true,
    headMetaVerification: true,
    // the following are off for slimDOMOptions === true,
    // as they destroy some (hidden) info:
    headMetaAuthorship: _slimDOMOptions === "all",
    headMetaDescKeywords: _slimDOMOptions === "all",
    headTitleMutations: _slimDOMOptions === "all"
  } : _slimDOMOptions ? _slimDOMOptions : {};
  polyfill$1();
  let lastFullSnapshotEvent;
  let incrementalSnapshotCount = 0;
  const eventProcessor = (e2) => {
    for (const plugin3 of plugins || []) {
      if (plugin3.eventProcessor) {
        e2 = plugin3.eventProcessor(e2);
      }
    }
    if (packFn && // Disable packing events which will be emitted to parent frames.
    !passEmitsToParent) {
      e2 = packFn(e2);
    }
    return e2;
  };
  wrappedEmit = (r2, isCheckout) => {
    var _a22;
    const e2 = r2;
    e2.timestamp = nowTimestamp();
    if (((_a22 = mutationBuffers[0]) == null ? void 0 : _a22.isFrozen()) && e2.type !== EventType.FullSnapshot && !(e2.type === EventType.IncrementalSnapshot && e2.data.source === IncrementalSource.Mutation)) {
      mutationBuffers.forEach((buf) => buf.unfreeze());
    }
    if (inEmittingFrame) {
      emit == null ? void 0 : emit(eventProcessor(e2), isCheckout);
    } else if (passEmitsToParent) {
      const message = {
        type: "rrweb",
        event: eventProcessor(e2),
        origin: window.location.origin,
        isCheckout
      };
      window.parent.postMessage(message, "*");
    }
    if (e2.type === EventType.FullSnapshot) {
      lastFullSnapshotEvent = e2;
      incrementalSnapshotCount = 0;
    } else if (e2.type === EventType.IncrementalSnapshot) {
      if (e2.data.source === IncrementalSource.Mutation && e2.data.isAttachIframe) {
        return;
      }
      incrementalSnapshotCount++;
      const exceedCount = checkoutEveryNth && incrementalSnapshotCount >= checkoutEveryNth;
      const exceedTime = checkoutEveryNms && e2.timestamp - lastFullSnapshotEvent.timestamp > checkoutEveryNms;
      if (exceedCount || exceedTime) {
        takeFullSnapshot$1(true);
      }
    }
  };
  const wrappedMutationEmit = (m2) => {
    wrappedEmit({
      type: EventType.IncrementalSnapshot,
      data: {
        source: IncrementalSource.Mutation,
        ...m2
      }
    });
  };
  const wrappedScrollEmit = (p2) => wrappedEmit({
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.Scroll,
      ...p2
    }
  });
  const wrappedCanvasMutationEmit = (p2) => wrappedEmit({
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.CanvasMutation,
      ...p2
    }
  });
  const wrappedAdoptedStyleSheetEmit = (a2) => wrappedEmit({
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.AdoptedStyleSheet,
      ...a2
    }
  });
  const stylesheetManager = new StylesheetManager({
    mutationCb: wrappedMutationEmit,
    adoptedStyleSheetCb: wrappedAdoptedStyleSheetEmit
  });
  const iframeManager = new IframeManager({
    mirror,
    mutationCb: wrappedMutationEmit,
    stylesheetManager,
    recordCrossOriginIframes,
    wrappedEmit
  });
  for (const plugin3 of plugins || []) {
    if (plugin3.getMirror)
      plugin3.getMirror({
        nodeMirror: mirror,
        crossOriginIframeMirror: iframeManager.crossOriginIframeMirror,
        crossOriginIframeStyleMirror: iframeManager.crossOriginIframeStyleMirror
      });
  }
  const processedNodeManager = new ProcessedNodeManager();
  canvasManager = new CanvasManager({
    recordCanvas,
    mutationCb: wrappedCanvasMutationEmit,
    win: window,
    blockClass,
    blockSelector,
    mirror,
    sampling: sampling.canvas,
    dataURLOptions
  });
  const shadowDomManager = new ShadowDomManager({
    mutationCb: wrappedMutationEmit,
    scrollCb: wrappedScrollEmit,
    bypassOptions: {
      blockClass,
      blockSelector,
      maskTextClass,
      maskTextSelector,
      inlineStylesheet,
      maskInputOptions,
      dataURLOptions,
      maskTextFn,
      maskInputFn,
      recordCanvas,
      inlineImages,
      sampling,
      slimDOMOptions,
      iframeManager,
      stylesheetManager,
      canvasManager,
      keepIframeSrcFn,
      processedNodeManager
    },
    mirror
  });
  takeFullSnapshot$1 = (isCheckout = false) => {
    if (!recordDOM) {
      return;
    }
    wrappedEmit(
      {
        type: EventType.Meta,
        data: {
          href: window.location.href,
          width: getWindowWidth(),
          height: getWindowHeight()
        }
      },
      isCheckout
    );
    stylesheetManager.reset();
    shadowDomManager.init();
    mutationBuffers.forEach((buf) => buf.lock());
    const node2 = snapshot(document, {
      mirror,
      blockClass,
      blockSelector,
      maskTextClass,
      maskTextSelector,
      inlineStylesheet,
      maskAllInputs: maskInputOptions,
      maskTextFn,
      maskInputFn,
      slimDOM: slimDOMOptions,
      dataURLOptions,
      recordCanvas,
      inlineImages,
      onSerialize: (n22) => {
        if (isSerializedIframe(n22, mirror)) {
          iframeManager.addIframe(n22);
        }
        if (isSerializedStylesheet(n22, mirror)) {
          stylesheetManager.trackLinkElement(n22);
        }
        if (hasShadowRoot(n22)) {
          shadowDomManager.addShadowRoot(index2.shadowRoot(n22), document);
        }
      },
      onIframeLoad: (iframe, childSn) => {
        iframeManager.attachIframe(iframe, childSn);
        shadowDomManager.observeAttachShadow(iframe);
      },
      onStylesheetLoad: (linkEl, childSn) => {
        stylesheetManager.attachLinkElement(linkEl, childSn);
      },
      keepIframeSrcFn
    });
    if (!node2) {
      return console.warn("Failed to snapshot the document");
    }
    wrappedEmit(
      {
        type: EventType.FullSnapshot,
        data: {
          node: node2,
          initialOffset: getWindowScroll(window)
        }
      },
      isCheckout
    );
    mutationBuffers.forEach((buf) => buf.unlock());
    if (document.adoptedStyleSheets && document.adoptedStyleSheets.length > 0)
      stylesheetManager.adoptStyleSheets(
        document.adoptedStyleSheets,
        mirror.getId(document)
      );
  };
  try {
    const handlers3 = [];
    const observe = (doc) => {
      var _a22;
      return callbackWrapper(initObservers)(
        {
          mutationCb: wrappedMutationEmit,
          mousemoveCb: (positions, source) => wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: {
              source,
              positions
            }
          }),
          mouseInteractionCb: (d2) => wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: {
              source: IncrementalSource.MouseInteraction,
              ...d2
            }
          }),
          scrollCb: wrappedScrollEmit,
          viewportResizeCb: (d2) => wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: {
              source: IncrementalSource.ViewportResize,
              ...d2
            }
          }),
          inputCb: (v2) => wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: {
              source: IncrementalSource.Input,
              ...v2
            }
          }),
          mediaInteractionCb: (p2) => wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: {
              source: IncrementalSource.MediaInteraction,
              ...p2
            }
          }),
          styleSheetRuleCb: (r2) => wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: {
              source: IncrementalSource.StyleSheetRule,
              ...r2
            }
          }),
          styleDeclarationCb: (r2) => wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: {
              source: IncrementalSource.StyleDeclaration,
              ...r2
            }
          }),
          canvasMutationCb: wrappedCanvasMutationEmit,
          fontCb: (p2) => wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: {
              source: IncrementalSource.Font,
              ...p2
            }
          }),
          selectionCb: (p2) => {
            wrappedEmit({
              type: EventType.IncrementalSnapshot,
              data: {
                source: IncrementalSource.Selection,
                ...p2
              }
            });
          },
          customElementCb: (c2) => {
            wrappedEmit({
              type: EventType.IncrementalSnapshot,
              data: {
                source: IncrementalSource.CustomElement,
                ...c2
              }
            });
          },
          blockClass,
          ignoreClass,
          ignoreSelector,
          maskTextClass,
          maskTextSelector,
          maskInputOptions,
          inlineStylesheet,
          sampling,
          recordDOM,
          recordCanvas,
          inlineImages,
          userTriggeredOnInput,
          collectFonts,
          doc,
          maskInputFn,
          maskTextFn,
          keepIframeSrcFn,
          blockSelector,
          slimDOMOptions,
          dataURLOptions,
          mirror,
          iframeManager,
          stylesheetManager,
          shadowDomManager,
          processedNodeManager,
          canvasManager,
          ignoreCSSAttributes,
          plugins: ((_a22 = plugins == null ? void 0 : plugins.filter((p2) => p2.observer)) == null ? void 0 : _a22.map((p2) => ({
            observer: p2.observer,
            options: p2.options,
            callback: (payload) => wrappedEmit({
              type: EventType.Plugin,
              data: {
                plugin: p2.name,
                payload
              }
            })
          }))) || []
        },
        hooks
      );
    };
    iframeManager.addLoadListener((iframeEl) => {
      try {
        handlers3.push(observe(iframeEl.contentDocument));
      } catch (error) {
        console.warn(error);
      }
    });
    const init = () => {
      takeFullSnapshot$1();
      handlers3.push(observe(document));
      recording = true;
    };
    if (document.readyState === "interactive" || document.readyState === "complete") {
      init();
    } else {
      handlers3.push(
        on("DOMContentLoaded", () => {
          wrappedEmit({
            type: EventType.DomContentLoaded,
            data: {}
          });
          if (recordAfter === "DOMContentLoaded") init();
        })
      );
      handlers3.push(
        on(
          "load",
          () => {
            wrappedEmit({
              type: EventType.Load,
              data: {}
            });
            if (recordAfter === "load") init();
          },
          window
        )
      );
    }
    return () => {
      handlers3.forEach((handler) => {
        try {
          handler();
        } catch (error) {
          const msg = String(error).toLowerCase();
          if (!msg.includes("cross-origin")) {
            console.warn(error);
          }
        }
      });
      processedNodeManager.destroy();
      recording = false;
      unregisterErrorHandler();
    };
  } catch (error) {
    console.warn(error);
  }
}
var __defProp2, __defNormalProp, __publicField, _a2, __defProp$1, __defNormalProp$1, __publicField$1, NodeType$3, testableAccessors$1, testableMethods$1, untaintedBasePrototype$1, isAngularZonePresent$1, untaintedAccessorCache$1, untaintedMethodCache$1, index$1, Mirror, ORIGINAL_ATTRIBUTE_NAME, URL_IN_CSS_REF, URL_PROTOCOL_MATCH, URL_WWW_MATCH, DATA_URI, _id, tagNameRegex, IGNORED_NODE, canvasService, canvasCtx, SRCSET_NOT_SPACES, SRCSET_COMMAS_OR_SPACES, cachedDocument, MEDIA_SELECTOR, MEDIA_SELECTOR_GLOBAL, picocolors_browser$1, x$1, create$1, picocolors_browserExports$1, __viteBrowserExternal$2, __viteBrowserExternal$1$1, require$$2$1, pico$1, terminalHighlight$1$1, CssSyntaxError$3$1, cssSyntaxError$1, symbols$1, DEFAULT_RAW$1, Stringifier$2$1, stringifier$1, Stringifier$1$1, stringify_1$1, isClean$2$1, my$2$1, CssSyntaxError$2$1, Stringifier2$1, stringify$3$1, Node$4$1, node$1, Node$3$1, Declaration$4$1, declaration$1, urlAlphabet$1, customAlphabet$1, nanoid$1$1, nonSecure$1, SourceMapConsumer$2$1, SourceMapGenerator$2$1, existsSync$1, readFileSync$1, dirname$1$1, join$1, PreviousMap$2$1, previousMap$1, SourceMapConsumer$1$1, SourceMapGenerator$1$1, fileURLToPath$1, pathToFileURL$1$1, isAbsolute$1, resolve$1$1, nanoid$2, terminalHighlight$2, CssSyntaxError$1$1, PreviousMap$1$1, fromOffsetCache$1, sourceMapAvailable$1$1, pathAvailable$1$1, Input$4$1, input$1, SourceMapConsumer$3, SourceMapGenerator$3, dirname$2, relative$1, resolve$2, sep$1, pathToFileURL$2, Input$3$1, sourceMapAvailable$2, pathAvailable$2, MapGenerator$2$1, mapGenerator$1, Node$2$1, Comment$4$1, comment$1, isClean$1$1, my$1$1, Declaration$3$1, Comment$3$1, Node$1$1, parse$4$1, Rule$4$1, AtRule$4$1, Root$6$1, Container$7$1, container$1, Container$6$1, LazyResult$4$1, Processor$3$1, Document$3$1, document$1$1, printed$1, warnOnce$2$1, Warning$2$1, warning$1, Warning$1$1, Result$3$1, result$1, SINGLE_QUOTE$1, DOUBLE_QUOTE$1, BACKSLASH$1, SLASH$1, NEWLINE$1, SPACE$1, FEED$1, TAB$1, CR$1, OPEN_SQUARE$1, CLOSE_SQUARE$1, OPEN_PARENTHESES$1, CLOSE_PARENTHESES$1, OPEN_CURLY$1, CLOSE_CURLY$1, SEMICOLON$1, ASTERISK$1, COLON$1, AT$1, RE_AT_END$1, RE_WORD_END$1, RE_BAD_BRACKET$1, RE_HEX_ESCAPE$1, tokenize$1, Container$5$1, AtRule$3$1, atRule$1, Container$4$1, LazyResult$3$1, Processor$2$1, Root$5$1, root$1, list$2$1, list_1$1, Container$3$1, list$1$1, Rule$3$1, rule$1, Declaration$2$1, tokenizer2$1, Comment$2$1, AtRule$2$1, Root$4$1, Rule$2$1, SAFE_COMMENT_NEIGHBOR$1, Parser$1$1, parser$1, Container$2$1, Parser2$1, Input$2$1, parse_1$1, isClean$3, my$3, MapGenerator$1$1, stringify$2$1, Container$1$1, Document$2$1, warnOnce$1$1, Result$2$1, parse$2$1, Root$3$1, TYPE_TO_CLASS_NAME$1, PLUGIN_PROPS$1, NOT_VISITORS$1, CHILDREN$1, postcss$2$1, LazyResult$2$1, lazyResult$1, MapGenerator2$1, stringify$1$1, warnOnce2$1, parse$1$1, Result$1$1, NoWorkResult$1$1, noWorkResult$1, NoWorkResult2$1, LazyResult$1$1, Document$1$1, Root$2$1, Processor$1$1, processor$1, Declaration$1$1, PreviousMap2$1, Comment$1$1, AtRule$1$1, Input$1$1, Root$1$1, Rule$1$1, fromJSON_1$1, CssSyntaxError2$1, Declaration2$1, LazyResult2$1, Container2$1, Processor2$1, stringify$5, fromJSON$2, Document22, Warning2$1, Comment2$1, AtRule2$1, Result2$1, Input2$1, parse$5, list$3, Rule2$1, Root2$1, Node2$1, postcss_1$1, postcss$1$1, __defProp22, __defNormalProp2, __publicField2, picocolors_browser, x2, create, picocolors_browserExports, __viteBrowserExternal, __viteBrowserExternal$1, require$$2, pico, terminalHighlight$1, CssSyntaxError$3, cssSyntaxError, symbols, DEFAULT_RAW, Stringifier$2, stringifier, Stringifier$1, stringify_1, isClean$2, my$2, CssSyntaxError$2, Stringifier22, stringify$3, Node$4, node, Node$3, Declaration$4, declaration, urlAlphabet, customAlphabet, nanoid$1, nonSecure, SourceMapConsumer$2, SourceMapGenerator$2, existsSync, readFileSync, dirname$1, join, PreviousMap$2, previousMap, SourceMapConsumer$1, SourceMapGenerator$1, fileURLToPath, pathToFileURL$1, isAbsolute, resolve$1, nanoid, terminalHighlight, CssSyntaxError$1, PreviousMap$1, fromOffsetCache, sourceMapAvailable$1, pathAvailable$1, Input$4, input, SourceMapConsumer, SourceMapGenerator, dirname, relative, resolve, sep, pathToFileURL, Input$3, sourceMapAvailable, pathAvailable, MapGenerator$2, mapGenerator, Node$2, Comment$4, comment, isClean$1, my$1, Declaration$3, Comment$3, Node$1, parse$4, Rule$4, AtRule$4, Root$6, Container$7, container, Container$6, LazyResult$4, Processor$3, Document$3, document$1, printed, warnOnce$2, Warning$2, warning, Warning$1, Result$3, result, SINGLE_QUOTE, DOUBLE_QUOTE, BACKSLASH, SLASH, NEWLINE, SPACE, FEED, TAB, CR, OPEN_SQUARE, CLOSE_SQUARE, OPEN_PARENTHESES, CLOSE_PARENTHESES, OPEN_CURLY, CLOSE_CURLY, SEMICOLON, ASTERISK, COLON, AT, RE_AT_END, RE_WORD_END, RE_BAD_BRACKET, RE_HEX_ESCAPE, tokenize, Container$5, AtRule$3, atRule, Container$4, LazyResult$3, Processor$2, Root$5, root, list$2, list_1, Container$3, list$1, Rule$3, rule, Declaration$2, tokenizer22, Comment$2, AtRule$2, Root$4, Rule$2, SAFE_COMMENT_NEIGHBOR, Parser$1, parser, Container$2, Parser22, Input$2, parse_1, isClean, my, MapGenerator$1, stringify$2, Container$1, Document$2, warnOnce$1, Result$2, parse$2, Root$3, TYPE_TO_CLASS_NAME, PLUGIN_PROPS, NOT_VISITORS, CHILDREN, postcss$2, LazyResult$2, lazyResult, MapGenerator22, stringify$1, warnOnce22, parse$1, Result$1, NoWorkResult$1, noWorkResult, NoWorkResult22, LazyResult$1, Document$1, Root$2, Processor$1, processor, Declaration$1, PreviousMap22, Comment$1, AtRule$1, Input$1, Root$1, Rule$1, fromJSON_1, CssSyntaxError22, Declaration22, LazyResult22, Container22, Processor22, stringify2, fromJSON, Document222, Warning22, Comment22, AtRule22, Result22, Input22, parse, list, Rule22, Root22, Node22, postcss_1, postcss$1, BaseRRNode, NodeType$2, testableAccessors, testableMethods, untaintedBasePrototype, isAngularZonePresent, untaintedAccessorCache, untaintedMethodCache, index2, DEPARTED_MIRROR_ACCESS_WARNING, _mirror, nowTimestamp, StyleSheetMirror, EventType, IncrementalSource, MouseInteractions, PointerTypes, CanvasContext, MediaInteractions, NodeType, DoubleLinkedList, moveKey, MutationBuffer, errorHandler, callbackWrapper, mutationBuffers, INPUT_TAGS, lastInputValueMap, CrossOriginIframeMirror, IframeManager, ShadowDomManager, chars, lookup, i$1, encode, canvasVarMap, saveWebGLVar, serializeArgs, isInstanceOfWebGLObject, encodedJs, decodeBase64, blob, CanvasManager, StylesheetManager, ProcessedNodeManager, wrappedEmit, takeFullSnapshot$1, canvasManager, recording, mirror, n2, SKIP_TIME_INTERVAL, addCustomEvent, freezePage, takeFullSnapshot;
var init_rrweb = __esm({
  "node_modules/@newrelic/rrweb/dist/rrweb.js"() {
    __defProp2 = Object.defineProperty;
    __defNormalProp = (obj2, key, value) => key in obj2 ? __defProp2(obj2, key, { enumerable: true, configurable: true, writable: true, value }) : obj2[key] = value;
    __publicField = (obj2, key, value) => __defNormalProp(obj2, typeof key !== "symbol" ? key + "" : key, value);
    __defProp$1 = Object.defineProperty;
    __defNormalProp$1 = (obj2, key, value) => key in obj2 ? __defProp$1(obj2, key, { enumerable: true, configurable: true, writable: true, value }) : obj2[key] = value;
    __publicField$1 = (obj2, key, value) => __defNormalProp$1(obj2, typeof key !== "symbol" ? key + "" : key, value);
    NodeType$3 = /* @__PURE__ */ ((NodeType2) => {
      NodeType2[NodeType2["Document"] = 0] = "Document";
      NodeType2[NodeType2["DocumentType"] = 1] = "DocumentType";
      NodeType2[NodeType2["Element"] = 2] = "Element";
      NodeType2[NodeType2["Text"] = 3] = "Text";
      NodeType2[NodeType2["CDATA"] = 4] = "CDATA";
      NodeType2[NodeType2["Comment"] = 5] = "Comment";
      return NodeType2;
    })(NodeType$3 || {});
    testableAccessors$1 = {
      Node: ["childNodes", "parentNode", "parentElement", "textContent"],
      ShadowRoot: ["host", "styleSheets"],
      Element: ["shadowRoot", "querySelector", "querySelectorAll"],
      MutationObserver: []
    };
    testableMethods$1 = {
      Node: ["contains", "getRootNode"],
      ShadowRoot: ["getSelection"],
      Element: [],
      MutationObserver: ["constructor"]
    };
    untaintedBasePrototype$1 = {};
    isAngularZonePresent$1 = () => {
      return !!globalThis.Zone;
    };
    untaintedAccessorCache$1 = {};
    untaintedMethodCache$1 = {};
    index$1 = {
      childNodes: childNodes$1,
      parentNode: parentNode$1,
      parentElement: parentElement$1,
      textContent: textContent$1,
      contains: contains$1,
      getRootNode: getRootNode$1,
      host: host$1,
      styleSheets: styleSheets$1,
      shadowRoot: shadowRoot$1,
      querySelector: querySelector$1,
      querySelectorAll: querySelectorAll$1,
      mutationObserver: mutationObserverCtor$1,
      patch: patch$1
    };
    Mirror = class {
      constructor() {
        __publicField$1(this, "idNodeMap", /* @__PURE__ */ new Map());
        __publicField$1(this, "nodeMetaMap", /* @__PURE__ */ new WeakMap());
      }
      getId(n22) {
        var _a22;
        if (!n22)
          return -1;
        const id2 = (_a22 = this.getMeta(n22)) == null ? void 0 : _a22.id;
        return id2 ?? -1;
      }
      getNode(id2) {
        return this.idNodeMap.get(id2) || null;
      }
      getIds() {
        return Array.from(this.idNodeMap.keys());
      }
      getMeta(n22) {
        return this.nodeMetaMap.get(n22) || null;
      }
      removeNodeFromMap(n22) {
        const id2 = this.getId(n22);
        this.idNodeMap.delete(id2);
        if (n22.childNodes) {
          n22.childNodes.forEach((childNode) => this.removeNodeFromMap(childNode));
        }
      }
      has(id2) {
        return this.idNodeMap.has(id2);
      }
      hasNode(node2) {
        return this.nodeMetaMap.has(node2);
      }
      add(n22, meta) {
        const id2 = meta.id;
        this.idNodeMap.set(id2, n22);
        this.nodeMetaMap.set(n22, meta);
      }
      replace(id2, n22) {
        const oldNode = this.getNode(id2);
        if (oldNode) {
          const meta = this.nodeMetaMap.get(oldNode);
          if (meta)
            this.nodeMetaMap.set(n22, meta);
        }
        this.idNodeMap.set(id2, n22);
      }
      reset() {
        this.idNodeMap = /* @__PURE__ */ new Map();
        this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
      }
    };
    ORIGINAL_ATTRIBUTE_NAME = "__rrweb_original__";
    URL_IN_CSS_REF = /url\((?:(')([^']*)'|(")(.*?)"|([^)]*))\)/gm;
    URL_PROTOCOL_MATCH = /^(?:[a-z+]+:)?\/\//i;
    URL_WWW_MATCH = /^www\..*/i;
    DATA_URI = /^(data:)([^,]*),(.*)/i;
    _id = 1;
    tagNameRegex = new RegExp("[^a-z0-9-_:]");
    IGNORED_NODE = -2;
    SRCSET_NOT_SPACES = /^[^ \t\n\r\u000c]+/;
    SRCSET_COMMAS_OR_SPACES = /^[, \t\n\r\u000c]+/;
    cachedDocument = /* @__PURE__ */ new WeakMap();
    MEDIA_SELECTOR = /(max|min)-device-(width|height)/;
    MEDIA_SELECTOR_GLOBAL = new RegExp(MEDIA_SELECTOR.source, "g");
    picocolors_browser$1 = { exports: {} };
    x$1 = String;
    create$1 = function() {
      return { isColorSupported: false, reset: x$1, bold: x$1, dim: x$1, italic: x$1, underline: x$1, inverse: x$1, hidden: x$1, strikethrough: x$1, black: x$1, red: x$1, green: x$1, yellow: x$1, blue: x$1, magenta: x$1, cyan: x$1, white: x$1, gray: x$1, bgBlack: x$1, bgRed: x$1, bgGreen: x$1, bgYellow: x$1, bgBlue: x$1, bgMagenta: x$1, bgCyan: x$1, bgWhite: x$1 };
    };
    picocolors_browser$1.exports = create$1();
    picocolors_browser$1.exports.createColors = create$1;
    picocolors_browserExports$1 = picocolors_browser$1.exports;
    __viteBrowserExternal$2 = {};
    __viteBrowserExternal$1$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: __viteBrowserExternal$2
    }, Symbol.toStringTag, { value: "Module" }));
    require$$2$1 = /* @__PURE__ */ getAugmentedNamespace$1(__viteBrowserExternal$1$1);
    pico$1 = picocolors_browserExports$1;
    terminalHighlight$1$1 = require$$2$1;
    CssSyntaxError$3$1 = class CssSyntaxError extends Error {
      constructor(message, line, column, source, file, plugin22) {
        super(message);
        this.name = "CssSyntaxError";
        this.reason = message;
        if (file) {
          this.file = file;
        }
        if (source) {
          this.source = source;
        }
        if (plugin22) {
          this.plugin = plugin22;
        }
        if (typeof line !== "undefined" && typeof column !== "undefined") {
          if (typeof line === "number") {
            this.line = line;
            this.column = column;
          } else {
            this.line = line.line;
            this.column = line.column;
            this.endLine = column.line;
            this.endColumn = column.column;
          }
        }
        this.setMessage();
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, CssSyntaxError);
        }
      }
      setMessage() {
        this.message = this.plugin ? this.plugin + ": " : "";
        this.message += this.file ? this.file : "<css input>";
        if (typeof this.line !== "undefined") {
          this.message += ":" + this.line + ":" + this.column;
        }
        this.message += ": " + this.reason;
      }
      showSourceCode(color) {
        if (!this.source) return "";
        let css = this.source;
        if (color == null) color = pico$1.isColorSupported;
        if (terminalHighlight$1$1) {
          if (color) css = terminalHighlight$1$1(css);
        }
        let lines = css.split(/\r?\n/);
        let start = Math.max(this.line - 3, 0);
        let end = Math.min(this.line + 2, lines.length);
        let maxWidth = String(end).length;
        let mark, aside;
        if (color) {
          let { bold, gray, red } = pico$1.createColors(true);
          mark = (text) => bold(red(text));
          aside = (text) => gray(text);
        } else {
          mark = aside = (str) => str;
        }
        return lines.slice(start, end).map((line, index22) => {
          let number = start + 1 + index22;
          let gutter = " " + (" " + number).slice(-maxWidth) + " | ";
          if (number === this.line) {
            let spacing = aside(gutter.replace(/\d/g, " ")) + line.slice(0, this.column - 1).replace(/[^\t]/g, " ");
            return mark(">") + aside(gutter) + line + "\n " + spacing + mark("^");
          }
          return " " + aside(gutter) + line;
        }).join("\n");
      }
      toString() {
        let code = this.showSourceCode();
        if (code) {
          code = "\n\n" + code + "\n";
        }
        return this.name + ": " + this.message + code;
      }
    };
    cssSyntaxError$1 = CssSyntaxError$3$1;
    CssSyntaxError$3$1.default = CssSyntaxError$3$1;
    symbols$1 = {};
    symbols$1.isClean = /* @__PURE__ */ Symbol("isClean");
    symbols$1.my = /* @__PURE__ */ Symbol("my");
    DEFAULT_RAW$1 = {
      after: "\n",
      beforeClose: "\n",
      beforeComment: "\n",
      beforeDecl: "\n",
      beforeOpen: " ",
      beforeRule: "\n",
      colon: ": ",
      commentLeft: " ",
      commentRight: " ",
      emptyBody: "",
      indent: "    ",
      semicolon: false
    };
    Stringifier$2$1 = class Stringifier {
      constructor(builder) {
        this.builder = builder;
      }
      atrule(node2, semicolon) {
        let name = "@" + node2.name;
        let params = node2.params ? this.rawValue(node2, "params") : "";
        if (typeof node2.raws.afterName !== "undefined") {
          name += node2.raws.afterName;
        } else if (params) {
          name += " ";
        }
        if (node2.nodes) {
          this.block(node2, name + params);
        } else {
          let end = (node2.raws.between || "") + (semicolon ? ";" : "");
          this.builder(name + params + end, node2);
        }
      }
      beforeAfter(node2, detect) {
        let value;
        if (node2.type === "decl") {
          value = this.raw(node2, null, "beforeDecl");
        } else if (node2.type === "comment") {
          value = this.raw(node2, null, "beforeComment");
        } else if (detect === "before") {
          value = this.raw(node2, null, "beforeRule");
        } else {
          value = this.raw(node2, null, "beforeClose");
        }
        let buf = node2.parent;
        let depth = 0;
        while (buf && buf.type !== "root") {
          depth += 1;
          buf = buf.parent;
        }
        if (value.includes("\n")) {
          let indent = this.raw(node2, null, "indent");
          if (indent.length) {
            for (let step = 0; step < depth; step++) value += indent;
          }
        }
        return value;
      }
      block(node2, start) {
        let between = this.raw(node2, "between", "beforeOpen");
        this.builder(start + between + "{", node2, "start");
        let after;
        if (node2.nodes && node2.nodes.length) {
          this.body(node2);
          after = this.raw(node2, "after");
        } else {
          after = this.raw(node2, "after", "emptyBody");
        }
        if (after) this.builder(after);
        this.builder("}", node2, "end");
      }
      body(node2) {
        let last = node2.nodes.length - 1;
        while (last > 0) {
          if (node2.nodes[last].type !== "comment") break;
          last -= 1;
        }
        let semicolon = this.raw(node2, "semicolon");
        for (let i2 = 0; i2 < node2.nodes.length; i2++) {
          let child = node2.nodes[i2];
          let before = this.raw(child, "before");
          if (before) this.builder(before);
          this.stringify(child, last !== i2 || semicolon);
        }
      }
      comment(node2) {
        let left = this.raw(node2, "left", "commentLeft");
        let right = this.raw(node2, "right", "commentRight");
        this.builder("/*" + left + node2.text + right + "*/", node2);
      }
      decl(node2, semicolon) {
        let between = this.raw(node2, "between", "colon");
        let string = node2.prop + between + this.rawValue(node2, "value");
        if (node2.important) {
          string += node2.raws.important || " !important";
        }
        if (semicolon) string += ";";
        this.builder(string, node2);
      }
      document(node2) {
        this.body(node2);
      }
      raw(node2, own, detect) {
        let value;
        if (!detect) detect = own;
        if (own) {
          value = node2.raws[own];
          if (typeof value !== "undefined") return value;
        }
        let parent = node2.parent;
        if (detect === "before") {
          if (!parent || parent.type === "root" && parent.first === node2) {
            return "";
          }
          if (parent && parent.type === "document") {
            return "";
          }
        }
        if (!parent) return DEFAULT_RAW$1[detect];
        let root2 = node2.root();
        if (!root2.rawCache) root2.rawCache = {};
        if (typeof root2.rawCache[detect] !== "undefined") {
          return root2.rawCache[detect];
        }
        if (detect === "before" || detect === "after") {
          return this.beforeAfter(node2, detect);
        } else {
          let method = "raw" + capitalize$1(detect);
          if (this[method]) {
            value = this[method](root2, node2);
          } else {
            root2.walk((i2) => {
              value = i2.raws[own];
              if (typeof value !== "undefined") return false;
            });
          }
        }
        if (typeof value === "undefined") value = DEFAULT_RAW$1[detect];
        root2.rawCache[detect] = value;
        return value;
      }
      rawBeforeClose(root2) {
        let value;
        root2.walk((i2) => {
          if (i2.nodes && i2.nodes.length > 0) {
            if (typeof i2.raws.after !== "undefined") {
              value = i2.raws.after;
              if (value.includes("\n")) {
                value = value.replace(/[^\n]+$/, "");
              }
              return false;
            }
          }
        });
        if (value) value = value.replace(/\S/g, "");
        return value;
      }
      rawBeforeComment(root2, node2) {
        let value;
        root2.walkComments((i2) => {
          if (typeof i2.raws.before !== "undefined") {
            value = i2.raws.before;
            if (value.includes("\n")) {
              value = value.replace(/[^\n]+$/, "");
            }
            return false;
          }
        });
        if (typeof value === "undefined") {
          value = this.raw(node2, null, "beforeDecl");
        } else if (value) {
          value = value.replace(/\S/g, "");
        }
        return value;
      }
      rawBeforeDecl(root2, node2) {
        let value;
        root2.walkDecls((i2) => {
          if (typeof i2.raws.before !== "undefined") {
            value = i2.raws.before;
            if (value.includes("\n")) {
              value = value.replace(/[^\n]+$/, "");
            }
            return false;
          }
        });
        if (typeof value === "undefined") {
          value = this.raw(node2, null, "beforeRule");
        } else if (value) {
          value = value.replace(/\S/g, "");
        }
        return value;
      }
      rawBeforeOpen(root2) {
        let value;
        root2.walk((i2) => {
          if (i2.type !== "decl") {
            value = i2.raws.between;
            if (typeof value !== "undefined") return false;
          }
        });
        return value;
      }
      rawBeforeRule(root2) {
        let value;
        root2.walk((i2) => {
          if (i2.nodes && (i2.parent !== root2 || root2.first !== i2)) {
            if (typeof i2.raws.before !== "undefined") {
              value = i2.raws.before;
              if (value.includes("\n")) {
                value = value.replace(/[^\n]+$/, "");
              }
              return false;
            }
          }
        });
        if (value) value = value.replace(/\S/g, "");
        return value;
      }
      rawColon(root2) {
        let value;
        root2.walkDecls((i2) => {
          if (typeof i2.raws.between !== "undefined") {
            value = i2.raws.between.replace(/[^\s:]/g, "");
            return false;
          }
        });
        return value;
      }
      rawEmptyBody(root2) {
        let value;
        root2.walk((i2) => {
          if (i2.nodes && i2.nodes.length === 0) {
            value = i2.raws.after;
            if (typeof value !== "undefined") return false;
          }
        });
        return value;
      }
      rawIndent(root2) {
        if (root2.raws.indent) return root2.raws.indent;
        let value;
        root2.walk((i2) => {
          let p2 = i2.parent;
          if (p2 && p2 !== root2 && p2.parent && p2.parent === root2) {
            if (typeof i2.raws.before !== "undefined") {
              let parts = i2.raws.before.split("\n");
              value = parts[parts.length - 1];
              value = value.replace(/\S/g, "");
              return false;
            }
          }
        });
        return value;
      }
      rawSemicolon(root2) {
        let value;
        root2.walk((i2) => {
          if (i2.nodes && i2.nodes.length && i2.last.type === "decl") {
            value = i2.raws.semicolon;
            if (typeof value !== "undefined") return false;
          }
        });
        return value;
      }
      rawValue(node2, prop2) {
        let value = node2[prop2];
        let raw = node2.raws[prop2];
        if (raw && raw.value === value) {
          return raw.raw;
        }
        return value;
      }
      root(node2) {
        this.body(node2);
        if (node2.raws.after) this.builder(node2.raws.after);
      }
      rule(node2) {
        this.block(node2, this.rawValue(node2, "selector"));
        if (node2.raws.ownSemicolon) {
          this.builder(node2.raws.ownSemicolon, node2, "end");
        }
      }
      stringify(node2, semicolon) {
        if (!this[node2.type]) {
          throw new Error(
            "Unknown AST node type " + node2.type + ". Maybe you need to change PostCSS stringifier."
          );
        }
        this[node2.type](node2, semicolon);
      }
    };
    stringifier$1 = Stringifier$2$1;
    Stringifier$2$1.default = Stringifier$2$1;
    Stringifier$1$1 = stringifier$1;
    stringify_1$1 = stringify$4$1;
    stringify$4$1.default = stringify$4$1;
    ({ isClean: isClean$2$1, my: my$2$1 } = symbols$1);
    CssSyntaxError$2$1 = cssSyntaxError$1;
    Stringifier2$1 = stringifier$1;
    stringify$3$1 = stringify_1$1;
    Node$4$1 = class Node2 {
      constructor(defaults2 = {}) {
        this.raws = {};
        this[isClean$2$1] = false;
        this[my$2$1] = true;
        for (let name in defaults2) {
          if (name === "nodes") {
            this.nodes = [];
            for (let node2 of defaults2[name]) {
              if (typeof node2.clone === "function") {
                this.append(node2.clone());
              } else {
                this.append(node2);
              }
            }
          } else {
            this[name] = defaults2[name];
          }
        }
      }
      addToError(error) {
        error.postcssNode = this;
        if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
          let s2 = this.source;
          error.stack = error.stack.replace(
            /\n\s{4}at /,
            `$&${s2.input.from}:${s2.start.line}:${s2.start.column}$&`
          );
        }
        return error;
      }
      after(add) {
        this.parent.insertAfter(this, add);
        return this;
      }
      assign(overrides = {}) {
        for (let name in overrides) {
          this[name] = overrides[name];
        }
        return this;
      }
      before(add) {
        this.parent.insertBefore(this, add);
        return this;
      }
      cleanRaws(keepBetween) {
        delete this.raws.before;
        delete this.raws.after;
        if (!keepBetween) delete this.raws.between;
      }
      clone(overrides = {}) {
        let cloned = cloneNode$1(this);
        for (let name in overrides) {
          cloned[name] = overrides[name];
        }
        return cloned;
      }
      cloneAfter(overrides = {}) {
        let cloned = this.clone(overrides);
        this.parent.insertAfter(this, cloned);
        return cloned;
      }
      cloneBefore(overrides = {}) {
        let cloned = this.clone(overrides);
        this.parent.insertBefore(this, cloned);
        return cloned;
      }
      error(message, opts = {}) {
        if (this.source) {
          let { end, start } = this.rangeBy(opts);
          return this.source.input.error(
            message,
            { column: start.column, line: start.line },
            { column: end.column, line: end.line },
            opts
          );
        }
        return new CssSyntaxError$2$1(message);
      }
      getProxyProcessor() {
        return {
          get(node2, prop2) {
            if (prop2 === "proxyOf") {
              return node2;
            } else if (prop2 === "root") {
              return () => node2.root().toProxy();
            } else {
              return node2[prop2];
            }
          },
          set(node2, prop2, value) {
            if (node2[prop2] === value) return true;
            node2[prop2] = value;
            if (prop2 === "prop" || prop2 === "value" || prop2 === "name" || prop2 === "params" || prop2 === "important" || /* c8 ignore next */
            prop2 === "text") {
              node2.markDirty();
            }
            return true;
          }
        };
      }
      markDirty() {
        if (this[isClean$2$1]) {
          this[isClean$2$1] = false;
          let next = this;
          while (next = next.parent) {
            next[isClean$2$1] = false;
          }
        }
      }
      next() {
        if (!this.parent) return void 0;
        let index22 = this.parent.index(this);
        return this.parent.nodes[index22 + 1];
      }
      positionBy(opts, stringRepresentation) {
        let pos = this.source.start;
        if (opts.index) {
          pos = this.positionInside(opts.index, stringRepresentation);
        } else if (opts.word) {
          stringRepresentation = this.toString();
          let index22 = stringRepresentation.indexOf(opts.word);
          if (index22 !== -1) pos = this.positionInside(index22, stringRepresentation);
        }
        return pos;
      }
      positionInside(index22, stringRepresentation) {
        let string = stringRepresentation || this.toString();
        let column = this.source.start.column;
        let line = this.source.start.line;
        for (let i2 = 0; i2 < index22; i2++) {
          if (string[i2] === "\n") {
            column = 1;
            line += 1;
          } else {
            column += 1;
          }
        }
        return { column, line };
      }
      prev() {
        if (!this.parent) return void 0;
        let index22 = this.parent.index(this);
        return this.parent.nodes[index22 - 1];
      }
      rangeBy(opts) {
        let start = {
          column: this.source.start.column,
          line: this.source.start.line
        };
        let end = this.source.end ? {
          column: this.source.end.column + 1,
          line: this.source.end.line
        } : {
          column: start.column + 1,
          line: start.line
        };
        if (opts.word) {
          let stringRepresentation = this.toString();
          let index22 = stringRepresentation.indexOf(opts.word);
          if (index22 !== -1) {
            start = this.positionInside(index22, stringRepresentation);
            end = this.positionInside(index22 + opts.word.length, stringRepresentation);
          }
        } else {
          if (opts.start) {
            start = {
              column: opts.start.column,
              line: opts.start.line
            };
          } else if (opts.index) {
            start = this.positionInside(opts.index);
          }
          if (opts.end) {
            end = {
              column: opts.end.column,
              line: opts.end.line
            };
          } else if (typeof opts.endIndex === "number") {
            end = this.positionInside(opts.endIndex);
          } else if (opts.index) {
            end = this.positionInside(opts.index + 1);
          }
        }
        if (end.line < start.line || end.line === start.line && end.column <= start.column) {
          end = { column: start.column + 1, line: start.line };
        }
        return { end, start };
      }
      raw(prop2, defaultType) {
        let str = new Stringifier2$1();
        return str.raw(this, prop2, defaultType);
      }
      remove() {
        if (this.parent) {
          this.parent.removeChild(this);
        }
        this.parent = void 0;
        return this;
      }
      replaceWith(...nodes) {
        if (this.parent) {
          let bookmark = this;
          let foundSelf = false;
          for (let node2 of nodes) {
            if (node2 === this) {
              foundSelf = true;
            } else if (foundSelf) {
              this.parent.insertAfter(bookmark, node2);
              bookmark = node2;
            } else {
              this.parent.insertBefore(bookmark, node2);
            }
          }
          if (!foundSelf) {
            this.remove();
          }
        }
        return this;
      }
      root() {
        let result2 = this;
        while (result2.parent && result2.parent.type !== "document") {
          result2 = result2.parent;
        }
        return result2;
      }
      toJSON(_2, inputs) {
        let fixed = {};
        let emitInputs = inputs == null;
        inputs = inputs || /* @__PURE__ */ new Map();
        let inputsNextIndex = 0;
        for (let name in this) {
          if (!Object.prototype.hasOwnProperty.call(this, name)) {
            continue;
          }
          if (name === "parent" || name === "proxyCache") continue;
          let value = this[name];
          if (Array.isArray(value)) {
            fixed[name] = value.map((i2) => {
              if (typeof i2 === "object" && i2.toJSON) {
                return i2.toJSON(null, inputs);
              } else {
                return i2;
              }
            });
          } else if (typeof value === "object" && value.toJSON) {
            fixed[name] = value.toJSON(null, inputs);
          } else if (name === "source") {
            let inputId = inputs.get(value.input);
            if (inputId == null) {
              inputId = inputsNextIndex;
              inputs.set(value.input, inputsNextIndex);
              inputsNextIndex++;
            }
            fixed[name] = {
              end: value.end,
              inputId,
              start: value.start
            };
          } else {
            fixed[name] = value;
          }
        }
        if (emitInputs) {
          fixed.inputs = [...inputs.keys()].map((input2) => input2.toJSON());
        }
        return fixed;
      }
      toProxy() {
        if (!this.proxyCache) {
          this.proxyCache = new Proxy(this, this.getProxyProcessor());
        }
        return this.proxyCache;
      }
      toString(stringifier2 = stringify$3$1) {
        if (stringifier2.stringify) stringifier2 = stringifier2.stringify;
        let result2 = "";
        stringifier2(this, (i2) => {
          result2 += i2;
        });
        return result2;
      }
      warn(result2, text, opts) {
        let data = { node: this };
        for (let i2 in opts) data[i2] = opts[i2];
        return result2.warn(text, data);
      }
      get proxyOf() {
        return this;
      }
    };
    node$1 = Node$4$1;
    Node$4$1.default = Node$4$1;
    Node$3$1 = node$1;
    Declaration$4$1 = class Declaration extends Node$3$1 {
      constructor(defaults2) {
        if (defaults2 && typeof defaults2.value !== "undefined" && typeof defaults2.value !== "string") {
          defaults2 = { ...defaults2, value: String(defaults2.value) };
        }
        super(defaults2);
        this.type = "decl";
      }
      get variable() {
        return this.prop.startsWith("--") || this.prop[0] === "$";
      }
    };
    declaration$1 = Declaration$4$1;
    Declaration$4$1.default = Declaration$4$1;
    urlAlphabet$1 = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
    customAlphabet$1 = (alphabet, defaultSize = 21) => {
      return (size = defaultSize) => {
        let id2 = "";
        let i2 = size;
        while (i2--) {
          id2 += alphabet[Math.random() * alphabet.length | 0];
        }
        return id2;
      };
    };
    nanoid$1$1 = (size = 21) => {
      let id2 = "";
      let i2 = size;
      while (i2--) {
        id2 += urlAlphabet$1[Math.random() * 64 | 0];
      }
      return id2;
    };
    nonSecure$1 = { nanoid: nanoid$1$1, customAlphabet: customAlphabet$1 };
    ({ SourceMapConsumer: SourceMapConsumer$2$1, SourceMapGenerator: SourceMapGenerator$2$1 } = require$$2$1);
    ({ existsSync: existsSync$1, readFileSync: readFileSync$1 } = require$$2$1);
    ({ dirname: dirname$1$1, join: join$1 } = require$$2$1);
    PreviousMap$2$1 = class PreviousMap {
      constructor(css, opts) {
        if (opts.map === false) return;
        this.loadAnnotation(css);
        this.inline = this.startWith(this.annotation, "data:");
        let prev = opts.map ? opts.map.prev : void 0;
        let text = this.loadMap(opts.from, prev);
        if (!this.mapFile && opts.from) {
          this.mapFile = opts.from;
        }
        if (this.mapFile) this.root = dirname$1$1(this.mapFile);
        if (text) this.text = text;
      }
      consumer() {
        if (!this.consumerCache) {
          this.consumerCache = new SourceMapConsumer$2$1(this.text);
        }
        return this.consumerCache;
      }
      decodeInline(text) {
        let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
        let baseUri = /^data:application\/json;base64,/;
        let charsetUri = /^data:application\/json;charset=utf-?8,/;
        let uri = /^data:application\/json,/;
        if (charsetUri.test(text) || uri.test(text)) {
          return decodeURIComponent(text.substr(RegExp.lastMatch.length));
        }
        if (baseCharsetUri.test(text) || baseUri.test(text)) {
          return fromBase64$1(text.substr(RegExp.lastMatch.length));
        }
        let encoding = text.match(/data:application\/json;([^,]+),/)[1];
        throw new Error("Unsupported source map encoding " + encoding);
      }
      getAnnotationURL(sourceMapString) {
        return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
      }
      isMap(map) {
        if (typeof map !== "object") return false;
        return typeof map.mappings === "string" || typeof map._mappings === "string" || Array.isArray(map.sections);
      }
      loadAnnotation(css) {
        let comments = css.match(/\/\*\s*# sourceMappingURL=/gm);
        if (!comments) return;
        let start = css.lastIndexOf(comments.pop());
        let end = css.indexOf("*/", start);
        if (start > -1 && end > -1) {
          this.annotation = this.getAnnotationURL(css.substring(start, end));
        }
      }
      loadFile(path) {
        this.root = dirname$1$1(path);
        if (existsSync$1(path)) {
          this.mapFile = path;
          return readFileSync$1(path, "utf-8").toString().trim();
        }
      }
      loadMap(file, prev) {
        if (prev === false) return false;
        if (prev) {
          if (typeof prev === "string") {
            return prev;
          } else if (typeof prev === "function") {
            let prevPath = prev(file);
            if (prevPath) {
              let map = this.loadFile(prevPath);
              if (!map) {
                throw new Error(
                  "Unable to load previous source map: " + prevPath.toString()
                );
              }
              return map;
            }
          } else if (prev instanceof SourceMapConsumer$2$1) {
            return SourceMapGenerator$2$1.fromSourceMap(prev).toString();
          } else if (prev instanceof SourceMapGenerator$2$1) {
            return prev.toString();
          } else if (this.isMap(prev)) {
            return JSON.stringify(prev);
          } else {
            throw new Error(
              "Unsupported previous source map format: " + prev.toString()
            );
          }
        } else if (this.inline) {
          return this.decodeInline(this.annotation);
        } else if (this.annotation) {
          let map = this.annotation;
          if (file) map = join$1(dirname$1$1(file), map);
          return this.loadFile(map);
        }
      }
      startWith(string, start) {
        if (!string) return false;
        return string.substr(0, start.length) === start;
      }
      withContent() {
        return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
      }
    };
    previousMap$1 = PreviousMap$2$1;
    PreviousMap$2$1.default = PreviousMap$2$1;
    ({ SourceMapConsumer: SourceMapConsumer$1$1, SourceMapGenerator: SourceMapGenerator$1$1 } = require$$2$1);
    ({ fileURLToPath: fileURLToPath$1, pathToFileURL: pathToFileURL$1$1 } = require$$2$1);
    ({ isAbsolute: isAbsolute$1, resolve: resolve$1$1 } = require$$2$1);
    ({ nanoid: nanoid$2 } = nonSecure$1);
    terminalHighlight$2 = require$$2$1;
    CssSyntaxError$1$1 = cssSyntaxError$1;
    PreviousMap$1$1 = previousMap$1;
    fromOffsetCache$1 = /* @__PURE__ */ Symbol("fromOffsetCache");
    sourceMapAvailable$1$1 = Boolean(SourceMapConsumer$1$1 && SourceMapGenerator$1$1);
    pathAvailable$1$1 = Boolean(resolve$1$1 && isAbsolute$1);
    Input$4$1 = class Input {
      constructor(css, opts = {}) {
        if (css === null || typeof css === "undefined" || typeof css === "object" && !css.toString) {
          throw new Error(`PostCSS received ${css} instead of CSS string`);
        }
        this.css = css.toString();
        if (this.css[0] === "\uFEFF" || this.css[0] === "\uFFFE") {
          this.hasBOM = true;
          this.css = this.css.slice(1);
        } else {
          this.hasBOM = false;
        }
        if (opts.from) {
          if (!pathAvailable$1$1 || /^\w+:\/\//.test(opts.from) || isAbsolute$1(opts.from)) {
            this.file = opts.from;
          } else {
            this.file = resolve$1$1(opts.from);
          }
        }
        if (pathAvailable$1$1 && sourceMapAvailable$1$1) {
          let map = new PreviousMap$1$1(this.css, opts);
          if (map.text) {
            this.map = map;
            let file = map.consumer().file;
            if (!this.file && file) this.file = this.mapResolve(file);
          }
        }
        if (!this.file) {
          this.id = "<input css " + nanoid$2(6) + ">";
        }
        if (this.map) this.map.file = this.from;
      }
      error(message, line, column, opts = {}) {
        let result2, endLine, endColumn;
        if (line && typeof line === "object") {
          let start = line;
          let end = column;
          if (typeof start.offset === "number") {
            let pos = this.fromOffset(start.offset);
            line = pos.line;
            column = pos.col;
          } else {
            line = start.line;
            column = start.column;
          }
          if (typeof end.offset === "number") {
            let pos = this.fromOffset(end.offset);
            endLine = pos.line;
            endColumn = pos.col;
          } else {
            endLine = end.line;
            endColumn = end.column;
          }
        } else if (!column) {
          let pos = this.fromOffset(line);
          line = pos.line;
          column = pos.col;
        }
        let origin = this.origin(line, column, endLine, endColumn);
        if (origin) {
          result2 = new CssSyntaxError$1$1(
            message,
            origin.endLine === void 0 ? origin.line : { column: origin.column, line: origin.line },
            origin.endLine === void 0 ? origin.column : { column: origin.endColumn, line: origin.endLine },
            origin.source,
            origin.file,
            opts.plugin
          );
        } else {
          result2 = new CssSyntaxError$1$1(
            message,
            endLine === void 0 ? line : { column, line },
            endLine === void 0 ? column : { column: endColumn, line: endLine },
            this.css,
            this.file,
            opts.plugin
          );
        }
        result2.input = { column, endColumn, endLine, line, source: this.css };
        if (this.file) {
          if (pathToFileURL$1$1) {
            result2.input.url = pathToFileURL$1$1(this.file).toString();
          }
          result2.input.file = this.file;
        }
        return result2;
      }
      fromOffset(offset) {
        let lastLine, lineToIndex;
        if (!this[fromOffsetCache$1]) {
          let lines = this.css.split("\n");
          lineToIndex = new Array(lines.length);
          let prevIndex = 0;
          for (let i2 = 0, l2 = lines.length; i2 < l2; i2++) {
            lineToIndex[i2] = prevIndex;
            prevIndex += lines[i2].length + 1;
          }
          this[fromOffsetCache$1] = lineToIndex;
        } else {
          lineToIndex = this[fromOffsetCache$1];
        }
        lastLine = lineToIndex[lineToIndex.length - 1];
        let min = 0;
        if (offset >= lastLine) {
          min = lineToIndex.length - 1;
        } else {
          let max2 = lineToIndex.length - 2;
          let mid;
          while (min < max2) {
            mid = min + (max2 - min >> 1);
            if (offset < lineToIndex[mid]) {
              max2 = mid - 1;
            } else if (offset >= lineToIndex[mid + 1]) {
              min = mid + 1;
            } else {
              min = mid;
              break;
            }
          }
        }
        return {
          col: offset - lineToIndex[min] + 1,
          line: min + 1
        };
      }
      mapResolve(file) {
        if (/^\w+:\/\//.test(file)) {
          return file;
        }
        return resolve$1$1(this.map.consumer().sourceRoot || this.map.root || ".", file);
      }
      origin(line, column, endLine, endColumn) {
        if (!this.map) return false;
        let consumer = this.map.consumer();
        let from = consumer.originalPositionFor({ column, line });
        if (!from.source) return false;
        let to;
        if (typeof endLine === "number") {
          to = consumer.originalPositionFor({ column: endColumn, line: endLine });
        }
        let fromUrl;
        if (isAbsolute$1(from.source)) {
          fromUrl = pathToFileURL$1$1(from.source);
        } else {
          fromUrl = new URL(
            from.source,
            this.map.consumer().sourceRoot || pathToFileURL$1$1(this.map.mapFile)
          );
        }
        let result2 = {
          column: from.column,
          endColumn: to && to.column,
          endLine: to && to.line,
          line: from.line,
          url: fromUrl.toString()
        };
        if (fromUrl.protocol === "file:") {
          if (fileURLToPath$1) {
            result2.file = fileURLToPath$1(fromUrl);
          } else {
            throw new Error(`file: protocol is not available in this PostCSS build`);
          }
        }
        let source = consumer.sourceContentFor(from.source);
        if (source) result2.source = source;
        return result2;
      }
      toJSON() {
        let json = {};
        for (let name of ["hasBOM", "css", "file", "id"]) {
          if (this[name] != null) {
            json[name] = this[name];
          }
        }
        if (this.map) {
          json.map = { ...this.map };
          if (json.map.consumerCache) {
            json.map.consumerCache = void 0;
          }
        }
        return json;
      }
      get from() {
        return this.file || this.id;
      }
    };
    input$1 = Input$4$1;
    Input$4$1.default = Input$4$1;
    if (terminalHighlight$2 && terminalHighlight$2.registerInput) {
      terminalHighlight$2.registerInput(Input$4$1);
    }
    ({ SourceMapConsumer: SourceMapConsumer$3, SourceMapGenerator: SourceMapGenerator$3 } = require$$2$1);
    ({ dirname: dirname$2, relative: relative$1, resolve: resolve$2, sep: sep$1 } = require$$2$1);
    ({ pathToFileURL: pathToFileURL$2 } = require$$2$1);
    Input$3$1 = input$1;
    sourceMapAvailable$2 = Boolean(SourceMapConsumer$3 && SourceMapGenerator$3);
    pathAvailable$2 = Boolean(dirname$2 && resolve$2 && relative$1 && sep$1);
    MapGenerator$2$1 = class MapGenerator {
      constructor(stringify22, root2, opts, cssString) {
        this.stringify = stringify22;
        this.mapOpts = opts.map || {};
        this.root = root2;
        this.opts = opts;
        this.css = cssString;
        this.originalCSS = cssString;
        this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute;
        this.memoizedFileURLs = /* @__PURE__ */ new Map();
        this.memoizedPaths = /* @__PURE__ */ new Map();
        this.memoizedURLs = /* @__PURE__ */ new Map();
      }
      addAnnotation() {
        let content;
        if (this.isInline()) {
          content = "data:application/json;base64," + this.toBase64(this.map.toString());
        } else if (typeof this.mapOpts.annotation === "string") {
          content = this.mapOpts.annotation;
        } else if (typeof this.mapOpts.annotation === "function") {
          content = this.mapOpts.annotation(this.opts.to, this.root);
        } else {
          content = this.outputFile() + ".map";
        }
        let eol = "\n";
        if (this.css.includes("\r\n")) eol = "\r\n";
        this.css += eol + "/*# sourceMappingURL=" + content + " */";
      }
      applyPrevMaps() {
        for (let prev of this.previous()) {
          let from = this.toUrl(this.path(prev.file));
          let root2 = prev.root || dirname$2(prev.file);
          let map;
          if (this.mapOpts.sourcesContent === false) {
            map = new SourceMapConsumer$3(prev.text);
            if (map.sourcesContent) {
              map.sourcesContent = null;
            }
          } else {
            map = prev.consumer();
          }
          this.map.applySourceMap(map, from, this.toUrl(this.path(root2)));
        }
      }
      clearAnnotation() {
        if (this.mapOpts.annotation === false) return;
        if (this.root) {
          let node2;
          for (let i2 = this.root.nodes.length - 1; i2 >= 0; i2--) {
            node2 = this.root.nodes[i2];
            if (node2.type !== "comment") continue;
            if (node2.text.indexOf("# sourceMappingURL=") === 0) {
              this.root.removeChild(i2);
            }
          }
        } else if (this.css) {
          this.css = this.css.replace(/\n*?\/\*#[\S\s]*?\*\/$/gm, "");
        }
      }
      generate() {
        this.clearAnnotation();
        if (pathAvailable$2 && sourceMapAvailable$2 && this.isMap()) {
          return this.generateMap();
        } else {
          let result2 = "";
          this.stringify(this.root, (i2) => {
            result2 += i2;
          });
          return [result2];
        }
      }
      generateMap() {
        if (this.root) {
          this.generateString();
        } else if (this.previous().length === 1) {
          let prev = this.previous()[0].consumer();
          prev.file = this.outputFile();
          this.map = SourceMapGenerator$3.fromSourceMap(prev, {
            ignoreInvalidMapping: true
          });
        } else {
          this.map = new SourceMapGenerator$3({
            file: this.outputFile(),
            ignoreInvalidMapping: true
          });
          this.map.addMapping({
            generated: { column: 0, line: 1 },
            original: { column: 0, line: 1 },
            source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>"
          });
        }
        if (this.isSourcesContent()) this.setSourcesContent();
        if (this.root && this.previous().length > 0) this.applyPrevMaps();
        if (this.isAnnotation()) this.addAnnotation();
        if (this.isInline()) {
          return [this.css];
        } else {
          return [this.css, this.map];
        }
      }
      generateString() {
        this.css = "";
        this.map = new SourceMapGenerator$3({
          file: this.outputFile(),
          ignoreInvalidMapping: true
        });
        let line = 1;
        let column = 1;
        let noSource = "<no source>";
        let mapping = {
          generated: { column: 0, line: 0 },
          original: { column: 0, line: 0 },
          source: ""
        };
        let lines, last;
        this.stringify(this.root, (str, node2, type) => {
          this.css += str;
          if (node2 && type !== "end") {
            mapping.generated.line = line;
            mapping.generated.column = column - 1;
            if (node2.source && node2.source.start) {
              mapping.source = this.sourcePath(node2);
              mapping.original.line = node2.source.start.line;
              mapping.original.column = node2.source.start.column - 1;
              this.map.addMapping(mapping);
            } else {
              mapping.source = noSource;
              mapping.original.line = 1;
              mapping.original.column = 0;
              this.map.addMapping(mapping);
            }
          }
          lines = str.match(/\n/g);
          if (lines) {
            line += lines.length;
            last = str.lastIndexOf("\n");
            column = str.length - last;
          } else {
            column += str.length;
          }
          if (node2 && type !== "start") {
            let p2 = node2.parent || { raws: {} };
            let childless = node2.type === "decl" || node2.type === "atrule" && !node2.nodes;
            if (!childless || node2 !== p2.last || p2.raws.semicolon) {
              if (node2.source && node2.source.end) {
                mapping.source = this.sourcePath(node2);
                mapping.original.line = node2.source.end.line;
                mapping.original.column = node2.source.end.column - 1;
                mapping.generated.line = line;
                mapping.generated.column = column - 2;
                this.map.addMapping(mapping);
              } else {
                mapping.source = noSource;
                mapping.original.line = 1;
                mapping.original.column = 0;
                mapping.generated.line = line;
                mapping.generated.column = column - 1;
                this.map.addMapping(mapping);
              }
            }
          }
        });
      }
      isAnnotation() {
        if (this.isInline()) {
          return true;
        }
        if (typeof this.mapOpts.annotation !== "undefined") {
          return this.mapOpts.annotation;
        }
        if (this.previous().length) {
          return this.previous().some((i2) => i2.annotation);
        }
        return true;
      }
      isInline() {
        if (typeof this.mapOpts.inline !== "undefined") {
          return this.mapOpts.inline;
        }
        let annotation = this.mapOpts.annotation;
        if (typeof annotation !== "undefined" && annotation !== true) {
          return false;
        }
        if (this.previous().length) {
          return this.previous().some((i2) => i2.inline);
        }
        return true;
      }
      isMap() {
        if (typeof this.opts.map !== "undefined") {
          return !!this.opts.map;
        }
        return this.previous().length > 0;
      }
      isSourcesContent() {
        if (typeof this.mapOpts.sourcesContent !== "undefined") {
          return this.mapOpts.sourcesContent;
        }
        if (this.previous().length) {
          return this.previous().some((i2) => i2.withContent());
        }
        return true;
      }
      outputFile() {
        if (this.opts.to) {
          return this.path(this.opts.to);
        } else if (this.opts.from) {
          return this.path(this.opts.from);
        } else {
          return "to.css";
        }
      }
      path(file) {
        if (this.mapOpts.absolute) return file;
        if (file.charCodeAt(0) === 60) return file;
        if (/^\w+:\/\//.test(file)) return file;
        let cached = this.memoizedPaths.get(file);
        if (cached) return cached;
        let from = this.opts.to ? dirname$2(this.opts.to) : ".";
        if (typeof this.mapOpts.annotation === "string") {
          from = dirname$2(resolve$2(from, this.mapOpts.annotation));
        }
        let path = relative$1(from, file);
        this.memoizedPaths.set(file, path);
        return path;
      }
      previous() {
        if (!this.previousMaps) {
          this.previousMaps = [];
          if (this.root) {
            this.root.walk((node2) => {
              if (node2.source && node2.source.input.map) {
                let map = node2.source.input.map;
                if (!this.previousMaps.includes(map)) {
                  this.previousMaps.push(map);
                }
              }
            });
          } else {
            let input2 = new Input$3$1(this.originalCSS, this.opts);
            if (input2.map) this.previousMaps.push(input2.map);
          }
        }
        return this.previousMaps;
      }
      setSourcesContent() {
        let already = {};
        if (this.root) {
          this.root.walk((node2) => {
            if (node2.source) {
              let from = node2.source.input.from;
              if (from && !already[from]) {
                already[from] = true;
                let fromUrl = this.usesFileUrls ? this.toFileUrl(from) : this.toUrl(this.path(from));
                this.map.setSourceContent(fromUrl, node2.source.input.css);
              }
            }
          });
        } else if (this.css) {
          let from = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
          this.map.setSourceContent(from, this.css);
        }
      }
      sourcePath(node2) {
        if (this.mapOpts.from) {
          return this.toUrl(this.mapOpts.from);
        } else if (this.usesFileUrls) {
          return this.toFileUrl(node2.source.input.from);
        } else {
          return this.toUrl(this.path(node2.source.input.from));
        }
      }
      toBase64(str) {
        if (Buffer) {
          return Buffer.from(str).toString("base64");
        } else {
          return window.btoa(unescape(encodeURIComponent(str)));
        }
      }
      toFileUrl(path) {
        let cached = this.memoizedFileURLs.get(path);
        if (cached) return cached;
        if (pathToFileURL$2) {
          let fileURL = pathToFileURL$2(path).toString();
          this.memoizedFileURLs.set(path, fileURL);
          return fileURL;
        } else {
          throw new Error(
            "`map.absolute` option is not available in this PostCSS build"
          );
        }
      }
      toUrl(path) {
        let cached = this.memoizedURLs.get(path);
        if (cached) return cached;
        if (sep$1 === "\\") {
          path = path.replace(/\\/g, "/");
        }
        let url = encodeURI(path).replace(/[#?]/g, encodeURIComponent);
        this.memoizedURLs.set(path, url);
        return url;
      }
    };
    mapGenerator$1 = MapGenerator$2$1;
    Node$2$1 = node$1;
    Comment$4$1 = class Comment extends Node$2$1 {
      constructor(defaults2) {
        super(defaults2);
        this.type = "comment";
      }
    };
    comment$1 = Comment$4$1;
    Comment$4$1.default = Comment$4$1;
    ({ isClean: isClean$1$1, my: my$1$1 } = symbols$1);
    Declaration$3$1 = declaration$1;
    Comment$3$1 = comment$1;
    Node$1$1 = node$1;
    Container$7$1 = class Container extends Node$1$1 {
      append(...children) {
        for (let child of children) {
          let nodes = this.normalize(child, this.last);
          for (let node2 of nodes) this.proxyOf.nodes.push(node2);
        }
        this.markDirty();
        return this;
      }
      cleanRaws(keepBetween) {
        super.cleanRaws(keepBetween);
        if (this.nodes) {
          for (let node2 of this.nodes) node2.cleanRaws(keepBetween);
        }
      }
      each(callback) {
        if (!this.proxyOf.nodes) return void 0;
        let iterator = this.getIterator();
        let index22, result2;
        while (this.indexes[iterator] < this.proxyOf.nodes.length) {
          index22 = this.indexes[iterator];
          result2 = callback(this.proxyOf.nodes[index22], index22);
          if (result2 === false) break;
          this.indexes[iterator] += 1;
        }
        delete this.indexes[iterator];
        return result2;
      }
      every(condition) {
        return this.nodes.every(condition);
      }
      getIterator() {
        if (!this.lastEach) this.lastEach = 0;
        if (!this.indexes) this.indexes = {};
        this.lastEach += 1;
        let iterator = this.lastEach;
        this.indexes[iterator] = 0;
        return iterator;
      }
      getProxyProcessor() {
        return {
          get(node2, prop2) {
            if (prop2 === "proxyOf") {
              return node2;
            } else if (!node2[prop2]) {
              return node2[prop2];
            } else if (prop2 === "each" || typeof prop2 === "string" && prop2.startsWith("walk")) {
              return (...args) => {
                return node2[prop2](
                  ...args.map((i2) => {
                    if (typeof i2 === "function") {
                      return (child, index22) => i2(child.toProxy(), index22);
                    } else {
                      return i2;
                    }
                  })
                );
              };
            } else if (prop2 === "every" || prop2 === "some") {
              return (cb) => {
                return node2[prop2](
                  (child, ...other) => cb(child.toProxy(), ...other)
                );
              };
            } else if (prop2 === "root") {
              return () => node2.root().toProxy();
            } else if (prop2 === "nodes") {
              return node2.nodes.map((i2) => i2.toProxy());
            } else if (prop2 === "first" || prop2 === "last") {
              return node2[prop2].toProxy();
            } else {
              return node2[prop2];
            }
          },
          set(node2, prop2, value) {
            if (node2[prop2] === value) return true;
            node2[prop2] = value;
            if (prop2 === "name" || prop2 === "params" || prop2 === "selector") {
              node2.markDirty();
            }
            return true;
          }
        };
      }
      index(child) {
        if (typeof child === "number") return child;
        if (child.proxyOf) child = child.proxyOf;
        return this.proxyOf.nodes.indexOf(child);
      }
      insertAfter(exist, add) {
        let existIndex = this.index(exist);
        let nodes = this.normalize(add, this.proxyOf.nodes[existIndex]).reverse();
        existIndex = this.index(exist);
        for (let node2 of nodes) this.proxyOf.nodes.splice(existIndex + 1, 0, node2);
        let index22;
        for (let id2 in this.indexes) {
          index22 = this.indexes[id2];
          if (existIndex < index22) {
            this.indexes[id2] = index22 + nodes.length;
          }
        }
        this.markDirty();
        return this;
      }
      insertBefore(exist, add) {
        let existIndex = this.index(exist);
        let type = existIndex === 0 ? "prepend" : false;
        let nodes = this.normalize(add, this.proxyOf.nodes[existIndex], type).reverse();
        existIndex = this.index(exist);
        for (let node2 of nodes) this.proxyOf.nodes.splice(existIndex, 0, node2);
        let index22;
        for (let id2 in this.indexes) {
          index22 = this.indexes[id2];
          if (existIndex <= index22) {
            this.indexes[id2] = index22 + nodes.length;
          }
        }
        this.markDirty();
        return this;
      }
      normalize(nodes, sample) {
        if (typeof nodes === "string") {
          nodes = cleanSource$1(parse$4$1(nodes).nodes);
        } else if (typeof nodes === "undefined") {
          nodes = [];
        } else if (Array.isArray(nodes)) {
          nodes = nodes.slice(0);
          for (let i2 of nodes) {
            if (i2.parent) i2.parent.removeChild(i2, "ignore");
          }
        } else if (nodes.type === "root" && this.type !== "document") {
          nodes = nodes.nodes.slice(0);
          for (let i2 of nodes) {
            if (i2.parent) i2.parent.removeChild(i2, "ignore");
          }
        } else if (nodes.type) {
          nodes = [nodes];
        } else if (nodes.prop) {
          if (typeof nodes.value === "undefined") {
            throw new Error("Value field is missed in node creation");
          } else if (typeof nodes.value !== "string") {
            nodes.value = String(nodes.value);
          }
          nodes = [new Declaration$3$1(nodes)];
        } else if (nodes.selector) {
          nodes = [new Rule$4$1(nodes)];
        } else if (nodes.name) {
          nodes = [new AtRule$4$1(nodes)];
        } else if (nodes.text) {
          nodes = [new Comment$3$1(nodes)];
        } else {
          throw new Error("Unknown node type in node creation");
        }
        let processed = nodes.map((i2) => {
          if (!i2[my$1$1]) Container.rebuild(i2);
          i2 = i2.proxyOf;
          if (i2.parent) i2.parent.removeChild(i2);
          if (i2[isClean$1$1]) markDirtyUp$1(i2);
          if (typeof i2.raws.before === "undefined") {
            if (sample && typeof sample.raws.before !== "undefined") {
              i2.raws.before = sample.raws.before.replace(/\S/g, "");
            }
          }
          i2.parent = this.proxyOf;
          return i2;
        });
        return processed;
      }
      prepend(...children) {
        children = children.reverse();
        for (let child of children) {
          let nodes = this.normalize(child, this.first, "prepend").reverse();
          for (let node2 of nodes) this.proxyOf.nodes.unshift(node2);
          for (let id2 in this.indexes) {
            this.indexes[id2] = this.indexes[id2] + nodes.length;
          }
        }
        this.markDirty();
        return this;
      }
      push(child) {
        child.parent = this;
        this.proxyOf.nodes.push(child);
        return this;
      }
      removeAll() {
        for (let node2 of this.proxyOf.nodes) node2.parent = void 0;
        this.proxyOf.nodes = [];
        this.markDirty();
        return this;
      }
      removeChild(child) {
        child = this.index(child);
        this.proxyOf.nodes[child].parent = void 0;
        this.proxyOf.nodes.splice(child, 1);
        let index22;
        for (let id2 in this.indexes) {
          index22 = this.indexes[id2];
          if (index22 >= child) {
            this.indexes[id2] = index22 - 1;
          }
        }
        this.markDirty();
        return this;
      }
      replaceValues(pattern, opts, callback) {
        if (!callback) {
          callback = opts;
          opts = {};
        }
        this.walkDecls((decl) => {
          if (opts.props && !opts.props.includes(decl.prop)) return;
          if (opts.fast && !decl.value.includes(opts.fast)) return;
          decl.value = decl.value.replace(pattern, callback);
        });
        this.markDirty();
        return this;
      }
      some(condition) {
        return this.nodes.some(condition);
      }
      walk(callback) {
        return this.each((child, i2) => {
          let result2;
          try {
            result2 = callback(child, i2);
          } catch (e2) {
            throw child.addToError(e2);
          }
          if (result2 !== false && child.walk) {
            result2 = child.walk(callback);
          }
          return result2;
        });
      }
      walkAtRules(name, callback) {
        if (!callback) {
          callback = name;
          return this.walk((child, i2) => {
            if (child.type === "atrule") {
              return callback(child, i2);
            }
          });
        }
        if (name instanceof RegExp) {
          return this.walk((child, i2) => {
            if (child.type === "atrule" && name.test(child.name)) {
              return callback(child, i2);
            }
          });
        }
        return this.walk((child, i2) => {
          if (child.type === "atrule" && child.name === name) {
            return callback(child, i2);
          }
        });
      }
      walkComments(callback) {
        return this.walk((child, i2) => {
          if (child.type === "comment") {
            return callback(child, i2);
          }
        });
      }
      walkDecls(prop2, callback) {
        if (!callback) {
          callback = prop2;
          return this.walk((child, i2) => {
            if (child.type === "decl") {
              return callback(child, i2);
            }
          });
        }
        if (prop2 instanceof RegExp) {
          return this.walk((child, i2) => {
            if (child.type === "decl" && prop2.test(child.prop)) {
              return callback(child, i2);
            }
          });
        }
        return this.walk((child, i2) => {
          if (child.type === "decl" && child.prop === prop2) {
            return callback(child, i2);
          }
        });
      }
      walkRules(selector, callback) {
        if (!callback) {
          callback = selector;
          return this.walk((child, i2) => {
            if (child.type === "rule") {
              return callback(child, i2);
            }
          });
        }
        if (selector instanceof RegExp) {
          return this.walk((child, i2) => {
            if (child.type === "rule" && selector.test(child.selector)) {
              return callback(child, i2);
            }
          });
        }
        return this.walk((child, i2) => {
          if (child.type === "rule" && child.selector === selector) {
            return callback(child, i2);
          }
        });
      }
      get first() {
        if (!this.proxyOf.nodes) return void 0;
        return this.proxyOf.nodes[0];
      }
      get last() {
        if (!this.proxyOf.nodes) return void 0;
        return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
      }
    };
    Container$7$1.registerParse = (dependant) => {
      parse$4$1 = dependant;
    };
    Container$7$1.registerRule = (dependant) => {
      Rule$4$1 = dependant;
    };
    Container$7$1.registerAtRule = (dependant) => {
      AtRule$4$1 = dependant;
    };
    Container$7$1.registerRoot = (dependant) => {
      Root$6$1 = dependant;
    };
    container$1 = Container$7$1;
    Container$7$1.default = Container$7$1;
    Container$7$1.rebuild = (node2) => {
      if (node2.type === "atrule") {
        Object.setPrototypeOf(node2, AtRule$4$1.prototype);
      } else if (node2.type === "rule") {
        Object.setPrototypeOf(node2, Rule$4$1.prototype);
      } else if (node2.type === "decl") {
        Object.setPrototypeOf(node2, Declaration$3$1.prototype);
      } else if (node2.type === "comment") {
        Object.setPrototypeOf(node2, Comment$3$1.prototype);
      } else if (node2.type === "root") {
        Object.setPrototypeOf(node2, Root$6$1.prototype);
      }
      node2[my$1$1] = true;
      if (node2.nodes) {
        node2.nodes.forEach((child) => {
          Container$7$1.rebuild(child);
        });
      }
    };
    Container$6$1 = container$1;
    Document$3$1 = class Document2 extends Container$6$1 {
      constructor(defaults2) {
        super({ type: "document", ...defaults2 });
        if (!this.nodes) {
          this.nodes = [];
        }
      }
      toResult(opts = {}) {
        let lazy = new LazyResult$4$1(new Processor$3$1(), this, opts);
        return lazy.stringify();
      }
    };
    Document$3$1.registerLazyResult = (dependant) => {
      LazyResult$4$1 = dependant;
    };
    Document$3$1.registerProcessor = (dependant) => {
      Processor$3$1 = dependant;
    };
    document$1$1 = Document$3$1;
    Document$3$1.default = Document$3$1;
    printed$1 = {};
    warnOnce$2$1 = function warnOnce(message) {
      if (printed$1[message]) return;
      printed$1[message] = true;
      if (typeof console !== "undefined" && console.warn) {
        console.warn(message);
      }
    };
    Warning$2$1 = class Warning {
      constructor(text, opts = {}) {
        this.type = "warning";
        this.text = text;
        if (opts.node && opts.node.source) {
          let range = opts.node.rangeBy(opts);
          this.line = range.start.line;
          this.column = range.start.column;
          this.endLine = range.end.line;
          this.endColumn = range.end.column;
        }
        for (let opt in opts) this[opt] = opts[opt];
      }
      toString() {
        if (this.node) {
          return this.node.error(this.text, {
            index: this.index,
            plugin: this.plugin,
            word: this.word
          }).message;
        }
        if (this.plugin) {
          return this.plugin + ": " + this.text;
        }
        return this.text;
      }
    };
    warning$1 = Warning$2$1;
    Warning$2$1.default = Warning$2$1;
    Warning$1$1 = warning$1;
    Result$3$1 = class Result {
      constructor(processor2, root2, opts) {
        this.processor = processor2;
        this.messages = [];
        this.root = root2;
        this.opts = opts;
        this.css = void 0;
        this.map = void 0;
      }
      toString() {
        return this.css;
      }
      warn(text, opts = {}) {
        if (!opts.plugin) {
          if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
            opts.plugin = this.lastPlugin.postcssPlugin;
          }
        }
        let warning2 = new Warning$1$1(text, opts);
        this.messages.push(warning2);
        return warning2;
      }
      warnings() {
        return this.messages.filter((i2) => i2.type === "warning");
      }
      get content() {
        return this.css;
      }
    };
    result$1 = Result$3$1;
    Result$3$1.default = Result$3$1;
    SINGLE_QUOTE$1 = "'".charCodeAt(0);
    DOUBLE_QUOTE$1 = '"'.charCodeAt(0);
    BACKSLASH$1 = "\\".charCodeAt(0);
    SLASH$1 = "/".charCodeAt(0);
    NEWLINE$1 = "\n".charCodeAt(0);
    SPACE$1 = " ".charCodeAt(0);
    FEED$1 = "\f".charCodeAt(0);
    TAB$1 = "	".charCodeAt(0);
    CR$1 = "\r".charCodeAt(0);
    OPEN_SQUARE$1 = "[".charCodeAt(0);
    CLOSE_SQUARE$1 = "]".charCodeAt(0);
    OPEN_PARENTHESES$1 = "(".charCodeAt(0);
    CLOSE_PARENTHESES$1 = ")".charCodeAt(0);
    OPEN_CURLY$1 = "{".charCodeAt(0);
    CLOSE_CURLY$1 = "}".charCodeAt(0);
    SEMICOLON$1 = ";".charCodeAt(0);
    ASTERISK$1 = "*".charCodeAt(0);
    COLON$1 = ":".charCodeAt(0);
    AT$1 = "@".charCodeAt(0);
    RE_AT_END$1 = /[\t\n\f\r "#'()/;[\\\]{}]/g;
    RE_WORD_END$1 = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
    RE_BAD_BRACKET$1 = /.[\r\n"'(/\\]/;
    RE_HEX_ESCAPE$1 = /[\da-f]/i;
    tokenize$1 = function tokenizer(input2, options = {}) {
      let css = input2.css.valueOf();
      let ignore = options.ignoreErrors;
      let code, next, quote, content, escape;
      let escaped, escapePos, prev, n22, currentToken;
      let length = css.length;
      let pos = 0;
      let buffer = [];
      let returned = [];
      function position() {
        return pos;
      }
      function unclosed(what) {
        throw input2.error("Unclosed " + what, pos);
      }
      function endOfFile() {
        return returned.length === 0 && pos >= length;
      }
      function nextToken(opts) {
        if (returned.length) return returned.pop();
        if (pos >= length) return;
        let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;
        code = css.charCodeAt(pos);
        switch (code) {
          case NEWLINE$1:
          case SPACE$1:
          case TAB$1:
          case CR$1:
          case FEED$1: {
            next = pos;
            do {
              next += 1;
              code = css.charCodeAt(next);
            } while (code === SPACE$1 || code === NEWLINE$1 || code === TAB$1 || code === CR$1 || code === FEED$1);
            currentToken = ["space", css.slice(pos, next)];
            pos = next - 1;
            break;
          }
          case OPEN_SQUARE$1:
          case CLOSE_SQUARE$1:
          case OPEN_CURLY$1:
          case CLOSE_CURLY$1:
          case COLON$1:
          case SEMICOLON$1:
          case CLOSE_PARENTHESES$1: {
            let controlChar = String.fromCharCode(code);
            currentToken = [controlChar, controlChar, pos];
            break;
          }
          case OPEN_PARENTHESES$1: {
            prev = buffer.length ? buffer.pop()[1] : "";
            n22 = css.charCodeAt(pos + 1);
            if (prev === "url" && n22 !== SINGLE_QUOTE$1 && n22 !== DOUBLE_QUOTE$1 && n22 !== SPACE$1 && n22 !== NEWLINE$1 && n22 !== TAB$1 && n22 !== FEED$1 && n22 !== CR$1) {
              next = pos;
              do {
                escaped = false;
                next = css.indexOf(")", next + 1);
                if (next === -1) {
                  if (ignore || ignoreUnclosed) {
                    next = pos;
                    break;
                  } else {
                    unclosed("bracket");
                  }
                }
                escapePos = next;
                while (css.charCodeAt(escapePos - 1) === BACKSLASH$1) {
                  escapePos -= 1;
                  escaped = !escaped;
                }
              } while (escaped);
              currentToken = ["brackets", css.slice(pos, next + 1), pos, next];
              pos = next;
            } else {
              next = css.indexOf(")", pos + 1);
              content = css.slice(pos, next + 1);
              if (next === -1 || RE_BAD_BRACKET$1.test(content)) {
                currentToken = ["(", "(", pos];
              } else {
                currentToken = ["brackets", content, pos, next];
                pos = next;
              }
            }
            break;
          }
          case SINGLE_QUOTE$1:
          case DOUBLE_QUOTE$1: {
            quote = code === SINGLE_QUOTE$1 ? "'" : '"';
            next = pos;
            do {
              escaped = false;
              next = css.indexOf(quote, next + 1);
              if (next === -1) {
                if (ignore || ignoreUnclosed) {
                  next = pos + 1;
                  break;
                } else {
                  unclosed("string");
                }
              }
              escapePos = next;
              while (css.charCodeAt(escapePos - 1) === BACKSLASH$1) {
                escapePos -= 1;
                escaped = !escaped;
              }
            } while (escaped);
            currentToken = ["string", css.slice(pos, next + 1), pos, next];
            pos = next;
            break;
          }
          case AT$1: {
            RE_AT_END$1.lastIndex = pos + 1;
            RE_AT_END$1.test(css);
            if (RE_AT_END$1.lastIndex === 0) {
              next = css.length - 1;
            } else {
              next = RE_AT_END$1.lastIndex - 2;
            }
            currentToken = ["at-word", css.slice(pos, next + 1), pos, next];
            pos = next;
            break;
          }
          case BACKSLASH$1: {
            next = pos;
            escape = true;
            while (css.charCodeAt(next + 1) === BACKSLASH$1) {
              next += 1;
              escape = !escape;
            }
            code = css.charCodeAt(next + 1);
            if (escape && code !== SLASH$1 && code !== SPACE$1 && code !== NEWLINE$1 && code !== TAB$1 && code !== CR$1 && code !== FEED$1) {
              next += 1;
              if (RE_HEX_ESCAPE$1.test(css.charAt(next))) {
                while (RE_HEX_ESCAPE$1.test(css.charAt(next + 1))) {
                  next += 1;
                }
                if (css.charCodeAt(next + 1) === SPACE$1) {
                  next += 1;
                }
              }
            }
            currentToken = ["word", css.slice(pos, next + 1), pos, next];
            pos = next;
            break;
          }
          default: {
            if (code === SLASH$1 && css.charCodeAt(pos + 1) === ASTERISK$1) {
              next = css.indexOf("*/", pos + 2) + 1;
              if (next === 0) {
                if (ignore || ignoreUnclosed) {
                  next = css.length;
                } else {
                  unclosed("comment");
                }
              }
              currentToken = ["comment", css.slice(pos, next + 1), pos, next];
              pos = next;
            } else {
              RE_WORD_END$1.lastIndex = pos + 1;
              RE_WORD_END$1.test(css);
              if (RE_WORD_END$1.lastIndex === 0) {
                next = css.length - 1;
              } else {
                next = RE_WORD_END$1.lastIndex - 2;
              }
              currentToken = ["word", css.slice(pos, next + 1), pos, next];
              buffer.push(currentToken);
              pos = next;
            }
            break;
          }
        }
        pos++;
        return currentToken;
      }
      function back(token) {
        returned.push(token);
      }
      return {
        back,
        endOfFile,
        nextToken,
        position
      };
    };
    Container$5$1 = container$1;
    AtRule$3$1 = class AtRule extends Container$5$1 {
      constructor(defaults2) {
        super(defaults2);
        this.type = "atrule";
      }
      append(...children) {
        if (!this.proxyOf.nodes) this.nodes = [];
        return super.append(...children);
      }
      prepend(...children) {
        if (!this.proxyOf.nodes) this.nodes = [];
        return super.prepend(...children);
      }
    };
    atRule$1 = AtRule$3$1;
    AtRule$3$1.default = AtRule$3$1;
    Container$5$1.registerAtRule(AtRule$3$1);
    Container$4$1 = container$1;
    Root$5$1 = class Root extends Container$4$1 {
      constructor(defaults2) {
        super(defaults2);
        this.type = "root";
        if (!this.nodes) this.nodes = [];
      }
      normalize(child, sample, type) {
        let nodes = super.normalize(child);
        if (sample) {
          if (type === "prepend") {
            if (this.nodes.length > 1) {
              sample.raws.before = this.nodes[1].raws.before;
            } else {
              delete sample.raws.before;
            }
          } else if (this.first !== sample) {
            for (let node2 of nodes) {
              node2.raws.before = sample.raws.before;
            }
          }
        }
        return nodes;
      }
      removeChild(child, ignore) {
        let index22 = this.index(child);
        if (!ignore && index22 === 0 && this.nodes.length > 1) {
          this.nodes[1].raws.before = this.nodes[index22].raws.before;
        }
        return super.removeChild(child);
      }
      toResult(opts = {}) {
        let lazy = new LazyResult$3$1(new Processor$2$1(), this, opts);
        return lazy.stringify();
      }
    };
    Root$5$1.registerLazyResult = (dependant) => {
      LazyResult$3$1 = dependant;
    };
    Root$5$1.registerProcessor = (dependant) => {
      Processor$2$1 = dependant;
    };
    root$1 = Root$5$1;
    Root$5$1.default = Root$5$1;
    Container$4$1.registerRoot(Root$5$1);
    list$2$1 = {
      comma(string) {
        return list$2$1.split(string, [","], true);
      },
      space(string) {
        let spaces = [" ", "\n", "	"];
        return list$2$1.split(string, spaces);
      },
      split(string, separators, last) {
        let array = [];
        let current = "";
        let split = false;
        let func = 0;
        let inQuote = false;
        let prevQuote = "";
        let escape = false;
        for (let letter of string) {
          if (escape) {
            escape = false;
          } else if (letter === "\\") {
            escape = true;
          } else if (inQuote) {
            if (letter === prevQuote) {
              inQuote = false;
            }
          } else if (letter === '"' || letter === "'") {
            inQuote = true;
            prevQuote = letter;
          } else if (letter === "(") {
            func += 1;
          } else if (letter === ")") {
            if (func > 0) func -= 1;
          } else if (func === 0) {
            if (separators.includes(letter)) split = true;
          }
          if (split) {
            if (current !== "") array.push(current.trim());
            current = "";
            split = false;
          } else {
            current += letter;
          }
        }
        if (last || current !== "") array.push(current.trim());
        return array;
      }
    };
    list_1$1 = list$2$1;
    list$2$1.default = list$2$1;
    Container$3$1 = container$1;
    list$1$1 = list_1$1;
    Rule$3$1 = class Rule extends Container$3$1 {
      constructor(defaults2) {
        super(defaults2);
        this.type = "rule";
        if (!this.nodes) this.nodes = [];
      }
      get selectors() {
        return list$1$1.comma(this.selector);
      }
      set selectors(values) {
        let match = this.selector ? this.selector.match(/,\s*/) : null;
        let sep2 = match ? match[0] : "," + this.raw("between", "beforeOpen");
        this.selector = values.join(sep2);
      }
    };
    rule$1 = Rule$3$1;
    Rule$3$1.default = Rule$3$1;
    Container$3$1.registerRule(Rule$3$1);
    Declaration$2$1 = declaration$1;
    tokenizer2$1 = tokenize$1;
    Comment$2$1 = comment$1;
    AtRule$2$1 = atRule$1;
    Root$4$1 = root$1;
    Rule$2$1 = rule$1;
    SAFE_COMMENT_NEIGHBOR$1 = {
      empty: true,
      space: true
    };
    Parser$1$1 = class Parser {
      constructor(input2) {
        this.input = input2;
        this.root = new Root$4$1();
        this.current = this.root;
        this.spaces = "";
        this.semicolon = false;
        this.createTokenizer();
        this.root.source = { input: input2, start: { column: 1, line: 1, offset: 0 } };
      }
      atrule(token) {
        let node2 = new AtRule$2$1();
        node2.name = token[1].slice(1);
        if (node2.name === "") {
          this.unnamedAtrule(node2, token);
        }
        this.init(node2, token[2]);
        let type;
        let prev;
        let shift;
        let last = false;
        let open = false;
        let params = [];
        let brackets = [];
        while (!this.tokenizer.endOfFile()) {
          token = this.tokenizer.nextToken();
          type = token[0];
          if (type === "(" || type === "[") {
            brackets.push(type === "(" ? ")" : "]");
          } else if (type === "{" && brackets.length > 0) {
            brackets.push("}");
          } else if (type === brackets[brackets.length - 1]) {
            brackets.pop();
          }
          if (brackets.length === 0) {
            if (type === ";") {
              node2.source.end = this.getPosition(token[2]);
              node2.source.end.offset++;
              this.semicolon = true;
              break;
            } else if (type === "{") {
              open = true;
              break;
            } else if (type === "}") {
              if (params.length > 0) {
                shift = params.length - 1;
                prev = params[shift];
                while (prev && prev[0] === "space") {
                  prev = params[--shift];
                }
                if (prev) {
                  node2.source.end = this.getPosition(prev[3] || prev[2]);
                  node2.source.end.offset++;
                }
              }
              this.end(token);
              break;
            } else {
              params.push(token);
            }
          } else {
            params.push(token);
          }
          if (this.tokenizer.endOfFile()) {
            last = true;
            break;
          }
        }
        node2.raws.between = this.spacesAndCommentsFromEnd(params);
        if (params.length) {
          node2.raws.afterName = this.spacesAndCommentsFromStart(params);
          this.raw(node2, "params", params);
          if (last) {
            token = params[params.length - 1];
            node2.source.end = this.getPosition(token[3] || token[2]);
            node2.source.end.offset++;
            this.spaces = node2.raws.between;
            node2.raws.between = "";
          }
        } else {
          node2.raws.afterName = "";
          node2.params = "";
        }
        if (open) {
          node2.nodes = [];
          this.current = node2;
        }
      }
      checkMissedSemicolon(tokens) {
        let colon = this.colon(tokens);
        if (colon === false) return;
        let founded = 0;
        let token;
        for (let j2 = colon - 1; j2 >= 0; j2--) {
          token = tokens[j2];
          if (token[0] !== "space") {
            founded += 1;
            if (founded === 2) break;
          }
        }
        throw this.input.error(
          "Missed semicolon",
          token[0] === "word" ? token[3] + 1 : token[2]
        );
      }
      colon(tokens) {
        let brackets = 0;
        let token, type, prev;
        for (let [i2, element] of tokens.entries()) {
          token = element;
          type = token[0];
          if (type === "(") {
            brackets += 1;
          }
          if (type === ")") {
            brackets -= 1;
          }
          if (brackets === 0 && type === ":") {
            if (!prev) {
              this.doubleColon(token);
            } else if (prev[0] === "word" && prev[1] === "progid") {
              continue;
            } else {
              return i2;
            }
          }
          prev = token;
        }
        return false;
      }
      comment(token) {
        let node2 = new Comment$2$1();
        this.init(node2, token[2]);
        node2.source.end = this.getPosition(token[3] || token[2]);
        node2.source.end.offset++;
        let text = token[1].slice(2, -2);
        if (/^\s*$/.test(text)) {
          node2.text = "";
          node2.raws.left = text;
          node2.raws.right = "";
        } else {
          let match = text.match(/^(\s*)([^]*\S)(\s*)$/);
          node2.text = match[2];
          node2.raws.left = match[1];
          node2.raws.right = match[3];
        }
      }
      createTokenizer() {
        this.tokenizer = tokenizer2$1(this.input);
      }
      decl(tokens, customProperty) {
        let node2 = new Declaration$2$1();
        this.init(node2, tokens[0][2]);
        let last = tokens[tokens.length - 1];
        if (last[0] === ";") {
          this.semicolon = true;
          tokens.pop();
        }
        node2.source.end = this.getPosition(
          last[3] || last[2] || findLastWithPosition$1(tokens)
        );
        node2.source.end.offset++;
        while (tokens[0][0] !== "word") {
          if (tokens.length === 1) this.unknownWord(tokens);
          node2.raws.before += tokens.shift()[1];
        }
        node2.source.start = this.getPosition(tokens[0][2]);
        node2.prop = "";
        while (tokens.length) {
          let type = tokens[0][0];
          if (type === ":" || type === "space" || type === "comment") {
            break;
          }
          node2.prop += tokens.shift()[1];
        }
        node2.raws.between = "";
        let token;
        while (tokens.length) {
          token = tokens.shift();
          if (token[0] === ":") {
            node2.raws.between += token[1];
            break;
          } else {
            if (token[0] === "word" && /\w/.test(token[1])) {
              this.unknownWord([token]);
            }
            node2.raws.between += token[1];
          }
        }
        if (node2.prop[0] === "_" || node2.prop[0] === "*") {
          node2.raws.before += node2.prop[0];
          node2.prop = node2.prop.slice(1);
        }
        let firstSpaces = [];
        let next;
        while (tokens.length) {
          next = tokens[0][0];
          if (next !== "space" && next !== "comment") break;
          firstSpaces.push(tokens.shift());
        }
        this.precheckMissedSemicolon(tokens);
        for (let i2 = tokens.length - 1; i2 >= 0; i2--) {
          token = tokens[i2];
          if (token[1].toLowerCase() === "!important") {
            node2.important = true;
            let string = this.stringFrom(tokens, i2);
            string = this.spacesFromEnd(tokens) + string;
            if (string !== " !important") node2.raws.important = string;
            break;
          } else if (token[1].toLowerCase() === "important") {
            let cache = tokens.slice(0);
            let str = "";
            for (let j2 = i2; j2 > 0; j2--) {
              let type = cache[j2][0];
              if (str.trim().indexOf("!") === 0 && type !== "space") {
                break;
              }
              str = cache.pop()[1] + str;
            }
            if (str.trim().indexOf("!") === 0) {
              node2.important = true;
              node2.raws.important = str;
              tokens = cache;
            }
          }
          if (token[0] !== "space" && token[0] !== "comment") {
            break;
          }
        }
        let hasWord = tokens.some((i2) => i2[0] !== "space" && i2[0] !== "comment");
        if (hasWord) {
          node2.raws.between += firstSpaces.map((i2) => i2[1]).join("");
          firstSpaces = [];
        }
        this.raw(node2, "value", firstSpaces.concat(tokens), customProperty);
        if (node2.value.includes(":") && !customProperty) {
          this.checkMissedSemicolon(tokens);
        }
      }
      doubleColon(token) {
        throw this.input.error(
          "Double colon",
          { offset: token[2] },
          { offset: token[2] + token[1].length }
        );
      }
      emptyRule(token) {
        let node2 = new Rule$2$1();
        this.init(node2, token[2]);
        node2.selector = "";
        node2.raws.between = "";
        this.current = node2;
      }
      end(token) {
        if (this.current.nodes && this.current.nodes.length) {
          this.current.raws.semicolon = this.semicolon;
        }
        this.semicolon = false;
        this.current.raws.after = (this.current.raws.after || "") + this.spaces;
        this.spaces = "";
        if (this.current.parent) {
          this.current.source.end = this.getPosition(token[2]);
          this.current.source.end.offset++;
          this.current = this.current.parent;
        } else {
          this.unexpectedClose(token);
        }
      }
      endFile() {
        if (this.current.parent) this.unclosedBlock();
        if (this.current.nodes && this.current.nodes.length) {
          this.current.raws.semicolon = this.semicolon;
        }
        this.current.raws.after = (this.current.raws.after || "") + this.spaces;
        this.root.source.end = this.getPosition(this.tokenizer.position());
      }
      freeSemicolon(token) {
        this.spaces += token[1];
        if (this.current.nodes) {
          let prev = this.current.nodes[this.current.nodes.length - 1];
          if (prev && prev.type === "rule" && !prev.raws.ownSemicolon) {
            prev.raws.ownSemicolon = this.spaces;
            this.spaces = "";
          }
        }
      }
      // Helpers
      getPosition(offset) {
        let pos = this.input.fromOffset(offset);
        return {
          column: pos.col,
          line: pos.line,
          offset
        };
      }
      init(node2, offset) {
        this.current.push(node2);
        node2.source = {
          input: this.input,
          start: this.getPosition(offset)
        };
        node2.raws.before = this.spaces;
        this.spaces = "";
        if (node2.type !== "comment") this.semicolon = false;
      }
      other(start) {
        let end = false;
        let type = null;
        let colon = false;
        let bracket = null;
        let brackets = [];
        let customProperty = start[1].startsWith("--");
        let tokens = [];
        let token = start;
        while (token) {
          type = token[0];
          tokens.push(token);
          if (type === "(" || type === "[") {
            if (!bracket) bracket = token;
            brackets.push(type === "(" ? ")" : "]");
          } else if (customProperty && colon && type === "{") {
            if (!bracket) bracket = token;
            brackets.push("}");
          } else if (brackets.length === 0) {
            if (type === ";") {
              if (colon) {
                this.decl(tokens, customProperty);
                return;
              } else {
                break;
              }
            } else if (type === "{") {
              this.rule(tokens);
              return;
            } else if (type === "}") {
              this.tokenizer.back(tokens.pop());
              end = true;
              break;
            } else if (type === ":") {
              colon = true;
            }
          } else if (type === brackets[brackets.length - 1]) {
            brackets.pop();
            if (brackets.length === 0) bracket = null;
          }
          token = this.tokenizer.nextToken();
        }
        if (this.tokenizer.endOfFile()) end = true;
        if (brackets.length > 0) this.unclosedBracket(bracket);
        if (end && colon) {
          if (!customProperty) {
            while (tokens.length) {
              token = tokens[tokens.length - 1][0];
              if (token !== "space" && token !== "comment") break;
              this.tokenizer.back(tokens.pop());
            }
          }
          this.decl(tokens, customProperty);
        } else {
          this.unknownWord(tokens);
        }
      }
      parse() {
        let token;
        while (!this.tokenizer.endOfFile()) {
          token = this.tokenizer.nextToken();
          switch (token[0]) {
            case "space":
              this.spaces += token[1];
              break;
            case ";":
              this.freeSemicolon(token);
              break;
            case "}":
              this.end(token);
              break;
            case "comment":
              this.comment(token);
              break;
            case "at-word":
              this.atrule(token);
              break;
            case "{":
              this.emptyRule(token);
              break;
            default:
              this.other(token);
              break;
          }
        }
        this.endFile();
      }
      precheckMissedSemicolon() {
      }
      raw(node2, prop2, tokens, customProperty) {
        let token, type;
        let length = tokens.length;
        let value = "";
        let clean = true;
        let next, prev;
        for (let i2 = 0; i2 < length; i2 += 1) {
          token = tokens[i2];
          type = token[0];
          if (type === "space" && i2 === length - 1 && !customProperty) {
            clean = false;
          } else if (type === "comment") {
            prev = tokens[i2 - 1] ? tokens[i2 - 1][0] : "empty";
            next = tokens[i2 + 1] ? tokens[i2 + 1][0] : "empty";
            if (!SAFE_COMMENT_NEIGHBOR$1[prev] && !SAFE_COMMENT_NEIGHBOR$1[next]) {
              if (value.slice(-1) === ",") {
                clean = false;
              } else {
                value += token[1];
              }
            } else {
              clean = false;
            }
          } else {
            value += token[1];
          }
        }
        if (!clean) {
          let raw = tokens.reduce((all, i2) => all + i2[1], "");
          node2.raws[prop2] = { raw, value };
        }
        node2[prop2] = value;
      }
      rule(tokens) {
        tokens.pop();
        let node2 = new Rule$2$1();
        this.init(node2, tokens[0][2]);
        node2.raws.between = this.spacesAndCommentsFromEnd(tokens);
        this.raw(node2, "selector", tokens);
        this.current = node2;
      }
      spacesAndCommentsFromEnd(tokens) {
        let lastTokenType;
        let spaces = "";
        while (tokens.length) {
          lastTokenType = tokens[tokens.length - 1][0];
          if (lastTokenType !== "space" && lastTokenType !== "comment") break;
          spaces = tokens.pop()[1] + spaces;
        }
        return spaces;
      }
      // Errors
      spacesAndCommentsFromStart(tokens) {
        let next;
        let spaces = "";
        while (tokens.length) {
          next = tokens[0][0];
          if (next !== "space" && next !== "comment") break;
          spaces += tokens.shift()[1];
        }
        return spaces;
      }
      spacesFromEnd(tokens) {
        let lastTokenType;
        let spaces = "";
        while (tokens.length) {
          lastTokenType = tokens[tokens.length - 1][0];
          if (lastTokenType !== "space") break;
          spaces = tokens.pop()[1] + spaces;
        }
        return spaces;
      }
      stringFrom(tokens, from) {
        let result2 = "";
        for (let i2 = from; i2 < tokens.length; i2++) {
          result2 += tokens[i2][1];
        }
        tokens.splice(from, tokens.length - from);
        return result2;
      }
      unclosedBlock() {
        let pos = this.current.source.start;
        throw this.input.error("Unclosed block", pos.line, pos.column);
      }
      unclosedBracket(bracket) {
        throw this.input.error(
          "Unclosed bracket",
          { offset: bracket[2] },
          { offset: bracket[2] + 1 }
        );
      }
      unexpectedClose(token) {
        throw this.input.error(
          "Unexpected }",
          { offset: token[2] },
          { offset: token[2] + 1 }
        );
      }
      unknownWord(tokens) {
        throw this.input.error(
          "Unknown word",
          { offset: tokens[0][2] },
          { offset: tokens[0][2] + tokens[0][1].length }
        );
      }
      unnamedAtrule(node2, token) {
        throw this.input.error(
          "At-rule without name",
          { offset: token[2] },
          { offset: token[2] + token[1].length }
        );
      }
    };
    parser$1 = Parser$1$1;
    Container$2$1 = container$1;
    Parser2$1 = parser$1;
    Input$2$1 = input$1;
    parse_1$1 = parse$3$1;
    parse$3$1.default = parse$3$1;
    Container$2$1.registerParse(parse$3$1);
    ({ isClean: isClean$3, my: my$3 } = symbols$1);
    MapGenerator$1$1 = mapGenerator$1;
    stringify$2$1 = stringify_1$1;
    Container$1$1 = container$1;
    Document$2$1 = document$1$1;
    warnOnce$1$1 = warnOnce$2$1;
    Result$2$1 = result$1;
    parse$2$1 = parse_1$1;
    Root$3$1 = root$1;
    TYPE_TO_CLASS_NAME$1 = {
      atrule: "AtRule",
      comment: "Comment",
      decl: "Declaration",
      document: "Document",
      root: "Root",
      rule: "Rule"
    };
    PLUGIN_PROPS$1 = {
      AtRule: true,
      AtRuleExit: true,
      Comment: true,
      CommentExit: true,
      Declaration: true,
      DeclarationExit: true,
      Document: true,
      DocumentExit: true,
      Once: true,
      OnceExit: true,
      postcssPlugin: true,
      prepare: true,
      Root: true,
      RootExit: true,
      Rule: true,
      RuleExit: true
    };
    NOT_VISITORS$1 = {
      Once: true,
      postcssPlugin: true,
      prepare: true
    };
    CHILDREN$1 = 0;
    postcss$2$1 = {};
    LazyResult$2$1 = class LazyResult {
      constructor(processor2, css, opts) {
        this.stringified = false;
        this.processed = false;
        let root2;
        if (typeof css === "object" && css !== null && (css.type === "root" || css.type === "document")) {
          root2 = cleanMarks$1(css);
        } else if (css instanceof LazyResult || css instanceof Result$2$1) {
          root2 = cleanMarks$1(css.root);
          if (css.map) {
            if (typeof opts.map === "undefined") opts.map = {};
            if (!opts.map.inline) opts.map.inline = false;
            opts.map.prev = css.map;
          }
        } else {
          let parser2 = parse$2$1;
          if (opts.syntax) parser2 = opts.syntax.parse;
          if (opts.parser) parser2 = opts.parser;
          if (parser2.parse) parser2 = parser2.parse;
          try {
            root2 = parser2(css, opts);
          } catch (error) {
            this.processed = true;
            this.error = error;
          }
          if (root2 && !root2[my$3]) {
            Container$1$1.rebuild(root2);
          }
        }
        this.result = new Result$2$1(processor2, root2, opts);
        this.helpers = { ...postcss$2$1, postcss: postcss$2$1, result: this.result };
        this.plugins = this.processor.plugins.map((plugin22) => {
          if (typeof plugin22 === "object" && plugin22.prepare) {
            return { ...plugin22, ...plugin22.prepare(this.result) };
          } else {
            return plugin22;
          }
        });
      }
      async() {
        if (this.error) return Promise.reject(this.error);
        if (this.processed) return Promise.resolve(this.result);
        if (!this.processing) {
          this.processing = this.runAsync();
        }
        return this.processing;
      }
      catch(onRejected) {
        return this.async().catch(onRejected);
      }
      finally(onFinally) {
        return this.async().then(onFinally, onFinally);
      }
      getAsyncError() {
        throw new Error("Use process(css).then(cb) to work with async plugins");
      }
      handleError(error, node2) {
        let plugin22 = this.result.lastPlugin;
        try {
          if (node2) node2.addToError(error);
          this.error = error;
          if (error.name === "CssSyntaxError" && !error.plugin) {
            error.plugin = plugin22.postcssPlugin;
            error.setMessage();
          } else if (plugin22.postcssVersion) {
            if (true) {
              let pluginName = plugin22.postcssPlugin;
              let pluginVer = plugin22.postcssVersion;
              let runtimeVer = this.result.processor.version;
              let a2 = pluginVer.split(".");
              let b3 = runtimeVer.split(".");
              if (a2[0] !== b3[0] || parseInt(a2[1]) > parseInt(b3[1])) {
                console.error(
                  "Unknown error from PostCSS plugin. Your current PostCSS version is " + runtimeVer + ", but " + pluginName + " uses " + pluginVer + ". Perhaps this is the source of the error below."
                );
              }
            }
          }
        } catch (err2) {
          if (console && console.error) console.error(err2);
        }
        return error;
      }
      prepareVisitors() {
        this.listeners = {};
        let add = (plugin22, type, cb) => {
          if (!this.listeners[type]) this.listeners[type] = [];
          this.listeners[type].push([plugin22, cb]);
        };
        for (let plugin22 of this.plugins) {
          if (typeof plugin22 === "object") {
            for (let event in plugin22) {
              if (!PLUGIN_PROPS$1[event] && /^[A-Z]/.test(event)) {
                throw new Error(
                  `Unknown event ${event} in ${plugin22.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
                );
              }
              if (!NOT_VISITORS$1[event]) {
                if (typeof plugin22[event] === "object") {
                  for (let filter in plugin22[event]) {
                    if (filter === "*") {
                      add(plugin22, event, plugin22[event][filter]);
                    } else {
                      add(
                        plugin22,
                        event + "-" + filter.toLowerCase(),
                        plugin22[event][filter]
                      );
                    }
                  }
                } else if (typeof plugin22[event] === "function") {
                  add(plugin22, event, plugin22[event]);
                }
              }
            }
          }
        }
        this.hasListener = Object.keys(this.listeners).length > 0;
      }
      async runAsync() {
        this.plugin = 0;
        for (let i2 = 0; i2 < this.plugins.length; i2++) {
          let plugin22 = this.plugins[i2];
          let promise = this.runOnRoot(plugin22);
          if (isPromise$1(promise)) {
            try {
              await promise;
            } catch (error) {
              throw this.handleError(error);
            }
          }
        }
        this.prepareVisitors();
        if (this.hasListener) {
          let root2 = this.result.root;
          while (!root2[isClean$3]) {
            root2[isClean$3] = true;
            let stack = [toStack$1(root2)];
            while (stack.length > 0) {
              let promise = this.visitTick(stack);
              if (isPromise$1(promise)) {
                try {
                  await promise;
                } catch (e2) {
                  let node2 = stack[stack.length - 1].node;
                  throw this.handleError(e2, node2);
                }
              }
            }
          }
          if (this.listeners.OnceExit) {
            for (let [plugin22, visitor] of this.listeners.OnceExit) {
              this.result.lastPlugin = plugin22;
              try {
                if (root2.type === "document") {
                  let roots = root2.nodes.map(
                    (subRoot) => visitor(subRoot, this.helpers)
                  );
                  await Promise.all(roots);
                } else {
                  await visitor(root2, this.helpers);
                }
              } catch (e2) {
                throw this.handleError(e2);
              }
            }
          }
        }
        this.processed = true;
        return this.stringify();
      }
      runOnRoot(plugin22) {
        this.result.lastPlugin = plugin22;
        try {
          if (typeof plugin22 === "object" && plugin22.Once) {
            if (this.result.root.type === "document") {
              let roots = this.result.root.nodes.map(
                (root2) => plugin22.Once(root2, this.helpers)
              );
              if (isPromise$1(roots[0])) {
                return Promise.all(roots);
              }
              return roots;
            }
            return plugin22.Once(this.result.root, this.helpers);
          } else if (typeof plugin22 === "function") {
            return plugin22(this.result.root, this.result);
          }
        } catch (error) {
          throw this.handleError(error);
        }
      }
      stringify() {
        if (this.error) throw this.error;
        if (this.stringified) return this.result;
        this.stringified = true;
        this.sync();
        let opts = this.result.opts;
        let str = stringify$2$1;
        if (opts.syntax) str = opts.syntax.stringify;
        if (opts.stringifier) str = opts.stringifier;
        if (str.stringify) str = str.stringify;
        let map = new MapGenerator$1$1(str, this.result.root, this.result.opts);
        let data = map.generate();
        this.result.css = data[0];
        this.result.map = data[1];
        return this.result;
      }
      sync() {
        if (this.error) throw this.error;
        if (this.processed) return this.result;
        this.processed = true;
        if (this.processing) {
          throw this.getAsyncError();
        }
        for (let plugin22 of this.plugins) {
          let promise = this.runOnRoot(plugin22);
          if (isPromise$1(promise)) {
            throw this.getAsyncError();
          }
        }
        this.prepareVisitors();
        if (this.hasListener) {
          let root2 = this.result.root;
          while (!root2[isClean$3]) {
            root2[isClean$3] = true;
            this.walkSync(root2);
          }
          if (this.listeners.OnceExit) {
            if (root2.type === "document") {
              for (let subRoot of root2.nodes) {
                this.visitSync(this.listeners.OnceExit, subRoot);
              }
            } else {
              this.visitSync(this.listeners.OnceExit, root2);
            }
          }
        }
        return this.result;
      }
      then(onFulfilled, onRejected) {
        if (true) {
          if (!("from" in this.opts)) {
            warnOnce$1$1(
              "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
            );
          }
        }
        return this.async().then(onFulfilled, onRejected);
      }
      toString() {
        return this.css;
      }
      visitSync(visitors, node2) {
        for (let [plugin22, visitor] of visitors) {
          this.result.lastPlugin = plugin22;
          let promise;
          try {
            promise = visitor(node2, this.helpers);
          } catch (e2) {
            throw this.handleError(e2, node2.proxyOf);
          }
          if (node2.type !== "root" && node2.type !== "document" && !node2.parent) {
            return true;
          }
          if (isPromise$1(promise)) {
            throw this.getAsyncError();
          }
        }
      }
      visitTick(stack) {
        let visit2 = stack[stack.length - 1];
        let { node: node2, visitors } = visit2;
        if (node2.type !== "root" && node2.type !== "document" && !node2.parent) {
          stack.pop();
          return;
        }
        if (visitors.length > 0 && visit2.visitorIndex < visitors.length) {
          let [plugin22, visitor] = visitors[visit2.visitorIndex];
          visit2.visitorIndex += 1;
          if (visit2.visitorIndex === visitors.length) {
            visit2.visitors = [];
            visit2.visitorIndex = 0;
          }
          this.result.lastPlugin = plugin22;
          try {
            return visitor(node2.toProxy(), this.helpers);
          } catch (e2) {
            throw this.handleError(e2, node2);
          }
        }
        if (visit2.iterator !== 0) {
          let iterator = visit2.iterator;
          let child;
          while (child = node2.nodes[node2.indexes[iterator]]) {
            node2.indexes[iterator] += 1;
            if (!child[isClean$3]) {
              child[isClean$3] = true;
              stack.push(toStack$1(child));
              return;
            }
          }
          visit2.iterator = 0;
          delete node2.indexes[iterator];
        }
        let events = visit2.events;
        while (visit2.eventIndex < events.length) {
          let event = events[visit2.eventIndex];
          visit2.eventIndex += 1;
          if (event === CHILDREN$1) {
            if (node2.nodes && node2.nodes.length) {
              node2[isClean$3] = true;
              visit2.iterator = node2.getIterator();
            }
            return;
          } else if (this.listeners[event]) {
            visit2.visitors = this.listeners[event];
            return;
          }
        }
        stack.pop();
      }
      walkSync(node2) {
        node2[isClean$3] = true;
        let events = getEvents$1(node2);
        for (let event of events) {
          if (event === CHILDREN$1) {
            if (node2.nodes) {
              node2.each((child) => {
                if (!child[isClean$3]) this.walkSync(child);
              });
            }
          } else {
            let visitors = this.listeners[event];
            if (visitors) {
              if (this.visitSync(visitors, node2.toProxy())) return;
            }
          }
        }
      }
      warnings() {
        return this.sync().warnings();
      }
      get content() {
        return this.stringify().content;
      }
      get css() {
        return this.stringify().css;
      }
      get map() {
        return this.stringify().map;
      }
      get messages() {
        return this.sync().messages;
      }
      get opts() {
        return this.result.opts;
      }
      get processor() {
        return this.result.processor;
      }
      get root() {
        return this.sync().root;
      }
      get [Symbol.toStringTag]() {
        return "LazyResult";
      }
    };
    LazyResult$2$1.registerPostcss = (dependant) => {
      postcss$2$1 = dependant;
    };
    lazyResult$1 = LazyResult$2$1;
    LazyResult$2$1.default = LazyResult$2$1;
    Root$3$1.registerLazyResult(LazyResult$2$1);
    Document$2$1.registerLazyResult(LazyResult$2$1);
    MapGenerator2$1 = mapGenerator$1;
    stringify$1$1 = stringify_1$1;
    warnOnce2$1 = warnOnce$2$1;
    parse$1$1 = parse_1$1;
    Result$1$1 = result$1;
    NoWorkResult$1$1 = class NoWorkResult {
      constructor(processor2, css, opts) {
        css = css.toString();
        this.stringified = false;
        this._processor = processor2;
        this._css = css;
        this._opts = opts;
        this._map = void 0;
        let root2;
        let str = stringify$1$1;
        this.result = new Result$1$1(this._processor, root2, this._opts);
        this.result.css = css;
        let self2 = this;
        Object.defineProperty(this.result, "root", {
          get() {
            return self2.root;
          }
        });
        let map = new MapGenerator2$1(str, root2, this._opts, css);
        if (map.isMap()) {
          let [generatedCSS, generatedMap] = map.generate();
          if (generatedCSS) {
            this.result.css = generatedCSS;
          }
          if (generatedMap) {
            this.result.map = generatedMap;
          }
        } else {
          map.clearAnnotation();
          this.result.css = map.css;
        }
      }
      async() {
        if (this.error) return Promise.reject(this.error);
        return Promise.resolve(this.result);
      }
      catch(onRejected) {
        return this.async().catch(onRejected);
      }
      finally(onFinally) {
        return this.async().then(onFinally, onFinally);
      }
      sync() {
        if (this.error) throw this.error;
        return this.result;
      }
      then(onFulfilled, onRejected) {
        if (true) {
          if (!("from" in this._opts)) {
            warnOnce2$1(
              "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
            );
          }
        }
        return this.async().then(onFulfilled, onRejected);
      }
      toString() {
        return this._css;
      }
      warnings() {
        return [];
      }
      get content() {
        return this.result.css;
      }
      get css() {
        return this.result.css;
      }
      get map() {
        return this.result.map;
      }
      get messages() {
        return [];
      }
      get opts() {
        return this.result.opts;
      }
      get processor() {
        return this.result.processor;
      }
      get root() {
        if (this._root) {
          return this._root;
        }
        let root2;
        let parser2 = parse$1$1;
        try {
          root2 = parser2(this._css, this._opts);
        } catch (error) {
          this.error = error;
        }
        if (this.error) {
          throw this.error;
        } else {
          this._root = root2;
          return root2;
        }
      }
      get [Symbol.toStringTag]() {
        return "NoWorkResult";
      }
    };
    noWorkResult$1 = NoWorkResult$1$1;
    NoWorkResult$1$1.default = NoWorkResult$1$1;
    NoWorkResult2$1 = noWorkResult$1;
    LazyResult$1$1 = lazyResult$1;
    Document$1$1 = document$1$1;
    Root$2$1 = root$1;
    Processor$1$1 = class Processor {
      constructor(plugins = []) {
        this.version = "8.4.38";
        this.plugins = this.normalize(plugins);
      }
      normalize(plugins) {
        let normalized = [];
        for (let i2 of plugins) {
          if (i2.postcss === true) {
            i2 = i2();
          } else if (i2.postcss) {
            i2 = i2.postcss;
          }
          if (typeof i2 === "object" && Array.isArray(i2.plugins)) {
            normalized = normalized.concat(i2.plugins);
          } else if (typeof i2 === "object" && i2.postcssPlugin) {
            normalized.push(i2);
          } else if (typeof i2 === "function") {
            normalized.push(i2);
          } else if (typeof i2 === "object" && (i2.parse || i2.stringify)) {
            if (true) {
              throw new Error(
                "PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation."
              );
            }
          } else {
            throw new Error(i2 + " is not a PostCSS plugin");
          }
        }
        return normalized;
      }
      process(css, opts = {}) {
        if (!this.plugins.length && !opts.parser && !opts.stringifier && !opts.syntax) {
          return new NoWorkResult2$1(this, css, opts);
        } else {
          return new LazyResult$1$1(this, css, opts);
        }
      }
      use(plugin22) {
        this.plugins = this.plugins.concat(this.normalize([plugin22]));
        return this;
      }
    };
    processor$1 = Processor$1$1;
    Processor$1$1.default = Processor$1$1;
    Root$2$1.registerProcessor(Processor$1$1);
    Document$1$1.registerProcessor(Processor$1$1);
    Declaration$1$1 = declaration$1;
    PreviousMap2$1 = previousMap$1;
    Comment$1$1 = comment$1;
    AtRule$1$1 = atRule$1;
    Input$1$1 = input$1;
    Root$1$1 = root$1;
    Rule$1$1 = rule$1;
    fromJSON_1$1 = fromJSON$1$1;
    fromJSON$1$1.default = fromJSON$1$1;
    CssSyntaxError2$1 = cssSyntaxError$1;
    Declaration2$1 = declaration$1;
    LazyResult2$1 = lazyResult$1;
    Container2$1 = container$1;
    Processor2$1 = processor$1;
    stringify$5 = stringify_1$1;
    fromJSON$2 = fromJSON_1$1;
    Document22 = document$1$1;
    Warning2$1 = warning$1;
    Comment2$1 = comment$1;
    AtRule2$1 = atRule$1;
    Result2$1 = result$1;
    Input2$1 = input$1;
    parse$5 = parse_1$1;
    list$3 = list_1$1;
    Rule2$1 = rule$1;
    Root2$1 = root$1;
    Node2$1 = node$1;
    postcss$3.plugin = function plugin(name, initializer) {
      let warningPrinted = false;
      function creator(...args) {
        if (console && console.warn && !warningPrinted) {
          warningPrinted = true;
          console.warn(
            name + ": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration"
          );
          if (process.env.LANG && process.env.LANG.startsWith("cn")) {
            console.warn(
              name + ": \u91CC\u9762 postcss.plugin \u88AB\u5F03\u7528. \u8FC1\u79FB\u6307\u5357:\nhttps://www.w3ctech.com/topic/2226"
            );
          }
        }
        let transformer = initializer(...args);
        transformer.postcssPlugin = name;
        transformer.postcssVersion = new Processor2$1().version;
        return transformer;
      }
      let cache;
      Object.defineProperty(creator, "postcss", {
        get() {
          if (!cache) cache = creator();
          return cache;
        }
      });
      creator.process = function(css, processOpts, pluginOpts) {
        return postcss$3([creator(pluginOpts)]).process(css, processOpts);
      };
      return creator;
    };
    postcss$3.stringify = stringify$5;
    postcss$3.parse = parse$5;
    postcss$3.fromJSON = fromJSON$2;
    postcss$3.list = list$3;
    postcss$3.comment = (defaults2) => new Comment2$1(defaults2);
    postcss$3.atRule = (defaults2) => new AtRule2$1(defaults2);
    postcss$3.decl = (defaults2) => new Declaration2$1(defaults2);
    postcss$3.rule = (defaults2) => new Rule2$1(defaults2);
    postcss$3.root = (defaults2) => new Root2$1(defaults2);
    postcss$3.document = (defaults2) => new Document22(defaults2);
    postcss$3.CssSyntaxError = CssSyntaxError2$1;
    postcss$3.Declaration = Declaration2$1;
    postcss$3.Container = Container2$1;
    postcss$3.Processor = Processor2$1;
    postcss$3.Document = Document22;
    postcss$3.Comment = Comment2$1;
    postcss$3.Warning = Warning2$1;
    postcss$3.AtRule = AtRule2$1;
    postcss$3.Result = Result2$1;
    postcss$3.Input = Input2$1;
    postcss$3.Rule = Rule2$1;
    postcss$3.Root = Root2$1;
    postcss$3.Node = Node2$1;
    LazyResult2$1.registerPostcss(postcss$3);
    postcss_1$1 = postcss$3;
    postcss$3.default = postcss$3;
    postcss$1$1 = /* @__PURE__ */ getDefaultExportFromCjs$1(postcss_1$1);
    postcss$1$1.stringify;
    postcss$1$1.fromJSON;
    postcss$1$1.plugin;
    postcss$1$1.parse;
    postcss$1$1.list;
    postcss$1$1.document;
    postcss$1$1.comment;
    postcss$1$1.atRule;
    postcss$1$1.rule;
    postcss$1$1.decl;
    postcss$1$1.root;
    postcss$1$1.CssSyntaxError;
    postcss$1$1.Declaration;
    postcss$1$1.Container;
    postcss$1$1.Processor;
    postcss$1$1.Document;
    postcss$1$1.Comment;
    postcss$1$1.Warning;
    postcss$1$1.AtRule;
    postcss$1$1.Result;
    postcss$1$1.Input;
    postcss$1$1.Rule;
    postcss$1$1.Root;
    postcss$1$1.Node;
    __defProp22 = Object.defineProperty;
    __defNormalProp2 = (obj2, key, value) => key in obj2 ? __defProp22(obj2, key, { enumerable: true, configurable: true, writable: true, value }) : obj2[key] = value;
    __publicField2 = (obj2, key, value) => __defNormalProp2(obj2, typeof key !== "symbol" ? key + "" : key, value);
    picocolors_browser = { exports: {} };
    x2 = String;
    create = function() {
      return { isColorSupported: false, reset: x2, bold: x2, dim: x2, italic: x2, underline: x2, inverse: x2, hidden: x2, strikethrough: x2, black: x2, red: x2, green: x2, yellow: x2, blue: x2, magenta: x2, cyan: x2, white: x2, gray: x2, bgBlack: x2, bgRed: x2, bgGreen: x2, bgYellow: x2, bgBlue: x2, bgMagenta: x2, bgCyan: x2, bgWhite: x2 };
    };
    picocolors_browser.exports = create();
    picocolors_browser.exports.createColors = create;
    picocolors_browserExports = picocolors_browser.exports;
    __viteBrowserExternal = {};
    __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: __viteBrowserExternal
    }, Symbol.toStringTag, { value: "Module" }));
    require$$2 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
    pico = picocolors_browserExports;
    terminalHighlight$1 = require$$2;
    CssSyntaxError$3 = class CssSyntaxError2 extends Error {
      constructor(message, line, column, source, file, plugin22) {
        super(message);
        this.name = "CssSyntaxError";
        this.reason = message;
        if (file) {
          this.file = file;
        }
        if (source) {
          this.source = source;
        }
        if (plugin22) {
          this.plugin = plugin22;
        }
        if (typeof line !== "undefined" && typeof column !== "undefined") {
          if (typeof line === "number") {
            this.line = line;
            this.column = column;
          } else {
            this.line = line.line;
            this.column = line.column;
            this.endLine = column.line;
            this.endColumn = column.column;
          }
        }
        this.setMessage();
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, CssSyntaxError2);
        }
      }
      setMessage() {
        this.message = this.plugin ? this.plugin + ": " : "";
        this.message += this.file ? this.file : "<css input>";
        if (typeof this.line !== "undefined") {
          this.message += ":" + this.line + ":" + this.column;
        }
        this.message += ": " + this.reason;
      }
      showSourceCode(color) {
        if (!this.source) return "";
        let css = this.source;
        if (color == null) color = pico.isColorSupported;
        if (terminalHighlight$1) {
          if (color) css = terminalHighlight$1(css);
        }
        let lines = css.split(/\r?\n/);
        let start = Math.max(this.line - 3, 0);
        let end = Math.min(this.line + 2, lines.length);
        let maxWidth = String(end).length;
        let mark, aside;
        if (color) {
          let { bold, gray, red } = pico.createColors(true);
          mark = (text) => bold(red(text));
          aside = (text) => gray(text);
        } else {
          mark = aside = (str) => str;
        }
        return lines.slice(start, end).map((line, index22) => {
          let number = start + 1 + index22;
          let gutter = " " + (" " + number).slice(-maxWidth) + " | ";
          if (number === this.line) {
            let spacing = aside(gutter.replace(/\d/g, " ")) + line.slice(0, this.column - 1).replace(/[^\t]/g, " ");
            return mark(">") + aside(gutter) + line + "\n " + spacing + mark("^");
          }
          return " " + aside(gutter) + line;
        }).join("\n");
      }
      toString() {
        let code = this.showSourceCode();
        if (code) {
          code = "\n\n" + code + "\n";
        }
        return this.name + ": " + this.message + code;
      }
    };
    cssSyntaxError = CssSyntaxError$3;
    CssSyntaxError$3.default = CssSyntaxError$3;
    symbols = {};
    symbols.isClean = /* @__PURE__ */ Symbol("isClean");
    symbols.my = /* @__PURE__ */ Symbol("my");
    DEFAULT_RAW = {
      after: "\n",
      beforeClose: "\n",
      beforeComment: "\n",
      beforeDecl: "\n",
      beforeOpen: " ",
      beforeRule: "\n",
      colon: ": ",
      commentLeft: " ",
      commentRight: " ",
      emptyBody: "",
      indent: "    ",
      semicolon: false
    };
    Stringifier$2 = class Stringifier2 {
      constructor(builder) {
        this.builder = builder;
      }
      atrule(node2, semicolon) {
        let name = "@" + node2.name;
        let params = node2.params ? this.rawValue(node2, "params") : "";
        if (typeof node2.raws.afterName !== "undefined") {
          name += node2.raws.afterName;
        } else if (params) {
          name += " ";
        }
        if (node2.nodes) {
          this.block(node2, name + params);
        } else {
          let end = (node2.raws.between || "") + (semicolon ? ";" : "");
          this.builder(name + params + end, node2);
        }
      }
      beforeAfter(node2, detect) {
        let value;
        if (node2.type === "decl") {
          value = this.raw(node2, null, "beforeDecl");
        } else if (node2.type === "comment") {
          value = this.raw(node2, null, "beforeComment");
        } else if (detect === "before") {
          value = this.raw(node2, null, "beforeRule");
        } else {
          value = this.raw(node2, null, "beforeClose");
        }
        let buf = node2.parent;
        let depth = 0;
        while (buf && buf.type !== "root") {
          depth += 1;
          buf = buf.parent;
        }
        if (value.includes("\n")) {
          let indent = this.raw(node2, null, "indent");
          if (indent.length) {
            for (let step = 0; step < depth; step++) value += indent;
          }
        }
        return value;
      }
      block(node2, start) {
        let between = this.raw(node2, "between", "beforeOpen");
        this.builder(start + between + "{", node2, "start");
        let after;
        if (node2.nodes && node2.nodes.length) {
          this.body(node2);
          after = this.raw(node2, "after");
        } else {
          after = this.raw(node2, "after", "emptyBody");
        }
        if (after) this.builder(after);
        this.builder("}", node2, "end");
      }
      body(node2) {
        let last = node2.nodes.length - 1;
        while (last > 0) {
          if (node2.nodes[last].type !== "comment") break;
          last -= 1;
        }
        let semicolon = this.raw(node2, "semicolon");
        for (let i2 = 0; i2 < node2.nodes.length; i2++) {
          let child = node2.nodes[i2];
          let before = this.raw(child, "before");
          if (before) this.builder(before);
          this.stringify(child, last !== i2 || semicolon);
        }
      }
      comment(node2) {
        let left = this.raw(node2, "left", "commentLeft");
        let right = this.raw(node2, "right", "commentRight");
        this.builder("/*" + left + node2.text + right + "*/", node2);
      }
      decl(node2, semicolon) {
        let between = this.raw(node2, "between", "colon");
        let string = node2.prop + between + this.rawValue(node2, "value");
        if (node2.important) {
          string += node2.raws.important || " !important";
        }
        if (semicolon) string += ";";
        this.builder(string, node2);
      }
      document(node2) {
        this.body(node2);
      }
      raw(node2, own, detect) {
        let value;
        if (!detect) detect = own;
        if (own) {
          value = node2.raws[own];
          if (typeof value !== "undefined") return value;
        }
        let parent = node2.parent;
        if (detect === "before") {
          if (!parent || parent.type === "root" && parent.first === node2) {
            return "";
          }
          if (parent && parent.type === "document") {
            return "";
          }
        }
        if (!parent) return DEFAULT_RAW[detect];
        let root2 = node2.root();
        if (!root2.rawCache) root2.rawCache = {};
        if (typeof root2.rawCache[detect] !== "undefined") {
          return root2.rawCache[detect];
        }
        if (detect === "before" || detect === "after") {
          return this.beforeAfter(node2, detect);
        } else {
          let method = "raw" + capitalize(detect);
          if (this[method]) {
            value = this[method](root2, node2);
          } else {
            root2.walk((i2) => {
              value = i2.raws[own];
              if (typeof value !== "undefined") return false;
            });
          }
        }
        if (typeof value === "undefined") value = DEFAULT_RAW[detect];
        root2.rawCache[detect] = value;
        return value;
      }
      rawBeforeClose(root2) {
        let value;
        root2.walk((i2) => {
          if (i2.nodes && i2.nodes.length > 0) {
            if (typeof i2.raws.after !== "undefined") {
              value = i2.raws.after;
              if (value.includes("\n")) {
                value = value.replace(/[^\n]+$/, "");
              }
              return false;
            }
          }
        });
        if (value) value = value.replace(/\S/g, "");
        return value;
      }
      rawBeforeComment(root2, node2) {
        let value;
        root2.walkComments((i2) => {
          if (typeof i2.raws.before !== "undefined") {
            value = i2.raws.before;
            if (value.includes("\n")) {
              value = value.replace(/[^\n]+$/, "");
            }
            return false;
          }
        });
        if (typeof value === "undefined") {
          value = this.raw(node2, null, "beforeDecl");
        } else if (value) {
          value = value.replace(/\S/g, "");
        }
        return value;
      }
      rawBeforeDecl(root2, node2) {
        let value;
        root2.walkDecls((i2) => {
          if (typeof i2.raws.before !== "undefined") {
            value = i2.raws.before;
            if (value.includes("\n")) {
              value = value.replace(/[^\n]+$/, "");
            }
            return false;
          }
        });
        if (typeof value === "undefined") {
          value = this.raw(node2, null, "beforeRule");
        } else if (value) {
          value = value.replace(/\S/g, "");
        }
        return value;
      }
      rawBeforeOpen(root2) {
        let value;
        root2.walk((i2) => {
          if (i2.type !== "decl") {
            value = i2.raws.between;
            if (typeof value !== "undefined") return false;
          }
        });
        return value;
      }
      rawBeforeRule(root2) {
        let value;
        root2.walk((i2) => {
          if (i2.nodes && (i2.parent !== root2 || root2.first !== i2)) {
            if (typeof i2.raws.before !== "undefined") {
              value = i2.raws.before;
              if (value.includes("\n")) {
                value = value.replace(/[^\n]+$/, "");
              }
              return false;
            }
          }
        });
        if (value) value = value.replace(/\S/g, "");
        return value;
      }
      rawColon(root2) {
        let value;
        root2.walkDecls((i2) => {
          if (typeof i2.raws.between !== "undefined") {
            value = i2.raws.between.replace(/[^\s:]/g, "");
            return false;
          }
        });
        return value;
      }
      rawEmptyBody(root2) {
        let value;
        root2.walk((i2) => {
          if (i2.nodes && i2.nodes.length === 0) {
            value = i2.raws.after;
            if (typeof value !== "undefined") return false;
          }
        });
        return value;
      }
      rawIndent(root2) {
        if (root2.raws.indent) return root2.raws.indent;
        let value;
        root2.walk((i2) => {
          let p2 = i2.parent;
          if (p2 && p2 !== root2 && p2.parent && p2.parent === root2) {
            if (typeof i2.raws.before !== "undefined") {
              let parts = i2.raws.before.split("\n");
              value = parts[parts.length - 1];
              value = value.replace(/\S/g, "");
              return false;
            }
          }
        });
        return value;
      }
      rawSemicolon(root2) {
        let value;
        root2.walk((i2) => {
          if (i2.nodes && i2.nodes.length && i2.last.type === "decl") {
            value = i2.raws.semicolon;
            if (typeof value !== "undefined") return false;
          }
        });
        return value;
      }
      rawValue(node2, prop2) {
        let value = node2[prop2];
        let raw = node2.raws[prop2];
        if (raw && raw.value === value) {
          return raw.raw;
        }
        return value;
      }
      root(node2) {
        this.body(node2);
        if (node2.raws.after) this.builder(node2.raws.after);
      }
      rule(node2) {
        this.block(node2, this.rawValue(node2, "selector"));
        if (node2.raws.ownSemicolon) {
          this.builder(node2.raws.ownSemicolon, node2, "end");
        }
      }
      stringify(node2, semicolon) {
        if (!this[node2.type]) {
          throw new Error(
            "Unknown AST node type " + node2.type + ". Maybe you need to change PostCSS stringifier."
          );
        }
        this[node2.type](node2, semicolon);
      }
    };
    stringifier = Stringifier$2;
    Stringifier$2.default = Stringifier$2;
    Stringifier$1 = stringifier;
    stringify_1 = stringify$4;
    stringify$4.default = stringify$4;
    ({ isClean: isClean$2, my: my$2 } = symbols);
    CssSyntaxError$2 = cssSyntaxError;
    Stringifier22 = stringifier;
    stringify$3 = stringify_1;
    Node$4 = class Node3 {
      constructor(defaults2 = {}) {
        this.raws = {};
        this[isClean$2] = false;
        this[my$2] = true;
        for (let name in defaults2) {
          if (name === "nodes") {
            this.nodes = [];
            for (let node2 of defaults2[name]) {
              if (typeof node2.clone === "function") {
                this.append(node2.clone());
              } else {
                this.append(node2);
              }
            }
          } else {
            this[name] = defaults2[name];
          }
        }
      }
      addToError(error) {
        error.postcssNode = this;
        if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
          let s2 = this.source;
          error.stack = error.stack.replace(
            /\n\s{4}at /,
            `$&${s2.input.from}:${s2.start.line}:${s2.start.column}$&`
          );
        }
        return error;
      }
      after(add) {
        this.parent.insertAfter(this, add);
        return this;
      }
      assign(overrides = {}) {
        for (let name in overrides) {
          this[name] = overrides[name];
        }
        return this;
      }
      before(add) {
        this.parent.insertBefore(this, add);
        return this;
      }
      cleanRaws(keepBetween) {
        delete this.raws.before;
        delete this.raws.after;
        if (!keepBetween) delete this.raws.between;
      }
      clone(overrides = {}) {
        let cloned = cloneNode(this);
        for (let name in overrides) {
          cloned[name] = overrides[name];
        }
        return cloned;
      }
      cloneAfter(overrides = {}) {
        let cloned = this.clone(overrides);
        this.parent.insertAfter(this, cloned);
        return cloned;
      }
      cloneBefore(overrides = {}) {
        let cloned = this.clone(overrides);
        this.parent.insertBefore(this, cloned);
        return cloned;
      }
      error(message, opts = {}) {
        if (this.source) {
          let { end, start } = this.rangeBy(opts);
          return this.source.input.error(
            message,
            { column: start.column, line: start.line },
            { column: end.column, line: end.line },
            opts
          );
        }
        return new CssSyntaxError$2(message);
      }
      getProxyProcessor() {
        return {
          get(node2, prop2) {
            if (prop2 === "proxyOf") {
              return node2;
            } else if (prop2 === "root") {
              return () => node2.root().toProxy();
            } else {
              return node2[prop2];
            }
          },
          set(node2, prop2, value) {
            if (node2[prop2] === value) return true;
            node2[prop2] = value;
            if (prop2 === "prop" || prop2 === "value" || prop2 === "name" || prop2 === "params" || prop2 === "important" || /* c8 ignore next */
            prop2 === "text") {
              node2.markDirty();
            }
            return true;
          }
        };
      }
      markDirty() {
        if (this[isClean$2]) {
          this[isClean$2] = false;
          let next = this;
          while (next = next.parent) {
            next[isClean$2] = false;
          }
        }
      }
      next() {
        if (!this.parent) return void 0;
        let index22 = this.parent.index(this);
        return this.parent.nodes[index22 + 1];
      }
      positionBy(opts, stringRepresentation) {
        let pos = this.source.start;
        if (opts.index) {
          pos = this.positionInside(opts.index, stringRepresentation);
        } else if (opts.word) {
          stringRepresentation = this.toString();
          let index22 = stringRepresentation.indexOf(opts.word);
          if (index22 !== -1) pos = this.positionInside(index22, stringRepresentation);
        }
        return pos;
      }
      positionInside(index22, stringRepresentation) {
        let string = stringRepresentation || this.toString();
        let column = this.source.start.column;
        let line = this.source.start.line;
        for (let i2 = 0; i2 < index22; i2++) {
          if (string[i2] === "\n") {
            column = 1;
            line += 1;
          } else {
            column += 1;
          }
        }
        return { column, line };
      }
      prev() {
        if (!this.parent) return void 0;
        let index22 = this.parent.index(this);
        return this.parent.nodes[index22 - 1];
      }
      rangeBy(opts) {
        let start = {
          column: this.source.start.column,
          line: this.source.start.line
        };
        let end = this.source.end ? {
          column: this.source.end.column + 1,
          line: this.source.end.line
        } : {
          column: start.column + 1,
          line: start.line
        };
        if (opts.word) {
          let stringRepresentation = this.toString();
          let index22 = stringRepresentation.indexOf(opts.word);
          if (index22 !== -1) {
            start = this.positionInside(index22, stringRepresentation);
            end = this.positionInside(index22 + opts.word.length, stringRepresentation);
          }
        } else {
          if (opts.start) {
            start = {
              column: opts.start.column,
              line: opts.start.line
            };
          } else if (opts.index) {
            start = this.positionInside(opts.index);
          }
          if (opts.end) {
            end = {
              column: opts.end.column,
              line: opts.end.line
            };
          } else if (typeof opts.endIndex === "number") {
            end = this.positionInside(opts.endIndex);
          } else if (opts.index) {
            end = this.positionInside(opts.index + 1);
          }
        }
        if (end.line < start.line || end.line === start.line && end.column <= start.column) {
          end = { column: start.column + 1, line: start.line };
        }
        return { end, start };
      }
      raw(prop2, defaultType) {
        let str = new Stringifier22();
        return str.raw(this, prop2, defaultType);
      }
      remove() {
        if (this.parent) {
          this.parent.removeChild(this);
        }
        this.parent = void 0;
        return this;
      }
      replaceWith(...nodes) {
        if (this.parent) {
          let bookmark = this;
          let foundSelf = false;
          for (let node2 of nodes) {
            if (node2 === this) {
              foundSelf = true;
            } else if (foundSelf) {
              this.parent.insertAfter(bookmark, node2);
              bookmark = node2;
            } else {
              this.parent.insertBefore(bookmark, node2);
            }
          }
          if (!foundSelf) {
            this.remove();
          }
        }
        return this;
      }
      root() {
        let result2 = this;
        while (result2.parent && result2.parent.type !== "document") {
          result2 = result2.parent;
        }
        return result2;
      }
      toJSON(_2, inputs) {
        let fixed = {};
        let emitInputs = inputs == null;
        inputs = inputs || /* @__PURE__ */ new Map();
        let inputsNextIndex = 0;
        for (let name in this) {
          if (!Object.prototype.hasOwnProperty.call(this, name)) {
            continue;
          }
          if (name === "parent" || name === "proxyCache") continue;
          let value = this[name];
          if (Array.isArray(value)) {
            fixed[name] = value.map((i2) => {
              if (typeof i2 === "object" && i2.toJSON) {
                return i2.toJSON(null, inputs);
              } else {
                return i2;
              }
            });
          } else if (typeof value === "object" && value.toJSON) {
            fixed[name] = value.toJSON(null, inputs);
          } else if (name === "source") {
            let inputId = inputs.get(value.input);
            if (inputId == null) {
              inputId = inputsNextIndex;
              inputs.set(value.input, inputsNextIndex);
              inputsNextIndex++;
            }
            fixed[name] = {
              end: value.end,
              inputId,
              start: value.start
            };
          } else {
            fixed[name] = value;
          }
        }
        if (emitInputs) {
          fixed.inputs = [...inputs.keys()].map((input2) => input2.toJSON());
        }
        return fixed;
      }
      toProxy() {
        if (!this.proxyCache) {
          this.proxyCache = new Proxy(this, this.getProxyProcessor());
        }
        return this.proxyCache;
      }
      toString(stringifier2 = stringify$3) {
        if (stringifier2.stringify) stringifier2 = stringifier2.stringify;
        let result2 = "";
        stringifier2(this, (i2) => {
          result2 += i2;
        });
        return result2;
      }
      warn(result2, text, opts) {
        let data = { node: this };
        for (let i2 in opts) data[i2] = opts[i2];
        return result2.warn(text, data);
      }
      get proxyOf() {
        return this;
      }
    };
    node = Node$4;
    Node$4.default = Node$4;
    Node$3 = node;
    Declaration$4 = class Declaration2 extends Node$3 {
      constructor(defaults2) {
        if (defaults2 && typeof defaults2.value !== "undefined" && typeof defaults2.value !== "string") {
          defaults2 = { ...defaults2, value: String(defaults2.value) };
        }
        super(defaults2);
        this.type = "decl";
      }
      get variable() {
        return this.prop.startsWith("--") || this.prop[0] === "$";
      }
    };
    declaration = Declaration$4;
    Declaration$4.default = Declaration$4;
    urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
    customAlphabet = (alphabet, defaultSize = 21) => {
      return (size = defaultSize) => {
        let id2 = "";
        let i2 = size;
        while (i2--) {
          id2 += alphabet[Math.random() * alphabet.length | 0];
        }
        return id2;
      };
    };
    nanoid$1 = (size = 21) => {
      let id2 = "";
      let i2 = size;
      while (i2--) {
        id2 += urlAlphabet[Math.random() * 64 | 0];
      }
      return id2;
    };
    nonSecure = { nanoid: nanoid$1, customAlphabet };
    ({ SourceMapConsumer: SourceMapConsumer$2, SourceMapGenerator: SourceMapGenerator$2 } = require$$2);
    ({ existsSync, readFileSync } = require$$2);
    ({ dirname: dirname$1, join } = require$$2);
    PreviousMap$2 = class PreviousMap2 {
      constructor(css, opts) {
        if (opts.map === false) return;
        this.loadAnnotation(css);
        this.inline = this.startWith(this.annotation, "data:");
        let prev = opts.map ? opts.map.prev : void 0;
        let text = this.loadMap(opts.from, prev);
        if (!this.mapFile && opts.from) {
          this.mapFile = opts.from;
        }
        if (this.mapFile) this.root = dirname$1(this.mapFile);
        if (text) this.text = text;
      }
      consumer() {
        if (!this.consumerCache) {
          this.consumerCache = new SourceMapConsumer$2(this.text);
        }
        return this.consumerCache;
      }
      decodeInline(text) {
        let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
        let baseUri = /^data:application\/json;base64,/;
        let charsetUri = /^data:application\/json;charset=utf-?8,/;
        let uri = /^data:application\/json,/;
        if (charsetUri.test(text) || uri.test(text)) {
          return decodeURIComponent(text.substr(RegExp.lastMatch.length));
        }
        if (baseCharsetUri.test(text) || baseUri.test(text)) {
          return fromBase64(text.substr(RegExp.lastMatch.length));
        }
        let encoding = text.match(/data:application\/json;([^,]+),/)[1];
        throw new Error("Unsupported source map encoding " + encoding);
      }
      getAnnotationURL(sourceMapString) {
        return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
      }
      isMap(map) {
        if (typeof map !== "object") return false;
        return typeof map.mappings === "string" || typeof map._mappings === "string" || Array.isArray(map.sections);
      }
      loadAnnotation(css) {
        let comments = css.match(/\/\*\s*# sourceMappingURL=/gm);
        if (!comments) return;
        let start = css.lastIndexOf(comments.pop());
        let end = css.indexOf("*/", start);
        if (start > -1 && end > -1) {
          this.annotation = this.getAnnotationURL(css.substring(start, end));
        }
      }
      loadFile(path) {
        this.root = dirname$1(path);
        if (existsSync(path)) {
          this.mapFile = path;
          return readFileSync(path, "utf-8").toString().trim();
        }
      }
      loadMap(file, prev) {
        if (prev === false) return false;
        if (prev) {
          if (typeof prev === "string") {
            return prev;
          } else if (typeof prev === "function") {
            let prevPath = prev(file);
            if (prevPath) {
              let map = this.loadFile(prevPath);
              if (!map) {
                throw new Error(
                  "Unable to load previous source map: " + prevPath.toString()
                );
              }
              return map;
            }
          } else if (prev instanceof SourceMapConsumer$2) {
            return SourceMapGenerator$2.fromSourceMap(prev).toString();
          } else if (prev instanceof SourceMapGenerator$2) {
            return prev.toString();
          } else if (this.isMap(prev)) {
            return JSON.stringify(prev);
          } else {
            throw new Error(
              "Unsupported previous source map format: " + prev.toString()
            );
          }
        } else if (this.inline) {
          return this.decodeInline(this.annotation);
        } else if (this.annotation) {
          let map = this.annotation;
          if (file) map = join(dirname$1(file), map);
          return this.loadFile(map);
        }
      }
      startWith(string, start) {
        if (!string) return false;
        return string.substr(0, start.length) === start;
      }
      withContent() {
        return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
      }
    };
    previousMap = PreviousMap$2;
    PreviousMap$2.default = PreviousMap$2;
    ({ SourceMapConsumer: SourceMapConsumer$1, SourceMapGenerator: SourceMapGenerator$1 } = require$$2);
    ({ fileURLToPath, pathToFileURL: pathToFileURL$1 } = require$$2);
    ({ isAbsolute, resolve: resolve$1 } = require$$2);
    ({ nanoid } = nonSecure);
    terminalHighlight = require$$2;
    CssSyntaxError$1 = cssSyntaxError;
    PreviousMap$1 = previousMap;
    fromOffsetCache = /* @__PURE__ */ Symbol("fromOffsetCache");
    sourceMapAvailable$1 = Boolean(SourceMapConsumer$1 && SourceMapGenerator$1);
    pathAvailable$1 = Boolean(resolve$1 && isAbsolute);
    Input$4 = class Input2 {
      constructor(css, opts = {}) {
        if (css === null || typeof css === "undefined" || typeof css === "object" && !css.toString) {
          throw new Error(`PostCSS received ${css} instead of CSS string`);
        }
        this.css = css.toString();
        if (this.css[0] === "\uFEFF" || this.css[0] === "\uFFFE") {
          this.hasBOM = true;
          this.css = this.css.slice(1);
        } else {
          this.hasBOM = false;
        }
        if (opts.from) {
          if (!pathAvailable$1 || /^\w+:\/\//.test(opts.from) || isAbsolute(opts.from)) {
            this.file = opts.from;
          } else {
            this.file = resolve$1(opts.from);
          }
        }
        if (pathAvailable$1 && sourceMapAvailable$1) {
          let map = new PreviousMap$1(this.css, opts);
          if (map.text) {
            this.map = map;
            let file = map.consumer().file;
            if (!this.file && file) this.file = this.mapResolve(file);
          }
        }
        if (!this.file) {
          this.id = "<input css " + nanoid(6) + ">";
        }
        if (this.map) this.map.file = this.from;
      }
      error(message, line, column, opts = {}) {
        let result2, endLine, endColumn;
        if (line && typeof line === "object") {
          let start = line;
          let end = column;
          if (typeof start.offset === "number") {
            let pos = this.fromOffset(start.offset);
            line = pos.line;
            column = pos.col;
          } else {
            line = start.line;
            column = start.column;
          }
          if (typeof end.offset === "number") {
            let pos = this.fromOffset(end.offset);
            endLine = pos.line;
            endColumn = pos.col;
          } else {
            endLine = end.line;
            endColumn = end.column;
          }
        } else if (!column) {
          let pos = this.fromOffset(line);
          line = pos.line;
          column = pos.col;
        }
        let origin = this.origin(line, column, endLine, endColumn);
        if (origin) {
          result2 = new CssSyntaxError$1(
            message,
            origin.endLine === void 0 ? origin.line : { column: origin.column, line: origin.line },
            origin.endLine === void 0 ? origin.column : { column: origin.endColumn, line: origin.endLine },
            origin.source,
            origin.file,
            opts.plugin
          );
        } else {
          result2 = new CssSyntaxError$1(
            message,
            endLine === void 0 ? line : { column, line },
            endLine === void 0 ? column : { column: endColumn, line: endLine },
            this.css,
            this.file,
            opts.plugin
          );
        }
        result2.input = { column, endColumn, endLine, line, source: this.css };
        if (this.file) {
          if (pathToFileURL$1) {
            result2.input.url = pathToFileURL$1(this.file).toString();
          }
          result2.input.file = this.file;
        }
        return result2;
      }
      fromOffset(offset) {
        let lastLine, lineToIndex;
        if (!this[fromOffsetCache]) {
          let lines = this.css.split("\n");
          lineToIndex = new Array(lines.length);
          let prevIndex = 0;
          for (let i2 = 0, l2 = lines.length; i2 < l2; i2++) {
            lineToIndex[i2] = prevIndex;
            prevIndex += lines[i2].length + 1;
          }
          this[fromOffsetCache] = lineToIndex;
        } else {
          lineToIndex = this[fromOffsetCache];
        }
        lastLine = lineToIndex[lineToIndex.length - 1];
        let min = 0;
        if (offset >= lastLine) {
          min = lineToIndex.length - 1;
        } else {
          let max2 = lineToIndex.length - 2;
          let mid;
          while (min < max2) {
            mid = min + (max2 - min >> 1);
            if (offset < lineToIndex[mid]) {
              max2 = mid - 1;
            } else if (offset >= lineToIndex[mid + 1]) {
              min = mid + 1;
            } else {
              min = mid;
              break;
            }
          }
        }
        return {
          col: offset - lineToIndex[min] + 1,
          line: min + 1
        };
      }
      mapResolve(file) {
        if (/^\w+:\/\//.test(file)) {
          return file;
        }
        return resolve$1(this.map.consumer().sourceRoot || this.map.root || ".", file);
      }
      origin(line, column, endLine, endColumn) {
        if (!this.map) return false;
        let consumer = this.map.consumer();
        let from = consumer.originalPositionFor({ column, line });
        if (!from.source) return false;
        let to;
        if (typeof endLine === "number") {
          to = consumer.originalPositionFor({ column: endColumn, line: endLine });
        }
        let fromUrl;
        if (isAbsolute(from.source)) {
          fromUrl = pathToFileURL$1(from.source);
        } else {
          fromUrl = new URL(
            from.source,
            this.map.consumer().sourceRoot || pathToFileURL$1(this.map.mapFile)
          );
        }
        let result2 = {
          column: from.column,
          endColumn: to && to.column,
          endLine: to && to.line,
          line: from.line,
          url: fromUrl.toString()
        };
        if (fromUrl.protocol === "file:") {
          if (fileURLToPath) {
            result2.file = fileURLToPath(fromUrl);
          } else {
            throw new Error(`file: protocol is not available in this PostCSS build`);
          }
        }
        let source = consumer.sourceContentFor(from.source);
        if (source) result2.source = source;
        return result2;
      }
      toJSON() {
        let json = {};
        for (let name of ["hasBOM", "css", "file", "id"]) {
          if (this[name] != null) {
            json[name] = this[name];
          }
        }
        if (this.map) {
          json.map = { ...this.map };
          if (json.map.consumerCache) {
            json.map.consumerCache = void 0;
          }
        }
        return json;
      }
      get from() {
        return this.file || this.id;
      }
    };
    input = Input$4;
    Input$4.default = Input$4;
    if (terminalHighlight && terminalHighlight.registerInput) {
      terminalHighlight.registerInput(Input$4);
    }
    ({ SourceMapConsumer, SourceMapGenerator } = require$$2);
    ({ dirname, relative, resolve, sep } = require$$2);
    ({ pathToFileURL } = require$$2);
    Input$3 = input;
    sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
    pathAvailable = Boolean(dirname && resolve && relative && sep);
    MapGenerator$2 = class MapGenerator2 {
      constructor(stringify22, root2, opts, cssString) {
        this.stringify = stringify22;
        this.mapOpts = opts.map || {};
        this.root = root2;
        this.opts = opts;
        this.css = cssString;
        this.originalCSS = cssString;
        this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute;
        this.memoizedFileURLs = /* @__PURE__ */ new Map();
        this.memoizedPaths = /* @__PURE__ */ new Map();
        this.memoizedURLs = /* @__PURE__ */ new Map();
      }
      addAnnotation() {
        let content;
        if (this.isInline()) {
          content = "data:application/json;base64," + this.toBase64(this.map.toString());
        } else if (typeof this.mapOpts.annotation === "string") {
          content = this.mapOpts.annotation;
        } else if (typeof this.mapOpts.annotation === "function") {
          content = this.mapOpts.annotation(this.opts.to, this.root);
        } else {
          content = this.outputFile() + ".map";
        }
        let eol = "\n";
        if (this.css.includes("\r\n")) eol = "\r\n";
        this.css += eol + "/*# sourceMappingURL=" + content + " */";
      }
      applyPrevMaps() {
        for (let prev of this.previous()) {
          let from = this.toUrl(this.path(prev.file));
          let root2 = prev.root || dirname(prev.file);
          let map;
          if (this.mapOpts.sourcesContent === false) {
            map = new SourceMapConsumer(prev.text);
            if (map.sourcesContent) {
              map.sourcesContent = null;
            }
          } else {
            map = prev.consumer();
          }
          this.map.applySourceMap(map, from, this.toUrl(this.path(root2)));
        }
      }
      clearAnnotation() {
        if (this.mapOpts.annotation === false) return;
        if (this.root) {
          let node2;
          for (let i2 = this.root.nodes.length - 1; i2 >= 0; i2--) {
            node2 = this.root.nodes[i2];
            if (node2.type !== "comment") continue;
            if (node2.text.indexOf("# sourceMappingURL=") === 0) {
              this.root.removeChild(i2);
            }
          }
        } else if (this.css) {
          this.css = this.css.replace(/\n*?\/\*#[\S\s]*?\*\/$/gm, "");
        }
      }
      generate() {
        this.clearAnnotation();
        if (pathAvailable && sourceMapAvailable && this.isMap()) {
          return this.generateMap();
        } else {
          let result2 = "";
          this.stringify(this.root, (i2) => {
            result2 += i2;
          });
          return [result2];
        }
      }
      generateMap() {
        if (this.root) {
          this.generateString();
        } else if (this.previous().length === 1) {
          let prev = this.previous()[0].consumer();
          prev.file = this.outputFile();
          this.map = SourceMapGenerator.fromSourceMap(prev, {
            ignoreInvalidMapping: true
          });
        } else {
          this.map = new SourceMapGenerator({
            file: this.outputFile(),
            ignoreInvalidMapping: true
          });
          this.map.addMapping({
            generated: { column: 0, line: 1 },
            original: { column: 0, line: 1 },
            source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>"
          });
        }
        if (this.isSourcesContent()) this.setSourcesContent();
        if (this.root && this.previous().length > 0) this.applyPrevMaps();
        if (this.isAnnotation()) this.addAnnotation();
        if (this.isInline()) {
          return [this.css];
        } else {
          return [this.css, this.map];
        }
      }
      generateString() {
        this.css = "";
        this.map = new SourceMapGenerator({
          file: this.outputFile(),
          ignoreInvalidMapping: true
        });
        let line = 1;
        let column = 1;
        let noSource = "<no source>";
        let mapping = {
          generated: { column: 0, line: 0 },
          original: { column: 0, line: 0 },
          source: ""
        };
        let lines, last;
        this.stringify(this.root, (str, node2, type) => {
          this.css += str;
          if (node2 && type !== "end") {
            mapping.generated.line = line;
            mapping.generated.column = column - 1;
            if (node2.source && node2.source.start) {
              mapping.source = this.sourcePath(node2);
              mapping.original.line = node2.source.start.line;
              mapping.original.column = node2.source.start.column - 1;
              this.map.addMapping(mapping);
            } else {
              mapping.source = noSource;
              mapping.original.line = 1;
              mapping.original.column = 0;
              this.map.addMapping(mapping);
            }
          }
          lines = str.match(/\n/g);
          if (lines) {
            line += lines.length;
            last = str.lastIndexOf("\n");
            column = str.length - last;
          } else {
            column += str.length;
          }
          if (node2 && type !== "start") {
            let p2 = node2.parent || { raws: {} };
            let childless = node2.type === "decl" || node2.type === "atrule" && !node2.nodes;
            if (!childless || node2 !== p2.last || p2.raws.semicolon) {
              if (node2.source && node2.source.end) {
                mapping.source = this.sourcePath(node2);
                mapping.original.line = node2.source.end.line;
                mapping.original.column = node2.source.end.column - 1;
                mapping.generated.line = line;
                mapping.generated.column = column - 2;
                this.map.addMapping(mapping);
              } else {
                mapping.source = noSource;
                mapping.original.line = 1;
                mapping.original.column = 0;
                mapping.generated.line = line;
                mapping.generated.column = column - 1;
                this.map.addMapping(mapping);
              }
            }
          }
        });
      }
      isAnnotation() {
        if (this.isInline()) {
          return true;
        }
        if (typeof this.mapOpts.annotation !== "undefined") {
          return this.mapOpts.annotation;
        }
        if (this.previous().length) {
          return this.previous().some((i2) => i2.annotation);
        }
        return true;
      }
      isInline() {
        if (typeof this.mapOpts.inline !== "undefined") {
          return this.mapOpts.inline;
        }
        let annotation = this.mapOpts.annotation;
        if (typeof annotation !== "undefined" && annotation !== true) {
          return false;
        }
        if (this.previous().length) {
          return this.previous().some((i2) => i2.inline);
        }
        return true;
      }
      isMap() {
        if (typeof this.opts.map !== "undefined") {
          return !!this.opts.map;
        }
        return this.previous().length > 0;
      }
      isSourcesContent() {
        if (typeof this.mapOpts.sourcesContent !== "undefined") {
          return this.mapOpts.sourcesContent;
        }
        if (this.previous().length) {
          return this.previous().some((i2) => i2.withContent());
        }
        return true;
      }
      outputFile() {
        if (this.opts.to) {
          return this.path(this.opts.to);
        } else if (this.opts.from) {
          return this.path(this.opts.from);
        } else {
          return "to.css";
        }
      }
      path(file) {
        if (this.mapOpts.absolute) return file;
        if (file.charCodeAt(0) === 60) return file;
        if (/^\w+:\/\//.test(file)) return file;
        let cached = this.memoizedPaths.get(file);
        if (cached) return cached;
        let from = this.opts.to ? dirname(this.opts.to) : ".";
        if (typeof this.mapOpts.annotation === "string") {
          from = dirname(resolve(from, this.mapOpts.annotation));
        }
        let path = relative(from, file);
        this.memoizedPaths.set(file, path);
        return path;
      }
      previous() {
        if (!this.previousMaps) {
          this.previousMaps = [];
          if (this.root) {
            this.root.walk((node2) => {
              if (node2.source && node2.source.input.map) {
                let map = node2.source.input.map;
                if (!this.previousMaps.includes(map)) {
                  this.previousMaps.push(map);
                }
              }
            });
          } else {
            let input2 = new Input$3(this.originalCSS, this.opts);
            if (input2.map) this.previousMaps.push(input2.map);
          }
        }
        return this.previousMaps;
      }
      setSourcesContent() {
        let already = {};
        if (this.root) {
          this.root.walk((node2) => {
            if (node2.source) {
              let from = node2.source.input.from;
              if (from && !already[from]) {
                already[from] = true;
                let fromUrl = this.usesFileUrls ? this.toFileUrl(from) : this.toUrl(this.path(from));
                this.map.setSourceContent(fromUrl, node2.source.input.css);
              }
            }
          });
        } else if (this.css) {
          let from = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
          this.map.setSourceContent(from, this.css);
        }
      }
      sourcePath(node2) {
        if (this.mapOpts.from) {
          return this.toUrl(this.mapOpts.from);
        } else if (this.usesFileUrls) {
          return this.toFileUrl(node2.source.input.from);
        } else {
          return this.toUrl(this.path(node2.source.input.from));
        }
      }
      toBase64(str) {
        if (Buffer) {
          return Buffer.from(str).toString("base64");
        } else {
          return window.btoa(unescape(encodeURIComponent(str)));
        }
      }
      toFileUrl(path) {
        let cached = this.memoizedFileURLs.get(path);
        if (cached) return cached;
        if (pathToFileURL) {
          let fileURL = pathToFileURL(path).toString();
          this.memoizedFileURLs.set(path, fileURL);
          return fileURL;
        } else {
          throw new Error(
            "`map.absolute` option is not available in this PostCSS build"
          );
        }
      }
      toUrl(path) {
        let cached = this.memoizedURLs.get(path);
        if (cached) return cached;
        if (sep === "\\") {
          path = path.replace(/\\/g, "/");
        }
        let url = encodeURI(path).replace(/[#?]/g, encodeURIComponent);
        this.memoizedURLs.set(path, url);
        return url;
      }
    };
    mapGenerator = MapGenerator$2;
    Node$2 = node;
    Comment$4 = class Comment2 extends Node$2 {
      constructor(defaults2) {
        super(defaults2);
        this.type = "comment";
      }
    };
    comment = Comment$4;
    Comment$4.default = Comment$4;
    ({ isClean: isClean$1, my: my$1 } = symbols);
    Declaration$3 = declaration;
    Comment$3 = comment;
    Node$1 = node;
    Container$7 = class Container2 extends Node$1 {
      append(...children) {
        for (let child of children) {
          let nodes = this.normalize(child, this.last);
          for (let node2 of nodes) this.proxyOf.nodes.push(node2);
        }
        this.markDirty();
        return this;
      }
      cleanRaws(keepBetween) {
        super.cleanRaws(keepBetween);
        if (this.nodes) {
          for (let node2 of this.nodes) node2.cleanRaws(keepBetween);
        }
      }
      each(callback) {
        if (!this.proxyOf.nodes) return void 0;
        let iterator = this.getIterator();
        let index22, result2;
        while (this.indexes[iterator] < this.proxyOf.nodes.length) {
          index22 = this.indexes[iterator];
          result2 = callback(this.proxyOf.nodes[index22], index22);
          if (result2 === false) break;
          this.indexes[iterator] += 1;
        }
        delete this.indexes[iterator];
        return result2;
      }
      every(condition) {
        return this.nodes.every(condition);
      }
      getIterator() {
        if (!this.lastEach) this.lastEach = 0;
        if (!this.indexes) this.indexes = {};
        this.lastEach += 1;
        let iterator = this.lastEach;
        this.indexes[iterator] = 0;
        return iterator;
      }
      getProxyProcessor() {
        return {
          get(node2, prop2) {
            if (prop2 === "proxyOf") {
              return node2;
            } else if (!node2[prop2]) {
              return node2[prop2];
            } else if (prop2 === "each" || typeof prop2 === "string" && prop2.startsWith("walk")) {
              return (...args) => {
                return node2[prop2](
                  ...args.map((i2) => {
                    if (typeof i2 === "function") {
                      return (child, index22) => i2(child.toProxy(), index22);
                    } else {
                      return i2;
                    }
                  })
                );
              };
            } else if (prop2 === "every" || prop2 === "some") {
              return (cb) => {
                return node2[prop2](
                  (child, ...other) => cb(child.toProxy(), ...other)
                );
              };
            } else if (prop2 === "root") {
              return () => node2.root().toProxy();
            } else if (prop2 === "nodes") {
              return node2.nodes.map((i2) => i2.toProxy());
            } else if (prop2 === "first" || prop2 === "last") {
              return node2[prop2].toProxy();
            } else {
              return node2[prop2];
            }
          },
          set(node2, prop2, value) {
            if (node2[prop2] === value) return true;
            node2[prop2] = value;
            if (prop2 === "name" || prop2 === "params" || prop2 === "selector") {
              node2.markDirty();
            }
            return true;
          }
        };
      }
      index(child) {
        if (typeof child === "number") return child;
        if (child.proxyOf) child = child.proxyOf;
        return this.proxyOf.nodes.indexOf(child);
      }
      insertAfter(exist, add) {
        let existIndex = this.index(exist);
        let nodes = this.normalize(add, this.proxyOf.nodes[existIndex]).reverse();
        existIndex = this.index(exist);
        for (let node2 of nodes) this.proxyOf.nodes.splice(existIndex + 1, 0, node2);
        let index22;
        for (let id2 in this.indexes) {
          index22 = this.indexes[id2];
          if (existIndex < index22) {
            this.indexes[id2] = index22 + nodes.length;
          }
        }
        this.markDirty();
        return this;
      }
      insertBefore(exist, add) {
        let existIndex = this.index(exist);
        let type = existIndex === 0 ? "prepend" : false;
        let nodes = this.normalize(add, this.proxyOf.nodes[existIndex], type).reverse();
        existIndex = this.index(exist);
        for (let node2 of nodes) this.proxyOf.nodes.splice(existIndex, 0, node2);
        let index22;
        for (let id2 in this.indexes) {
          index22 = this.indexes[id2];
          if (existIndex <= index22) {
            this.indexes[id2] = index22 + nodes.length;
          }
        }
        this.markDirty();
        return this;
      }
      normalize(nodes, sample) {
        if (typeof nodes === "string") {
          nodes = cleanSource(parse$4(nodes).nodes);
        } else if (typeof nodes === "undefined") {
          nodes = [];
        } else if (Array.isArray(nodes)) {
          nodes = nodes.slice(0);
          for (let i2 of nodes) {
            if (i2.parent) i2.parent.removeChild(i2, "ignore");
          }
        } else if (nodes.type === "root" && this.type !== "document") {
          nodes = nodes.nodes.slice(0);
          for (let i2 of nodes) {
            if (i2.parent) i2.parent.removeChild(i2, "ignore");
          }
        } else if (nodes.type) {
          nodes = [nodes];
        } else if (nodes.prop) {
          if (typeof nodes.value === "undefined") {
            throw new Error("Value field is missed in node creation");
          } else if (typeof nodes.value !== "string") {
            nodes.value = String(nodes.value);
          }
          nodes = [new Declaration$3(nodes)];
        } else if (nodes.selector) {
          nodes = [new Rule$4(nodes)];
        } else if (nodes.name) {
          nodes = [new AtRule$4(nodes)];
        } else if (nodes.text) {
          nodes = [new Comment$3(nodes)];
        } else {
          throw new Error("Unknown node type in node creation");
        }
        let processed = nodes.map((i2) => {
          if (!i2[my$1]) Container2.rebuild(i2);
          i2 = i2.proxyOf;
          if (i2.parent) i2.parent.removeChild(i2);
          if (i2[isClean$1]) markDirtyUp(i2);
          if (typeof i2.raws.before === "undefined") {
            if (sample && typeof sample.raws.before !== "undefined") {
              i2.raws.before = sample.raws.before.replace(/\S/g, "");
            }
          }
          i2.parent = this.proxyOf;
          return i2;
        });
        return processed;
      }
      prepend(...children) {
        children = children.reverse();
        for (let child of children) {
          let nodes = this.normalize(child, this.first, "prepend").reverse();
          for (let node2 of nodes) this.proxyOf.nodes.unshift(node2);
          for (let id2 in this.indexes) {
            this.indexes[id2] = this.indexes[id2] + nodes.length;
          }
        }
        this.markDirty();
        return this;
      }
      push(child) {
        child.parent = this;
        this.proxyOf.nodes.push(child);
        return this;
      }
      removeAll() {
        for (let node2 of this.proxyOf.nodes) node2.parent = void 0;
        this.proxyOf.nodes = [];
        this.markDirty();
        return this;
      }
      removeChild(child) {
        child = this.index(child);
        this.proxyOf.nodes[child].parent = void 0;
        this.proxyOf.nodes.splice(child, 1);
        let index22;
        for (let id2 in this.indexes) {
          index22 = this.indexes[id2];
          if (index22 >= child) {
            this.indexes[id2] = index22 - 1;
          }
        }
        this.markDirty();
        return this;
      }
      replaceValues(pattern, opts, callback) {
        if (!callback) {
          callback = opts;
          opts = {};
        }
        this.walkDecls((decl) => {
          if (opts.props && !opts.props.includes(decl.prop)) return;
          if (opts.fast && !decl.value.includes(opts.fast)) return;
          decl.value = decl.value.replace(pattern, callback);
        });
        this.markDirty();
        return this;
      }
      some(condition) {
        return this.nodes.some(condition);
      }
      walk(callback) {
        return this.each((child, i2) => {
          let result2;
          try {
            result2 = callback(child, i2);
          } catch (e2) {
            throw child.addToError(e2);
          }
          if (result2 !== false && child.walk) {
            result2 = child.walk(callback);
          }
          return result2;
        });
      }
      walkAtRules(name, callback) {
        if (!callback) {
          callback = name;
          return this.walk((child, i2) => {
            if (child.type === "atrule") {
              return callback(child, i2);
            }
          });
        }
        if (name instanceof RegExp) {
          return this.walk((child, i2) => {
            if (child.type === "atrule" && name.test(child.name)) {
              return callback(child, i2);
            }
          });
        }
        return this.walk((child, i2) => {
          if (child.type === "atrule" && child.name === name) {
            return callback(child, i2);
          }
        });
      }
      walkComments(callback) {
        return this.walk((child, i2) => {
          if (child.type === "comment") {
            return callback(child, i2);
          }
        });
      }
      walkDecls(prop2, callback) {
        if (!callback) {
          callback = prop2;
          return this.walk((child, i2) => {
            if (child.type === "decl") {
              return callback(child, i2);
            }
          });
        }
        if (prop2 instanceof RegExp) {
          return this.walk((child, i2) => {
            if (child.type === "decl" && prop2.test(child.prop)) {
              return callback(child, i2);
            }
          });
        }
        return this.walk((child, i2) => {
          if (child.type === "decl" && child.prop === prop2) {
            return callback(child, i2);
          }
        });
      }
      walkRules(selector, callback) {
        if (!callback) {
          callback = selector;
          return this.walk((child, i2) => {
            if (child.type === "rule") {
              return callback(child, i2);
            }
          });
        }
        if (selector instanceof RegExp) {
          return this.walk((child, i2) => {
            if (child.type === "rule" && selector.test(child.selector)) {
              return callback(child, i2);
            }
          });
        }
        return this.walk((child, i2) => {
          if (child.type === "rule" && child.selector === selector) {
            return callback(child, i2);
          }
        });
      }
      get first() {
        if (!this.proxyOf.nodes) return void 0;
        return this.proxyOf.nodes[0];
      }
      get last() {
        if (!this.proxyOf.nodes) return void 0;
        return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
      }
    };
    Container$7.registerParse = (dependant) => {
      parse$4 = dependant;
    };
    Container$7.registerRule = (dependant) => {
      Rule$4 = dependant;
    };
    Container$7.registerAtRule = (dependant) => {
      AtRule$4 = dependant;
    };
    Container$7.registerRoot = (dependant) => {
      Root$6 = dependant;
    };
    container = Container$7;
    Container$7.default = Container$7;
    Container$7.rebuild = (node2) => {
      if (node2.type === "atrule") {
        Object.setPrototypeOf(node2, AtRule$4.prototype);
      } else if (node2.type === "rule") {
        Object.setPrototypeOf(node2, Rule$4.prototype);
      } else if (node2.type === "decl") {
        Object.setPrototypeOf(node2, Declaration$3.prototype);
      } else if (node2.type === "comment") {
        Object.setPrototypeOf(node2, Comment$3.prototype);
      } else if (node2.type === "root") {
        Object.setPrototypeOf(node2, Root$6.prototype);
      }
      node2[my$1] = true;
      if (node2.nodes) {
        node2.nodes.forEach((child) => {
          Container$7.rebuild(child);
        });
      }
    };
    Container$6 = container;
    Document$3 = class Document23 extends Container$6 {
      constructor(defaults2) {
        super({ type: "document", ...defaults2 });
        if (!this.nodes) {
          this.nodes = [];
        }
      }
      toResult(opts = {}) {
        let lazy = new LazyResult$4(new Processor$3(), this, opts);
        return lazy.stringify();
      }
    };
    Document$3.registerLazyResult = (dependant) => {
      LazyResult$4 = dependant;
    };
    Document$3.registerProcessor = (dependant) => {
      Processor$3 = dependant;
    };
    document$1 = Document$3;
    Document$3.default = Document$3;
    printed = {};
    warnOnce$2 = function warnOnce2(message) {
      if (printed[message]) return;
      printed[message] = true;
      if (typeof console !== "undefined" && console.warn) {
        console.warn(message);
      }
    };
    Warning$2 = class Warning2 {
      constructor(text, opts = {}) {
        this.type = "warning";
        this.text = text;
        if (opts.node && opts.node.source) {
          let range = opts.node.rangeBy(opts);
          this.line = range.start.line;
          this.column = range.start.column;
          this.endLine = range.end.line;
          this.endColumn = range.end.column;
        }
        for (let opt in opts) this[opt] = opts[opt];
      }
      toString() {
        if (this.node) {
          return this.node.error(this.text, {
            index: this.index,
            plugin: this.plugin,
            word: this.word
          }).message;
        }
        if (this.plugin) {
          return this.plugin + ": " + this.text;
        }
        return this.text;
      }
    };
    warning = Warning$2;
    Warning$2.default = Warning$2;
    Warning$1 = warning;
    Result$3 = class Result2 {
      constructor(processor2, root2, opts) {
        this.processor = processor2;
        this.messages = [];
        this.root = root2;
        this.opts = opts;
        this.css = void 0;
        this.map = void 0;
      }
      toString() {
        return this.css;
      }
      warn(text, opts = {}) {
        if (!opts.plugin) {
          if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
            opts.plugin = this.lastPlugin.postcssPlugin;
          }
        }
        let warning2 = new Warning$1(text, opts);
        this.messages.push(warning2);
        return warning2;
      }
      warnings() {
        return this.messages.filter((i2) => i2.type === "warning");
      }
      get content() {
        return this.css;
      }
    };
    result = Result$3;
    Result$3.default = Result$3;
    SINGLE_QUOTE = "'".charCodeAt(0);
    DOUBLE_QUOTE = '"'.charCodeAt(0);
    BACKSLASH = "\\".charCodeAt(0);
    SLASH = "/".charCodeAt(0);
    NEWLINE = "\n".charCodeAt(0);
    SPACE = " ".charCodeAt(0);
    FEED = "\f".charCodeAt(0);
    TAB = "	".charCodeAt(0);
    CR = "\r".charCodeAt(0);
    OPEN_SQUARE = "[".charCodeAt(0);
    CLOSE_SQUARE = "]".charCodeAt(0);
    OPEN_PARENTHESES = "(".charCodeAt(0);
    CLOSE_PARENTHESES = ")".charCodeAt(0);
    OPEN_CURLY = "{".charCodeAt(0);
    CLOSE_CURLY = "}".charCodeAt(0);
    SEMICOLON = ";".charCodeAt(0);
    ASTERISK = "*".charCodeAt(0);
    COLON = ":".charCodeAt(0);
    AT = "@".charCodeAt(0);
    RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g;
    RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
    RE_BAD_BRACKET = /.[\r\n"'(/\\]/;
    RE_HEX_ESCAPE = /[\da-f]/i;
    tokenize = function tokenizer2(input2, options = {}) {
      let css = input2.css.valueOf();
      let ignore = options.ignoreErrors;
      let code, next, quote, content, escape;
      let escaped, escapePos, prev, n22, currentToken;
      let length = css.length;
      let pos = 0;
      let buffer = [];
      let returned = [];
      function position() {
        return pos;
      }
      function unclosed(what) {
        throw input2.error("Unclosed " + what, pos);
      }
      function endOfFile() {
        return returned.length === 0 && pos >= length;
      }
      function nextToken(opts) {
        if (returned.length) return returned.pop();
        if (pos >= length) return;
        let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;
        code = css.charCodeAt(pos);
        switch (code) {
          case NEWLINE:
          case SPACE:
          case TAB:
          case CR:
          case FEED: {
            next = pos;
            do {
              next += 1;
              code = css.charCodeAt(next);
            } while (code === SPACE || code === NEWLINE || code === TAB || code === CR || code === FEED);
            currentToken = ["space", css.slice(pos, next)];
            pos = next - 1;
            break;
          }
          case OPEN_SQUARE:
          case CLOSE_SQUARE:
          case OPEN_CURLY:
          case CLOSE_CURLY:
          case COLON:
          case SEMICOLON:
          case CLOSE_PARENTHESES: {
            let controlChar = String.fromCharCode(code);
            currentToken = [controlChar, controlChar, pos];
            break;
          }
          case OPEN_PARENTHESES: {
            prev = buffer.length ? buffer.pop()[1] : "";
            n22 = css.charCodeAt(pos + 1);
            if (prev === "url" && n22 !== SINGLE_QUOTE && n22 !== DOUBLE_QUOTE && n22 !== SPACE && n22 !== NEWLINE && n22 !== TAB && n22 !== FEED && n22 !== CR) {
              next = pos;
              do {
                escaped = false;
                next = css.indexOf(")", next + 1);
                if (next === -1) {
                  if (ignore || ignoreUnclosed) {
                    next = pos;
                    break;
                  } else {
                    unclosed("bracket");
                  }
                }
                escapePos = next;
                while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
                  escapePos -= 1;
                  escaped = !escaped;
                }
              } while (escaped);
              currentToken = ["brackets", css.slice(pos, next + 1), pos, next];
              pos = next;
            } else {
              next = css.indexOf(")", pos + 1);
              content = css.slice(pos, next + 1);
              if (next === -1 || RE_BAD_BRACKET.test(content)) {
                currentToken = ["(", "(", pos];
              } else {
                currentToken = ["brackets", content, pos, next];
                pos = next;
              }
            }
            break;
          }
          case SINGLE_QUOTE:
          case DOUBLE_QUOTE: {
            quote = code === SINGLE_QUOTE ? "'" : '"';
            next = pos;
            do {
              escaped = false;
              next = css.indexOf(quote, next + 1);
              if (next === -1) {
                if (ignore || ignoreUnclosed) {
                  next = pos + 1;
                  break;
                } else {
                  unclosed("string");
                }
              }
              escapePos = next;
              while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
                escapePos -= 1;
                escaped = !escaped;
              }
            } while (escaped);
            currentToken = ["string", css.slice(pos, next + 1), pos, next];
            pos = next;
            break;
          }
          case AT: {
            RE_AT_END.lastIndex = pos + 1;
            RE_AT_END.test(css);
            if (RE_AT_END.lastIndex === 0) {
              next = css.length - 1;
            } else {
              next = RE_AT_END.lastIndex - 2;
            }
            currentToken = ["at-word", css.slice(pos, next + 1), pos, next];
            pos = next;
            break;
          }
          case BACKSLASH: {
            next = pos;
            escape = true;
            while (css.charCodeAt(next + 1) === BACKSLASH) {
              next += 1;
              escape = !escape;
            }
            code = css.charCodeAt(next + 1);
            if (escape && code !== SLASH && code !== SPACE && code !== NEWLINE && code !== TAB && code !== CR && code !== FEED) {
              next += 1;
              if (RE_HEX_ESCAPE.test(css.charAt(next))) {
                while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
                  next += 1;
                }
                if (css.charCodeAt(next + 1) === SPACE) {
                  next += 1;
                }
              }
            }
            currentToken = ["word", css.slice(pos, next + 1), pos, next];
            pos = next;
            break;
          }
          default: {
            if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
              next = css.indexOf("*/", pos + 2) + 1;
              if (next === 0) {
                if (ignore || ignoreUnclosed) {
                  next = css.length;
                } else {
                  unclosed("comment");
                }
              }
              currentToken = ["comment", css.slice(pos, next + 1), pos, next];
              pos = next;
            } else {
              RE_WORD_END.lastIndex = pos + 1;
              RE_WORD_END.test(css);
              if (RE_WORD_END.lastIndex === 0) {
                next = css.length - 1;
              } else {
                next = RE_WORD_END.lastIndex - 2;
              }
              currentToken = ["word", css.slice(pos, next + 1), pos, next];
              buffer.push(currentToken);
              pos = next;
            }
            break;
          }
        }
        pos++;
        return currentToken;
      }
      function back(token) {
        returned.push(token);
      }
      return {
        back,
        endOfFile,
        nextToken,
        position
      };
    };
    Container$5 = container;
    AtRule$3 = class AtRule2 extends Container$5 {
      constructor(defaults2) {
        super(defaults2);
        this.type = "atrule";
      }
      append(...children) {
        if (!this.proxyOf.nodes) this.nodes = [];
        return super.append(...children);
      }
      prepend(...children) {
        if (!this.proxyOf.nodes) this.nodes = [];
        return super.prepend(...children);
      }
    };
    atRule = AtRule$3;
    AtRule$3.default = AtRule$3;
    Container$5.registerAtRule(AtRule$3);
    Container$4 = container;
    Root$5 = class Root2 extends Container$4 {
      constructor(defaults2) {
        super(defaults2);
        this.type = "root";
        if (!this.nodes) this.nodes = [];
      }
      normalize(child, sample, type) {
        let nodes = super.normalize(child);
        if (sample) {
          if (type === "prepend") {
            if (this.nodes.length > 1) {
              sample.raws.before = this.nodes[1].raws.before;
            } else {
              delete sample.raws.before;
            }
          } else if (this.first !== sample) {
            for (let node2 of nodes) {
              node2.raws.before = sample.raws.before;
            }
          }
        }
        return nodes;
      }
      removeChild(child, ignore) {
        let index22 = this.index(child);
        if (!ignore && index22 === 0 && this.nodes.length > 1) {
          this.nodes[1].raws.before = this.nodes[index22].raws.before;
        }
        return super.removeChild(child);
      }
      toResult(opts = {}) {
        let lazy = new LazyResult$3(new Processor$2(), this, opts);
        return lazy.stringify();
      }
    };
    Root$5.registerLazyResult = (dependant) => {
      LazyResult$3 = dependant;
    };
    Root$5.registerProcessor = (dependant) => {
      Processor$2 = dependant;
    };
    root = Root$5;
    Root$5.default = Root$5;
    Container$4.registerRoot(Root$5);
    list$2 = {
      comma(string) {
        return list$2.split(string, [","], true);
      },
      space(string) {
        let spaces = [" ", "\n", "	"];
        return list$2.split(string, spaces);
      },
      split(string, separators, last) {
        let array = [];
        let current = "";
        let split = false;
        let func = 0;
        let inQuote = false;
        let prevQuote = "";
        let escape = false;
        for (let letter of string) {
          if (escape) {
            escape = false;
          } else if (letter === "\\") {
            escape = true;
          } else if (inQuote) {
            if (letter === prevQuote) {
              inQuote = false;
            }
          } else if (letter === '"' || letter === "'") {
            inQuote = true;
            prevQuote = letter;
          } else if (letter === "(") {
            func += 1;
          } else if (letter === ")") {
            if (func > 0) func -= 1;
          } else if (func === 0) {
            if (separators.includes(letter)) split = true;
          }
          if (split) {
            if (current !== "") array.push(current.trim());
            current = "";
            split = false;
          } else {
            current += letter;
          }
        }
        if (last || current !== "") array.push(current.trim());
        return array;
      }
    };
    list_1 = list$2;
    list$2.default = list$2;
    Container$3 = container;
    list$1 = list_1;
    Rule$3 = class Rule2 extends Container$3 {
      constructor(defaults2) {
        super(defaults2);
        this.type = "rule";
        if (!this.nodes) this.nodes = [];
      }
      get selectors() {
        return list$1.comma(this.selector);
      }
      set selectors(values) {
        let match = this.selector ? this.selector.match(/,\s*/) : null;
        let sep2 = match ? match[0] : "," + this.raw("between", "beforeOpen");
        this.selector = values.join(sep2);
      }
    };
    rule = Rule$3;
    Rule$3.default = Rule$3;
    Container$3.registerRule(Rule$3);
    Declaration$2 = declaration;
    tokenizer22 = tokenize;
    Comment$2 = comment;
    AtRule$2 = atRule;
    Root$4 = root;
    Rule$2 = rule;
    SAFE_COMMENT_NEIGHBOR = {
      empty: true,
      space: true
    };
    Parser$1 = class Parser2 {
      constructor(input2) {
        this.input = input2;
        this.root = new Root$4();
        this.current = this.root;
        this.spaces = "";
        this.semicolon = false;
        this.createTokenizer();
        this.root.source = { input: input2, start: { column: 1, line: 1, offset: 0 } };
      }
      atrule(token) {
        let node2 = new AtRule$2();
        node2.name = token[1].slice(1);
        if (node2.name === "") {
          this.unnamedAtrule(node2, token);
        }
        this.init(node2, token[2]);
        let type;
        let prev;
        let shift;
        let last = false;
        let open = false;
        let params = [];
        let brackets = [];
        while (!this.tokenizer.endOfFile()) {
          token = this.tokenizer.nextToken();
          type = token[0];
          if (type === "(" || type === "[") {
            brackets.push(type === "(" ? ")" : "]");
          } else if (type === "{" && brackets.length > 0) {
            brackets.push("}");
          } else if (type === brackets[brackets.length - 1]) {
            brackets.pop();
          }
          if (brackets.length === 0) {
            if (type === ";") {
              node2.source.end = this.getPosition(token[2]);
              node2.source.end.offset++;
              this.semicolon = true;
              break;
            } else if (type === "{") {
              open = true;
              break;
            } else if (type === "}") {
              if (params.length > 0) {
                shift = params.length - 1;
                prev = params[shift];
                while (prev && prev[0] === "space") {
                  prev = params[--shift];
                }
                if (prev) {
                  node2.source.end = this.getPosition(prev[3] || prev[2]);
                  node2.source.end.offset++;
                }
              }
              this.end(token);
              break;
            } else {
              params.push(token);
            }
          } else {
            params.push(token);
          }
          if (this.tokenizer.endOfFile()) {
            last = true;
            break;
          }
        }
        node2.raws.between = this.spacesAndCommentsFromEnd(params);
        if (params.length) {
          node2.raws.afterName = this.spacesAndCommentsFromStart(params);
          this.raw(node2, "params", params);
          if (last) {
            token = params[params.length - 1];
            node2.source.end = this.getPosition(token[3] || token[2]);
            node2.source.end.offset++;
            this.spaces = node2.raws.between;
            node2.raws.between = "";
          }
        } else {
          node2.raws.afterName = "";
          node2.params = "";
        }
        if (open) {
          node2.nodes = [];
          this.current = node2;
        }
      }
      checkMissedSemicolon(tokens) {
        let colon = this.colon(tokens);
        if (colon === false) return;
        let founded = 0;
        let token;
        for (let j2 = colon - 1; j2 >= 0; j2--) {
          token = tokens[j2];
          if (token[0] !== "space") {
            founded += 1;
            if (founded === 2) break;
          }
        }
        throw this.input.error(
          "Missed semicolon",
          token[0] === "word" ? token[3] + 1 : token[2]
        );
      }
      colon(tokens) {
        let brackets = 0;
        let token, type, prev;
        for (let [i2, element] of tokens.entries()) {
          token = element;
          type = token[0];
          if (type === "(") {
            brackets += 1;
          }
          if (type === ")") {
            brackets -= 1;
          }
          if (brackets === 0 && type === ":") {
            if (!prev) {
              this.doubleColon(token);
            } else if (prev[0] === "word" && prev[1] === "progid") {
              continue;
            } else {
              return i2;
            }
          }
          prev = token;
        }
        return false;
      }
      comment(token) {
        let node2 = new Comment$2();
        this.init(node2, token[2]);
        node2.source.end = this.getPosition(token[3] || token[2]);
        node2.source.end.offset++;
        let text = token[1].slice(2, -2);
        if (/^\s*$/.test(text)) {
          node2.text = "";
          node2.raws.left = text;
          node2.raws.right = "";
        } else {
          let match = text.match(/^(\s*)([^]*\S)(\s*)$/);
          node2.text = match[2];
          node2.raws.left = match[1];
          node2.raws.right = match[3];
        }
      }
      createTokenizer() {
        this.tokenizer = tokenizer22(this.input);
      }
      decl(tokens, customProperty) {
        let node2 = new Declaration$2();
        this.init(node2, tokens[0][2]);
        let last = tokens[tokens.length - 1];
        if (last[0] === ";") {
          this.semicolon = true;
          tokens.pop();
        }
        node2.source.end = this.getPosition(
          last[3] || last[2] || findLastWithPosition(tokens)
        );
        node2.source.end.offset++;
        while (tokens[0][0] !== "word") {
          if (tokens.length === 1) this.unknownWord(tokens);
          node2.raws.before += tokens.shift()[1];
        }
        node2.source.start = this.getPosition(tokens[0][2]);
        node2.prop = "";
        while (tokens.length) {
          let type = tokens[0][0];
          if (type === ":" || type === "space" || type === "comment") {
            break;
          }
          node2.prop += tokens.shift()[1];
        }
        node2.raws.between = "";
        let token;
        while (tokens.length) {
          token = tokens.shift();
          if (token[0] === ":") {
            node2.raws.between += token[1];
            break;
          } else {
            if (token[0] === "word" && /\w/.test(token[1])) {
              this.unknownWord([token]);
            }
            node2.raws.between += token[1];
          }
        }
        if (node2.prop[0] === "_" || node2.prop[0] === "*") {
          node2.raws.before += node2.prop[0];
          node2.prop = node2.prop.slice(1);
        }
        let firstSpaces = [];
        let next;
        while (tokens.length) {
          next = tokens[0][0];
          if (next !== "space" && next !== "comment") break;
          firstSpaces.push(tokens.shift());
        }
        this.precheckMissedSemicolon(tokens);
        for (let i2 = tokens.length - 1; i2 >= 0; i2--) {
          token = tokens[i2];
          if (token[1].toLowerCase() === "!important") {
            node2.important = true;
            let string = this.stringFrom(tokens, i2);
            string = this.spacesFromEnd(tokens) + string;
            if (string !== " !important") node2.raws.important = string;
            break;
          } else if (token[1].toLowerCase() === "important") {
            let cache = tokens.slice(0);
            let str = "";
            for (let j2 = i2; j2 > 0; j2--) {
              let type = cache[j2][0];
              if (str.trim().indexOf("!") === 0 && type !== "space") {
                break;
              }
              str = cache.pop()[1] + str;
            }
            if (str.trim().indexOf("!") === 0) {
              node2.important = true;
              node2.raws.important = str;
              tokens = cache;
            }
          }
          if (token[0] !== "space" && token[0] !== "comment") {
            break;
          }
        }
        let hasWord = tokens.some((i2) => i2[0] !== "space" && i2[0] !== "comment");
        if (hasWord) {
          node2.raws.between += firstSpaces.map((i2) => i2[1]).join("");
          firstSpaces = [];
        }
        this.raw(node2, "value", firstSpaces.concat(tokens), customProperty);
        if (node2.value.includes(":") && !customProperty) {
          this.checkMissedSemicolon(tokens);
        }
      }
      doubleColon(token) {
        throw this.input.error(
          "Double colon",
          { offset: token[2] },
          { offset: token[2] + token[1].length }
        );
      }
      emptyRule(token) {
        let node2 = new Rule$2();
        this.init(node2, token[2]);
        node2.selector = "";
        node2.raws.between = "";
        this.current = node2;
      }
      end(token) {
        if (this.current.nodes && this.current.nodes.length) {
          this.current.raws.semicolon = this.semicolon;
        }
        this.semicolon = false;
        this.current.raws.after = (this.current.raws.after || "") + this.spaces;
        this.spaces = "";
        if (this.current.parent) {
          this.current.source.end = this.getPosition(token[2]);
          this.current.source.end.offset++;
          this.current = this.current.parent;
        } else {
          this.unexpectedClose(token);
        }
      }
      endFile() {
        if (this.current.parent) this.unclosedBlock();
        if (this.current.nodes && this.current.nodes.length) {
          this.current.raws.semicolon = this.semicolon;
        }
        this.current.raws.after = (this.current.raws.after || "") + this.spaces;
        this.root.source.end = this.getPosition(this.tokenizer.position());
      }
      freeSemicolon(token) {
        this.spaces += token[1];
        if (this.current.nodes) {
          let prev = this.current.nodes[this.current.nodes.length - 1];
          if (prev && prev.type === "rule" && !prev.raws.ownSemicolon) {
            prev.raws.ownSemicolon = this.spaces;
            this.spaces = "";
          }
        }
      }
      // Helpers
      getPosition(offset) {
        let pos = this.input.fromOffset(offset);
        return {
          column: pos.col,
          line: pos.line,
          offset
        };
      }
      init(node2, offset) {
        this.current.push(node2);
        node2.source = {
          input: this.input,
          start: this.getPosition(offset)
        };
        node2.raws.before = this.spaces;
        this.spaces = "";
        if (node2.type !== "comment") this.semicolon = false;
      }
      other(start) {
        let end = false;
        let type = null;
        let colon = false;
        let bracket = null;
        let brackets = [];
        let customProperty = start[1].startsWith("--");
        let tokens = [];
        let token = start;
        while (token) {
          type = token[0];
          tokens.push(token);
          if (type === "(" || type === "[") {
            if (!bracket) bracket = token;
            brackets.push(type === "(" ? ")" : "]");
          } else if (customProperty && colon && type === "{") {
            if (!bracket) bracket = token;
            brackets.push("}");
          } else if (brackets.length === 0) {
            if (type === ";") {
              if (colon) {
                this.decl(tokens, customProperty);
                return;
              } else {
                break;
              }
            } else if (type === "{") {
              this.rule(tokens);
              return;
            } else if (type === "}") {
              this.tokenizer.back(tokens.pop());
              end = true;
              break;
            } else if (type === ":") {
              colon = true;
            }
          } else if (type === brackets[brackets.length - 1]) {
            brackets.pop();
            if (brackets.length === 0) bracket = null;
          }
          token = this.tokenizer.nextToken();
        }
        if (this.tokenizer.endOfFile()) end = true;
        if (brackets.length > 0) this.unclosedBracket(bracket);
        if (end && colon) {
          if (!customProperty) {
            while (tokens.length) {
              token = tokens[tokens.length - 1][0];
              if (token !== "space" && token !== "comment") break;
              this.tokenizer.back(tokens.pop());
            }
          }
          this.decl(tokens, customProperty);
        } else {
          this.unknownWord(tokens);
        }
      }
      parse() {
        let token;
        while (!this.tokenizer.endOfFile()) {
          token = this.tokenizer.nextToken();
          switch (token[0]) {
            case "space":
              this.spaces += token[1];
              break;
            case ";":
              this.freeSemicolon(token);
              break;
            case "}":
              this.end(token);
              break;
            case "comment":
              this.comment(token);
              break;
            case "at-word":
              this.atrule(token);
              break;
            case "{":
              this.emptyRule(token);
              break;
            default:
              this.other(token);
              break;
          }
        }
        this.endFile();
      }
      precheckMissedSemicolon() {
      }
      raw(node2, prop2, tokens, customProperty) {
        let token, type;
        let length = tokens.length;
        let value = "";
        let clean = true;
        let next, prev;
        for (let i2 = 0; i2 < length; i2 += 1) {
          token = tokens[i2];
          type = token[0];
          if (type === "space" && i2 === length - 1 && !customProperty) {
            clean = false;
          } else if (type === "comment") {
            prev = tokens[i2 - 1] ? tokens[i2 - 1][0] : "empty";
            next = tokens[i2 + 1] ? tokens[i2 + 1][0] : "empty";
            if (!SAFE_COMMENT_NEIGHBOR[prev] && !SAFE_COMMENT_NEIGHBOR[next]) {
              if (value.slice(-1) === ",") {
                clean = false;
              } else {
                value += token[1];
              }
            } else {
              clean = false;
            }
          } else {
            value += token[1];
          }
        }
        if (!clean) {
          let raw = tokens.reduce((all, i2) => all + i2[1], "");
          node2.raws[prop2] = { raw, value };
        }
        node2[prop2] = value;
      }
      rule(tokens) {
        tokens.pop();
        let node2 = new Rule$2();
        this.init(node2, tokens[0][2]);
        node2.raws.between = this.spacesAndCommentsFromEnd(tokens);
        this.raw(node2, "selector", tokens);
        this.current = node2;
      }
      spacesAndCommentsFromEnd(tokens) {
        let lastTokenType;
        let spaces = "";
        while (tokens.length) {
          lastTokenType = tokens[tokens.length - 1][0];
          if (lastTokenType !== "space" && lastTokenType !== "comment") break;
          spaces = tokens.pop()[1] + spaces;
        }
        return spaces;
      }
      // Errors
      spacesAndCommentsFromStart(tokens) {
        let next;
        let spaces = "";
        while (tokens.length) {
          next = tokens[0][0];
          if (next !== "space" && next !== "comment") break;
          spaces += tokens.shift()[1];
        }
        return spaces;
      }
      spacesFromEnd(tokens) {
        let lastTokenType;
        let spaces = "";
        while (tokens.length) {
          lastTokenType = tokens[tokens.length - 1][0];
          if (lastTokenType !== "space") break;
          spaces = tokens.pop()[1] + spaces;
        }
        return spaces;
      }
      stringFrom(tokens, from) {
        let result2 = "";
        for (let i2 = from; i2 < tokens.length; i2++) {
          result2 += tokens[i2][1];
        }
        tokens.splice(from, tokens.length - from);
        return result2;
      }
      unclosedBlock() {
        let pos = this.current.source.start;
        throw this.input.error("Unclosed block", pos.line, pos.column);
      }
      unclosedBracket(bracket) {
        throw this.input.error(
          "Unclosed bracket",
          { offset: bracket[2] },
          { offset: bracket[2] + 1 }
        );
      }
      unexpectedClose(token) {
        throw this.input.error(
          "Unexpected }",
          { offset: token[2] },
          { offset: token[2] + 1 }
        );
      }
      unknownWord(tokens) {
        throw this.input.error(
          "Unknown word",
          { offset: tokens[0][2] },
          { offset: tokens[0][2] + tokens[0][1].length }
        );
      }
      unnamedAtrule(node2, token) {
        throw this.input.error(
          "At-rule without name",
          { offset: token[2] },
          { offset: token[2] + token[1].length }
        );
      }
    };
    parser = Parser$1;
    Container$2 = container;
    Parser22 = parser;
    Input$2 = input;
    parse_1 = parse$3;
    parse$3.default = parse$3;
    Container$2.registerParse(parse$3);
    ({ isClean, my } = symbols);
    MapGenerator$1 = mapGenerator;
    stringify$2 = stringify_1;
    Container$1 = container;
    Document$2 = document$1;
    warnOnce$1 = warnOnce$2;
    Result$2 = result;
    parse$2 = parse_1;
    Root$3 = root;
    TYPE_TO_CLASS_NAME = {
      atrule: "AtRule",
      comment: "Comment",
      decl: "Declaration",
      document: "Document",
      root: "Root",
      rule: "Rule"
    };
    PLUGIN_PROPS = {
      AtRule: true,
      AtRuleExit: true,
      Comment: true,
      CommentExit: true,
      Declaration: true,
      DeclarationExit: true,
      Document: true,
      DocumentExit: true,
      Once: true,
      OnceExit: true,
      postcssPlugin: true,
      prepare: true,
      Root: true,
      RootExit: true,
      Rule: true,
      RuleExit: true
    };
    NOT_VISITORS = {
      Once: true,
      postcssPlugin: true,
      prepare: true
    };
    CHILDREN = 0;
    postcss$2 = {};
    LazyResult$2 = class LazyResult2 {
      constructor(processor2, css, opts) {
        this.stringified = false;
        this.processed = false;
        let root2;
        if (typeof css === "object" && css !== null && (css.type === "root" || css.type === "document")) {
          root2 = cleanMarks(css);
        } else if (css instanceof LazyResult2 || css instanceof Result$2) {
          root2 = cleanMarks(css.root);
          if (css.map) {
            if (typeof opts.map === "undefined") opts.map = {};
            if (!opts.map.inline) opts.map.inline = false;
            opts.map.prev = css.map;
          }
        } else {
          let parser2 = parse$2;
          if (opts.syntax) parser2 = opts.syntax.parse;
          if (opts.parser) parser2 = opts.parser;
          if (parser2.parse) parser2 = parser2.parse;
          try {
            root2 = parser2(css, opts);
          } catch (error) {
            this.processed = true;
            this.error = error;
          }
          if (root2 && !root2[my]) {
            Container$1.rebuild(root2);
          }
        }
        this.result = new Result$2(processor2, root2, opts);
        this.helpers = { ...postcss$2, postcss: postcss$2, result: this.result };
        this.plugins = this.processor.plugins.map((plugin22) => {
          if (typeof plugin22 === "object" && plugin22.prepare) {
            return { ...plugin22, ...plugin22.prepare(this.result) };
          } else {
            return plugin22;
          }
        });
      }
      async() {
        if (this.error) return Promise.reject(this.error);
        if (this.processed) return Promise.resolve(this.result);
        if (!this.processing) {
          this.processing = this.runAsync();
        }
        return this.processing;
      }
      catch(onRejected) {
        return this.async().catch(onRejected);
      }
      finally(onFinally) {
        return this.async().then(onFinally, onFinally);
      }
      getAsyncError() {
        throw new Error("Use process(css).then(cb) to work with async plugins");
      }
      handleError(error, node2) {
        let plugin22 = this.result.lastPlugin;
        try {
          if (node2) node2.addToError(error);
          this.error = error;
          if (error.name === "CssSyntaxError" && !error.plugin) {
            error.plugin = plugin22.postcssPlugin;
            error.setMessage();
          } else if (plugin22.postcssVersion) {
            if (true) {
              let pluginName = plugin22.postcssPlugin;
              let pluginVer = plugin22.postcssVersion;
              let runtimeVer = this.result.processor.version;
              let a2 = pluginVer.split(".");
              let b3 = runtimeVer.split(".");
              if (a2[0] !== b3[0] || parseInt(a2[1]) > parseInt(b3[1])) {
                console.error(
                  "Unknown error from PostCSS plugin. Your current PostCSS version is " + runtimeVer + ", but " + pluginName + " uses " + pluginVer + ". Perhaps this is the source of the error below."
                );
              }
            }
          }
        } catch (err2) {
          if (console && console.error) console.error(err2);
        }
        return error;
      }
      prepareVisitors() {
        this.listeners = {};
        let add = (plugin22, type, cb) => {
          if (!this.listeners[type]) this.listeners[type] = [];
          this.listeners[type].push([plugin22, cb]);
        };
        for (let plugin22 of this.plugins) {
          if (typeof plugin22 === "object") {
            for (let event in plugin22) {
              if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) {
                throw new Error(
                  `Unknown event ${event} in ${plugin22.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
                );
              }
              if (!NOT_VISITORS[event]) {
                if (typeof plugin22[event] === "object") {
                  for (let filter in plugin22[event]) {
                    if (filter === "*") {
                      add(plugin22, event, plugin22[event][filter]);
                    } else {
                      add(
                        plugin22,
                        event + "-" + filter.toLowerCase(),
                        plugin22[event][filter]
                      );
                    }
                  }
                } else if (typeof plugin22[event] === "function") {
                  add(plugin22, event, plugin22[event]);
                }
              }
            }
          }
        }
        this.hasListener = Object.keys(this.listeners).length > 0;
      }
      async runAsync() {
        this.plugin = 0;
        for (let i2 = 0; i2 < this.plugins.length; i2++) {
          let plugin22 = this.plugins[i2];
          let promise = this.runOnRoot(plugin22);
          if (isPromise(promise)) {
            try {
              await promise;
            } catch (error) {
              throw this.handleError(error);
            }
          }
        }
        this.prepareVisitors();
        if (this.hasListener) {
          let root2 = this.result.root;
          while (!root2[isClean]) {
            root2[isClean] = true;
            let stack = [toStack(root2)];
            while (stack.length > 0) {
              let promise = this.visitTick(stack);
              if (isPromise(promise)) {
                try {
                  await promise;
                } catch (e2) {
                  let node2 = stack[stack.length - 1].node;
                  throw this.handleError(e2, node2);
                }
              }
            }
          }
          if (this.listeners.OnceExit) {
            for (let [plugin22, visitor] of this.listeners.OnceExit) {
              this.result.lastPlugin = plugin22;
              try {
                if (root2.type === "document") {
                  let roots = root2.nodes.map(
                    (subRoot) => visitor(subRoot, this.helpers)
                  );
                  await Promise.all(roots);
                } else {
                  await visitor(root2, this.helpers);
                }
              } catch (e2) {
                throw this.handleError(e2);
              }
            }
          }
        }
        this.processed = true;
        return this.stringify();
      }
      runOnRoot(plugin22) {
        this.result.lastPlugin = plugin22;
        try {
          if (typeof plugin22 === "object" && plugin22.Once) {
            if (this.result.root.type === "document") {
              let roots = this.result.root.nodes.map(
                (root2) => plugin22.Once(root2, this.helpers)
              );
              if (isPromise(roots[0])) {
                return Promise.all(roots);
              }
              return roots;
            }
            return plugin22.Once(this.result.root, this.helpers);
          } else if (typeof plugin22 === "function") {
            return plugin22(this.result.root, this.result);
          }
        } catch (error) {
          throw this.handleError(error);
        }
      }
      stringify() {
        if (this.error) throw this.error;
        if (this.stringified) return this.result;
        this.stringified = true;
        this.sync();
        let opts = this.result.opts;
        let str = stringify$2;
        if (opts.syntax) str = opts.syntax.stringify;
        if (opts.stringifier) str = opts.stringifier;
        if (str.stringify) str = str.stringify;
        let map = new MapGenerator$1(str, this.result.root, this.result.opts);
        let data = map.generate();
        this.result.css = data[0];
        this.result.map = data[1];
        return this.result;
      }
      sync() {
        if (this.error) throw this.error;
        if (this.processed) return this.result;
        this.processed = true;
        if (this.processing) {
          throw this.getAsyncError();
        }
        for (let plugin22 of this.plugins) {
          let promise = this.runOnRoot(plugin22);
          if (isPromise(promise)) {
            throw this.getAsyncError();
          }
        }
        this.prepareVisitors();
        if (this.hasListener) {
          let root2 = this.result.root;
          while (!root2[isClean]) {
            root2[isClean] = true;
            this.walkSync(root2);
          }
          if (this.listeners.OnceExit) {
            if (root2.type === "document") {
              for (let subRoot of root2.nodes) {
                this.visitSync(this.listeners.OnceExit, subRoot);
              }
            } else {
              this.visitSync(this.listeners.OnceExit, root2);
            }
          }
        }
        return this.result;
      }
      then(onFulfilled, onRejected) {
        if (true) {
          if (!("from" in this.opts)) {
            warnOnce$1(
              "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
            );
          }
        }
        return this.async().then(onFulfilled, onRejected);
      }
      toString() {
        return this.css;
      }
      visitSync(visitors, node2) {
        for (let [plugin22, visitor] of visitors) {
          this.result.lastPlugin = plugin22;
          let promise;
          try {
            promise = visitor(node2, this.helpers);
          } catch (e2) {
            throw this.handleError(e2, node2.proxyOf);
          }
          if (node2.type !== "root" && node2.type !== "document" && !node2.parent) {
            return true;
          }
          if (isPromise(promise)) {
            throw this.getAsyncError();
          }
        }
      }
      visitTick(stack) {
        let visit2 = stack[stack.length - 1];
        let { node: node2, visitors } = visit2;
        if (node2.type !== "root" && node2.type !== "document" && !node2.parent) {
          stack.pop();
          return;
        }
        if (visitors.length > 0 && visit2.visitorIndex < visitors.length) {
          let [plugin22, visitor] = visitors[visit2.visitorIndex];
          visit2.visitorIndex += 1;
          if (visit2.visitorIndex === visitors.length) {
            visit2.visitors = [];
            visit2.visitorIndex = 0;
          }
          this.result.lastPlugin = plugin22;
          try {
            return visitor(node2.toProxy(), this.helpers);
          } catch (e2) {
            throw this.handleError(e2, node2);
          }
        }
        if (visit2.iterator !== 0) {
          let iterator = visit2.iterator;
          let child;
          while (child = node2.nodes[node2.indexes[iterator]]) {
            node2.indexes[iterator] += 1;
            if (!child[isClean]) {
              child[isClean] = true;
              stack.push(toStack(child));
              return;
            }
          }
          visit2.iterator = 0;
          delete node2.indexes[iterator];
        }
        let events = visit2.events;
        while (visit2.eventIndex < events.length) {
          let event = events[visit2.eventIndex];
          visit2.eventIndex += 1;
          if (event === CHILDREN) {
            if (node2.nodes && node2.nodes.length) {
              node2[isClean] = true;
              visit2.iterator = node2.getIterator();
            }
            return;
          } else if (this.listeners[event]) {
            visit2.visitors = this.listeners[event];
            return;
          }
        }
        stack.pop();
      }
      walkSync(node2) {
        node2[isClean] = true;
        let events = getEvents(node2);
        for (let event of events) {
          if (event === CHILDREN) {
            if (node2.nodes) {
              node2.each((child) => {
                if (!child[isClean]) this.walkSync(child);
              });
            }
          } else {
            let visitors = this.listeners[event];
            if (visitors) {
              if (this.visitSync(visitors, node2.toProxy())) return;
            }
          }
        }
      }
      warnings() {
        return this.sync().warnings();
      }
      get content() {
        return this.stringify().content;
      }
      get css() {
        return this.stringify().css;
      }
      get map() {
        return this.stringify().map;
      }
      get messages() {
        return this.sync().messages;
      }
      get opts() {
        return this.result.opts;
      }
      get processor() {
        return this.result.processor;
      }
      get root() {
        return this.sync().root;
      }
      get [Symbol.toStringTag]() {
        return "LazyResult";
      }
    };
    LazyResult$2.registerPostcss = (dependant) => {
      postcss$2 = dependant;
    };
    lazyResult = LazyResult$2;
    LazyResult$2.default = LazyResult$2;
    Root$3.registerLazyResult(LazyResult$2);
    Document$2.registerLazyResult(LazyResult$2);
    MapGenerator22 = mapGenerator;
    stringify$1 = stringify_1;
    warnOnce22 = warnOnce$2;
    parse$1 = parse_1;
    Result$1 = result;
    NoWorkResult$1 = class NoWorkResult2 {
      constructor(processor2, css, opts) {
        css = css.toString();
        this.stringified = false;
        this._processor = processor2;
        this._css = css;
        this._opts = opts;
        this._map = void 0;
        let root2;
        let str = stringify$1;
        this.result = new Result$1(this._processor, root2, this._opts);
        this.result.css = css;
        let self2 = this;
        Object.defineProperty(this.result, "root", {
          get() {
            return self2.root;
          }
        });
        let map = new MapGenerator22(str, root2, this._opts, css);
        if (map.isMap()) {
          let [generatedCSS, generatedMap] = map.generate();
          if (generatedCSS) {
            this.result.css = generatedCSS;
          }
          if (generatedMap) {
            this.result.map = generatedMap;
          }
        } else {
          map.clearAnnotation();
          this.result.css = map.css;
        }
      }
      async() {
        if (this.error) return Promise.reject(this.error);
        return Promise.resolve(this.result);
      }
      catch(onRejected) {
        return this.async().catch(onRejected);
      }
      finally(onFinally) {
        return this.async().then(onFinally, onFinally);
      }
      sync() {
        if (this.error) throw this.error;
        return this.result;
      }
      then(onFulfilled, onRejected) {
        if (true) {
          if (!("from" in this._opts)) {
            warnOnce22(
              "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
            );
          }
        }
        return this.async().then(onFulfilled, onRejected);
      }
      toString() {
        return this._css;
      }
      warnings() {
        return [];
      }
      get content() {
        return this.result.css;
      }
      get css() {
        return this.result.css;
      }
      get map() {
        return this.result.map;
      }
      get messages() {
        return [];
      }
      get opts() {
        return this.result.opts;
      }
      get processor() {
        return this.result.processor;
      }
      get root() {
        if (this._root) {
          return this._root;
        }
        let root2;
        let parser2 = parse$1;
        try {
          root2 = parser2(this._css, this._opts);
        } catch (error) {
          this.error = error;
        }
        if (this.error) {
          throw this.error;
        } else {
          this._root = root2;
          return root2;
        }
      }
      get [Symbol.toStringTag]() {
        return "NoWorkResult";
      }
    };
    noWorkResult = NoWorkResult$1;
    NoWorkResult$1.default = NoWorkResult$1;
    NoWorkResult22 = noWorkResult;
    LazyResult$1 = lazyResult;
    Document$1 = document$1;
    Root$2 = root;
    Processor$1 = class Processor2 {
      constructor(plugins = []) {
        this.version = "8.4.38";
        this.plugins = this.normalize(plugins);
      }
      normalize(plugins) {
        let normalized = [];
        for (let i2 of plugins) {
          if (i2.postcss === true) {
            i2 = i2();
          } else if (i2.postcss) {
            i2 = i2.postcss;
          }
          if (typeof i2 === "object" && Array.isArray(i2.plugins)) {
            normalized = normalized.concat(i2.plugins);
          } else if (typeof i2 === "object" && i2.postcssPlugin) {
            normalized.push(i2);
          } else if (typeof i2 === "function") {
            normalized.push(i2);
          } else if (typeof i2 === "object" && (i2.parse || i2.stringify)) {
            if (true) {
              throw new Error(
                "PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation."
              );
            }
          } else {
            throw new Error(i2 + " is not a PostCSS plugin");
          }
        }
        return normalized;
      }
      process(css, opts = {}) {
        if (!this.plugins.length && !opts.parser && !opts.stringifier && !opts.syntax) {
          return new NoWorkResult22(this, css, opts);
        } else {
          return new LazyResult$1(this, css, opts);
        }
      }
      use(plugin22) {
        this.plugins = this.plugins.concat(this.normalize([plugin22]));
        return this;
      }
    };
    processor = Processor$1;
    Processor$1.default = Processor$1;
    Root$2.registerProcessor(Processor$1);
    Document$1.registerProcessor(Processor$1);
    Declaration$1 = declaration;
    PreviousMap22 = previousMap;
    Comment$1 = comment;
    AtRule$1 = atRule;
    Input$1 = input;
    Root$1 = root;
    Rule$1 = rule;
    fromJSON_1 = fromJSON$1;
    fromJSON$1.default = fromJSON$1;
    CssSyntaxError22 = cssSyntaxError;
    Declaration22 = declaration;
    LazyResult22 = lazyResult;
    Container22 = container;
    Processor22 = processor;
    stringify2 = stringify_1;
    fromJSON = fromJSON_1;
    Document222 = document$1;
    Warning22 = warning;
    Comment22 = comment;
    AtRule22 = atRule;
    Result22 = result;
    Input22 = input;
    parse = parse_1;
    list = list_1;
    Rule22 = rule;
    Root22 = root;
    Node22 = node;
    postcss.plugin = function plugin2(name, initializer) {
      let warningPrinted = false;
      function creator(...args) {
        if (console && console.warn && !warningPrinted) {
          warningPrinted = true;
          console.warn(
            name + ": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration"
          );
          if (process.env.LANG && process.env.LANG.startsWith("cn")) {
            console.warn(
              name + ": \u91CC\u9762 postcss.plugin \u88AB\u5F03\u7528. \u8FC1\u79FB\u6307\u5357:\nhttps://www.w3ctech.com/topic/2226"
            );
          }
        }
        let transformer = initializer(...args);
        transformer.postcssPlugin = name;
        transformer.postcssVersion = new Processor22().version;
        return transformer;
      }
      let cache;
      Object.defineProperty(creator, "postcss", {
        get() {
          if (!cache) cache = creator();
          return cache;
        }
      });
      creator.process = function(css, processOpts, pluginOpts) {
        return postcss([creator(pluginOpts)]).process(css, processOpts);
      };
      return creator;
    };
    postcss.stringify = stringify2;
    postcss.parse = parse;
    postcss.fromJSON = fromJSON;
    postcss.list = list;
    postcss.comment = (defaults2) => new Comment22(defaults2);
    postcss.atRule = (defaults2) => new AtRule22(defaults2);
    postcss.decl = (defaults2) => new Declaration22(defaults2);
    postcss.rule = (defaults2) => new Rule22(defaults2);
    postcss.root = (defaults2) => new Root22(defaults2);
    postcss.document = (defaults2) => new Document222(defaults2);
    postcss.CssSyntaxError = CssSyntaxError22;
    postcss.Declaration = Declaration22;
    postcss.Container = Container22;
    postcss.Processor = Processor22;
    postcss.Document = Document222;
    postcss.Comment = Comment22;
    postcss.Warning = Warning22;
    postcss.AtRule = AtRule22;
    postcss.Result = Result22;
    postcss.Input = Input22;
    postcss.Rule = Rule22;
    postcss.Root = Root22;
    postcss.Node = Node22;
    LazyResult22.registerPostcss(postcss);
    postcss_1 = postcss;
    postcss.default = postcss;
    postcss$1 = /* @__PURE__ */ getDefaultExportFromCjs(postcss_1);
    postcss$1.stringify;
    postcss$1.fromJSON;
    postcss$1.plugin;
    postcss$1.parse;
    postcss$1.list;
    postcss$1.document;
    postcss$1.comment;
    postcss$1.atRule;
    postcss$1.rule;
    postcss$1.decl;
    postcss$1.root;
    postcss$1.CssSyntaxError;
    postcss$1.Declaration;
    postcss$1.Container;
    postcss$1.Processor;
    postcss$1.Document;
    postcss$1.Comment;
    postcss$1.Warning;
    postcss$1.AtRule;
    postcss$1.Result;
    postcss$1.Input;
    postcss$1.Rule;
    postcss$1.Root;
    postcss$1.Node;
    BaseRRNode = class _BaseRRNode {
      constructor(..._args) {
        __publicField2(this, "parentElement", null);
        __publicField2(this, "parentNode", null);
        __publicField2(this, "ownerDocument");
        __publicField2(this, "firstChild", null);
        __publicField2(this, "lastChild", null);
        __publicField2(this, "previousSibling", null);
        __publicField2(this, "nextSibling", null);
        __publicField2(this, "ELEMENT_NODE", NodeType$2.ELEMENT_NODE);
        __publicField2(this, "TEXT_NODE", NodeType$2.TEXT_NODE);
        __publicField2(this, "nodeType");
        __publicField2(this, "nodeName");
        __publicField2(this, "RRNodeType");
      }
      get childNodes() {
        const childNodes2 = [];
        let childIterator = this.firstChild;
        while (childIterator) {
          childNodes2.push(childIterator);
          childIterator = childIterator.nextSibling;
        }
        return childNodes2;
      }
      contains(node2) {
        if (!(node2 instanceof _BaseRRNode))
          return false;
        else if (node2.ownerDocument !== this.ownerDocument)
          return false;
        else if (node2 === this)
          return true;
        while (node2.parentNode) {
          if (node2.parentNode === this)
            return true;
          node2 = node2.parentNode;
        }
        return false;
      }
      appendChild(_newChild) {
        throw new Error(`RRDomException: Failed to execute 'appendChild' on 'RRNode': This RRNode type does not support this method.`);
      }
      insertBefore(_newChild, _refChild) {
        throw new Error(`RRDomException: Failed to execute 'insertBefore' on 'RRNode': This RRNode type does not support this method.`);
      }
      removeChild(_node) {
        throw new Error(`RRDomException: Failed to execute 'removeChild' on 'RRNode': This RRNode type does not support this method.`);
      }
      toString() {
        return "RRNode";
      }
    };
    (function(NodeType2) {
      NodeType2[NodeType2["PLACEHOLDER"] = 0] = "PLACEHOLDER";
      NodeType2[NodeType2["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
      NodeType2[NodeType2["ATTRIBUTE_NODE"] = 2] = "ATTRIBUTE_NODE";
      NodeType2[NodeType2["TEXT_NODE"] = 3] = "TEXT_NODE";
      NodeType2[NodeType2["CDATA_SECTION_NODE"] = 4] = "CDATA_SECTION_NODE";
      NodeType2[NodeType2["ENTITY_REFERENCE_NODE"] = 5] = "ENTITY_REFERENCE_NODE";
      NodeType2[NodeType2["ENTITY_NODE"] = 6] = "ENTITY_NODE";
      NodeType2[NodeType2["PROCESSING_INSTRUCTION_NODE"] = 7] = "PROCESSING_INSTRUCTION_NODE";
      NodeType2[NodeType2["COMMENT_NODE"] = 8] = "COMMENT_NODE";
      NodeType2[NodeType2["DOCUMENT_NODE"] = 9] = "DOCUMENT_NODE";
      NodeType2[NodeType2["DOCUMENT_TYPE_NODE"] = 10] = "DOCUMENT_TYPE_NODE";
      NodeType2[NodeType2["DOCUMENT_FRAGMENT_NODE"] = 11] = "DOCUMENT_FRAGMENT_NODE";
    })(NodeType$2 || (NodeType$2 = {}));
    testableAccessors = {
      Node: ["childNodes", "parentNode", "parentElement", "textContent"],
      ShadowRoot: ["host", "styleSheets"],
      Element: ["shadowRoot", "querySelector", "querySelectorAll"],
      MutationObserver: []
    };
    testableMethods = {
      Node: ["contains", "getRootNode"],
      ShadowRoot: ["getSelection"],
      Element: [],
      MutationObserver: ["constructor"]
    };
    untaintedBasePrototype = {};
    isAngularZonePresent = () => {
      return !!globalThis.Zone;
    };
    untaintedAccessorCache = {};
    untaintedMethodCache = {};
    index2 = {
      childNodes,
      parentNode,
      parentElement,
      textContent,
      contains,
      getRootNode,
      host,
      styleSheets,
      shadowRoot,
      querySelector,
      querySelectorAll,
      mutationObserver: mutationObserverCtor,
      patch
    };
    DEPARTED_MIRROR_ACCESS_WARNING = "Please stop import mirror directly. Instead of that,\r\nnow you can use replayer.getMirror() to access the mirror instance of a replayer,\r\nor you can use record.mirror to access the mirror instance during recording.";
    _mirror = {
      map: {},
      getId() {
        console.error(DEPARTED_MIRROR_ACCESS_WARNING);
        return -1;
      },
      getNode() {
        console.error(DEPARTED_MIRROR_ACCESS_WARNING);
        return null;
      },
      removeNodeFromMap() {
        console.error(DEPARTED_MIRROR_ACCESS_WARNING);
      },
      has() {
        console.error(DEPARTED_MIRROR_ACCESS_WARNING);
        return false;
      },
      reset() {
        console.error(DEPARTED_MIRROR_ACCESS_WARNING);
      }
    };
    if (typeof window !== "undefined" && window.Proxy && window.Reflect) {
      _mirror = new Proxy(_mirror, {
        get(target, prop2, receiver) {
          if (prop2 === "map") {
            console.error(DEPARTED_MIRROR_ACCESS_WARNING);
          }
          return Reflect.get(target, prop2, receiver);
        }
      });
    }
    nowTimestamp = Date.now;
    if (!/* @__PURE__ */ /[1-9][0-9]{12}/.test(Date.now().toString())) {
      nowTimestamp = () => (/* @__PURE__ */ new Date()).getTime();
    }
    StyleSheetMirror = class {
      constructor() {
        __publicField(this, "id", 1);
        __publicField(this, "styleIDMap", /* @__PURE__ */ new WeakMap());
        __publicField(this, "idStyleMap", /* @__PURE__ */ new Map());
      }
      getId(stylesheet) {
        return this.styleIDMap.get(stylesheet) ?? -1;
      }
      has(stylesheet) {
        return this.styleIDMap.has(stylesheet);
      }
      /**
       * @returns If the stylesheet is in the mirror, returns the id of the stylesheet. If not, return the new assigned id.
       */
      add(stylesheet, id2) {
        if (this.has(stylesheet)) return this.getId(stylesheet);
        let newId;
        if (id2 === void 0) {
          newId = this.id++;
        } else newId = id2;
        this.styleIDMap.set(stylesheet, newId);
        this.idStyleMap.set(newId, stylesheet);
        return newId;
      }
      getStyle(id2) {
        return this.idStyleMap.get(id2) || null;
      }
      reset() {
        this.styleIDMap = /* @__PURE__ */ new WeakMap();
        this.idStyleMap = /* @__PURE__ */ new Map();
        this.id = 1;
      }
      generateId() {
        return this.id++;
      }
    };
    EventType = /* @__PURE__ */ ((EventType2) => {
      EventType2[EventType2["DomContentLoaded"] = 0] = "DomContentLoaded";
      EventType2[EventType2["Load"] = 1] = "Load";
      EventType2[EventType2["FullSnapshot"] = 2] = "FullSnapshot";
      EventType2[EventType2["IncrementalSnapshot"] = 3] = "IncrementalSnapshot";
      EventType2[EventType2["Meta"] = 4] = "Meta";
      EventType2[EventType2["Custom"] = 5] = "Custom";
      EventType2[EventType2["Plugin"] = 6] = "Plugin";
      return EventType2;
    })(EventType || {});
    IncrementalSource = /* @__PURE__ */ ((IncrementalSource2) => {
      IncrementalSource2[IncrementalSource2["Mutation"] = 0] = "Mutation";
      IncrementalSource2[IncrementalSource2["MouseMove"] = 1] = "MouseMove";
      IncrementalSource2[IncrementalSource2["MouseInteraction"] = 2] = "MouseInteraction";
      IncrementalSource2[IncrementalSource2["Scroll"] = 3] = "Scroll";
      IncrementalSource2[IncrementalSource2["ViewportResize"] = 4] = "ViewportResize";
      IncrementalSource2[IncrementalSource2["Input"] = 5] = "Input";
      IncrementalSource2[IncrementalSource2["TouchMove"] = 6] = "TouchMove";
      IncrementalSource2[IncrementalSource2["MediaInteraction"] = 7] = "MediaInteraction";
      IncrementalSource2[IncrementalSource2["StyleSheetRule"] = 8] = "StyleSheetRule";
      IncrementalSource2[IncrementalSource2["CanvasMutation"] = 9] = "CanvasMutation";
      IncrementalSource2[IncrementalSource2["Font"] = 10] = "Font";
      IncrementalSource2[IncrementalSource2["Log"] = 11] = "Log";
      IncrementalSource2[IncrementalSource2["Drag"] = 12] = "Drag";
      IncrementalSource2[IncrementalSource2["StyleDeclaration"] = 13] = "StyleDeclaration";
      IncrementalSource2[IncrementalSource2["Selection"] = 14] = "Selection";
      IncrementalSource2[IncrementalSource2["AdoptedStyleSheet"] = 15] = "AdoptedStyleSheet";
      IncrementalSource2[IncrementalSource2["CustomElement"] = 16] = "CustomElement";
      return IncrementalSource2;
    })(IncrementalSource || {});
    MouseInteractions = /* @__PURE__ */ ((MouseInteractions2) => {
      MouseInteractions2[MouseInteractions2["MouseUp"] = 0] = "MouseUp";
      MouseInteractions2[MouseInteractions2["MouseDown"] = 1] = "MouseDown";
      MouseInteractions2[MouseInteractions2["Click"] = 2] = "Click";
      MouseInteractions2[MouseInteractions2["ContextMenu"] = 3] = "ContextMenu";
      MouseInteractions2[MouseInteractions2["DblClick"] = 4] = "DblClick";
      MouseInteractions2[MouseInteractions2["Focus"] = 5] = "Focus";
      MouseInteractions2[MouseInteractions2["Blur"] = 6] = "Blur";
      MouseInteractions2[MouseInteractions2["TouchStart"] = 7] = "TouchStart";
      MouseInteractions2[MouseInteractions2["TouchMove_Departed"] = 8] = "TouchMove_Departed";
      MouseInteractions2[MouseInteractions2["TouchEnd"] = 9] = "TouchEnd";
      MouseInteractions2[MouseInteractions2["TouchCancel"] = 10] = "TouchCancel";
      return MouseInteractions2;
    })(MouseInteractions || {});
    PointerTypes = /* @__PURE__ */ ((PointerTypes2) => {
      PointerTypes2[PointerTypes2["Mouse"] = 0] = "Mouse";
      PointerTypes2[PointerTypes2["Pen"] = 1] = "Pen";
      PointerTypes2[PointerTypes2["Touch"] = 2] = "Touch";
      return PointerTypes2;
    })(PointerTypes || {});
    CanvasContext = /* @__PURE__ */ ((CanvasContext2) => {
      CanvasContext2[CanvasContext2["2D"] = 0] = "2D";
      CanvasContext2[CanvasContext2["WebGL"] = 1] = "WebGL";
      CanvasContext2[CanvasContext2["WebGL2"] = 2] = "WebGL2";
      return CanvasContext2;
    })(CanvasContext || {});
    MediaInteractions = /* @__PURE__ */ ((MediaInteractions2) => {
      MediaInteractions2[MediaInteractions2["Play"] = 0] = "Play";
      MediaInteractions2[MediaInteractions2["Pause"] = 1] = "Pause";
      MediaInteractions2[MediaInteractions2["Seeked"] = 2] = "Seeked";
      MediaInteractions2[MediaInteractions2["VolumeChange"] = 3] = "VolumeChange";
      MediaInteractions2[MediaInteractions2["RateChange"] = 4] = "RateChange";
      return MediaInteractions2;
    })(MediaInteractions || {});
    NodeType = /* @__PURE__ */ ((NodeType2) => {
      NodeType2[NodeType2["Document"] = 0] = "Document";
      NodeType2[NodeType2["DocumentType"] = 1] = "DocumentType";
      NodeType2[NodeType2["Element"] = 2] = "Element";
      NodeType2[NodeType2["Text"] = 3] = "Text";
      NodeType2[NodeType2["CDATA"] = 4] = "CDATA";
      NodeType2[NodeType2["Comment"] = 5] = "Comment";
      return NodeType2;
    })(NodeType || {});
    DoubleLinkedList = class {
      constructor() {
        __publicField(this, "length", 0);
        __publicField(this, "head", null);
        __publicField(this, "tail", null);
      }
      get(position) {
        if (position >= this.length) {
          throw new Error("Position outside of list range");
        }
        let current = this.head;
        for (let index22 = 0; index22 < position; index22++) {
          current = (current == null ? void 0 : current.next) || null;
        }
        return current;
      }
      addNode(n22) {
        const node2 = {
          value: n22,
          previous: null,
          next: null
        };
        n22.__ln = node2;
        if (n22.previousSibling && isNodeInLinkedList(n22.previousSibling)) {
          const current = n22.previousSibling.__ln.next;
          node2.next = current;
          node2.previous = n22.previousSibling.__ln;
          n22.previousSibling.__ln.next = node2;
          if (current) {
            current.previous = node2;
          }
        } else if (n22.nextSibling && isNodeInLinkedList(n22.nextSibling) && n22.nextSibling.__ln.previous) {
          const current = n22.nextSibling.__ln.previous;
          node2.previous = current;
          node2.next = n22.nextSibling.__ln;
          n22.nextSibling.__ln.previous = node2;
          if (current) {
            current.next = node2;
          }
        } else {
          if (this.head) {
            this.head.previous = node2;
          }
          node2.next = this.head;
          this.head = node2;
        }
        if (node2.next === null) {
          this.tail = node2;
        }
        this.length++;
      }
      removeNode(n22) {
        const current = n22.__ln;
        if (!this.head) {
          return;
        }
        if (!current.previous) {
          this.head = current.next;
          if (this.head) {
            this.head.previous = null;
          } else {
            this.tail = null;
          }
        } else {
          current.previous.next = current.next;
          if (current.next) {
            current.next.previous = current.previous;
          } else {
            this.tail = current.previous;
          }
        }
        if (n22.__ln) {
          delete n22.__ln;
        }
        this.length--;
      }
    };
    moveKey = (id2, parentId) => `${id2}@${parentId}`;
    MutationBuffer = class {
      constructor() {
        __publicField(this, "frozen", false);
        __publicField(this, "locked", false);
        __publicField(this, "texts", []);
        __publicField(this, "attributes", []);
        __publicField(this, "attributeMap", /* @__PURE__ */ new WeakMap());
        __publicField(this, "removes", []);
        __publicField(this, "mapRemoves", []);
        __publicField(this, "movedMap", {});
        __publicField(this, "addedSet", /* @__PURE__ */ new Set());
        __publicField(this, "movedSet", /* @__PURE__ */ new Set());
        __publicField(this, "droppedSet", /* @__PURE__ */ new Set());
        __publicField(this, "removesSubTreeCache", /* @__PURE__ */ new Set());
        __publicField(this, "mutationCb");
        __publicField(this, "blockClass");
        __publicField(this, "blockSelector");
        __publicField(this, "maskTextClass");
        __publicField(this, "maskTextSelector");
        __publicField(this, "inlineStylesheet");
        __publicField(this, "maskInputOptions");
        __publicField(this, "maskTextFn");
        __publicField(this, "maskInputFn");
        __publicField(this, "keepIframeSrcFn");
        __publicField(this, "recordCanvas");
        __publicField(this, "inlineImages");
        __publicField(this, "slimDOMOptions");
        __publicField(this, "dataURLOptions");
        __publicField(this, "doc");
        __publicField(this, "mirror");
        __publicField(this, "iframeManager");
        __publicField(this, "stylesheetManager");
        __publicField(this, "shadowDomManager");
        __publicField(this, "canvasManager");
        __publicField(this, "processedNodeManager");
        __publicField(this, "unattachedDoc");
        __publicField(this, "processMutations", (mutations) => {
          mutations.forEach(this.processMutation);
          this.emit();
        });
        __publicField(this, "emit", () => {
          if (this.frozen || this.locked) {
            return;
          }
          const adds = [];
          const addedIds = /* @__PURE__ */ new Set();
          const addList = new DoubleLinkedList();
          const getNextId = (n22) => {
            let ns = n22;
            let nextId = IGNORED_NODE;
            while (nextId === IGNORED_NODE) {
              ns = ns && ns.nextSibling;
              nextId = ns && this.mirror.getId(ns);
            }
            return nextId;
          };
          const pushAdd = (n22) => {
            const parent = index2.parentNode(n22);
            if (!parent || !inDom(n22)) {
              return;
            }
            let cssCaptured = false;
            if (n22.nodeType === Node.TEXT_NODE) {
              const parentTag = parent.tagName;
              if (parentTag === "TEXTAREA") {
                return;
              } else if (parentTag === "STYLE" && this.addedSet.has(parent)) {
                cssCaptured = true;
              }
            }
            const parentId = isShadowRoot(parent) ? this.mirror.getId(getShadowHost(n22)) : this.mirror.getId(parent);
            const nextId = getNextId(n22);
            if (parentId === -1 || nextId === -1) {
              return addList.addNode(n22);
            }
            const sn = serializeNodeWithId(n22, {
              doc: this.doc,
              mirror: this.mirror,
              blockClass: this.blockClass,
              blockSelector: this.blockSelector,
              maskTextClass: this.maskTextClass,
              maskTextSelector: this.maskTextSelector,
              skipChild: true,
              newlyAddedElement: true,
              inlineStylesheet: this.inlineStylesheet,
              maskInputOptions: this.maskInputOptions,
              maskTextFn: this.maskTextFn,
              maskInputFn: this.maskInputFn,
              slimDOMOptions: this.slimDOMOptions,
              dataURLOptions: this.dataURLOptions,
              recordCanvas: this.recordCanvas,
              inlineImages: this.inlineImages,
              onSerialize: (currentN) => {
                if (isSerializedIframe(currentN, this.mirror)) {
                  this.iframeManager.addIframe(currentN);
                }
                if (isSerializedStylesheet(currentN, this.mirror)) {
                  this.stylesheetManager.trackLinkElement(
                    currentN
                  );
                }
                if (hasShadowRoot(n22)) {
                  this.shadowDomManager.addShadowRoot(index2.shadowRoot(n22), this.doc);
                }
              },
              onIframeLoad: (iframe, childSn) => {
                this.iframeManager.attachIframe(iframe, childSn);
                this.shadowDomManager.observeAttachShadow(iframe);
              },
              onStylesheetLoad: (link, childSn) => {
                this.stylesheetManager.attachLinkElement(link, childSn);
              },
              cssCaptured
            });
            if (sn) {
              adds.push({
                parentId,
                nextId,
                node: sn
              });
              addedIds.add(sn.id);
            }
          };
          while (this.mapRemoves.length) {
            this.mirror.removeNodeFromMap(this.mapRemoves.shift());
          }
          for (const n22 of this.movedSet) {
            if (isParentRemoved(this.removesSubTreeCache, n22, this.mirror) && !this.movedSet.has(index2.parentNode(n22))) {
              continue;
            }
            pushAdd(n22);
          }
          for (const n22 of this.addedSet) {
            if (!isAncestorInSet(this.droppedSet, n22) && !isParentRemoved(this.removesSubTreeCache, n22, this.mirror)) {
              pushAdd(n22);
            } else if (isAncestorInSet(this.movedSet, n22)) {
              pushAdd(n22);
            } else {
              this.droppedSet.add(n22);
            }
          }
          let candidate = null;
          while (addList.length) {
            let node2 = null;
            if (candidate) {
              const parentId = this.mirror.getId(index2.parentNode(candidate.value));
              const nextId = getNextId(candidate.value);
              if (parentId !== -1 && nextId !== -1) {
                node2 = candidate;
              }
            }
            if (!node2) {
              let tailNode = addList.tail;
              while (tailNode) {
                const _node = tailNode;
                tailNode = tailNode.previous;
                if (_node) {
                  const parentId = this.mirror.getId(index2.parentNode(_node.value));
                  const nextId = getNextId(_node.value);
                  if (nextId === -1) continue;
                  else if (parentId !== -1) {
                    node2 = _node;
                    break;
                  } else {
                    const unhandledNode = _node.value;
                    const parent = index2.parentNode(unhandledNode);
                    if (parent && parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                      const shadowHost = index2.host(parent);
                      const parentId2 = this.mirror.getId(shadowHost);
                      if (parentId2 !== -1) {
                        node2 = _node;
                        break;
                      }
                    }
                  }
                }
              }
            }
            if (!node2) {
              while (addList.head) {
                addList.removeNode(addList.head.value);
              }
              break;
            }
            candidate = node2.previous;
            addList.removeNode(node2.value);
            pushAdd(node2.value);
          }
          const payload = {
            texts: this.texts.map((text) => {
              const n22 = text.node;
              const parent = index2.parentNode(n22);
              if (parent && parent.tagName === "TEXTAREA") {
                this.genTextAreaValueMutation(parent);
              }
              return {
                id: this.mirror.getId(n22),
                value: text.value
              };
            }).filter((text) => !addedIds.has(text.id)).filter((text) => this.mirror.has(text.id)),
            attributes: this.attributes.map((attribute) => {
              const { attributes } = attribute;
              if (typeof attributes.style === "string") {
                const diffAsStr = JSON.stringify(attribute.styleDiff);
                const unchangedAsStr = JSON.stringify(attribute._unchangedStyles);
                if (diffAsStr.length < attributes.style.length) {
                  if ((diffAsStr + unchangedAsStr).split("var(").length === attributes.style.split("var(").length) {
                    attributes.style = attribute.styleDiff;
                  }
                }
              }
              return {
                id: this.mirror.getId(attribute.node),
                attributes
              };
            }).filter((attribute) => !addedIds.has(attribute.id)).filter((attribute) => this.mirror.has(attribute.id)),
            removes: this.removes,
            adds
          };
          if (!payload.texts.length && !payload.attributes.length && !payload.removes.length && !payload.adds.length) {
            return;
          }
          this.texts = [];
          this.attributes = [];
          this.attributeMap = /* @__PURE__ */ new WeakMap();
          this.removes = [];
          this.addedSet = /* @__PURE__ */ new Set();
          this.movedSet = /* @__PURE__ */ new Set();
          this.droppedSet = /* @__PURE__ */ new Set();
          this.removesSubTreeCache = /* @__PURE__ */ new Set();
          this.movedMap = {};
          this.mutationCb(payload);
        });
        __publicField(this, "genTextAreaValueMutation", (textarea) => {
          let item = this.attributeMap.get(textarea);
          if (!item) {
            item = {
              node: textarea,
              attributes: {},
              styleDiff: {},
              _unchangedStyles: {}
            };
            this.attributes.push(item);
            this.attributeMap.set(textarea, item);
          }
          const value = Array.from(
            index2.childNodes(textarea),
            (cn) => index2.textContent(cn) || ""
          ).join("");
          item.attributes.value = maskInputValue({
            element: textarea,
            maskInputOptions: this.maskInputOptions,
            tagName: textarea.tagName,
            type: getInputType(textarea),
            value,
            maskInputFn: this.maskInputFn
          });
        });
        __publicField(this, "processMutation", (m2) => {
          if (isIgnored(m2.target, this.mirror, this.slimDOMOptions)) {
            return;
          }
          switch (m2.type) {
            case "characterData": {
              const value = index2.textContent(m2.target);
              if (!isBlocked(m2.target, this.blockClass, this.blockSelector, false) && value !== m2.oldValue) {
                this.texts.push({
                  value: needMaskingText(
                    m2.target,
                    this.maskTextClass,
                    this.maskTextSelector,
                    true
                    // checkAncestors
                  ) && value ? this.maskTextFn ? this.maskTextFn(value, closestElementOfNode(m2.target)) : value.replace(/[\S]/g, "*") : value,
                  node: m2.target
                });
              }
              break;
            }
            case "attributes": {
              const target = m2.target;
              let attributeName = m2.attributeName;
              let value = m2.target.getAttribute(attributeName);
              if (attributeName === "value") {
                const type = getInputType(target);
                value = maskInputValue({
                  element: target,
                  maskInputOptions: this.maskInputOptions,
                  tagName: target.tagName,
                  type,
                  value,
                  maskInputFn: this.maskInputFn
                });
              }
              if (isBlocked(m2.target, this.blockClass, this.blockSelector, false) || value === m2.oldValue) {
                return;
              }
              let item = this.attributeMap.get(m2.target);
              if (target.tagName === "IFRAME" && attributeName === "src" && !this.keepIframeSrcFn(value)) {
                if (!target.contentDocument) {
                  attributeName = "rr_src";
                } else {
                  return;
                }
              }
              if (!item) {
                item = {
                  node: m2.target,
                  attributes: {},
                  styleDiff: {},
                  _unchangedStyles: {}
                };
                this.attributes.push(item);
                this.attributeMap.set(m2.target, item);
              }
              if (attributeName === "type" && target.tagName === "INPUT" && (m2.oldValue || "").toLowerCase() === "password") {
                target.setAttribute("data-rr-is-password", "true");
              }
              if (!ignoreAttribute(target.tagName, attributeName)) {
                item.attributes[attributeName] = transformAttribute(
                  this.doc,
                  toLowerCase(target.tagName),
                  toLowerCase(attributeName),
                  value
                );
                if (attributeName === "style") {
                  if (!this.unattachedDoc) {
                    try {
                      this.unattachedDoc = document.implementation.createHTMLDocument();
                    } catch (e2) {
                      this.unattachedDoc = this.doc;
                    }
                  }
                  const old = this.unattachedDoc.createElement("span");
                  if (m2.oldValue) {
                    old.setAttribute("style", m2.oldValue);
                  }
                  for (const pname of Array.from(target.style)) {
                    const newValue = target.style.getPropertyValue(pname);
                    const newPriority = target.style.getPropertyPriority(pname);
                    if (newValue !== old.style.getPropertyValue(pname) || newPriority !== old.style.getPropertyPriority(pname)) {
                      if (newPriority === "") {
                        item.styleDiff[pname] = newValue;
                      } else {
                        item.styleDiff[pname] = [newValue, newPriority];
                      }
                    } else {
                      item._unchangedStyles[pname] = [newValue, newPriority];
                    }
                  }
                  for (const pname of Array.from(old.style)) {
                    if (target.style.getPropertyValue(pname) === "") {
                      item.styleDiff[pname] = false;
                    }
                  }
                } else if (attributeName === "open" && target.tagName === "DIALOG") {
                  if (target.matches("dialog:modal")) {
                    item.attributes["rr_open_mode"] = "modal";
                  } else {
                    item.attributes["rr_open_mode"] = "non-modal";
                  }
                }
              }
              break;
            }
            case "childList": {
              if (isBlocked(m2.target, this.blockClass, this.blockSelector, true))
                return;
              if (m2.target.tagName === "TEXTAREA") {
                this.genTextAreaValueMutation(m2.target);
                return;
              }
              m2.addedNodes.forEach((n22) => this.genAdds(n22, m2.target));
              m2.removedNodes.forEach((n22) => {
                const nodeId = this.mirror.getId(n22);
                const parentId = isShadowRoot(m2.target) ? this.mirror.getId(index2.host(m2.target)) : this.mirror.getId(m2.target);
                if (isBlocked(m2.target, this.blockClass, this.blockSelector, false) || isIgnored(n22, this.mirror, this.slimDOMOptions) || !isSerialized(n22, this.mirror)) {
                  return;
                }
                if (this.addedSet.has(n22)) {
                  deepDelete(this.addedSet, n22);
                  this.droppedSet.add(n22);
                } else if (this.addedSet.has(m2.target) && nodeId === -1) ;
                else if (isAncestorRemoved(m2.target, this.mirror)) ;
                else if (this.movedSet.has(n22) && this.movedMap[moveKey(nodeId, parentId)]) {
                  deepDelete(this.movedSet, n22);
                } else {
                  this.removes.push({
                    parentId,
                    id: nodeId,
                    isShadow: isShadowRoot(m2.target) && isNativeShadowDom(m2.target) ? true : void 0
                  });
                  processRemoves(n22, this.removesSubTreeCache);
                }
                this.mapRemoves.push(n22);
              });
              break;
            }
          }
        });
        __publicField(this, "genAdds", (n22, target) => {
          if (this.processedNodeManager.inOtherBuffer(n22, this)) return;
          if (this.addedSet.has(n22) || this.movedSet.has(n22)) return;
          if (this.mirror.hasNode(n22)) {
            if (isIgnored(n22, this.mirror, this.slimDOMOptions)) {
              return;
            }
            this.movedSet.add(n22);
            let targetId = null;
            if (target && this.mirror.hasNode(target)) {
              targetId = this.mirror.getId(target);
            }
            if (targetId && targetId !== -1) {
              this.movedMap[moveKey(this.mirror.getId(n22), targetId)] = true;
            }
          } else {
            this.addedSet.add(n22);
            this.droppedSet.delete(n22);
          }
          if (!isBlocked(n22, this.blockClass, this.blockSelector, false)) {
            index2.childNodes(n22).forEach((childN) => this.genAdds(childN));
            if (hasShadowRoot(n22)) {
              index2.childNodes(index2.shadowRoot(n22)).forEach((childN) => {
                this.processedNodeManager.add(childN, this);
                this.genAdds(childN, n22);
              });
            }
          }
        });
      }
      init(options) {
        [
          "mutationCb",
          "blockClass",
          "blockSelector",
          "maskTextClass",
          "maskTextSelector",
          "inlineStylesheet",
          "maskInputOptions",
          "maskTextFn",
          "maskInputFn",
          "keepIframeSrcFn",
          "recordCanvas",
          "inlineImages",
          "slimDOMOptions",
          "dataURLOptions",
          "doc",
          "mirror",
          "iframeManager",
          "stylesheetManager",
          "shadowDomManager",
          "canvasManager",
          "processedNodeManager"
        ].forEach((key) => {
          this[key] = options[key];
        });
      }
      freeze() {
        this.frozen = true;
        this.canvasManager.freeze();
      }
      unfreeze() {
        this.frozen = false;
        this.canvasManager.unfreeze();
        this.emit();
      }
      isFrozen() {
        return this.frozen;
      }
      lock() {
        this.locked = true;
        this.canvasManager.lock();
      }
      unlock() {
        this.locked = false;
        this.canvasManager.unlock();
        this.emit();
      }
      reset() {
        this.shadowDomManager.reset();
        this.canvasManager.reset();
      }
    };
    callbackWrapper = (cb) => {
      if (!errorHandler) {
        return cb;
      }
      const rrwebWrapped = (...rest) => {
        try {
          return cb(...rest);
        } catch (error) {
          if (errorHandler && errorHandler(error) === true) {
            return;
          }
          throw error;
        }
      };
      return rrwebWrapped;
    };
    mutationBuffers = [];
    INPUT_TAGS = ["INPUT", "TEXTAREA", "SELECT"];
    lastInputValueMap = /* @__PURE__ */ new WeakMap();
    CrossOriginIframeMirror = class {
      constructor(generateIdFn) {
        __publicField(this, "iframeIdToRemoteIdMap", /* @__PURE__ */ new WeakMap());
        __publicField(this, "iframeRemoteIdToIdMap", /* @__PURE__ */ new WeakMap());
        this.generateIdFn = generateIdFn;
      }
      getId(iframe, remoteId, idToRemoteMap, remoteToIdMap) {
        const idToRemoteIdMap = idToRemoteMap || this.getIdToRemoteIdMap(iframe);
        const remoteIdToIdMap = remoteToIdMap || this.getRemoteIdToIdMap(iframe);
        let id2 = idToRemoteIdMap.get(remoteId);
        if (!id2) {
          id2 = this.generateIdFn();
          idToRemoteIdMap.set(remoteId, id2);
          remoteIdToIdMap.set(id2, remoteId);
        }
        return id2;
      }
      getIds(iframe, remoteId) {
        const idToRemoteIdMap = this.getIdToRemoteIdMap(iframe);
        const remoteIdToIdMap = this.getRemoteIdToIdMap(iframe);
        return remoteId.map(
          (id2) => this.getId(iframe, id2, idToRemoteIdMap, remoteIdToIdMap)
        );
      }
      getRemoteId(iframe, id2, map) {
        const remoteIdToIdMap = map || this.getRemoteIdToIdMap(iframe);
        if (typeof id2 !== "number") return id2;
        const remoteId = remoteIdToIdMap.get(id2);
        if (!remoteId) return -1;
        return remoteId;
      }
      getRemoteIds(iframe, ids) {
        const remoteIdToIdMap = this.getRemoteIdToIdMap(iframe);
        return ids.map((id2) => this.getRemoteId(iframe, id2, remoteIdToIdMap));
      }
      reset(iframe) {
        if (!iframe) {
          this.iframeIdToRemoteIdMap = /* @__PURE__ */ new WeakMap();
          this.iframeRemoteIdToIdMap = /* @__PURE__ */ new WeakMap();
          return;
        }
        this.iframeIdToRemoteIdMap.delete(iframe);
        this.iframeRemoteIdToIdMap.delete(iframe);
      }
      getIdToRemoteIdMap(iframe) {
        let idToRemoteIdMap = this.iframeIdToRemoteIdMap.get(iframe);
        if (!idToRemoteIdMap) {
          idToRemoteIdMap = /* @__PURE__ */ new Map();
          this.iframeIdToRemoteIdMap.set(iframe, idToRemoteIdMap);
        }
        return idToRemoteIdMap;
      }
      getRemoteIdToIdMap(iframe) {
        let remoteIdToIdMap = this.iframeRemoteIdToIdMap.get(iframe);
        if (!remoteIdToIdMap) {
          remoteIdToIdMap = /* @__PURE__ */ new Map();
          this.iframeRemoteIdToIdMap.set(iframe, remoteIdToIdMap);
        }
        return remoteIdToIdMap;
      }
    };
    IframeManager = class {
      constructor(options) {
        __publicField(this, "iframes", /* @__PURE__ */ new WeakMap());
        __publicField(this, "crossOriginIframeMap", /* @__PURE__ */ new WeakMap());
        __publicField(this, "crossOriginIframeMirror", new CrossOriginIframeMirror(genId));
        __publicField(this, "crossOriginIframeStyleMirror");
        __publicField(this, "crossOriginIframeRootIdMap", /* @__PURE__ */ new WeakMap());
        __publicField(this, "mirror");
        __publicField(this, "mutationCb");
        __publicField(this, "wrappedEmit");
        __publicField(this, "loadListener");
        __publicField(this, "stylesheetManager");
        __publicField(this, "recordCrossOriginIframes");
        this.mutationCb = options.mutationCb;
        this.wrappedEmit = options.wrappedEmit;
        this.stylesheetManager = options.stylesheetManager;
        this.recordCrossOriginIframes = options.recordCrossOriginIframes;
        this.crossOriginIframeStyleMirror = new CrossOriginIframeMirror(
          this.stylesheetManager.styleMirror.generateId.bind(
            this.stylesheetManager.styleMirror
          )
        );
        this.mirror = options.mirror;
        if (this.recordCrossOriginIframes) {
          window.addEventListener("message", this.handleMessage.bind(this));
        }
      }
      addIframe(iframeEl) {
        this.iframes.set(iframeEl, true);
        if (iframeEl.contentWindow)
          this.crossOriginIframeMap.set(iframeEl.contentWindow, iframeEl);
      }
      addLoadListener(cb) {
        this.loadListener = cb;
      }
      attachIframe(iframeEl, childSn) {
        var _a22, _b2;
        this.mutationCb({
          adds: [
            {
              parentId: this.mirror.getId(iframeEl),
              nextId: null,
              node: childSn
            }
          ],
          removes: [],
          texts: [],
          attributes: [],
          isAttachIframe: true
        });
        if (this.recordCrossOriginIframes)
          (_a22 = iframeEl.contentWindow) == null ? void 0 : _a22.addEventListener(
            "message",
            this.handleMessage.bind(this)
          );
        (_b2 = this.loadListener) == null ? void 0 : _b2.call(this, iframeEl);
        if (iframeEl.contentDocument && iframeEl.contentDocument.adoptedStyleSheets && iframeEl.contentDocument.adoptedStyleSheets.length > 0)
          this.stylesheetManager.adoptStyleSheets(
            iframeEl.contentDocument.adoptedStyleSheets,
            this.mirror.getId(iframeEl.contentDocument)
          );
      }
      handleMessage(message) {
        const crossOriginMessageEvent = message;
        if (crossOriginMessageEvent.data.type !== "rrweb" || // To filter out the rrweb messages which are forwarded by some sites.
        crossOriginMessageEvent.origin !== crossOriginMessageEvent.data.origin)
          return;
        const iframeSourceWindow = message.source;
        if (!iframeSourceWindow) return;
        const iframeEl = this.crossOriginIframeMap.get(message.source);
        if (!iframeEl) return;
        const transformedEvent = this.transformCrossOriginEvent(
          iframeEl,
          crossOriginMessageEvent.data.event
        );
        if (transformedEvent)
          this.wrappedEmit(
            transformedEvent,
            crossOriginMessageEvent.data.isCheckout
          );
      }
      transformCrossOriginEvent(iframeEl, e2) {
        var _a22;
        switch (e2.type) {
          case EventType.FullSnapshot: {
            this.crossOriginIframeMirror.reset(iframeEl);
            this.crossOriginIframeStyleMirror.reset(iframeEl);
            this.replaceIdOnNode(e2.data.node, iframeEl);
            const rootId = e2.data.node.id;
            this.crossOriginIframeRootIdMap.set(iframeEl, rootId);
            this.patchRootIdOnNode(e2.data.node, rootId);
            return {
              timestamp: e2.timestamp,
              type: EventType.IncrementalSnapshot,
              data: {
                source: IncrementalSource.Mutation,
                adds: [
                  {
                    parentId: this.mirror.getId(iframeEl),
                    nextId: null,
                    node: e2.data.node
                  }
                ],
                removes: [],
                texts: [],
                attributes: [],
                isAttachIframe: true
              }
            };
          }
          case EventType.Meta:
          case EventType.Load:
          case EventType.DomContentLoaded: {
            return false;
          }
          case EventType.Plugin: {
            return e2;
          }
          case EventType.Custom: {
            this.replaceIds(
              e2.data.payload,
              iframeEl,
              ["id", "parentId", "previousId", "nextId"]
            );
            return e2;
          }
          case EventType.IncrementalSnapshot: {
            switch (e2.data.source) {
              case IncrementalSource.Mutation: {
                e2.data.adds.forEach((n22) => {
                  this.replaceIds(n22, iframeEl, [
                    "parentId",
                    "nextId",
                    "previousId"
                  ]);
                  this.replaceIdOnNode(n22.node, iframeEl);
                  const rootId = this.crossOriginIframeRootIdMap.get(iframeEl);
                  rootId && this.patchRootIdOnNode(n22.node, rootId);
                });
                e2.data.removes.forEach((n22) => {
                  this.replaceIds(n22, iframeEl, ["parentId", "id"]);
                });
                e2.data.attributes.forEach((n22) => {
                  this.replaceIds(n22, iframeEl, ["id"]);
                });
                e2.data.texts.forEach((n22) => {
                  this.replaceIds(n22, iframeEl, ["id"]);
                });
                return e2;
              }
              case IncrementalSource.Drag:
              case IncrementalSource.TouchMove:
              case IncrementalSource.MouseMove: {
                e2.data.positions.forEach((p2) => {
                  this.replaceIds(p2, iframeEl, ["id"]);
                });
                return e2;
              }
              case IncrementalSource.ViewportResize: {
                return false;
              }
              case IncrementalSource.MediaInteraction:
              case IncrementalSource.MouseInteraction:
              case IncrementalSource.Scroll:
              case IncrementalSource.CanvasMutation:
              case IncrementalSource.Input: {
                this.replaceIds(e2.data, iframeEl, ["id"]);
                return e2;
              }
              case IncrementalSource.StyleSheetRule:
              case IncrementalSource.StyleDeclaration: {
                this.replaceIds(e2.data, iframeEl, ["id"]);
                this.replaceStyleIds(e2.data, iframeEl, ["styleId"]);
                return e2;
              }
              case IncrementalSource.Font: {
                return e2;
              }
              case IncrementalSource.Selection: {
                e2.data.ranges.forEach((range) => {
                  this.replaceIds(range, iframeEl, ["start", "end"]);
                });
                return e2;
              }
              case IncrementalSource.AdoptedStyleSheet: {
                this.replaceIds(e2.data, iframeEl, ["id"]);
                this.replaceStyleIds(e2.data, iframeEl, ["styleIds"]);
                (_a22 = e2.data.styles) == null ? void 0 : _a22.forEach((style) => {
                  this.replaceStyleIds(style, iframeEl, ["styleId"]);
                });
                return e2;
              }
            }
          }
        }
        return false;
      }
      replace(iframeMirror, obj2, iframeEl, keys) {
        for (const key of keys) {
          if (!Array.isArray(obj2[key]) && typeof obj2[key] !== "number") continue;
          if (Array.isArray(obj2[key])) {
            obj2[key] = iframeMirror.getIds(
              iframeEl,
              obj2[key]
            );
          } else {
            obj2[key] = iframeMirror.getId(iframeEl, obj2[key]);
          }
        }
        return obj2;
      }
      replaceIds(obj2, iframeEl, keys) {
        return this.replace(this.crossOriginIframeMirror, obj2, iframeEl, keys);
      }
      replaceStyleIds(obj2, iframeEl, keys) {
        return this.replace(this.crossOriginIframeStyleMirror, obj2, iframeEl, keys);
      }
      replaceIdOnNode(node2, iframeEl) {
        this.replaceIds(node2, iframeEl, ["id", "rootId"]);
        if ("childNodes" in node2) {
          node2.childNodes.forEach((child) => {
            this.replaceIdOnNode(child, iframeEl);
          });
        }
      }
      patchRootIdOnNode(node2, rootId) {
        if (node2.type !== NodeType.Document && !node2.rootId) node2.rootId = rootId;
        if ("childNodes" in node2) {
          node2.childNodes.forEach((child) => {
            this.patchRootIdOnNode(child, rootId);
          });
        }
      }
    };
    ShadowDomManager = class {
      constructor(options) {
        __publicField(this, "shadowDoms", /* @__PURE__ */ new WeakSet());
        __publicField(this, "mutationCb");
        __publicField(this, "scrollCb");
        __publicField(this, "bypassOptions");
        __publicField(this, "mirror");
        __publicField(this, "restoreHandlers", []);
        this.mutationCb = options.mutationCb;
        this.scrollCb = options.scrollCb;
        this.bypassOptions = options.bypassOptions;
        this.mirror = options.mirror;
        this.init();
      }
      init() {
        this.reset();
        this.patchAttachShadow(Element, document);
      }
      addShadowRoot(shadowRoot2, doc) {
        if (!isNativeShadowDom(shadowRoot2)) return;
        if (this.shadowDoms.has(shadowRoot2)) return;
        this.shadowDoms.add(shadowRoot2);
        const observer = initMutationObserver(
          {
            ...this.bypassOptions,
            doc,
            mutationCb: this.mutationCb,
            mirror: this.mirror,
            shadowDomManager: this
          },
          shadowRoot2
        );
        this.restoreHandlers.push(() => observer.disconnect());
        this.restoreHandlers.push(
          initScrollObserver({
            ...this.bypassOptions,
            scrollCb: this.scrollCb,
            // https://gist.github.com/praveenpuglia/0832da687ed5a5d7a0907046c9ef1813
            // scroll is not allowed to pass the boundary, so we need to listen the shadow document
            doc: shadowRoot2,
            mirror: this.mirror
          })
        );
        setTimeout(() => {
          if (shadowRoot2.adoptedStyleSheets && shadowRoot2.adoptedStyleSheets.length > 0)
            this.bypassOptions.stylesheetManager.adoptStyleSheets(
              shadowRoot2.adoptedStyleSheets,
              this.mirror.getId(index2.host(shadowRoot2))
            );
          this.restoreHandlers.push(
            initAdoptedStyleSheetObserver(
              {
                mirror: this.mirror,
                stylesheetManager: this.bypassOptions.stylesheetManager
              },
              shadowRoot2
            )
          );
        }, 0);
      }
      /**
       * Monkey patch 'attachShadow' of an IFrameElement to observe newly added shadow doms.
       */
      observeAttachShadow(iframeElement) {
        if (!iframeElement.contentWindow || !iframeElement.contentDocument) return;
        this.patchAttachShadow(
          iframeElement.contentWindow.Element,
          iframeElement.contentDocument
        );
      }
      /**
       * Patch 'attachShadow' to observe newly added shadow doms.
       */
      patchAttachShadow(element, doc) {
        const manager = this;
        this.restoreHandlers.push(
          patch(
            element.prototype,
            "attachShadow",
            function(original) {
              return function(option) {
                const sRoot = original.call(this, option);
                const shadowRootEl = index2.shadowRoot(this);
                if (shadowRootEl && inDom(this))
                  manager.addShadowRoot(shadowRootEl, doc);
                return sRoot;
              };
            }
          )
        );
      }
      reset() {
        this.restoreHandlers.forEach((handler) => {
          try {
            handler();
          } catch (e2) {
          }
        });
        this.restoreHandlers = [];
        this.shadowDoms = /* @__PURE__ */ new WeakSet();
      }
    };
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
    for (i$1 = 0; i$1 < chars.length; i$1++) {
      lookup[chars.charCodeAt(i$1)] = i$1;
    }
    encode = function(arraybuffer) {
      var bytes = new Uint8Array(arraybuffer), i2, len = bytes.length, base64 = "";
      for (i2 = 0; i2 < len; i2 += 3) {
        base64 += chars[bytes[i2] >> 2];
        base64 += chars[(bytes[i2] & 3) << 4 | bytes[i2 + 1] >> 4];
        base64 += chars[(bytes[i2 + 1] & 15) << 2 | bytes[i2 + 2] >> 6];
        base64 += chars[bytes[i2 + 2] & 63];
      }
      if (len % 3 === 2) {
        base64 = base64.substring(0, base64.length - 1) + "=";
      } else if (len % 3 === 1) {
        base64 = base64.substring(0, base64.length - 2) + "==";
      }
      return base64;
    };
    canvasVarMap = /* @__PURE__ */ new Map();
    saveWebGLVar = (value, win, ctx) => {
      if (!value || !(isInstanceOfWebGLObject(value, win) || typeof value === "object"))
        return;
      const name = value.constructor.name;
      const list2 = variableListFor$1(ctx, name);
      let index22 = list2.indexOf(value);
      if (index22 === -1) {
        index22 = list2.length;
        list2.push(value);
      }
      return index22;
    };
    serializeArgs = (args, win, ctx) => {
      return args.map((arg) => serializeArg(arg, win, ctx));
    };
    isInstanceOfWebGLObject = (value, win) => {
      const webGLConstructorNames = [
        "WebGLActiveInfo",
        "WebGLBuffer",
        "WebGLFramebuffer",
        "WebGLProgram",
        "WebGLRenderbuffer",
        "WebGLShader",
        "WebGLShaderPrecisionFormat",
        "WebGLTexture",
        "WebGLUniformLocation",
        "WebGLVertexArrayObject",
        // In old Chrome versions, value won't be an instanceof WebGLVertexArrayObject.
        "WebGLVertexArrayObjectOES"
      ];
      const supportedWebGLConstructorNames = webGLConstructorNames.filter(
        (name) => typeof win[name] === "function"
      );
      return Boolean(
        supportedWebGLConstructorNames.find(
          (name) => value instanceof win[name]
        )
      );
    };
    encodedJs = "KGZ1bmN0aW9uKCkgewogICJ1c2Ugc3RyaWN0IjsKICB2YXIgY2hhcnMgPSAiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyI7CiAgdmFyIGxvb2t1cCA9IHR5cGVvZiBVaW50OEFycmF5ID09PSAidW5kZWZpbmVkIiA/IFtdIDogbmV3IFVpbnQ4QXJyYXkoMjU2KTsKICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXJzLmxlbmd0aDsgaSsrKSB7CiAgICBsb29rdXBbY2hhcnMuY2hhckNvZGVBdChpKV0gPSBpOwogIH0KICB2YXIgZW5jb2RlID0gZnVuY3Rpb24oYXJyYXlidWZmZXIpIHsKICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGFycmF5YnVmZmVyKSwgaTIsIGxlbiA9IGJ5dGVzLmxlbmd0aCwgYmFzZTY0ID0gIiI7CiAgICBmb3IgKGkyID0gMDsgaTIgPCBsZW47IGkyICs9IDMpIHsKICAgICAgYmFzZTY0ICs9IGNoYXJzW2J5dGVzW2kyXSA+PiAyXTsKICAgICAgYmFzZTY0ICs9IGNoYXJzWyhieXRlc1tpMl0gJiAzKSA8PCA0IHwgYnl0ZXNbaTIgKyAxXSA+PiA0XTsKICAgICAgYmFzZTY0ICs9IGNoYXJzWyhieXRlc1tpMiArIDFdICYgMTUpIDw8IDIgfCBieXRlc1tpMiArIDJdID4+IDZdOwogICAgICBiYXNlNjQgKz0gY2hhcnNbYnl0ZXNbaTIgKyAyXSAmIDYzXTsKICAgIH0KICAgIGlmIChsZW4gJSAzID09PSAyKSB7CiAgICAgIGJhc2U2NCA9IGJhc2U2NC5zdWJzdHJpbmcoMCwgYmFzZTY0Lmxlbmd0aCAtIDEpICsgIj0iOwogICAgfSBlbHNlIGlmIChsZW4gJSAzID09PSAxKSB7CiAgICAgIGJhc2U2NCA9IGJhc2U2NC5zdWJzdHJpbmcoMCwgYmFzZTY0Lmxlbmd0aCAtIDIpICsgIj09IjsKICAgIH0KICAgIHJldHVybiBiYXNlNjQ7CiAgfTsKICBjb25zdCBsYXN0QmxvYk1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7CiAgY29uc3QgdHJhbnNwYXJlbnRCbG9iTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTsKICBhc3luYyBmdW5jdGlvbiBnZXRUcmFuc3BhcmVudEJsb2JGb3Iod2lkdGgsIGhlaWdodCwgZGF0YVVSTE9wdGlvbnMpIHsKICAgIGNvbnN0IGlkID0gYCR7d2lkdGh9LSR7aGVpZ2h0fWA7CiAgICBpZiAoIk9mZnNjcmVlbkNhbnZhcyIgaW4gZ2xvYmFsVGhpcykgewogICAgICBpZiAodHJhbnNwYXJlbnRCbG9iTWFwLmhhcyhpZCkpIHJldHVybiB0cmFuc3BhcmVudEJsb2JNYXAuZ2V0KGlkKTsKICAgICAgY29uc3Qgb2Zmc2NyZWVuID0gbmV3IE9mZnNjcmVlbkNhbnZhcyh3aWR0aCwgaGVpZ2h0KTsKICAgICAgb2Zmc2NyZWVuLmdldENvbnRleHQoIjJkIik7CiAgICAgIGNvbnN0IGJsb2IgPSBhd2FpdCBvZmZzY3JlZW4uY29udmVydFRvQmxvYihkYXRhVVJMT3B0aW9ucyk7CiAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0gYXdhaXQgYmxvYi5hcnJheUJ1ZmZlcigpOwogICAgICBjb25zdCBiYXNlNjQgPSBlbmNvZGUoYXJyYXlCdWZmZXIpOwogICAgICB0cmFuc3BhcmVudEJsb2JNYXAuc2V0KGlkLCBiYXNlNjQpOwogICAgICByZXR1cm4gYmFzZTY0OwogICAgfSBlbHNlIHsKICAgICAgcmV0dXJuICIiOwogICAgfQogIH0KICBjb25zdCB3b3JrZXIgPSBzZWxmOwogIHdvcmtlci5vbm1lc3NhZ2UgPSBhc3luYyBmdW5jdGlvbihlKSB7CiAgICBpZiAoIk9mZnNjcmVlbkNhbnZhcyIgaW4gZ2xvYmFsVGhpcykgewogICAgICBjb25zdCB7IGlkLCBiaXRtYXAsIHdpZHRoLCBoZWlnaHQsIGRhdGFVUkxPcHRpb25zIH0gPSBlLmRhdGE7CiAgICAgIGNvbnN0IHRyYW5zcGFyZW50QmFzZTY0ID0gZ2V0VHJhbnNwYXJlbnRCbG9iRm9yKAogICAgICAgIHdpZHRoLAogICAgICAgIGhlaWdodCwKICAgICAgICBkYXRhVVJMT3B0aW9ucwogICAgICApOwogICAgICBjb25zdCBvZmZzY3JlZW4gPSBuZXcgT2Zmc2NyZWVuQ2FudmFzKHdpZHRoLCBoZWlnaHQpOwogICAgICBjb25zdCBjdHggPSBvZmZzY3JlZW4uZ2V0Q29udGV4dCgiMmQiKTsKICAgICAgY3R4LmRyYXdJbWFnZShiaXRtYXAsIDAsIDApOwogICAgICBiaXRtYXAuY2xvc2UoKTsKICAgICAgY29uc3QgYmxvYiA9IGF3YWl0IG9mZnNjcmVlbi5jb252ZXJ0VG9CbG9iKGRhdGFVUkxPcHRpb25zKTsKICAgICAgY29uc3QgdHlwZSA9IGJsb2IudHlwZTsKICAgICAgY29uc3QgYXJyYXlCdWZmZXIgPSBhd2FpdCBibG9iLmFycmF5QnVmZmVyKCk7CiAgICAgIGNvbnN0IGJhc2U2NCA9IGVuY29kZShhcnJheUJ1ZmZlcik7CiAgICAgIGlmICghbGFzdEJsb2JNYXAuaGFzKGlkKSAmJiBhd2FpdCB0cmFuc3BhcmVudEJhc2U2NCA9PT0gYmFzZTY0KSB7CiAgICAgICAgbGFzdEJsb2JNYXAuc2V0KGlkLCBiYXNlNjQpOwogICAgICAgIHJldHVybiB3b3JrZXIucG9zdE1lc3NhZ2UoeyBpZCB9KTsKICAgICAgfQogICAgICBpZiAobGFzdEJsb2JNYXAuZ2V0KGlkKSA9PT0gYmFzZTY0KSByZXR1cm4gd29ya2VyLnBvc3RNZXNzYWdlKHsgaWQgfSk7CiAgICAgIHdvcmtlci5wb3N0TWVzc2FnZSh7CiAgICAgICAgaWQsCiAgICAgICAgdHlwZSwKICAgICAgICBiYXNlNjQsCiAgICAgICAgd2lkdGgsCiAgICAgICAgaGVpZ2h0CiAgICAgIH0pOwogICAgICBsYXN0QmxvYk1hcC5zZXQoaWQsIGJhc2U2NCk7CiAgICB9IGVsc2UgewogICAgICByZXR1cm4gd29ya2VyLnBvc3RNZXNzYWdlKHsgaWQ6IGUuZGF0YS5pZCB9KTsKICAgIH0KICB9Owp9KSgpOwovLyMgc291cmNlTWFwcGluZ1VSTD1pbWFnZS1iaXRtYXAtZGF0YS11cmwtd29ya2VyLUlKcEM3Z19iLmpzLm1hcAo=";
    decodeBase64 = (base64) => Uint8Array.from(atob(base64), (c2) => c2.charCodeAt(0));
    blob = typeof window !== "undefined" && window.Blob && new Blob([decodeBase64(encodedJs)], { type: "text/javascript;charset=utf-8" });
    CanvasManager = class {
      constructor(options) {
        __publicField(this, "pendingCanvasMutations", /* @__PURE__ */ new Map());
        __publicField(this, "rafStamps", { latestId: 0, invokeId: null });
        __publicField(this, "mirror");
        __publicField(this, "mutationCb");
        __publicField(this, "resetObservers");
        __publicField(this, "frozen", false);
        __publicField(this, "locked", false);
        __publicField(this, "processMutation", (target, mutation) => {
          const newFrame = this.rafStamps.invokeId && this.rafStamps.latestId !== this.rafStamps.invokeId;
          if (newFrame || !this.rafStamps.invokeId)
            this.rafStamps.invokeId = this.rafStamps.latestId;
          if (!this.pendingCanvasMutations.has(target)) {
            this.pendingCanvasMutations.set(target, []);
          }
          this.pendingCanvasMutations.get(target).push(mutation);
        });
        const {
          sampling = "all",
          win,
          blockClass,
          blockSelector,
          recordCanvas,
          dataURLOptions
        } = options;
        this.mutationCb = options.mutationCb;
        this.mirror = options.mirror;
        if (recordCanvas && sampling === "all")
          this.initCanvasMutationObserver(win, blockClass, blockSelector);
        if (recordCanvas && typeof sampling === "number")
          this.initCanvasFPSObserver(sampling, win, blockClass, blockSelector, {
            dataURLOptions
          });
      }
      reset() {
        this.pendingCanvasMutations.clear();
        this.resetObservers && this.resetObservers();
      }
      freeze() {
        this.frozen = true;
      }
      unfreeze() {
        this.frozen = false;
      }
      lock() {
        this.locked = true;
      }
      unlock() {
        this.locked = false;
      }
      initCanvasFPSObserver(fps, win, blockClass, blockSelector, options) {
        const canvasContextReset = initCanvasContextObserver(
          win,
          blockClass,
          blockSelector,
          true
        );
        const snapshotInProgressMap = /* @__PURE__ */ new Map();
        const worker = new WorkerWrapper();
        worker.onmessage = (e2) => {
          const { id: id2 } = e2.data;
          snapshotInProgressMap.set(id2, false);
          if (!("base64" in e2.data)) return;
          const { base64, type, width, height } = e2.data;
          this.mutationCb({
            id: id2,
            type: CanvasContext["2D"],
            commands: [
              {
                property: "clearRect",
                // wipe canvas
                args: [0, 0, width, height]
              },
              {
                property: "drawImage",
                // draws (semi-transparent) image
                args: [
                  {
                    rr_type: "ImageBitmap",
                    args: [
                      {
                        rr_type: "Blob",
                        data: [{ rr_type: "ArrayBuffer", base64 }],
                        type
                      }
                    ]
                  },
                  0,
                  0
                ]
              }
            ]
          });
        };
        const timeBetweenSnapshots = 1e3 / fps;
        let lastSnapshotTime = 0;
        let rafId;
        const getCanvas = () => {
          const matchedCanvas = [];
          win.document.querySelectorAll("canvas").forEach((canvas) => {
            if (!isBlocked(canvas, blockClass, blockSelector, true)) {
              matchedCanvas.push(canvas);
            }
          });
          return matchedCanvas;
        };
        const takeCanvasSnapshots = (timestamp) => {
          if (lastSnapshotTime && timestamp - lastSnapshotTime < timeBetweenSnapshots) {
            rafId = requestAnimationFrame(takeCanvasSnapshots);
            return;
          }
          lastSnapshotTime = timestamp;
          getCanvas().forEach(async (canvas) => {
            var _a22;
            const id2 = this.mirror.getId(canvas);
            if (snapshotInProgressMap.get(id2)) return;
            if (canvas.width === 0 || canvas.height === 0) return;
            snapshotInProgressMap.set(id2, true);
            if (["webgl", "webgl2"].includes(canvas.__context)) {
              const context = canvas.getContext(canvas.__context);
              if (((_a22 = context == null ? void 0 : context.getContextAttributes()) == null ? void 0 : _a22.preserveDrawingBuffer) === false) {
                context.clear(context.COLOR_BUFFER_BIT);
              }
            }
            const bitmap = await createImageBitmap(canvas);
            worker.postMessage(
              {
                id: id2,
                bitmap,
                width: canvas.width,
                height: canvas.height,
                dataURLOptions: options.dataURLOptions
              },
              [bitmap]
            );
          });
          rafId = requestAnimationFrame(takeCanvasSnapshots);
        };
        rafId = requestAnimationFrame(takeCanvasSnapshots);
        this.resetObservers = () => {
          canvasContextReset();
          cancelAnimationFrame(rafId);
        };
      }
      initCanvasMutationObserver(win, blockClass, blockSelector) {
        this.startRAFTimestamping();
        this.startPendingCanvasMutationFlusher();
        const canvasContextReset = initCanvasContextObserver(
          win,
          blockClass,
          blockSelector,
          false
        );
        const canvas2DReset = initCanvas2DMutationObserver(
          this.processMutation.bind(this),
          win,
          blockClass,
          blockSelector
        );
        const canvasWebGL1and2Reset = initCanvasWebGLMutationObserver(
          this.processMutation.bind(this),
          win,
          blockClass,
          blockSelector
        );
        this.resetObservers = () => {
          canvasContextReset();
          canvas2DReset();
          canvasWebGL1and2Reset();
        };
      }
      startPendingCanvasMutationFlusher() {
        requestAnimationFrame(() => this.flushPendingCanvasMutations());
      }
      startRAFTimestamping() {
        const setLatestRAFTimestamp = (timestamp) => {
          this.rafStamps.latestId = timestamp;
          requestAnimationFrame(setLatestRAFTimestamp);
        };
        requestAnimationFrame(setLatestRAFTimestamp);
      }
      flushPendingCanvasMutations() {
        this.pendingCanvasMutations.forEach(
          (_values, canvas) => {
            const id2 = this.mirror.getId(canvas);
            this.flushPendingCanvasMutationFor(canvas, id2);
          }
        );
        requestAnimationFrame(() => this.flushPendingCanvasMutations());
      }
      flushPendingCanvasMutationFor(canvas, id2) {
        if (this.frozen || this.locked) {
          return;
        }
        const valuesWithType = this.pendingCanvasMutations.get(canvas);
        if (!valuesWithType || id2 === -1) return;
        const values = valuesWithType.map((value) => {
          const { type: type2, ...rest } = value;
          return rest;
        });
        const { type } = valuesWithType[0];
        this.mutationCb({ id: id2, type, commands: values });
        this.pendingCanvasMutations.delete(canvas);
      }
    };
    StylesheetManager = class {
      constructor(options) {
        __publicField(this, "trackedLinkElements", /* @__PURE__ */ new WeakSet());
        __publicField(this, "mutationCb");
        __publicField(this, "adoptedStyleSheetCb");
        __publicField(this, "styleMirror", new StyleSheetMirror());
        this.mutationCb = options.mutationCb;
        this.adoptedStyleSheetCb = options.adoptedStyleSheetCb;
      }
      attachLinkElement(linkEl, childSn) {
        if ("_cssText" in childSn.attributes)
          this.mutationCb({
            adds: [],
            removes: [],
            texts: [],
            attributes: [
              {
                id: childSn.id,
                attributes: childSn.attributes
              }
            ]
          });
        this.trackLinkElement(linkEl);
      }
      trackLinkElement(linkEl) {
        if (this.trackedLinkElements.has(linkEl)) return;
        this.trackedLinkElements.add(linkEl);
        this.trackStylesheetInLinkElement(linkEl);
      }
      adoptStyleSheets(sheets, hostId) {
        if (sheets.length === 0) return;
        const adoptedStyleSheetData = {
          id: hostId,
          styleIds: []
        };
        const styles = [];
        for (const sheet of sheets) {
          let styleId;
          if (!this.styleMirror.has(sheet)) {
            styleId = this.styleMirror.add(sheet);
            styles.push({
              styleId,
              rules: Array.from(sheet.rules || CSSRule, (r2, index22) => ({
                rule: stringifyRule(r2, sheet.href),
                index: index22
              }))
            });
          } else styleId = this.styleMirror.getId(sheet);
          adoptedStyleSheetData.styleIds.push(styleId);
        }
        if (styles.length > 0) adoptedStyleSheetData.styles = styles;
        this.adoptedStyleSheetCb(adoptedStyleSheetData);
      }
      reset() {
        this.styleMirror.reset();
        this.trackedLinkElements = /* @__PURE__ */ new WeakSet();
      }
      // TODO: take snapshot on stylesheet reload by applying event listener
      trackStylesheetInLinkElement(_linkEl) {
      }
    };
    ProcessedNodeManager = class {
      constructor() {
        __publicField(this, "nodeMap", /* @__PURE__ */ new WeakMap());
        __publicField(this, "active", false);
      }
      inOtherBuffer(node2, thisBuffer) {
        const buffers = this.nodeMap.get(node2);
        return buffers && Array.from(buffers).some((buffer) => buffer !== thisBuffer);
      }
      add(node2, buffer) {
        if (!this.active) {
          this.active = true;
          requestAnimationFrame(() => {
            this.nodeMap = /* @__PURE__ */ new WeakMap();
            this.active = false;
          });
        }
        this.nodeMap.set(node2, (this.nodeMap.get(node2) || /* @__PURE__ */ new Set()).add(buffer));
      }
      destroy() {
      }
    };
    recording = false;
    try {
      if (Array.from([1], (x22) => x22 * 2)[0] !== 2) {
        const cleanFrame = document.createElement("iframe");
        document.body.appendChild(cleanFrame);
        Array.from = ((_a2 = cleanFrame.contentWindow) == null ? void 0 : _a2.Array.from) || Array.from;
        document.body.removeChild(cleanFrame);
      }
    } catch (err2) {
      console.debug("Unable to override Array.from", err2);
    }
    mirror = createMirror$2();
    record.addCustomEvent = (tag, payload) => {
      if (!recording) {
        throw new Error("please add custom event after start recording");
      }
      wrappedEmit({
        type: EventType.Custom,
        data: {
          tag,
          payload
        }
      });
    };
    record.freezePage = () => {
      mutationBuffers.forEach((buf) => buf.freeze());
    };
    record.takeFullSnapshot = (isCheckout) => {
      if (!recording) {
        throw new Error("please take full snapshot after start recording");
      }
      takeFullSnapshot$1(isCheckout);
    };
    record.mirror = mirror;
    !(function(t22) {
      t22[t22.NotStarted = 0] = "NotStarted", t22[t22.Running = 1] = "Running", t22[t22.Stopped = 2] = "Stopped";
    })(n2 || (n2 = {}));
    SKIP_TIME_INTERVAL = 5 * 1e3;
    ({ addCustomEvent } = record);
    ({ freezePage } = record);
    ({ takeFullSnapshot } = record);
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/session_replay/shared/recorder-events.js
var RecorderEvents;
var init_recorder_events = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/session_replay/shared/recorder-events.js"() {
    init_event_buffer();
    RecorderEvents = class {
      /** The buffer to hold recorder event nodes */
      #events = new EventBuffer(Infinity);
      /** Payload metadata -- Should indicate when a replay blob started recording.  Resets each time a harvest occurs.
         * cycle timestamps are used as fallbacks if event timestamps cannot be used
         */
      cycleTimestamp = Date.now();
      /** Payload metadata -- Should indicate that the payload being sent has a full DOM snapshot. This can happen
       * -- When the recording library begins recording, it starts by taking a DOM snapshot
       * -- When visibility changes from "hidden" -> "visible", it must capture a full snapshot for the replay to work correctly across tabs
      */
      hasSnapshot = false;
      /** Payload metadata -- Should indicate that the payload being sent has a meta node. The meta node should always precede a snapshot node. */
      hasMeta = false;
      /** Payload metadata -- Should indicate that the payload being sent contains an error.  Used for query/filter purposes in UI */
      hasError = false;
      constructor(shouldInlineStylesheets = true) {
        this.inlinedAllStylesheets = shouldInlineStylesheets;
      }
      add(event, evaluatedSize) {
        this.#events.add(event, evaluatedSize);
      }
      get events() {
        return this.#events.get();
      }
      /** A value which increments with every new mutation node reported. Resets after a harvest is sent */
      get payloadBytesEstimation() {
        return this.#events.byteSize();
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/session_replay/shared/recorder.js
var recorder_exports = {};
__export(recorder_exports, {
  Recorder: () => Recorder
});
var RRWEB_DATA_CHANNEL, Recorder;
var init_recorder = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/session_replay/shared/recorder.js"() {
    init_rrweb();
    init_stringify();
    init_constants12();
    init_recorder_events();
    init_constants3();
    init_stylesheet_evaluator();
    init_handle();
    init_constants4();
    init_features();
    init_utils();
    init_agent_constants();
    init_console();
    init_invoke();
    init_register_handler();
    RRWEB_DATA_CHANNEL = "rrweb-data";
    Recorder = class {
      /** flag that if true, blocks events from being "stored".  Only set to true when a full snapshot has incomplete nodes (only stylesheets ATM) */
      #fixing = false;
      #warnCSSOnce = single(() => warn(47));
      // notifies user of potential replayer issue if fix_stylesheets is off
      #canRecord = true;
      triggerHistory = [];
      // useful for debugging
      constructor(srInstrument) {
        this.srInstrument = srInstrument;
        this.ee = srInstrument.ee;
        this.srFeatureName = srInstrument.featureName;
        this.agentRef = srInstrument.agentRef;
        this.isErrorMode = false;
        this.shouldFix = this.agentRef.init.session_replay.fix_stylesheets;
        this.events = new RecorderEvents(this.shouldFix);
        this.backloggedEvents = new RecorderEvents(this.shouldFix);
        this.hasSeenSnapshot = false;
        this.hasSeenMeta = false;
        this.lastMeta = false;
        this.stopRecording = () => {
          this.agentRef.runtime.isRecording = false;
        };
        defaultRegister(SESSION_ERROR, () => {
          this.#canRecord = false;
          this.stopRecording();
        }, this.srFeatureName, this.ee);
        const processReplayNode = (event, isCheckout) => {
          this.audit(event, isCheckout);
        };
        if (this.srInstrument.featAggregate?.drained) this.ee.on(RRWEB_DATA_CHANNEL, processReplayNode);
        else defaultRegister(RRWEB_DATA_CHANNEL, processReplayNode, this.srFeatureName, this.ee);
      }
      get trigger() {
        return this.triggerHistory[this.triggerHistory.length - 1];
      }
      getEvents() {
        return {
          events: [...this.backloggedEvents.events, ...this.events.events].filter((x3) => x3),
          type: "standard",
          cycleTimestamp: Math.min(this.backloggedEvents.cycleTimestamp, this.events.cycleTimestamp),
          payloadBytesEstimation: this.backloggedEvents.payloadBytesEstimation + this.events.payloadBytesEstimation,
          hasError: this.backloggedEvents.hasError || this.events.hasError,
          hasMeta: this.backloggedEvents.hasMeta || this.events.hasMeta,
          hasSnapshot: this.backloggedEvents.hasSnapshot || this.events.hasSnapshot,
          inlinedAllStylesheets: !!this.backloggedEvents.events.length && this.backloggedEvents.inlinedAllStylesheets || this.events.inlinedAllStylesheets
        };
      }
      /** Clears the buffer (this.events), and resets all payload metadata properties */
      clearBuffer() {
        this.backloggedEvents = this.isErrorMode ? this.events : new RecorderEvents(this.shouldFix);
        this.events = new RecorderEvents(this.shouldFix);
      }
      /** Begin recording using configured recording lib */
      startRecording(trigger, mode) {
        if (!this.#canRecord) return;
        this.triggerHistory.push(trigger);
        this.isErrorMode = mode === MODE.ERROR;
        this.stopRecording();
        this.agentRef.runtime.isRecording = true;
        const {
          block_class,
          ignore_class,
          mask_text_class,
          block_selector,
          mask_input_options,
          mask_text_selector,
          mask_all_inputs,
          inline_images,
          collect_fonts
        } = this.agentRef.init.session_replay;
        let stop;
        try {
          stop = record({
            emit: (event, isCheckout) => {
              handle(RRWEB_DATA_CHANNEL, [event, isCheckout], void 0, this.srFeatureName, this.ee);
            },
            blockClass: block_class,
            ignoreClass: ignore_class,
            maskTextClass: mask_text_class,
            blockSelector: block_selector,
            maskInputOptions: mask_input_options,
            maskTextSelector: mask_text_selector,
            maskTextFn: customMasker,
            maskAllInputs: mask_all_inputs,
            maskInputFn: customMasker,
            inlineStylesheet: true,
            inlineImages: inline_images,
            collectFonts: collect_fonts,
            checkoutEveryNms: CHECKOUT_MS[mode],
            recordAfter: "DOMContentLoaded",
            slimDOMOptions: "all"
          });
        } catch (err2) {
          this.ee.emit("internal-error", [err2]);
        }
        this.stopRecording = () => {
          this.agentRef.runtime.isRecording = false;
          stop?.();
        };
      }
      /**
       * audit - Checks if the event node payload is missing certain attributes
       * will forward on to the "store" method if nothing needs async fixing
       * @param {*} event - An RRWEB event node
       * @param {*} isCheckout - Flag indicating if the payload was triggered as a checkout
       */
      audit(event, isCheckout) {
        const incompletes = this.agentRef.init.session_replay.fix_stylesheets ? stylesheetEvaluator.evaluate() : 0;
        const missingInlineSMTag = "SessionReplay/Payload/Missing-Inline-Css/";
        if (!this.shouldFix) {
          if (incompletes > 0) {
            this.events.inlinedAllStylesheets = false;
            this.#warnCSSOnce();
            handle(SUPPORTABILITY_METRIC_CHANNEL, [missingInlineSMTag + "Skipped", incompletes], void 0, FEATURE_NAMES.metrics, this.ee);
          }
          return this.store(event, isCheckout);
        }
        if (!incompletes && this.#fixing && event.type === RRWEB_EVENT_TYPES.Meta) this.#fixing = false;
        if (incompletes > 0) {
          stylesheetEvaluator.fix().then((failedToFix) => {
            if (failedToFix > 0) {
              this.events.inlinedAllStylesheets = false;
              this.shouldFix = false;
            }
            handle(SUPPORTABILITY_METRIC_CHANNEL, [missingInlineSMTag + "Failed", failedToFix], void 0, FEATURE_NAMES.metrics, this.ee);
            handle(SUPPORTABILITY_METRIC_CHANNEL, [missingInlineSMTag + "Fixed", incompletes - failedToFix], void 0, FEATURE_NAMES.metrics, this.ee);
            this.takeFullSnapshot();
          });
          if (event.type === RRWEB_EVENT_TYPES.FullSnapshot || event.type === RRWEB_EVENT_TYPES.Meta) this.#fixing = true;
        }
        if (!this.#fixing) this.store(event, isCheckout);
      }
      /** Store a payload in the buffer (this.events).  This should be the callback to the recording lib noticing a mutation */
      store(event, isCheckout) {
        if (!event || this.srInstrument.featAggregate?.blocked) return;
        event.timestamp = this.agentRef.runtime.timeKeeper.correctAbsoluteTimestamp(event.timestamp);
        event.__serialized = stringify(event);
        const eventBytes = event.__serialized.length;
        const payloadSize = this.getPayloadSize(eventBytes);
        handle(SUPPORTABILITY_METRIC_CHANNEL, ["rrweb/node/" + event.type + "/bytes", eventBytes], void 0, FEATURE_NAMES.metrics, this.ee);
        if (this.isErrorMode && isCheckout && event.type === RRWEB_EVENT_TYPES.Meta) {
          this.clearBuffer();
        }
        this.hasSeenMeta ||= this.events.hasMeta ||= event.type === RRWEB_EVENT_TYPES.Meta;
        this.hasSeenSnapshot ||= this.events.hasSnapshot ||= event.type === RRWEB_EVENT_TYPES.FullSnapshot;
        this.events.add(event, eventBytes);
        if ((this.events.hasSnapshot && this.events.hasMeta || payloadSize > IDEAL_PAYLOAD_SIZE) && !this.isErrorMode) {
          this.agentRef.runtime.harvester.triggerHarvestFor(this.srInstrument.featAggregate);
        }
      }
      /** force the recording lib to take a full DOM snapshot.  This needs to occur in certain cases, like visibility changes */
      takeFullSnapshot() {
        try {
          if (!this.agentRef.runtime.isRecording) return;
          record.takeFullSnapshot();
        } catch (err2) {
        }
      }
      clearTimestamps() {
        this.events.cycleTimestamp = void 0;
      }
      /** Estimate the payload size */
      getPayloadSize(newBytes = 0) {
        return this.estimateCompression(this.events.payloadBytesEstimation + newBytes) + QUERY_PARAM_PADDING2;
      }
      /** Extensive research has yielded about an 88% compression factor on these payloads.
       * This is an estimation using that factor as to not cause performance issues while evaluating
       * https://staging.onenr.io/037jbJWxbjy
       * */
      estimateCompression(data) {
        if (!!this.srInstrument.featAggregate?.gzipper && !!this.srInstrument.featAggregate?.u8) return data * AVG_COMPRESSION;
        return data;
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/common/dom/selector-path.js
function buildPathSelector(elem, pathSelector) {
  const {
    id: id2,
    localName
  } = elem;
  return [localName, id2 ? "#".concat(id2) : "", pathSelector ? ">".concat(pathSelector) : ""].join("");
}
function getNthOfTypeIndex(node2) {
  try {
    let i2 = 1;
    const {
      tagName
    } = node2;
    while (node2.previousElementSibling) {
      if (node2.previousElementSibling.tagName === tagName) i2++;
      node2 = node2.previousElementSibling;
    }
    return i2;
  } catch (err2) {
  }
}
function nearestAttrName(originalFieldName) {
  if (originalFieldName === "tagName") originalFieldName = "tag";
  if (originalFieldName === "className") originalFieldName = "class";
  return "nearest".concat(originalFieldName.charAt(0).toUpperCase() + originalFieldName.slice(1));
}
var analyzeElemPath;
var init_selector_path = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/common/dom/selector-path.js"() {
    analyzeElemPath = (elem, targetFields = []) => {
      const result2 = {
        path: void 0,
        nearestFields: {},
        hasButton: false,
        hasLink: false
      };
      if (!elem) return result2;
      if (elem === window) {
        result2.path = "window";
        return result2;
      }
      if (elem === document) {
        result2.path = "document";
        return result2;
      }
      let pathSelector = "";
      const index3 = getNthOfTypeIndex(elem);
      try {
        while (elem?.tagName) {
          const tagName = elem.tagName.toLowerCase();
          result2.hasLink ||= tagName === "a";
          result2.hasButton ||= tagName === "button" || tagName === "input" && elem.type.toLowerCase() === "button";
          targetFields.forEach((field) => {
            result2.nearestFields[nearestAttrName(field)] ||= elem[field]?.baseVal || elem[field];
          });
          pathSelector = buildPathSelector(elem, pathSelector);
          elem = elem.parentNode;
        }
      } catch (err2) {
      }
      result2.path = pathSelector ? index3 ? "".concat(pathSelector, ":nth-of-type(").concat(index3, ")") : pathSelector : void 0;
      return result2;
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/generic_events/aggregate/user-actions/aggregated-user-action.js
var AggregatedUserAction;
var init_aggregated_user_action = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/generic_events/aggregate/user-actions/aggregated-user-action.js"() {
    init_constants2();
    init_clean_url();
    AggregatedUserAction = class {
      constructor(evt, selectorInfo) {
        this.event = evt;
        this.count = 1;
        this.originMs = Math.floor(evt.timeStamp);
        this.relativeMs = [0];
        this.selectorPath = selectorInfo.path;
        this.rageClick = void 0;
        this.nearestTargetFields = selectorInfo.nearestFields;
        this.currentUrl = cleanURL("" + location);
        this.deadClick = false;
        this.errorClick = false;
      }
      /**
       * Aggregates the count and maintains the relative MS array for matching events
       * Will determine if a rage click was observed as part of the aggregation
       * @param {Event} evt
       * @returns {void}
       */
      aggregate(evt) {
        this.count++;
        this.relativeMs.push(Math.floor(evt.timeStamp - this.originMs));
        if (this.isRageClick()) this.rageClick = true;
      }
      /**
       * Determines if the current set of relative ms values constitutes a rage click
       * @returns {boolean}
       */
      isRageClick() {
        const len = this.relativeMs.length;
        return this.event.type === "click" && len >= RAGE_CLICK_THRESHOLD_EVENTS && this.relativeMs[len - 1] - this.relativeMs[len - RAGE_CLICK_THRESHOLD_EVENTS] < RAGE_CLICK_THRESHOLD_MS;
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/generic_events/aggregate/user-actions/user-actions-aggregator.js
function getAggregationKey(evt, selectorPath) {
  let aggregationKey = evt.type;
  if (evt.type !== "scrollend") aggregationKey += "-" + selectorPath;
  return aggregationKey;
}
var UserActionsAggregator;
var init_user_actions_aggregator = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/generic_events/aggregate/user-actions/user-actions-aggregator.js"() {
    init_selector_path();
    init_constants2();
    init_aggregated_user_action();
    init_timer();
    init_nreum();
    UserActionsAggregator = class {
      /** @type {AggregatedUserAction=} */
      #aggregationEvent = void 0;
      #aggregationKey = "";
      #deadClickTimer = void 0;
      #domObserver = void 0;
      #errorClickTimer = void 0;
      constructor() {
        if (gosNREUMOriginals().o.MO) {
          this.#domObserver = new MutationObserver(this.isLiveClick.bind(this));
        }
      }
      get aggregationEvent() {
        const finishedEvent = this.#aggregationEvent;
        this.#aggregationKey = "";
        this.#aggregationEvent = void 0;
        return finishedEvent;
      }
      /**
       * Process the event and determine if a new aggregation set should be made or if it should increment the current aggregation
       * @param {Event} evt The event supplied by the addEventListener callback
       * @returns {AggregatedUserAction|undefined} The previous aggregation set if it has been completed by processing the current event
       */
      process(evt, targetFields) {
        if (!evt) return;
        const targetElem = OBSERVED_WINDOW_EVENTS.includes(evt.type) ? window : evt.target;
        const selectorInfo = analyzeElemPath(targetElem, targetFields);
        const aggregationKey = getAggregationKey(evt, selectorInfo.path);
        if (!!aggregationKey && aggregationKey === this.#aggregationKey) {
          this.#aggregationEvent.aggregate(evt);
        } else {
          const finishedEvent = this.#aggregationEvent;
          this.#deadClickCleanup();
          this.#errorClickCleanup();
          this.#aggregationKey = aggregationKey;
          this.#aggregationEvent = new AggregatedUserAction(evt, selectorInfo);
          if (evt.type === "click" && (selectorInfo.hasButton || selectorInfo.hasLink)) {
            this.#deadClickSetup(this.#aggregationEvent);
            this.#errorClickSetup();
          }
          return finishedEvent;
        }
      }
      markAsErrorClick() {
        if (this.#aggregationEvent && this.#errorClickTimer) {
          this.#aggregationEvent.errorClick = true;
          this.#errorClickCleanup();
        }
      }
      #errorClickSetup() {
        this.#errorClickTimer = new Timer({
          onEnd: () => {
            this.#errorClickCleanup();
          }
        }, FRUSTRATION_TIMEOUT_MS);
      }
      #errorClickCleanup() {
        this.#errorClickTimer?.clear();
        this.#errorClickTimer = void 0;
      }
      #deadClickSetup(userAction) {
        if (this.#isEvaluatingDeadClick() || !this.#domObserver) return;
        this.#domObserver.observe(document, {
          attributes: true,
          characterData: true,
          childList: true,
          subtree: true
        });
        this.#deadClickTimer = new Timer({
          onEnd: () => {
            userAction.deadClick = true;
            this.#deadClickCleanup();
          }
        }, FRUSTRATION_TIMEOUT_MS);
      }
      #deadClickCleanup() {
        this.#domObserver?.disconnect();
        this.#deadClickTimer?.clear();
        this.#deadClickTimer = void 0;
      }
      #isEvaluatingDeadClick() {
        return this.#deadClickTimer !== void 0;
      }
      isLiveClick() {
        if (this.#isEvaluatingDeadClick()) this.#deadClickCleanup();
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/generic_events/aggregate/index.js
var aggregate_exports8 = {};
__export(aggregate_exports8, {
  Aggregate: () => Aggregate8
});
var Aggregate8;
var init_aggregate8 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/generic_events/aggregate/index.js"() {
    init_stringify();
    init_clean_url();
    init_constants2();
    init_runtime();
    init_aggregate_base();
    init_console();
    init_now();
    init_register_handler();
    init_traverse();
    init_user_actions_aggregator();
    init_iframe();
    init_type_check();
    init_v2();
    Aggregate8 = class extends AggregateBase {
      static featureName = FEATURE_NAME;
      #userActionAggregator;
      constructor(agentRef) {
        super(agentRef, FEATURE_NAME);
        this.referrerUrl = isBrowserScope && document.referrer ? cleanURL(document.referrer) : void 0;
        this.waitForFlags(["ins"]).then(([ins]) => {
          if (!ins) {
            this.blocked = true;
            this.deregisterDrain();
            return;
          }
          this.#trackSupportabilityMetrics();
          defaultRegister("api-recordCustomEvent", (timestamp, eventType, attributes, target) => {
            if (RESERVED_EVENT_TYPES.includes(eventType)) return warn(46);
            this.addEvent({
              eventType,
              timestamp: this.#toEpoch(timestamp),
              ...attributes
            }, target);
          }, this.featureName, this.ee);
          if (agentRef.init.page_action.enabled) {
            defaultRegister("api-addPageAction", (timestamp, name, attributes, target) => {
              this.addEvent({
                ...attributes,
                eventType: "PageAction",
                timestamp: this.#toEpoch(timestamp),
                timeSinceLoad: timestamp / 1e3,
                actionName: name,
                referrerUrl: this.referrerUrl,
                ...isBrowserScope && {
                  browserWidth: window.document.documentElement?.clientWidth,
                  browserHeight: window.document.documentElement?.clientHeight
                }
              }, target);
            }, this.featureName, this.ee);
          }
          let addUserAction = () => {
          };
          if (isBrowserScope && agentRef.init.user_actions.enabled) {
            this.#userActionAggregator = new UserActionsAggregator();
            this.harvestOpts.beforeUnload = () => addUserAction?.(this.#userActionAggregator.aggregationEvent);
            addUserAction = (aggregatedUserAction) => {
              try {
                if (aggregatedUserAction?.event) {
                  let targetAttrName = function(originalFieldName) {
                    if (originalFieldName === "tagName") originalFieldName = "tag";
                    if (originalFieldName === "className") originalFieldName = "class";
                    return "target".concat(originalFieldName.charAt(0).toUpperCase() + originalFieldName.slice(1));
                  }, canTrustTargetAttribute = function(attribute) {
                    return !!(aggregatedUserAction.selectorPath !== "window" && aggregatedUserAction.selectorPath !== "document" && target instanceof HTMLElement && target?.[attribute]);
                  };
                  const {
                    target,
                    timeStamp,
                    type
                  } = aggregatedUserAction.event;
                  const userActionEvent = {
                    eventType: "UserAction",
                    timestamp: this.#toEpoch(timeStamp),
                    action: type,
                    actionCount: aggregatedUserAction.count,
                    actionDuration: aggregatedUserAction.relativeMs[aggregatedUserAction.relativeMs.length - 1],
                    actionMs: aggregatedUserAction.relativeMs,
                    rageClick: aggregatedUserAction.rageClick,
                    target: aggregatedUserAction.selectorPath,
                    currentUrl: aggregatedUserAction.currentUrl,
                    ...isIFrameWindow(window) && {
                      iframe: true
                    },
                    ...this.agentRef.init.user_actions.elementAttributes.reduce((acc, field) => {
                      if (canTrustTargetAttribute(field)) acc[targetAttrName(field)] = String(target[field]).trim().slice(0, 128);
                      return acc;
                    }, {}),
                    ...aggregatedUserAction.nearestTargetFields,
                    ...aggregatedUserAction.deadClick && {
                      deadClick: true
                    },
                    ...aggregatedUserAction.errorClick && {
                      errorClick: true
                    }
                  };
                  this.addEvent(userActionEvent);
                  this.#trackUserActionSM(userActionEvent);
                }
              } catch (e2) {
              }
            };
            defaultRegister("ua", (evt) => {
              addUserAction(this.#userActionAggregator.process(evt, this.agentRef.init.user_actions.elementAttributes));
            }, this.featureName, this.ee);
            defaultRegister("navChange", () => {
              this.#userActionAggregator.isLiveClick();
            }, this.featureName, this.ee);
            defaultRegister("uaXhr", () => {
              this.#userActionAggregator.isLiveClick();
            }, this.featureName, this.ee);
            defaultRegister("uaErr", () => this.#userActionAggregator.markAsErrorClick(), this.featureName, this.ee);
          }
          const performanceTypesToCapture = [...agentRef.init.performance.capture_marks ? ["mark"] : [], ...agentRef.init.performance.capture_measures ? ["measure"] : []];
          if (performanceTypesToCapture.length) {
            try {
              performanceTypesToCapture.forEach((type) => {
                if (PerformanceObserver.supportedEntryTypes.includes(type)) {
                  const observer = new PerformanceObserver((list2) => {
                    list2.getEntries().forEach((entry) => {
                      try {
                        let createDetailAttrs = function(detail) {
                          if (detail === null || detail === void 0) return {};
                          else if (!isPureObject(detail)) return {
                            entryDetail: detail
                          };
                          else return flattenJSON(detail);
                          function flattenJSON(nestedJSON, parentKey = "entryDetail") {
                            let items = {};
                            if (nestedJSON === null || nestedJSON === void 0) return items;
                            Object.keys(nestedJSON).forEach((key) => {
                              let newKey = parentKey + "." + key;
                              if (isPureObject(nestedJSON[key])) {
                                Object.assign(items, flattenJSON(nestedJSON[key], newKey));
                              } else {
                                if (nestedJSON[key] !== null && nestedJSON[key] !== void 0) items[newKey] = nestedJSON[key];
                              }
                            });
                            return items;
                          }
                        };
                        this.reportSupportabilityMetric("Generic/Performance/" + type + "/Seen");
                        const detailObj = agentRef.init.performance.capture_detail ? createDetailAttrs(entry.detail) : {};
                        this.addEvent({
                          ...detailObj,
                          eventType: "BrowserPerformance",
                          timestamp: this.#toEpoch(entry.startTime),
                          entryName: entry.name,
                          entryDuration: entry.duration,
                          entryType: type
                        });
                      } catch (err2) {
                      }
                    });
                  });
                  observer.observe({
                    buffered: true,
                    type
                  });
                }
              });
            } catch (err2) {
            }
          }
          if (isBrowserScope && agentRef.init.performance.resources.enabled) {
            defaultRegister("browserPerformance.resource", (entry) => {
              try {
                const {
                  name,
                  duration,
                  ...entryObject
                } = entry.toJSON();
                let firstParty = false;
                try {
                  const entryDomain = new URL(name).hostname;
                  const isNr = entryDomain.includes("newrelic.com") || entryDomain.includes("nr-data.net") || entryDomain.includes("nr-local.net");
                  if (this.agentRef.init.performance.resources.ignore_newrelic && isNr) return;
                  if (this.agentRef.init.performance.resources.asset_types.length && !this.agentRef.init.performance.resources.asset_types.includes(entryObject.initiatorType)) return;
                  firstParty = entryDomain === globalScope?.location.hostname || agentRef.init.performance.resources.first_party_domains.includes(entryDomain);
                  if (firstParty) this.reportSupportabilityMetric("Generic/Performance/FirstPartyResource/Seen");
                  if (isNr) this.reportSupportabilityMetric("Generic/Performance/NrResource/Seen");
                } catch (err2) {
                }
                this.reportSupportabilityMetric("Generic/Performance/Resource/Seen");
                const event = {
                  ...entryObject,
                  eventType: "BrowserPerformance",
                  timestamp: this.#toEpoch(entryObject.startTime),
                  entryName: cleanURL(name),
                  entryDuration: duration,
                  firstParty
                };
                this.addEvent(event);
              } catch (err2) {
                this.ee.emit("internal-error", [err2, "GenericEvents-Resource"]);
              }
            }, this.featureName, this.ee);
          }
          defaultRegister("api-measure", (args, n3, target) => {
            const {
              start,
              duration,
              customAttributes
            } = args;
            const event = {
              ...customAttributes,
              eventType: "BrowserPerformance",
              timestamp: this.#toEpoch(start),
              entryName: n3,
              entryDuration: duration,
              entryType: "measure"
            };
            this.addEvent(event, target);
          }, this.featureName, this.ee);
          if (agentRef.init.feature_flags.includes("websockets")) {
            defaultRegister("ws-complete", (nrData) => {
              const event = {
                ...nrData,
                eventType: "WebSocket",
                timestamp: this.#toEpoch(nrData.timestamp),
                openedAt: this.#toEpoch(nrData.openedAt),
                closedAt: this.#toEpoch(nrData.closedAt)
              };
              this.reportSupportabilityMetric("WebSocket/Completed/Seen");
              this.reportSupportabilityMetric("WebSocket/Completed/Bytes", stringify(event).length);
              this.addEvent(event);
            }, this.featureName, this.ee);
          }
          this.drain();
        });
      }
      // WARNING: Insights times are in seconds. EXCEPT timestamp, which is in ms.
      /** Some keys are set by the query params or request headers sent with the harvest and override the body values, so check those before adding new standard body values...
       * see harvest.js#baseQueryString for more info on the query params
       * Notably:
       * * name: set by the `t=` query param
       * * appId: set by the `a=` query param
       * * standalone: set by the `sa=` query param
       * * session: set by the `s=` query param
       * * sessionTraceId: set by the `ptid=` query param
       * * userAgent*: set by the userAgent header
       * @param {object=} obj the event object for storing in the event buffer
       * @param {string=} target the target metadata for the event to scope buffering and harvesting. Defaults to container agent config if undefined
       * @returns void
       */
      addEvent(obj2 = {}, target) {
        if (!obj2 || !Object.keys(obj2).length) return;
        if (!obj2.eventType) {
          warn(44);
          return;
        }
        for (let key in obj2) {
          let val = obj2[key];
          obj2[key] = val && typeof val === "object" ? stringify(val) : val;
        }
        const defaultEventAttributes = {
          /** should be overridden by the event-specific attributes, but just in case -- set it to now() */
          timestamp: this.#toEpoch(now()),
          /** all generic events require pageUrl(s) */
          pageUrl: cleanURL("" + initialLocation),
          currentUrl: cleanURL("" + location),
          /** Specific attributes only supplied if harvesting to endpoint version 2 */
          ...getVersion2Attributes(target, this)
        };
        const eventAttributes = {
          /** Agent-level custom attributes */
          ...this.agentRef.info.jsAttributes || {},
          /** Fallbacks for required properties in-case the event did not supply them, should take precedence over agent-level custom attrs */
          ...defaultEventAttributes,
          /** Event-specific attributes take precedence over agent-level custom attributes and fallbacks */
          ...obj2
        };
        this.events.add(eventAttributes);
      }
      serializer(eventBuffer) {
        return applyFnToProps({
          ins: eventBuffer
        }, this.obfuscator.obfuscateString.bind(this.obfuscator), "string");
      }
      queryStringsBuilder() {
        return {
          ua: this.agentRef.info.userAttributes,
          at: this.agentRef.info.atts
        };
      }
      #toEpoch(timestamp) {
        return Math.floor(this.agentRef.runtime.timeKeeper.correctRelativeTimestamp(timestamp));
      }
      #trackSupportabilityMetrics() {
        const configPerfTag = "Config/Performance/";
        if (this.agentRef.init.performance.capture_marks) this.reportSupportabilityMetric(configPerfTag + "CaptureMarks/Enabled");
        if (this.agentRef.init.performance.capture_measures) this.reportSupportabilityMetric(configPerfTag + "CaptureMeasures/Enabled");
        if (this.agentRef.init.performance.resources.enabled) this.reportSupportabilityMetric(configPerfTag + "Resources/Enabled");
        if (this.agentRef.init.performance.resources.asset_types?.length !== 0) this.reportSupportabilityMetric(configPerfTag + "Resources/AssetTypes/Changed");
        if (this.agentRef.init.performance.resources.first_party_domains?.length !== 0) this.reportSupportabilityMetric(configPerfTag + "Resources/FirstPartyDomains/Changed");
        if (this.agentRef.init.performance.resources.ignore_newrelic === false) this.reportSupportabilityMetric(configPerfTag + "Resources/IgnoreNewrelic/Changed");
      }
      #trackUserActionSM(ua) {
        if (ua.rageClick) this.reportSupportabilityMetric("UserAction/RageClick/Seen");
        if (ua.deadClick) this.reportSupportabilityMetric("UserAction/DeadClick/Seen");
        if (ua.errorClick) this.reportSupportabilityMetric("UserAction/ErrorClick/Seen");
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/logging/shared/log.js
var Log;
var init_log = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/logging/shared/log.js"() {
    init_runtime();
    init_clean_url();
    init_constants5();
    Log = class {
      /** @type {long} the unix timestamp of the log event */
      timestamp;
      /** @type {string} the log message */
      message;
      /** @type {object} the object of attributes to be parsed by logging ingest into top-level properties */
      attributes;
      /** @type {'ERROR'|'TRACE'|'DEBUG'|'INFO'|'WARN'} the log type of the log */
      level;
      /**
       * @param {number} timestamp - Unix timestamp
       * @param {string} message - message string
       * @param {object} attributes - other log event attributes
       * @param {enum} level - Log level
       */
      constructor(timestamp, message, attributes = {}, level = LOG_LEVELS.INFO) {
        this.timestamp = timestamp;
        this.message = message;
        this.attributes = {
          ...attributes,
          pageUrl: cleanURL("" + initialLocation)
        };
        this.level = level.toUpperCase();
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/logging/aggregate/index.js
var aggregate_exports9 = {};
__export(aggregate_exports9, {
  Aggregate: () => Aggregate9
});
var LOGGING_EVENT, Aggregate9;
var init_aggregate9 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/logging/aggregate/index.js"() {
    init_register_handler();
    init_console();
    init_stringify();
    init_aggregate_base();
    init_constants5();
    init_log();
    init_utils2();
    init_traverse();
    init_constants3();
    init_constants12();
    init_feature_gates();
    init_v2();
    LOGGING_EVENT = "Logging/Event/";
    Aggregate9 = class extends AggregateBase {
      static featureName = FEATURE_NAME3;
      constructor(agentRef) {
        super(agentRef, FEATURE_NAME3);
        const updateLocalLoggingMode = (auto, api) => {
          this.loggingMode = {
            auto,
            api
          };
          if (api === void 0) this.loggingMode.api = auto;
        };
        this.harvestOpts.raw = true;
        super.customAttributesAreSeparate = true;
        this.ee.on(SESSION_EVENTS.RESET, () => {
          this.abort(ABORT_REASONS.RESET);
        });
        this.ee.on(SESSION_EVENTS.UPDATE, (type, data) => {
          if (this.blocked || type !== SESSION_EVENT_TYPES.CROSS_TAB) return;
          if (data.loggingMode === LOGGING_MODE.OFF && (!data.logApiMode || data.logApiMode === LOGGING_MODE.OFF)) this.abort(ABORT_REASONS.CROSS_TAB);
          else updateLocalLoggingMode(data.loggingMode, data.logApiMode);
        });
        this.waitForFlags(["log", "logapi"]).then(([auto, api]) => {
          if (this.blocked) return;
          this.loggingMode ??= {
            auto,
            api
          };
          const session = this.agentRef.runtime.session;
          if (canEnableSessionTracking(agentRef.init) && session) {
            if (session.isNew) this.#syncWithSessionManager();
            else updateLocalLoggingMode(session.state.loggingMode, session.state.logApiMode);
          }
          if (this.loggingMode.auto === LOGGING_MODE.OFF && this.loggingMode.api === LOGGING_MODE.OFF) {
            this.blocked = true;
            this.deregisterDrain();
            return;
          }
          defaultRegister(LOGGING_EVENT_EMITTER_CHANNEL, this.handleLog.bind(this), this.featureName, this.ee);
          this.drain();
          agentRef.runtime.harvester.triggerHarvestFor(this);
        });
      }
      handleLog(timestamp, message, attributes = {}, level = LOG_LEVELS.INFO, autoCaptured, target) {
        if (this.blocked) return;
        const modeForThisLog = autoCaptured ? this.loggingMode.auto : this.loggingMode.api;
        if (!modeForThisLog) return;
        if (!attributes || typeof attributes !== "object") attributes = {};
        attributes = {
          ...attributes,
          /** Specific attributes only supplied if harvesting to endpoint version 2 */
          ...getVersion2Attributes(target, this)
        };
        if (typeof level === "string") level = level.toUpperCase();
        if (!isValidLogLevel(level)) return warn(30, level);
        if (modeForThisLog < (LOGGING_MODE[level] || Infinity)) {
          this.reportSupportabilityMetric(LOGGING_EVENT + "Dropped/Sampling");
          return;
        }
        try {
          if (typeof message !== "string") {
            const stringified = stringify(message);
            if (!!stringified && stringified !== "{}") message = stringified;
            else message = String(message);
          }
        } catch (err2) {
          warn(16, message);
          this.reportSupportabilityMetric(LOGGING_EVENT + "Dropped/Casting");
          return;
        }
        if (typeof message !== "string" || !message) return warn(32);
        const log2 = new Log(Math.floor(this.agentRef.runtime.timeKeeper.correctRelativeTimestamp(timestamp)), message, attributes, level);
        if (this.events.add(log2)) this.reportSupportabilityMetric(LOGGING_EVENT + (autoCaptured ? "Auto" : "API") + "/Added");
      }
      serializer(eventBuffer) {
        const sessionEntity = this.agentRef.runtime.session;
        return [{
          common: {
            /** Attributes in the `common` section are added to `all` logs generated in the payload */
            attributes: {
              ...applyFnToProps(this.agentRef.info.jsAttributes, this.obfuscator.obfuscateString.bind(this.obfuscator), "string"),
              ...this.harvestEndpointVersion === 1 && {
                "entity.guid": this.agentRef.runtime.appMetadata.agents[0].entityGuid,
                appId: this.agentRef.info.applicationID
              },
              ...sessionEntity && {
                session: sessionEntity.state.value || "0",
                // The session ID that we generate and keep across page loads
                hasReplay: sessionEntity.state.sessionReplayMode === 1,
                // True if a session replay recording is running
                hasTrace: sessionEntity.state.sessionTraceMode === 1
                // True if a session trace recording is running
              },
              ptid: this.agentRef.runtime.ptid,
              // page trace id
              standalone: Boolean(this.agentRef.info.sa),
              // copy paste (true) vs APM (false)
              agentVersion: this.agentRef.runtime.version,
              // browser agent version
              // The following 3 attributes are evaluated and dropped at ingest processing time and do not get stored on NRDB:
              "instrumentation.provider": "browser",
              "instrumentation.version": this.agentRef.runtime.version,
              "instrumentation.name": this.agentRef.runtime.loaderType
            }
          },
          /** logs section contains individual unique log entries */
          logs: applyFnToProps(eventBuffer, this.obfuscator.obfuscateString.bind(this.obfuscator), "string")
        }];
      }
      queryStringsBuilder() {
        return {
          browser_monitoring_key: this.agentRef.info.licenseKey
        };
      }
      /** Abort the feature, once aborted it will not resume */
      abort(reason = {}) {
        this.reportSupportabilityMetric("Logging/Abort/".concat(reason.sm));
        this.blocked = true;
        if (this.events) {
          this.events.clear();
          this.events.clearSave();
        }
        this.loggingMode = {
          auto: LOGGING_MODE.OFF,
          api: LOGGING_MODE.OFF
        };
        this.#syncWithSessionManager();
        this.deregisterDrain();
      }
      #syncWithSessionManager() {
        this.agentRef.runtime.session?.write({
          loggingMode: this.loggingMode.auto,
          logApiMode: this.loggingMode.api
        });
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/soft_navigations/constants.js
var INTERACTION_TRIGGERS, POPSTATE_TRIGGER, API_TRIGGER_NAME, IPL_TRIGGER_NAME, FEATURE_NAME11, NO_LONG_TASK_WINDOW, POPSTATE_MERGE_WINDOW, INTERACTION_TYPE, NODE_TYPE, INTERACTION_STATUS;
var init_constants13 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/soft_navigations/constants.js"() {
    init_features();
    INTERACTION_TRIGGERS = [
      "click",
      // e.g. user clicks link or the page back/forward buttons
      "keydown",
      // e.g. user presses left and right arrow key to switch between displayed photo gallery
      "submit"
      // e.g. user clicks submit butotn or presses enter while editing a form field
    ];
    POPSTATE_TRIGGER = "popstate";
    API_TRIGGER_NAME = "api";
    IPL_TRIGGER_NAME = "initialPageLoad";
    FEATURE_NAME11 = FEATURE_NAMES.softNav;
    NO_LONG_TASK_WINDOW = 5e3;
    POPSTATE_MERGE_WINDOW = 500;
    INTERACTION_TYPE = {
      INITIAL_PAGE_LOAD: "",
      ROUTE_CHANGE: 1,
      UNSPECIFIED: 2
    };
    NODE_TYPE = {
      INTERACTION: 1,
      AJAX: 2,
      CUSTOM_END: 3,
      CUSTOM_TRACER: 4
    };
    INTERACTION_STATUS = {
      IP: "in progress",
      PF: "pending finish",
      // interaction meets the hard criteria but is awaiting flexible conditions to fully finish
      FIN: "finished",
      CAN: "cancelled"
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/soft_navigations/aggregate/bel-node.js
var nodesSeen, BelNode;
var init_bel_node = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/soft_navigations/aggregate/bel-node.js"() {
    nodesSeen = 0;
    BelNode = class {
      belType;
      /** List of other BelNode derivatives. Each children should be of a subclass that implements its own 'serialize' function. */
      children = [];
      start;
      end;
      callbackEnd = 0;
      callbackDuration = 0;
      nodeId = ++nodesSeen;
      addChild(child) {
        this.children.push(child);
      }
      /** Virtual fn for stringifying an instance. */
      serialize() {
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/soft_navigations/aggregate/ajax-node.js
var AjaxNode;
var init_ajax_node = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/soft_navigations/aggregate/ajax-node.js"() {
    init_bel_serializer();
    init_constants13();
    init_bel_node();
    AjaxNode = class extends BelNode {
      constructor(ajaxEvent, ajaxContext) {
        super();
        this.belType = NODE_TYPE.AJAX;
        this.method = ajaxEvent.method;
        this.status = ajaxEvent.status;
        this.domain = ajaxEvent.domain;
        this.path = ajaxEvent.path;
        this.txSize = ajaxEvent.requestSize;
        this.rxSize = ajaxEvent.responseSize;
        this.requestedWith = ajaxEvent.type === "fetch" ? 1 : "";
        this.spanId = ajaxEvent.spanId;
        this.traceId = ajaxEvent.traceId;
        this.spanTimestamp = ajaxEvent.spanTimestamp;
        this.gql = ajaxEvent.gql;
        this.start = ajaxEvent.startTime;
        this.end = ajaxEvent.endTime;
        if (ajaxContext?.latestLongtaskEnd) {
          this.callbackEnd = Math.max(ajaxContext.latestLongtaskEnd, this.end);
          this.callbackDuration = this.callbackEnd - this.end;
        } else this.callbackEnd = this.end;
      }
      serialize(parentStartTimestamp, agentRef) {
        const addString = getAddStringContext(agentRef.runtime.obfuscator);
        const nodeList = [];
        const fields = [
          numeric(this.belType),
          0,
          // this will be overwritten below with number of attached nodes
          numeric(this.start - parentStartTimestamp),
          // start relative to parent start (if part of first node in payload) or first parent start
          numeric(this.end - this.start),
          // end is relative to start
          numeric(this.callbackEnd - this.end),
          // callbackEnd is relative to end
          numeric(this.callbackDuration),
          // not relative
          addString(this.method),
          numeric(this.status),
          addString(this.domain),
          addString(this.path),
          numeric(this.txSize),
          numeric(this.rxSize),
          this.requestedWith,
          addString(this.nodeId),
          nullable(this.spanId, addString, true) + nullable(this.traceId, addString, true) + nullable(this.spanTimestamp, numeric)
        ];
        let allAttachedNodes = [];
        if (typeof this.gql === "object") allAttachedNodes = addCustomAttributes(this.gql, addString);
        this.children.forEach((node2) => allAttachedNodes.push(node2.serialize()));
        fields[1] = numeric(allAttachedNodes.length);
        nodeList.push(fields);
        if (allAttachedNodes.length) nodeList.push(allAttachedNodes.join(";"));
        return nodeList.join(";");
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/soft_navigations/aggregate/interaction.js
var Interaction;
var init_interaction = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/soft_navigations/aggregate/interaction.js"() {
    init_runtime();
    init_unique_id();
    init_bel_serializer();
    init_now();
    init_clean_url();
    init_constants13();
    init_bel_node();
    Interaction = class extends BelNode {
      id = generateUuid();
      // unique id that is serialized and used to link interactions with errors
      initialPageURL = initialLocation;
      customName;
      customAttributes = {};
      customDataByApi = {};
      queueTime;
      // only used by initialPageLoad interactions
      appTime;
      // only used by initialPageLoad interactions
      newRoute;
      /** Internal state of this interaction: in-progress, finished, or cancelled. */
      status = INTERACTION_STATUS.IP;
      domTimestamp = 0;
      historyTimestamp = 0;
      createdByApi = false;
      keepOpenUntilEndApi = false;
      onDone = [];
      customEnd = 0;
      cancellationTimer;
      watchLongtaskTimer;
      constructor(uiEvent, uiEventTimestamp, currentRouteKnown, currentUrl) {
        super();
        this.belType = NODE_TYPE.INTERACTION;
        this.trigger = uiEvent;
        this.start = uiEventTimestamp;
        this.oldRoute = currentRouteKnown;
        this.eventSubscription = /* @__PURE__ */ new Map([["finished", []], ["cancelled", []]]);
        this.forceSave = this.forceIgnore = false;
        if (this.trigger === API_TRIGGER_NAME) this.createdByApi = true;
        this.newURL = this.oldURL = currentUrl || globalScope?.location.href;
      }
      updateHistory(timestamp, newUrl) {
        if (this.domTimestamp > 0) return;
        if (!newUrl || newUrl === this.oldURL) return;
        this.newURL = newUrl;
        this.historyTimestamp = timestamp || now();
      }
      updateDom(timestamp) {
        if (!this.historyTimestamp || timestamp < this.historyTimestamp) return;
        this.domTimestamp = timestamp || now();
      }
      checkHistoryAndDomChange() {
        if (!(this.historyTimestamp > 0 && this.domTimestamp > this.historyTimestamp)) return false;
        if (this.status === INTERACTION_STATUS.PF) return true;
        this.status = INTERACTION_STATUS.PF;
        clearTimeout(this.cancellationTimer);
        this.watchLongtaskTimer ??= setTimeout(() => this.done(), NO_LONG_TASK_WINDOW);
        return true;
      }
      on(event, cb) {
        if (!this.eventSubscription.has(event)) throw new Error("Cannot subscribe to non pre-defined events.");
        if (typeof cb !== "function") throw new Error("Must supply function as callback.");
        this.eventSubscription.get(event).push(cb);
      }
      done(customEndTime = this.customEnd, calledByApi = false) {
        if (this.keepOpenUntilEndApi && !calledByApi) return false;
        if (this.status === INTERACTION_STATUS.FIN || this.status === INTERACTION_STATUS.CAN) return true;
        clearTimeout(this.cancellationTimer);
        clearTimeout(this.watchLongtaskTimer);
        this.onDone.forEach((apiProvidedCb) => apiProvidedCb(this.customDataByApi));
        if (this.forceIgnore) this.#cancel();
        else if (this.status === INTERACTION_STATUS.PF) this.#finish(customEndTime);
        else if (this.forceSave) this.#finish(customEndTime || performance.now());
        else this.#cancel();
        return true;
      }
      #finish(customEndTime) {
        this.end = Math.max(this.domTimestamp, this.historyTimestamp, customEndTime);
        this.status = INTERACTION_STATUS.FIN;
        const callbacks = this.eventSubscription.get("finished");
        callbacks.forEach((fn) => fn());
      }
      #cancel() {
        this.status = INTERACTION_STATUS.CAN;
        const callbacks = this.eventSubscription.get("cancelled");
        callbacks.forEach((fn) => fn());
      }
      /**
       * Given a timestamp, determine if it falls within this interaction's span, i.e. if this was the active interaction during that time.
       * For in-progress interactions, this only compares the time with the start of span. Cancelled interactions are not considered active at all.
       * Pending-finish interactions are also considered still active wrt assigning ajax or jserrors to them during the wait period.
       * @param {DOMHighResTimeStamp} timestamp
       * @returns True or false boolean.
       */
      isActiveDuring(timestamp) {
        if (this.status === INTERACTION_STATUS.IP || this.status === INTERACTION_STATUS.PF) return this.start <= timestamp;
        return this.status === INTERACTION_STATUS.FIN && this.start <= timestamp && timestamp < this.end;
      }
      // Following are virtual properties overridden by a subclass:
      get firstPaint() {
      }
      get firstContentfulPaint() {
      }
      get navTiming() {
      }
      /**
       * Serializes (BEL) the interaction data for transmission.
       * @param {Number} firstStartTimeOfPayload timestamp
       * @param {Agent} agentRef Pass in the agent reference directly so that the event itself doesnt need to store the pointers and ruin the evaluation of the event size by including unused object references.
       * @returns {String} A string that is the serialized representation of this interaction.
       */
      serialize(firstStartTimeOfPayload, agentRef) {
        const isFirstIxnOfPayload = firstStartTimeOfPayload === void 0;
        const addString = getAddStringContext(agentRef.runtime.obfuscator);
        const nodeList = [];
        let ixnType;
        if (this.trigger === IPL_TRIGGER_NAME) ixnType = INTERACTION_TYPE.INITIAL_PAGE_LOAD;
        else if (this.newURL !== this.oldURL) ixnType = INTERACTION_TYPE.ROUTE_CHANGE;
        else ixnType = INTERACTION_TYPE.UNSPECIFIED;
        const fields = [
          numeric(this.belType),
          0,
          // this will be overwritten below with number of attached nodes
          numeric(this.start - (isFirstIxnOfPayload ? 0 : firstStartTimeOfPayload)),
          // the very 1st ixn does not require offset so it should fallback to a 0 while rest is offset by the very 1st ixn's start
          numeric(this.end - this.start),
          // end -- relative to start
          numeric(0),
          // callbackEnd -- relative to start; not used by BrowserInteraction events so these are always 0
          numeric(0),
          // not relative; always 0 for BrowserInteraction
          addString(this.trigger),
          addString(cleanURL(this.initialPageURL, true)),
          addString(cleanURL(this.oldURL, true)),
          addString(cleanURL(this.newURL, true)),
          addString(this.customName),
          ixnType,
          nullable(this.queueTime, numeric, true) + nullable(this.appTime, numeric, true) + nullable(this.oldRoute, addString, true) + nullable(this.newRoute, addString, true) + addString(this.id),
          addString(this.nodeId),
          nullable(this.firstPaint, numeric, true) + nullable(this.firstContentfulPaint, numeric)
        ];
        const customAttributes = {
          ...agentRef.info.jsAttributes,
          ...this.customAttributes
        };
        const allAttachedNodes = addCustomAttributes(customAttributes || {}, addString);
        if (agentRef.info.atts) allAttachedNodes.push("a," + addString(agentRef.info.atts));
        this.children.forEach((node2) => allAttachedNodes.push(node2.serialize(isFirstIxnOfPayload ? this.start : firstStartTimeOfPayload, agentRef)));
        fields[1] = numeric(allAttachedNodes.length);
        nodeList.push(fields);
        if (allAttachedNodes.length) nodeList.push(allAttachedNodes.join(";"));
        if (this.navTiming) nodeList.push(this.navTiming);
        else nodeList.push("");
        return nodeList.join(";");
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/soft_navigations/aggregate/initial-page-load-interaction.js
var InitialPageLoadInteraction;
var init_initial_page_load_interaction = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/soft_navigations/aggregate/initial-page-load-interaction.js"() {
    init_nav_timing();
    init_interaction();
    init_bel_serializer();
    init_first_paint();
    init_first_contentful_paint();
    init_constants13();
    InitialPageLoadInteraction = class extends Interaction {
      constructor(agentRef) {
        super(IPL_TRIGGER_NAME, 0, null);
        this.queueTime = agentRef.info.queueTime;
        this.appTime = agentRef.info.applicationTime;
        this.oldURL = document.referrer || void 0;
      }
      get firstPaint() {
        return firstPaint.current.value;
      }
      get firstContentfulPaint() {
        return firstContentfulPaint.current.value;
      }
      /**
       * Build the navTiming node. This assumes the navTimingValues array in nav-timing.js has already been filled with values via the PageViewEvent feature having
       * executed the addPT function first and foremost.
       */
      get navTiming() {
        if (!navTimingValues.length) return;
        let seperator = ",";
        let navTimingNode = "b";
        let prev = 0;
        navTimingValues.slice(1, 21).forEach((v2) => {
          if (v2 !== void 0) {
            navTimingNode += seperator + numeric(v2 - prev);
            seperator = ",";
            prev = v2;
          } else {
            navTimingNode += seperator + "!";
            seperator = "";
          }
        });
        return navTimingNode;
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/features/soft_navigations/aggregate/index.js
var aggregate_exports10 = {};
__export(aggregate_exports10, {
  Aggregate: () => Aggregate10
});
function getActionText(elem) {
  const tagName = elem.tagName?.toLowerCase();
  const elementsOfInterest = ["a", "button", "input"];
  if (elementsOfInterest.includes(tagName)) {
    return elem.title || elem.value || elem.innerText;
  }
}
var Aggregate10;
var init_aggregate10 = __esm({
  "node_modules/@newrelic/browser-agent/dist/esm/features/soft_navigations/aggregate/index.js"() {
    init_handle();
    init_register_handler();
    init_webdriver_detection();
    init_load_time();
    init_features();
    init_aggregate_base();
    init_constants13();
    init_ajax_node();
    init_initial_page_load_interaction();
    init_interaction();
    Aggregate10 = class extends AggregateBase {
      static featureName = FEATURE_NAME11;
      constructor(agentRef, {
        domObserver
      }) {
        super(agentRef, FEATURE_NAME11);
        super.customAttributesAreSeparate = true;
        this.interactionsToHarvest = this.events;
        this.domObserver = domObserver;
        this.initialPageLoadInteraction = new InitialPageLoadInteraction(agentRef);
        this.initialPageLoadInteraction.onDone.push(() => {
          if (agentRef.runtime.session?.isNew) this.initialPageLoadInteraction.customAttributes.isFirstOfSession = true;
          this.initialPageLoadInteraction.customAttributes.webdriverDetected = webdriverDetected;
          this.initialPageLoadInteraction.forceSave = true;
          const ixn = this.initialPageLoadInteraction;
          this.events.add(ixn);
          this.initialPageLoadInteraction = null;
        });
        loadTime.subscribe(({
          value: loadEventTime
        }) => {
          this.initialPageLoadInteraction.done(loadEventTime);
          this.reportSupportabilityMetric("SoftNav/Interaction/InitialPageLoad/Duration/Ms", Math.round(loadEventTime));
        });
        this.latestRouteSetByApi = null;
        this.interactionInProgress = null;
        this.latestHistoryUrl = window.location.href;
        this.harvestOpts.beforeUnload = () => this.interactionInProgress?.done();
        this.waitForFlags(["spa"]).then(([spaOn]) => {
          if (spaOn) {
            this.drain();
          } else {
            this.blocked = true;
            this.deregisterDrain();
          }
        });
        defaultRegister("newUIEvent", (event) => this.startUIInteraction(event.type, Math.floor(event.timeStamp), event.target), this.featureName, this.ee);
        defaultRegister("newURL", (timestamp, url) => {
          this.latestHistoryUrl = url;
          this.interactionInProgress?.updateHistory(timestamp, url);
        }, this.featureName, this.ee);
        defaultRegister("newDom", (timestamp) => {
          this.interactionInProgress?.updateDom(timestamp);
          this.interactionInProgress?.checkHistoryAndDomChange();
        }, this.featureName, this.ee);
        this.ee.on("long-task", (task) => {
          if (!this.interactionInProgress?.watchLongtaskTimer) return;
          clearTimeout(this.interactionInProgress.watchLongtaskTimer);
          this.interactionInProgress.customEnd = task.end;
          this.interactionInProgress.watchLongtaskTimer = setTimeout(() => this.interactionInProgress.done(), NO_LONG_TASK_WINDOW);
          this.reportSupportabilityMetric("SoftNav/Interaction/Extended");
        });
        this.#registerApiHandlers();
        defaultRegister("ajax", this.#handleAjaxEvent.bind(this), this.featureName, this.ee);
        defaultRegister("jserror", this.#handleJserror.bind(this), this.featureName, this.ee);
      }
      serializer(eventBuffer) {
        let firstIxnStartTime;
        const serializedIxnList = [];
        for (const interaction of eventBuffer) {
          serializedIxnList.push(interaction.serialize(firstIxnStartTime, this.agentRef));
          if (firstIxnStartTime === void 0) firstIxnStartTime = Math.floor(interaction.start);
        }
        return "bel.7;".concat(serializedIxnList.join(";"));
      }
      startUIInteraction(eventName, startedAt, sourceElem) {
        if (this.interactionInProgress?.createdByApi) return;
        if (eventName === POPSTATE_TRIGGER && this.interactionInProgress?.trigger !== POPSTATE_TRIGGER && startedAt - this.interactionInProgress?.start <= POPSTATE_MERGE_WINDOW) return;
        if (this.interactionInProgress?.done() === false) return;
        const oldURL = eventName === POPSTATE_TRIGGER ? this.latestHistoryUrl : void 0;
        this.interactionInProgress = new Interaction(eventName, startedAt, this.latestRouteSetByApi, oldURL);
        if (eventName === INTERACTION_TRIGGERS[0]) {
          const sourceElemText = getActionText(sourceElem);
          if (sourceElemText) this.interactionInProgress.customAttributes.actionText = sourceElemText;
        }
        this.interactionInProgress.cancellationTimer = setTimeout(() => {
          this.interactionInProgress.done();
          this.reportSupportabilityMetric("SoftNav/Interaction/TimeOut");
        }, 3e4);
        this.setClosureHandlers();
      }
      setClosureHandlers() {
        this.interactionInProgress.on("finished", () => {
          const ref = this.interactionInProgress;
          this.events.add(this.interactionInProgress);
          this.interactionInProgress = null;
          this.domObserver.disconnect();
          this.reportSupportabilityMetric("SoftNav/Interaction/".concat(ref.newURL !== ref.oldURL ? "RouteChange" : "Custom", "/Duration/Ms"), Math.round(ref.end - ref.start));
        });
        this.interactionInProgress.on("cancelled", () => {
          this.interactionInProgress = null;
          this.domObserver.disconnect();
        });
      }
      /**
       * Find the active interaction (current or past) for a given timestamp. Note that historic lookups mostly only go as far back as the last harvest for this feature.
       * Also, the caller should check the status of the interaction returned if found via {@link Interaction.status}, if that's pertinent.
       * TIP: Cancelled (status) interactions are NOT returned!
       * IMPORTANT: Finished interactions are in queue for next harvest! It's highly recommended that consumer logic be synchronous for safe reference.
       * @param {DOMHighResTimeStamp} timestamp
       * @returns An {@link Interaction} or undefined, if no active interaction was found.
       */
      getInteractionFor(timestamp) {
        if (this.interactionInProgress?.isActiveDuring(timestamp)) return this.interactionInProgress;
        let saveIxn;
        const interactionsBuffer = this.interactionsToHarvest.get();
        if (!interactionsBuffer) return void 0;
        for (let idx = interactionsBuffer.length - 1; idx >= 0; idx--) {
          const finishedInteraction = interactionsBuffer[idx];
          if (finishedInteraction.isActiveDuring(timestamp)) {
            if (finishedInteraction.trigger !== IPL_TRIGGER_NAME) return finishedInteraction;
            else saveIxn = finishedInteraction;
          }
        }
        if (saveIxn) return saveIxn;
        if (this.initialPageLoadInteraction?.isActiveDuring(timestamp)) return this.initialPageLoadInteraction;
      }
      /**
       * Handles or redirect ajax event based on the interaction, if any, that it's tied to.
       * @param {Object} event see Ajax feature's storeXhr function for object definition
       * @param {Object} metadata reference to the ajax context, used to pass long task info
       */
      #handleAjaxEvent(event, metadata) {
        const associatedInteraction = this.getInteractionFor(event.startTime);
        if (!associatedInteraction) {
          handle("returnAjax", [event], void 0, FEATURE_NAMES.ajax, this.ee);
        } else {
          if (associatedInteraction.status === INTERACTION_STATUS.FIN) processAjax.call(this, event, metadata, associatedInteraction);
          else {
            associatedInteraction.on("finished", () => processAjax.call(this, event, metadata, associatedInteraction));
            associatedInteraction.on("cancelled", () => handle("returnAjax", [event], void 0, FEATURE_NAMES.ajax, this.ee));
          }
        }
        function processAjax(event2, metadata2, parentInteraction) {
          const finalEnd = parentInteraction.end;
          if (event2.startTime > finalEnd) {
            handle("returnAjax", [event2], void 0, FEATURE_NAMES.ajax, this.ee);
            return;
          }
          const newNode = new AjaxNode(event2, metadata2);
          parentInteraction.addChild(newNode);
        }
      }
      /**
       * Handles or redirects jserror event based on the interaction, if any, that it's tied to.
       * @param {Array} jsErrorEvent the error event array from jserrors feature
       */
      #handleJserror(jsErrorEvent) {
        const timestamp = jsErrorEvent[3].time;
        const associatedInteraction = this.getInteractionFor(timestamp);
        if (!associatedInteraction) {
          return handle("returnJserror", [jsErrorEvent], void 0, FEATURE_NAMES.jserrors, this.ee);
        }
        if (associatedInteraction.status === INTERACTION_STATUS.FIN) {
          processJserror.call(this, jsErrorEvent, associatedInteraction);
        } else {
          associatedInteraction.on("finished", () => processJserror.call(this, jsErrorEvent, associatedInteraction));
          associatedInteraction.on("cancelled", () => handle("returnJserror", [jsErrorEvent], void 0, FEATURE_NAMES.jserrors, this.ee));
        }
        function processJserror(jsErrorEvent2, parentInteraction) {
          const finalEnd = parentInteraction.end;
          if (timestamp > finalEnd) {
            return handle("returnJserror", [jsErrorEvent2], void 0, FEATURE_NAMES.jserrors, this.ee);
          }
          const params = jsErrorEvent2[2];
          params.browserInteractionId = parentInteraction.id;
          handle("returnJserror", [jsErrorEvent2, parentInteraction.customAttributes], void 0, FEATURE_NAMES.jserrors, this.ee);
        }
      }
      #registerApiHandlers() {
        const INTERACTION_API = "api-ixn-";
        const thisClass = this;
        defaultRegister(INTERACTION_API + "get", function(time, {
          waitForEnd
        } = {}) {
          this.associatedInteraction = thisClass.getInteractionFor(time);
          if (this.associatedInteraction?.trigger === IPL_TRIGGER_NAME) this.associatedInteraction = null;
          if (!this.associatedInteraction) {
            this.associatedInteraction = thisClass.interactionInProgress = new Interaction(API_TRIGGER_NAME, Math.floor(time), thisClass.latestRouteSetByApi);
            thisClass.domObserver.observe(document.body, {
              attributes: true,
              childList: true,
              subtree: true,
              characterData: true
            });
            thisClass.setClosureHandlers();
          }
          if (waitForEnd === true) {
            this.associatedInteraction.keepOpenUntilEndApi = true;
            clearTimeout(this.associatedInteraction.cancellationTimer);
          }
        }, thisClass.featureName, thisClass.ee);
        defaultRegister(INTERACTION_API + "end", function(timeNow) {
          this.associatedInteraction.done(timeNow, true);
        }, thisClass.featureName, thisClass.ee);
        defaultRegister(INTERACTION_API + "save", function() {
          this.associatedInteraction.forceSave = true;
        }, thisClass.featureName, thisClass.ee);
        defaultRegister(INTERACTION_API + "ignore", function() {
          this.associatedInteraction.forceIgnore = true;
        }, thisClass.featureName, thisClass.ee);
        defaultRegister(INTERACTION_API + "getContext", function(time, callback) {
          if (typeof callback !== "function") return;
          setTimeout(() => callback(this.associatedInteraction.customDataByApi), 0);
        }, thisClass.featureName, thisClass.ee);
        defaultRegister(INTERACTION_API + "onEnd", function(time, callback) {
          if (typeof callback !== "function") return;
          this.associatedInteraction.onDone.push(callback);
        }, thisClass.featureName, thisClass.ee);
        defaultRegister(INTERACTION_API + "actionText", function(time, newActionText) {
          if (newActionText) this.associatedInteraction.customAttributes.actionText = newActionText;
        }, thisClass.featureName, thisClass.ee);
        defaultRegister(INTERACTION_API + "setName", function(time, name, trigger) {
          if (name) this.associatedInteraction.customName = name;
          if (trigger) this.associatedInteraction.trigger = trigger;
        }, thisClass.featureName, thisClass.ee);
        defaultRegister(INTERACTION_API + "setAttribute", function(time, key, value) {
          this.associatedInteraction.customAttributes[key] = value;
        }, thisClass.featureName, thisClass.ee);
        defaultRegister(INTERACTION_API + "routeName", function(time, newRouteName) {
          thisClass.latestRouteSetByApi = newRouteName;
          if (thisClass.interactionInProgress) thisClass.interactionInProgress.newRoute = newRouteName;
        }, thisClass.featureName, thisClass.ee);
      }
    };
  }
});

// node_modules/@newrelic/browser-agent/dist/esm/loaders/agent.js
init_public_path();
init_agent_base();

// node_modules/@newrelic/browser-agent/dist/esm/loaders/features/enabled-features.js
init_features();
var featureNames = Object.values(FEATURE_NAMES);
function getEnabledFeatures(agentInit) {
  const enabledFeatures = {};
  featureNames.forEach((featureName) => {
    enabledFeatures[featureName] = !!agentInit[featureName]?.enabled;
  });
  return enabledFeatures;
}

// node_modules/@newrelic/browser-agent/dist/esm/loaders/agent.js
init_configure();

// node_modules/@newrelic/browser-agent/dist/esm/loaders/features/featureDependencies.js
init_features();
function getFeatureDependencyNames(feature) {
  switch (feature) {
    case FEATURE_NAMES.ajax:
      return [FEATURE_NAMES.jserrors];
    case FEATURE_NAMES.sessionTrace:
      return [FEATURE_NAMES.ajax, FEATURE_NAMES.pageViewEvent];
    case FEATURE_NAMES.sessionReplay:
      return [FEATURE_NAMES.sessionTrace];
    case FEATURE_NAMES.pageViewTiming:
      return [FEATURE_NAMES.pageViewEvent];
    // this could change if we disconnect window load timings
    default:
      return [];
  }
}

// node_modules/@newrelic/browser-agent/dist/esm/loaders/agent.js
init_features();

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/setPageViewName.js
init_handle();
init_now();
init_constants();
init_sharedHandlers();
function setupSetPageViewNameAPI(agent) {
  setupAPI(SET_PAGE_VIEW_NAME, function(name, host2) {
    if (typeof name !== "string") return;
    if (name.charAt(0) !== "/") name = "/" + name;
    agent.runtime.customTransaction = (host2 || "http://custom.transaction") + name;
    handle(prefix + SET_PAGE_VIEW_NAME, [now()], void 0, void 0, agent.ee);
  }, agent);
}

// node_modules/@newrelic/browser-agent/dist/esm/features/utils/instrument-base.js
init_drain();
init_feature_base();
init_load();
init_runtime();
init_console();
init_features();
init_utils();
init_feature_gates();
init_invoke();
init_agent_constants();
init_handle();
var InstrumentBase = class extends FeatureBase {
  /**
   * Instantiate InstrumentBase.
   * @param {string} agentIdentifier - The unique ID of the instantiated agent (relative to global scope).
   * @param {string} featureName - The name of the feature module (used to construct file path).
   */
  constructor(agentRef, featureName) {
    super(agentRef.agentIdentifier, featureName);
    this.agentRef = agentRef;
    this.abortHandler = void 0;
    this.featAggregate = void 0;
    this.loadedSuccessfully = void 0;
    this.onAggregateImported = new Promise((resolve2) => {
      this.loadedSuccessfully = resolve2;
    });
    this.deferred = Promise.resolve();
    if (agentRef.init[this.featureName].autoStart === false) {
      this.deferred = new Promise((resolve2, reject) => {
        this.ee.on("manual-start-all", single(() => {
          registerDrain(agentRef.agentIdentifier, this.featureName);
          resolve2();
        }));
      });
    } else {
      registerDrain(agentRef.agentIdentifier, featureName);
    }
  }
  /**
   * Lazy-load the latter part of the feature: its aggregator. This method is called by the first part of the feature
   * (the instrumentation) when instrumentation is complete.
   * @param {Object} agentRef - reference to the base agent ancestor that this feature belongs to
   * @param {Function} fetchAggregator - a function that returns a promise that resolves to the aggregate module
   * @param {Object} [argsObjFromInstrument] - any values or references to pass down to aggregate
   * @returns
   */
  importAggregator(agentRef, fetchAggregator, argsObjFromInstrument = {}) {
    if (this.featAggregate) return;
    const importLater = async () => {
      await this.deferred;
      let session;
      try {
        if (canEnableSessionTracking(agentRef.init)) {
          const {
            setupAgentSession: setupAgentSession2
          } = await Promise.resolve().then(() => (init_agent_session(), agent_session_exports));
          session = setupAgentSession2(agentRef);
        }
      } catch (e2) {
        warn(20, e2);
        this.ee.emit("internal-error", [e2]);
        handle(SESSION_ERROR, [e2], void 0, this.featureName, this.ee);
      }
      try {
        if (!this.#shouldImportAgg(this.featureName, session, agentRef.init)) {
          drain(this.agentIdentifier, this.featureName);
          this.loadedSuccessfully(false);
          return;
        }
        const {
          Aggregate: Aggregate11
        } = await fetchAggregator();
        this.featAggregate = new Aggregate11(agentRef, argsObjFromInstrument);
        agentRef.runtime.harvester.initializedAggregates.push(this.featAggregate);
        this.loadedSuccessfully(true);
      } catch (e2) {
        warn(34, e2);
        this.abortHandler?.();
        drain(this.agentIdentifier, this.featureName, true);
        this.loadedSuccessfully(false);
        if (this.ee) this.ee.abort();
      }
    };
    if (!isBrowserScope) importLater();
    else onWindowLoad(() => importLater(), true);
  }
  /**
  * Make a determination if an aggregate class should even be imported
  * @param {string} featureName
  * @param {import('../../common/session/session-entity').SessionEntity} session
  * @returns
  */
  #shouldImportAgg(featureName, session, agentInit) {
    if (this.blocked) return false;
    switch (featureName) {
      case FEATURE_NAMES.sessionReplay:
        return hasReplayPrerequisite(agentInit) && !!session;
      case FEATURE_NAMES.sessionTrace:
        return !!session;
      default:
        return true;
    }
  }
};

// node_modules/@newrelic/browser-agent/dist/esm/features/page_view_event/instrument/index.js
init_constants6();
init_constants3();
init_global_event();
init_load();
var Instrument = class extends InstrumentBase {
  static featureName = FEATURE_NAME4;
  constructor(agentRef) {
    super(agentRef, FEATURE_NAME4);
    this.setupInspectionEvents(agentRef.agentIdentifier);
    setupSetPageViewNameAPI(agentRef);
    this.importAggregator(agentRef, () => Promise.resolve().then(() => (init_aggregate(), aggregate_exports)));
  }
  setupInspectionEvents(agentIdentifier) {
    const dispatch = (evt, name) => {
      if (!evt) return;
      dispatchGlobalEvent({
        agentIdentifier,
        timeStamp: evt.timeStamp,
        loaded: evt.target.readyState === "complete",
        type: "window",
        name,
        data: evt.target.location + ""
      });
    };
    onDOMContentLoaded((evt) => {
      dispatch(evt, "DOMContentLoaded");
    });
    onWindowLoad((evt) => {
      dispatch(evt, "load");
    });
    onPopstateChange((evt) => {
      dispatch(evt, "navigate");
    });
    this.ee.on(SESSION_EVENTS.UPDATE, (_2, data) => {
      dispatchGlobalEvent({
        agentIdentifier,
        type: "lifecycle",
        name: "session",
        data
      });
    });
  }
};

// node_modules/@newrelic/browser-agent/dist/esm/loaders/agent.js
init_nreum();
init_console();
init_runtime();

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/setCustomAttribute.js
init_console();
init_constants();
init_sharedHandlers();
function setupSetCustomAttributeAPI(agent) {
  setupAPI(SET_CUSTOM_ATTRIBUTE, function(name, value, persistAttribute = false) {
    if (typeof name !== "string") {
      warn(39, typeof name);
      return;
    }
    if (!(["string", "number", "boolean"].includes(typeof value) || value === null)) {
      warn(40, typeof value);
      return;
    }
    return appendJsAttribute(agent, name, value, SET_CUSTOM_ATTRIBUTE, persistAttribute);
  }, agent);
}

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/setUserId.js
init_console();
init_constants();
init_sharedHandlers();
init_handle();
function setupSetUserIdAPI(agent) {
  setupAPI(SET_USER_ID, function(value, resetSession = false) {
    if (!(typeof value === "string" || value === null)) {
      warn(41, typeof value);
      return;
    }
    const currUser = agent.info.jsAttributes["enduser.id"];
    const shouldAttemptReset = resetSession && currUser !== void 0 && currUser !== null && currUser !== value;
    if (shouldAttemptReset) {
      handle(prefix + "setUserIdAndResetSession", [value], void 0, "session", agent.ee);
    } else {
      appendJsAttribute(agent, "enduser.id", value, SET_USER_ID, true);
    }
  }, agent);
}

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/setApplicationVersion.js
init_console();
init_constants();
init_sharedHandlers();
function setupSetApplicationVersionAPI(agent) {
  setupAPI(SET_APPLICATION_VERSION, function(value) {
    if (!(typeof value === "string" || value === null)) {
      warn(42, typeof value);
      return;
    }
    return appendJsAttribute(agent, "application.version", value, SET_APPLICATION_VERSION, false);
  }, agent);
}

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/start.js
init_constants();
init_sharedHandlers();
function setupStartAPI(agent) {
  setupAPI(START, function() {
    agent.ee.emit("manual-start-all");
  }, agent);
}

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/consent.js
init_constants();
init_sharedHandlers();
init_handle();
init_console();
function setupConsentAPI(agent) {
  setupAPI(CONSENT, function(accept = true) {
    if (typeof accept !== "boolean") {
      warn(65, typeof accept);
      return;
    }
    handle(prefix + CONSENT, [accept], void 0, "session", agent.ee);
    agent.runtime.consented = accept;
    if (accept) {
      const pveInst = agent.features.page_view_event;
      pveInst.onAggregateImported.then((loaded) => {
        const pveAgg = pveInst.featAggregate;
        if (loaded && !pveAgg.sentRum) {
          pveAgg.sendRum();
        }
      });
    }
  }, agent);
}

// node_modules/@newrelic/browser-agent/dist/esm/loaders/agent.js
var Agent = class extends AgentBase {
  /**
   * @param {AgentOptions} options
   */
  constructor(options) {
    super();
    if (!globalScope) {
      warn(21);
      return;
    }
    this.features = {};
    setNREUMInitializedAgent(this.agentIdentifier, this);
    this.desiredFeatures = new Set(options.features || []);
    this.desiredFeatures.add(Instrument);
    configure(this, options, options.loaderType || "agent");
    setupSetCustomAttributeAPI(this);
    setupSetUserIdAPI(this);
    setupSetApplicationVersionAPI(this);
    setupStartAPI(this);
    setupConsentAPI(this);
    this.run();
  }
  get config() {
    return {
      info: this.info,
      init: this.init,
      loader_config: this.loader_config,
      runtime: this.runtime
    };
  }
  get api() {
    return this;
  }
  run() {
    try {
      const enabledFeatures = getEnabledFeatures(this.init);
      const featuresToStart = [...this.desiredFeatures];
      featuresToStart.sort((a2, b3) => featurePriority[a2.featureName] - featurePriority[b3.featureName]);
      featuresToStart.forEach((InstrumentCtor) => {
        if (!enabledFeatures[InstrumentCtor.featureName] && InstrumentCtor.featureName !== FEATURE_NAMES.pageViewEvent) return;
        const dependencies = getFeatureDependencyNames(InstrumentCtor.featureName);
        const missingDependencies = dependencies.filter((featName) => !(featName in this.features));
        if (missingDependencies.length > 0) {
          warn(36, {
            targetFeature: InstrumentCtor.featureName,
            missingDependencies
          });
        }
        this.features[InstrumentCtor.featureName] = new InstrumentCtor(this);
      });
    } catch (err2) {
      warn(22, err2);
      for (const featName in this.features) {
        this.features[featName].abortHandler?.();
      }
      const newrelic2 = gosNREUM();
      delete newrelic2.initializedAgents[this.agentIdentifier]?.features;
      delete this.sharedAggregator;
      const thisEE = newrelic2.ee.get(this.agentIdentifier);
      thisEE.abort();
      return false;
    }
  }
};

// node_modules/@newrelic/browser-agent/dist/esm/features/page_view_timing/instrument/index.js
init_handle();
init_page_visibility();
init_constants8();
init_runtime();
init_now();
var Instrument2 = class extends InstrumentBase {
  static featureName = FEATURE_NAME5;
  constructor(agentRef) {
    super(agentRef, FEATURE_NAME5);
    if (!isBrowserScope) return;
    subscribeToVisibilityChange(() => handle("docHidden", [now()], void 0, FEATURE_NAME5, this.ee), true);
    subscribeToPageUnload(() => handle("winPagehide", [now()], void 0, FEATURE_NAME5, this.ee));
    this.importAggregator(agentRef, () => Promise.resolve().then(() => (init_aggregate2(), aggregate_exports2)));
  }
};

// node_modules/@newrelic/browser-agent/dist/esm/features/metrics/instrument/index.js
init_runtime();
init_handle();
init_constants4();
var Instrument3 = class extends InstrumentBase {
  static featureName = FEATURE_NAME2;
  constructor(agentRef) {
    super(agentRef, FEATURE_NAME2);
    if (isBrowserScope) {
      document.addEventListener("securitypolicyviolation", (e2) => {
        handle(SUPPORTABILITY_METRIC_CHANNEL, ["Generic/CSPViolation/Detected"], void 0, this.featureName, this.ee);
      });
    }
    this.importAggregator(agentRef, () => Promise.resolve().then(() => (init_aggregate3(), aggregate_exports3)));
  }
};

// node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/instrument/index.js
init_handle();
init_constants9();
init_runtime();
init_event_listener_opts();
init_now();

// node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/shared/uncaught-error.js
init_stringify();
var UncaughtError = class {
  constructor(message, filename, lineno, colno, newrelic2) {
    this.name = "UncaughtError";
    this.message = typeof message === "string" ? message : stringify(message);
    this.sourceURL = filename;
    this.line = lineno;
    this.column = colno;
    this.__newrelic = newrelic2;
  }
};

// node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/shared/cast-error.js
function castError(error) {
  if (canTrustError(error)) {
    return error;
  }
  return new UncaughtError(error?.message !== void 0 ? error.message : error, error?.filename || error?.sourceURL, error?.lineno || error?.line, error?.colno || error?.col, error?.__newrelic, error?.cause);
}
function castPromiseRejectionEvent(promiseRejectionEvent) {
  const prefix3 = "Unhandled Promise Rejection: ";
  if (!promiseRejectionEvent?.reason) return;
  if (canTrustError(promiseRejectionEvent.reason)) {
    try {
      if (!promiseRejectionEvent.reason.message.startsWith(prefix3)) promiseRejectionEvent.reason.message = prefix3 + promiseRejectionEvent.reason.message;
    } catch (e2) {
    }
    return castError(promiseRejectionEvent.reason);
  }
  const error = castError(promiseRejectionEvent.reason);
  if (!(error.message || "").startsWith(prefix3)) error.message = prefix3 + error.message;
  return error;
}
function castErrorEvent(errorEvent) {
  if (errorEvent.error instanceof SyntaxError && !/:\d+$/.test(errorEvent.error.stack?.trim())) {
    const error = new UncaughtError(errorEvent.message, errorEvent.filename, errorEvent.lineno, errorEvent.colno, errorEvent.error.__newrelic, errorEvent.cause);
    error.name = SyntaxError.name;
    return error;
  }
  if (canTrustError(errorEvent.error)) return errorEvent.error;
  return castError(errorEvent);
}
function canTrustError(error) {
  return error instanceof Error && !!error.stack;
}

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/noticeError.js
init_handle();
init_now();
init_features();
init_constants();
init_sharedHandlers();
function setupNoticeErrorAPI(agent) {
  setupAPI(NOTICE_ERROR, (err2, customAttributes) => noticeError(err2, customAttributes, agent), agent);
}
function noticeError(err2, customAttributes, agentRef, target, timestamp = now()) {
  if (typeof err2 === "string") err2 = new Error(err2);
  handle("err", [err2, timestamp, false, customAttributes, agentRef.runtime.isRecording, void 0, target], void 0, FEATURE_NAMES.jserrors, agentRef.ee);
  handle("uaErr", [], void 0, FEATURE_NAMES.genericEvents, agentRef.ee);
}

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/setErrorHandler.js
init_constants();
init_sharedHandlers();
function setupSetErrorHandlerAPI(agent) {
  setupAPI(SET_ERROR_HANDLER, function(callback) {
    agent.runtime.onerror = callback;
  }, agent);
}

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/addRelease.js
init_constants();
init_sharedHandlers();
function setupAddReleaseAPI(agent) {
  let releaseCount = 0;
  setupAPI(ADD_RELEASE, function(name, id2) {
    if (++releaseCount > 10) return;
    this.runtime.releaseIds[name.slice(-200)] = ("" + id2).slice(-200);
  }, agent);
}

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/register.js
init_handle();
init_console();
init_v2();
init_features();
init_now();
init_constants4();
init_sharedHandlers();
init_constants();

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/log.js
init_now();
init_constants5();
init_utils2();
init_constants();
init_sharedHandlers();
function setupLogAPI(agent) {
  setupAPI(LOG, (message, options) => log(message, options, agent), agent);
}
function log(message, {
  customAttributes = {},
  level = LOG_LEVELS.INFO
} = {}, agentRef, target, timestamp = now()) {
  bufferLog(agentRef.ee, message, customAttributes, level, false, target, timestamp);
}

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/addPageAction.js
init_handle();
init_now();
init_features();
init_constants();
init_sharedHandlers();
function setupAddPageActionAPI(agent) {
  setupAPI(ADD_PAGE_ACTION, (name, attributes) => addPageAction(name, attributes, agent), agent);
}
function addPageAction(name, attributes, agentRef, target, timestamp = now()) {
  handle(prefix + ADD_PAGE_ACTION, [timestamp, name, attributes, target], void 0, FEATURE_NAMES.genericEvents, agentRef.ee);
}

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/register.js
init_invoke();

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/measure.js
init_handle();
init_now();
init_console();
init_features();
init_constants();
init_sharedHandlers();
function setupMeasureAPI(agent) {
  setupAPI(MEASURE, (name, options) => measure(name, options, agent), agent);
}
function measure(name, options, agentRef, target, timestamp = now()) {
  const {
    start,
    end,
    customAttributes
  } = options || {};
  const returnObj = {
    customAttributes: customAttributes || {}
  };
  if (typeof returnObj.customAttributes !== "object" || typeof name !== "string" || name.length === 0) {
    warn(57);
    return;
  }
  const getValueFromTiming = (timing, d2) => {
    if (timing == null) return d2;
    if (typeof timing === "number") return timing;
    if (timing instanceof PerformanceMark) return timing.startTime;
    return Number.NaN;
  };
  returnObj.start = getValueFromTiming(start, 0);
  returnObj.end = getValueFromTiming(end, timestamp);
  if (Number.isNaN(returnObj.start) || Number.isNaN(returnObj.end)) {
    warn(57);
    return;
  }
  returnObj.duration = returnObj.end - returnObj.start;
  if (returnObj.duration < 0) {
    warn(58);
    return;
  }
  handle(prefix + MEASURE, [returnObj, name, target], void 0, FEATURE_NAMES.genericEvents, agentRef.ee);
  return returnObj;
}

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/recordCustomEvent.js
init_handle();
init_now();
init_features();
init_constants();
init_sharedHandlers();
function setupRecordCustomEventAPI(agent) {
  setupAPI(RECORD_CUSTOM_EVENT, (eventType, attributes) => recordCustomEvent(eventType, attributes, agent), agent);
}
function recordCustomEvent(eventType, attributes = {}, agentRef, target, timestamp = now()) {
  handle(prefix + RECORD_CUSTOM_EVENT, [timestamp, eventType, attributes, target], void 0, FEATURE_NAMES.genericEvents, agentRef.ee);
}

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/register.js
init_page_visibility();

// node_modules/@newrelic/browser-agent/dist/esm/common/util/script-tracker.js
init_runtime();
init_now();
init_clean_url();
init_browser_stack_matchers();
var validEntryCriteria = (entry) => entry.initiatorType === "script" || entry.initiatorType === "link" && entry.name.endsWith(".js");
var scripts = /* @__PURE__ */ new Set();
var poSubscribers = [];
if (globalScope.PerformanceObserver?.supportedEntryTypes.includes("resource")) {
  const scriptObserver = new PerformanceObserver((list2) => {
    list2.getEntries().forEach((entry) => {
      if (validEntryCriteria(entry)) {
        if (scripts.size > 250) scripts.delete(scripts.values().next().value);
        scripts.add(entry);
        const canClear = [];
        poSubscribers.forEach(({
          test,
          addedAt
        }, idx) => {
          if (test(entry) || now() - addedAt > 1e4) canClear.push(idx);
        });
        poSubscribers = poSubscribers.filter((_2, idx) => !canClear.includes(idx));
      }
    });
  });
  scriptObserver.observe({
    type: "resource",
    buffered: true
  });
}
function extractUrlsFromStack(stack) {
  if (!stack || typeof stack !== "string") return [];
  const urls = /* @__PURE__ */ new Set();
  const lines = stack.split("\n");
  for (const line of lines) {
    const parts = line.match(gecko) || line.match(chrome);
    if (parts && parts[2]) {
      urls.add(cleanURL(parts[2]));
    }
  }
  return [...urls];
}
function getDeepStackTrace() {
  let stack;
  try {
    const originalStackLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = 50;
    stack = new Error().stack;
    Error.stackTraceLimit = originalStackLimit;
  } catch (e2) {
    stack = new Error().stack;
  }
  return stack;
}
function wasPreloaded(targetUrl) {
  if (!targetUrl || !globalScope.document) return false;
  try {
    const linkTags = globalScope.document.querySelectorAll('link[rel="preload"][as="script"]');
    for (const link of linkTags) {
      if (cleanURL(link.href) === targetUrl) return true;
    }
  } catch (error) {
  }
  return false;
}
function findScriptTimings() {
  const timings = {
    registeredAt: now(),
    reportedAt: void 0,
    fetchStart: 0,
    fetchEnd: 0,
    asset: void 0,
    type: "unknown"
  };
  const stack = getDeepStackTrace();
  if (!stack) return timings;
  const navUrl = globalScope.performance?.getEntriesByType("navigation")?.find((entry) => entry.initiatorType === "navigation")?.name || "";
  try {
    let entryMatchesMfe = function(entry) {
      const entryUrl = cleanURL(entry.name);
      return entryUrl.endsWith(mfeScriptUrl) || mfeScriptUrl.endsWith(entryUrl);
    }, setMatchedAttributes = function(entry) {
      timings.fetchStart = Math.floor(entry.startTime);
      timings.fetchEnd = Math.floor(entry.responseEnd);
      timings.asset = entry.name;
      timings.type = entry.initiatorType;
    };
    const mfeScriptUrl = extractUrlsFromStack(stack).at(-1);
    if (!mfeScriptUrl) return timings;
    if (navUrl.includes(mfeScriptUrl)) {
      timings.asset = cleanURL(navUrl);
      timings.type = "inline";
      return timings;
    }
    const match = performance.getEntriesByType("resource").find(entryMatchesMfe) || [...scripts].find(entryMatchesMfe);
    if (match) {
      setMatchedAttributes(match);
    } else {
      if (wasPreloaded(mfeScriptUrl)) {
        timings.asset = mfeScriptUrl;
        timings.type = "preload";
        poSubscribers.push({
          addedAt: now(),
          test: (entry) => {
            if (entryMatchesMfe(entry)) {
              setMatchedAttributes(entry);
              return true;
            }
            return false;
          }
        });
      }
    }
  } catch (error) {
  }
  return timings;
}

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/register.js
var PROTECTED_KEYS = ["name", "id", "type"];
function setupRegisterAPI(agent) {
  setupAPI(REGISTER, function(target) {
    return register(agent, target);
  }, agent);
}
function register(agentRef, target, parent) {
  warn(54, "newrelic.register");
  target ||= {};
  target.type = V2_TYPES.MFE;
  target.licenseKey ||= agentRef.info.licenseKey;
  target.blocked = false;
  target.parent = parent || {};
  if (typeof target.tags !== "object" || target.tags === null || Array.isArray(target.tags)) target.tags = {};
  const timings = findScriptTimings();
  const attrs = {};
  Object.entries(target.tags).forEach(([key, value]) => {
    if (!PROTECTED_KEYS.includes(key)) {
      attrs["source.".concat(key)] = value;
    }
  });
  target.isolated ??= true;
  let invalidApiResponse = () => {
  };
  const registeredEntities = agentRef.runtime.registeredEntities;
  if (!target.isolated) {
    const sharedEntity = registeredEntities.find(({
      metadata: {
        target: {
          id: id2
        }
      }
    }) => id2 === target.id && !target.isolated);
    if (sharedEntity) return sharedEntity;
  }
  const block = (warning2) => {
    target.blocked = true;
    invalidApiResponse = warning2;
  };
  function hasValidValue(val) {
    return typeof val === "string" && !!val.trim() && val.trim().length < 501 || typeof val === "number";
  }
  if (!agentRef.init.api.allow_registered_children) block(single(() => warn(55)));
  if (!hasValidValue(target.id) || !hasValidValue(target.name)) block(single(() => warn(48, target)));
  const api = {
    addPageAction: (name, attributes = {}) => report2(addPageAction, [name, {
      ...attrs,
      ...attributes
    }, agentRef], target),
    deregister: () => {
      reportTimings();
      block(single(() => warn(68)));
    },
    log: (message, options = {}) => report2(log, [message, {
      ...options,
      customAttributes: {
        ...attrs,
        ...options.customAttributes || {}
      }
    }, agentRef], target),
    measure: (name, options = {}) => report2(measure, [name, {
      ...options,
      customAttributes: {
        ...attrs,
        ...options.customAttributes || {}
      }
    }, agentRef], target),
    noticeError: (error, attributes = {}) => report2(noticeError, [error, {
      ...attrs,
      ...attributes
    }, agentRef], target),
    register: (target2 = {}) => report2(register, [agentRef, target2], api.metadata.target),
    recordCustomEvent: (eventType, attributes = {}) => report2(recordCustomEvent, [eventType, {
      ...attrs,
      ...attributes
    }, agentRef], target),
    setApplicationVersion: (value) => setLocalValue("application.version", value),
    setCustomAttribute: (key, value) => setLocalValue(key, value),
    setUserId: (value) => setLocalValue("enduser.id", value),
    /** metadata */
    metadata: {
      customAttributes: attrs,
      target,
      timings
    }
  };
  const isBlocked2 = () => {
    if (target.blocked) invalidApiResponse();
    return target.blocked;
  };
  if (!isBlocked2()) {
    registeredEntities.push(api);
    subscribeToPageUnload(reportTimings);
  }
  function reportTimings() {
    if (timings.reportedAt) return;
    timings.reportedAt = now();
    api.recordCustomEvent("MicroFrontEndTiming", {
      assetUrl: timings.asset,
      // the url of the script that was registered, or undefined if it could not be determined (inline or no match)
      assetType: timings.type,
      // the type of asset that was associated with the timings, one of 'script', 'link' (if preloaded and found in the resource timing buffer), 'preload' (if preloaded but not found in the resource timing buffer), or "unknown" if it could not be determined
      timeToLoad: timings.registeredAt - timings.fetchStart,
      // fetchStart to registeredAt
      timeToBeRequested: timings.fetchStart,
      // origin to fetchStart
      timeToFetch: timings.fetchEnd - timings.fetchStart,
      // fetchStart to fetchEnd
      timeToRegister: timings.registeredAt - timings.fetchEnd,
      // fetchEnd to registeredAt
      timeAlive: timings.reportedAt - timings.registeredAt
      // registeredAt to reportedAt
    });
  }
  const setLocalValue = (key, value) => {
    if (isBlocked2()) return;
    attrs[key] = value;
  };
  const report2 = (methodToCall, args, target2) => {
    if (isBlocked2() && methodToCall !== register) return;
    const timestamp = now();
    handle(SUPPORTABILITY_METRIC_CHANNEL, ["API/register/".concat(methodToCall.name, "/called")], void 0, FEATURE_NAMES.metrics, agentRef.ee);
    try {
      const shouldDuplicate = agentRef.init.api.duplicate_registered_data && methodToCall !== register;
      if (shouldDuplicate) {
        let duplicatedArgs = args;
        if (args[1] instanceof Object) {
          const childAttrs = {
            "child.id": target2.id,
            "child.type": target2.type
          };
          if ("customAttributes" in args[1]) duplicatedArgs = [args[0], {
            ...args[1],
            customAttributes: {
              ...args[1].customAttributes,
              ...childAttrs
            }
          }, ...args.slice(2)];
          else duplicatedArgs = [args[0], {
            ...args[1],
            ...childAttrs
          }, ...args.slice(2)];
        }
        methodToCall(...duplicatedArgs, void 0, timestamp);
      }
      return methodToCall(...args, target2, timestamp);
    } catch (err2) {
      warn(50, err2);
    }
  };
  return api;
}

// node_modules/@newrelic/browser-agent/dist/esm/features/jserrors/instrument/index.js
var Instrument4 = class extends InstrumentBase {
  static featureName = FEATURE_NAME6;
  constructor(agentRef) {
    super(agentRef, FEATURE_NAME6);
    setupNoticeErrorAPI(agentRef);
    setupSetErrorHandlerAPI(agentRef);
    setupAddReleaseAPI(agentRef);
    setupRegisterAPI(agentRef);
    try {
      this.removeOnAbort = new AbortController();
    } catch (e2) {
    }
    this.ee.on("internal-error", (error, reason) => {
      if (!this.abortHandler) return;
      handle("ierr", [castError(error), now(), true, {}, agentRef.runtime.isRecording, reason], void 0, this.featureName, this.ee);
    });
    globalScope.addEventListener("unhandledrejection", (promiseRejectionEvent) => {
      if (!this.abortHandler) return;
      handle("err", [castPromiseRejectionEvent(promiseRejectionEvent), now(), false, {
        unhandledPromiseRejection: 1
      }, agentRef.runtime.isRecording], void 0, this.featureName, this.ee);
    }, eventListenerOpts(false, this.removeOnAbort?.signal));
    globalScope.addEventListener("error", (errorEvent) => {
      if (!this.abortHandler) return;
      handle("err", [castErrorEvent(errorEvent), now(), false, {}, agentRef.runtime.isRecording], void 0, this.featureName, this.ee);
    }, eventListenerOpts(false, this.removeOnAbort?.signal));
    this.abortHandler = this.#abort;
    this.importAggregator(agentRef, () => Promise.resolve().then(() => (init_aggregate4(), aggregate_exports4)));
  }
  /** Restoration and resource release tasks to be done if JS error loader is being aborted. Unwind changes to globals. */
  #abort() {
    this.removeOnAbort?.abort();
    this.abortHandler = void 0;
  }
};

// node_modules/@newrelic/browser-agent/dist/esm/features/ajax/instrument/index.js
init_nreum();
init_handle();

// node_modules/@newrelic/browser-agent/dist/esm/common/ids/id.js
init_get_or_set();
init_runtime();
var index = 1;
var prop = "nr@id";
function id(obj2) {
  const type = typeof obj2;
  if (!obj2 || !(type === "object" || type === "function")) return -1;
  if (obj2 === globalScope) return 0;
  return getOrSet(obj2, prop, function() {
    return index++;
  });
}

// node_modules/@newrelic/browser-agent/dist/esm/features/ajax/instrument/index.js
init_runtime();

// node_modules/@newrelic/browser-agent/dist/esm/common/util/data-size.js
init_stringify();
function dataSize(data) {
  if (typeof data === "string" && data.length) return data.length;
  if (typeof data !== "object") return void 0;
  if (typeof ArrayBuffer !== "undefined" && data instanceof ArrayBuffer && data.byteLength) return data.byteLength;
  if (typeof Blob !== "undefined" && data instanceof Blob && data.size) return data.size;
  if (typeof FormData !== "undefined" && data instanceof FormData) return void 0;
  try {
    return stringify(data).length;
  } catch (e2) {
    return void 0;
  }
}

// node_modules/@newrelic/browser-agent/dist/esm/features/ajax/instrument/index.js
init_event_listener_opts();

// node_modules/@newrelic/browser-agent/dist/esm/common/wrap/wrap-xhr.js
init_wrap_events();
init_contextual_ee();
init_event_listener_opts();
init_wrap_function();
init_runtime();
init_console();
var wrapped2 = {};
var XHR_PROPS = ["open", "send"];
function wrapXhr(sharedEE) {
  var baseEE = sharedEE || globalInstance;
  const ee2 = scopedEE2(baseEE);
  if (typeof globalScope.XMLHttpRequest === "undefined") return ee2;
  if (wrapped2[ee2.debugId]++) return ee2;
  wrapped2[ee2.debugId] = 1;
  wrapEvents(baseEE);
  var wrapFn = createWrapperWithEmitter(ee2);
  var OrigXHR = globalScope.XMLHttpRequest;
  var MutationObserver2 = globalScope.MutationObserver;
  var Promise2 = globalScope.Promise;
  var setImmediate = globalScope.setInterval;
  var READY_STATE_CHANGE = "readystatechange";
  var handlers3 = ["onload", "onerror", "onabort", "onloadstart", "onloadend", "onprogress", "ontimeout"];
  var pendingXhrs = [];
  var XHR2 = globalScope.XMLHttpRequest = newXHR;
  function newXHR(opts) {
    const xhr2 = new OrigXHR(opts);
    const context = ee2.context(xhr2);
    try {
      ee2.emit("new-xhr", [xhr2], context);
      xhr2.addEventListener(READY_STATE_CHANGE, wrapXHR(context), eventListenerOpts(false));
    } catch (e2) {
      warn(15, e2);
      try {
        ee2.emit("internal-error", [e2]);
      } catch (err2) {
      }
    }
    return xhr2;
  }
  copy2(OrigXHR, XHR2);
  XHR2.prototype = OrigXHR.prototype;
  wrapFn.inPlace(XHR2.prototype, XHR_PROPS, "-xhr-", getObject);
  ee2.on("send-xhr-start", function(args, xhr2) {
    wrapOnreadystatechange(args, xhr2);
    enqueuePendingXhr(xhr2);
  });
  ee2.on("open-xhr-start", wrapOnreadystatechange);
  function wrapOnreadystatechange(args, xhr2) {
    wrapFn.inPlace(xhr2, ["onreadystatechange"], "fn-", getObject);
  }
  function wrapXHR(ctx) {
    return function() {
      var xhr2 = this;
      if (xhr2.readyState > 3 && !ctx.resolved) {
        ctx.resolved = true;
        ee2.emit("xhr-resolved", [], xhr2);
      }
      wrapFn.inPlace(xhr2, handlers3, "fn-", getObject);
    };
  }
  if (MutationObserver2) {
    var resolved = Promise2 && Promise2.resolve();
    if (!setImmediate && !Promise2) {
      var toggle = 1;
      var dummyNode = document.createTextNode(toggle);
      new MutationObserver2(drainPendingXhrs).observe(dummyNode, {
        characterData: true
      });
    }
  } else {
    baseEE.on("fn-end", function(args) {
      if (args[0] && args[0].type === READY_STATE_CHANGE) return;
      drainPendingXhrs();
    });
  }
  function enqueuePendingXhr(xhr2) {
    pendingXhrs.push(xhr2);
    if (MutationObserver2) {
      if (resolved) {
        resolved.then(drainPendingXhrs);
      } else if (setImmediate) {
        setImmediate(drainPendingXhrs);
      } else {
        toggle = -toggle;
        dummyNode.data = toggle;
      }
    }
  }
  function drainPendingXhrs() {
    for (var i2 = 0; i2 < pendingXhrs.length; i2++) {
      wrapOnreadystatechange([], pendingXhrs[i2]);
    }
    if (pendingXhrs.length) pendingXhrs = [];
  }
  function getObject(args, obj2) {
    return obj2;
  }
  function copy2(from, to) {
    for (var i2 in from) {
      to[i2] = from[i2];
    }
    return to;
  }
  return ee2;
}
function scopedEE2(sharedEE) {
  return (sharedEE || globalInstance).get("xhr");
}

// node_modules/@newrelic/browser-agent/dist/esm/common/wrap/wrap-fetch.js
init_contextual_ee();
init_runtime();
var prefix2 = "fetch-";
var bodyPrefix = prefix2 + "body-";
var bodyMethods = ["arrayBuffer", "blob", "json", "text", "formData"];
var Req = globalScope.Request;
var Res = globalScope.Response;
var proto = "prototype";
var wrapped3 = {};
function wrapFetch(sharedEE) {
  const ee2 = scopedEE3(sharedEE);
  if (!(Req && Res && globalScope.fetch)) {
    return ee2;
  }
  if (wrapped3[ee2.debugId]++) return ee2;
  wrapped3[ee2.debugId] = 1;
  bodyMethods.forEach((method) => {
    wrapPromiseMethod(Req[proto], method, bodyPrefix);
    wrapPromiseMethod(Res[proto], method, bodyPrefix);
  });
  wrapPromiseMethod(globalScope, "fetch", prefix2);
  ee2.on(prefix2 + "end", function(err2, res) {
    var ctx = this;
    if (res) {
      var size = res.headers.get("content-length");
      if (size !== null) {
        ctx.rxSize = size;
      }
      ee2.emit(prefix2 + "done", [null, res], ctx);
    } else {
      ee2.emit(prefix2 + "done", [err2], ctx);
    }
  });
  function wrapPromiseMethod(target, name, prefix3) {
    var fn = target[name];
    if (typeof fn === "function") {
      target[name] = function() {
        var args = [...arguments];
        var ctx = {};
        ee2.emit(prefix3 + "before-start", [args], ctx);
        var dtPayload;
        if (ctx[contextId] && ctx[contextId].dt) dtPayload = ctx[contextId].dt;
        var origPromiseFromFetch = fn.apply(this, args);
        ee2.emit(prefix3 + "start", [args, dtPayload], origPromiseFromFetch);
        return origPromiseFromFetch.then(function(val) {
          ee2.emit(prefix3 + "end", [null, val], origPromiseFromFetch);
          return val;
        }, function(err2) {
          ee2.emit(prefix3 + "end", [err2], origPromiseFromFetch);
          throw err2;
        });
      };
    }
  }
  return ee2;
}
function scopedEE3(sharedEE) {
  return (sharedEE || globalInstance).get("fetch");
}

// node_modules/@newrelic/browser-agent/dist/esm/features/ajax/instrument/index.js
init_parse_url();

// node_modules/@newrelic/browser-agent/dist/esm/features/ajax/instrument/distributed-tracing.js
init_unique_id();
init_parse_url();
init_runtime();
init_stringify();
var DT = class {
  constructor(agentRef) {
    this.agentRef = agentRef;
  }
  generateTracePayload(parsedOrigin) {
    const loaderConfig = this.agentRef.loader_config;
    if (!this.shouldGenerateTrace(parsedOrigin) || !loaderConfig) {
      return null;
    }
    var accountId = (loaderConfig.accountID || "").toString() || null;
    var agentId = (loaderConfig.agentID || "").toString() || null;
    var trustKey = (loaderConfig.trustKey || "").toString() || null;
    if (!accountId || !agentId) {
      return null;
    }
    var spanId = generateSpanId();
    var traceId = generateTraceId();
    var timestamp = Date.now();
    var payload = {
      spanId,
      traceId,
      timestamp
    };
    if (parsedOrigin.sameOrigin || this.isAllowedOrigin(parsedOrigin) && this.useTraceContextHeadersForCors()) {
      payload.traceContextParentHeader = this.generateTraceContextParentHeader(spanId, traceId);
      payload.traceContextStateHeader = this.generateTraceContextStateHeader(spanId, timestamp, accountId, agentId, trustKey);
    }
    if (parsedOrigin.sameOrigin && !this.excludeNewrelicHeader() || !parsedOrigin.sameOrigin && this.isAllowedOrigin(parsedOrigin) && this.useNewrelicHeaderForCors()) {
      payload.newrelicHeader = this.generateTraceHeader(spanId, traceId, timestamp, accountId, agentId, trustKey);
    }
    return payload;
  }
  generateTraceContextParentHeader(spanId, traceId) {
    return "00-" + traceId + "-" + spanId + "-01";
  }
  generateTraceContextStateHeader(spanId, timestamp, accountId, appId, trustKey) {
    var version = 0;
    var transactionId = "";
    var parentType = 1;
    var sampled = "";
    var priority = "";
    return trustKey + "@nr=" + version + "-" + parentType + "-" + accountId + "-" + appId + "-" + spanId + "-" + transactionId + "-" + sampled + "-" + priority + "-" + timestamp;
  }
  generateTraceHeader(spanId, traceId, timestamp, accountId, appId, trustKey) {
    var hasBtoa = typeof globalScope?.btoa === "function";
    if (!hasBtoa) {
      return null;
    }
    var payload = {
      v: [0, 1],
      d: {
        ty: "Browser",
        ac: accountId,
        ap: appId,
        id: spanId,
        tr: traceId,
        ti: timestamp
      }
    };
    if (trustKey && accountId !== trustKey) {
      payload.d.tk = trustKey;
    }
    return btoa(stringify(payload));
  }
  // return true if DT is enabled and the origin is allowed, either by being
  // same-origin, or included in the allowed list
  shouldGenerateTrace(parsedOrigin) {
    return this.agentRef.init?.distributed_tracing?.enabled && this.isAllowedOrigin(parsedOrigin);
  }
  isAllowedOrigin(parsedOrigin) {
    var allowed = false;
    const dtConfig = this.agentRef.init?.distributed_tracing;
    if (parsedOrigin.sameOrigin) {
      allowed = true;
    } else if (dtConfig?.allowed_origins instanceof Array) {
      for (var i2 = 0; i2 < dtConfig.allowed_origins.length; i2++) {
        var allowedOrigin = parseUrl(dtConfig.allowed_origins[i2]);
        if (parsedOrigin.hostname === allowedOrigin.hostname && parsedOrigin.protocol === allowedOrigin.protocol && parsedOrigin.port === allowedOrigin.port) {
          allowed = true;
          break;
        }
      }
    }
    return allowed;
  }
  // exclude the newrelic header for same-origin calls
  excludeNewrelicHeader() {
    var dt = this.agentRef.init?.distributed_tracing;
    if (dt) {
      return !!dt.exclude_newrelic_header;
    }
    return false;
  }
  useNewrelicHeaderForCors() {
    var dt = this.agentRef.init?.distributed_tracing;
    if (dt) {
      return dt.cors_use_newrelic_header !== false;
    }
    return false;
  }
  useTraceContextHeadersForCors() {
    var dt = this.agentRef.init?.distributed_tracing;
    if (dt) {
      return !!dt.cors_use_tracecontext_headers;
    }
    return false;
  }
};

// node_modules/@newrelic/browser-agent/dist/esm/features/ajax/instrument/response-size.js
function responseSizeFromXhr(xhr2, lastSize) {
  var type = xhr2.responseType;
  if (type === "json" && lastSize !== null) return lastSize;
  if (type === "arraybuffer" || type === "blob" || type === "json") {
    return dataSize(xhr2.response);
  } else if (type === "text" || type === "" || type === void 0) {
    return dataSize(xhr2.responseText);
  } else {
    return void 0;
  }
}

// node_modules/@newrelic/browser-agent/dist/esm/features/ajax/instrument/index.js
init_constants10();
init_features();
init_constants4();
init_now();
init_deny_list();

// node_modules/@newrelic/browser-agent/dist/esm/common/url/extract-url.js
init_runtime();
init_nreum();
function extractUrl(target) {
  if (typeof target === "string") return target;
  else if (target instanceof gosNREUMOriginals().o.REQ) return target.url;
  else if (globalScope?.URL && target instanceof URL) return target.href;
}

// node_modules/@newrelic/browser-agent/dist/esm/features/ajax/instrument/index.js
var handlers2 = ["load", "error", "abort", "timeout"];
var handlersLen = handlers2.length;
var origRequest = gosNREUMOriginals().o.REQ;
var origXHR = gosNREUMOriginals().o.XHR;
var NR_CAT_HEADER = "X-NewRelic-App-Data";
var Instrument5 = class extends InstrumentBase {
  static featureName = FEATURE_NAME7;
  constructor(agentRef) {
    super(agentRef, FEATURE_NAME7);
    this.dt = new DT(agentRef);
    this.handler = (type, args, ctx, group) => handle(type, args, ctx, group, this.ee);
    try {
      const initiators = {
        xmlhttprequest: "xhr",
        fetch: "fetch",
        beacon: "beacon"
      };
      globalScope?.performance?.getEntriesByType("resource").forEach((resource) => {
        if (resource.initiatorType in initiators && resource.responseStatus !== 0) {
          const params = {
            status: resource.responseStatus
          };
          const metrics = {
            rxSize: resource.transferSize,
            duration: Math.floor(resource.duration),
            cbTime: 0
          };
          addUrl(params, resource.name);
          this.handler("xhr", [params, metrics, resource.startTime, resource.responseEnd, initiators[resource.initiatorType]], void 0, FEATURE_NAMES.ajax);
        }
      });
    } catch (err2) {
    }
    wrapFetch(this.ee);
    wrapXhr(this.ee);
    subscribeToEvents(agentRef, this.ee, this.handler, this.dt);
    this.importAggregator(agentRef, () => Promise.resolve().then(() => (init_aggregate5(), aggregate_exports5)));
  }
};
function subscribeToEvents(agentRef, ee2, handler, dt) {
  ee2.on("new-xhr", onNewXhr);
  ee2.on("open-xhr-start", onOpenXhrStart);
  ee2.on("open-xhr-end", onOpenXhrEnd);
  ee2.on("send-xhr-start", onSendXhrStart);
  ee2.on("xhr-cb-time", onXhrCbTime);
  ee2.on("xhr-load-added", onXhrLoadAdded);
  ee2.on("xhr-load-removed", onXhrLoadRemoved);
  ee2.on("xhr-resolved", onXhrResolved);
  ee2.on("addEventListener-end", onAddEventListenerEnd);
  ee2.on("removeEventListener-end", onRemoveEventListenerEnd);
  ee2.on("fn-end", onFnEnd);
  ee2.on("fetch-before-start", onFetchBeforeStart);
  ee2.on("fetch-start", onFetchStart);
  ee2.on("fn-start", onFnStart);
  ee2.on("fetch-done", onFetchDone);
  function onNewXhr(xhr2) {
    var ctx = this;
    ctx.totalCbs = 0;
    ctx.called = 0;
    ctx.cbTime = 0;
    ctx.end = end;
    ctx.ended = false;
    ctx.xhrGuids = {};
    ctx.lastSize = null;
    ctx.loadCaptureCalled = false;
    ctx.params = this.params || {};
    ctx.metrics = this.metrics || {};
    ctx.latestLongtaskEnd = 0;
    xhr2.addEventListener("load", function(event) {
      captureXhrData(ctx, xhr2);
    }, eventListenerOpts(false));
    if (ffVersion) return;
    xhr2.addEventListener("progress", function(event) {
      ctx.lastSize = event.loaded;
    }, eventListenerOpts(false));
  }
  function onOpenXhrStart(args) {
    this.params = {
      method: args[0]
    };
    addUrl(this, args[1]);
    this.metrics = {};
  }
  function onOpenXhrEnd(args, xhr2) {
    if (agentRef.loader_config.xpid && this.sameOrigin) {
      xhr2.setRequestHeader("X-NewRelic-ID", agentRef.loader_config.xpid);
    }
    var payload = dt.generateTracePayload(this.parsedOrigin);
    if (payload) {
      var added = false;
      if (payload.newrelicHeader) {
        xhr2.setRequestHeader("newrelic", payload.newrelicHeader);
        added = true;
      }
      if (payload.traceContextParentHeader) {
        xhr2.setRequestHeader("traceparent", payload.traceContextParentHeader);
        if (payload.traceContextStateHeader) {
          xhr2.setRequestHeader("tracestate", payload.traceContextStateHeader);
        }
        added = true;
      }
      if (added) {
        this.dt = payload;
      }
    }
  }
  function onSendXhrStart(args, xhr2) {
    var metrics = this.metrics;
    var data = args[0];
    var context = this;
    if (metrics && data) {
      var size = dataSize(data);
      if (size) metrics.txSize = size;
    }
    this.startTime = now();
    this.body = data;
    this.listener = function(evt) {
      try {
        if (evt.type === "abort" && !context.loadCaptureCalled) {
          context.params.aborted = true;
        }
        if (evt.type !== "load" || context.called === context.totalCbs && (context.onloadCalled || typeof xhr2.onload !== "function") && typeof context.end === "function") context.end(xhr2);
      } catch (e2) {
        try {
          ee2.emit("internal-error", [e2]);
        } catch (err2) {
        }
      }
    };
    for (var i2 = 0; i2 < handlersLen; i2++) {
      xhr2.addEventListener(handlers2[i2], this.listener, eventListenerOpts(false));
    }
  }
  function onXhrCbTime(time, onload, xhr2) {
    this.cbTime += time;
    if (onload) this.onloadCalled = true;
    else this.called += 1;
    if (this.called === this.totalCbs && (this.onloadCalled || typeof xhr2.onload !== "function") && typeof this.end === "function") this.end(xhr2);
  }
  function onXhrLoadAdded(cb, useCapture) {
    var idString = "" + id(cb) + !!useCapture;
    if (!this.xhrGuids || this.xhrGuids[idString]) return;
    this.xhrGuids[idString] = true;
    this.totalCbs += 1;
  }
  function onXhrLoadRemoved(cb, useCapture) {
    var idString = "" + id(cb) + !!useCapture;
    if (!this.xhrGuids || !this.xhrGuids[idString]) return;
    delete this.xhrGuids[idString];
    this.totalCbs -= 1;
  }
  function onXhrResolved() {
    this.endTime = now();
  }
  function onAddEventListenerEnd(args, xhr2) {
    if (xhr2 instanceof origXHR && args[0] === "load") ee2.emit("xhr-load-added", [args[1], args[2]], xhr2);
  }
  function onRemoveEventListenerEnd(args, xhr2) {
    if (xhr2 instanceof origXHR && args[0] === "load") ee2.emit("xhr-load-removed", [args[1], args[2]], xhr2);
  }
  function onFnStart(args, xhr2, methodName) {
    if (xhr2 instanceof origXHR) {
      if (methodName === "onload") this.onload = true;
      if ((args[0] && args[0].type) === "load" || this.onload) this.xhrCbStart = now();
    }
  }
  function onFnEnd(args, xhr2) {
    if (this.xhrCbStart) ee2.emit("xhr-cb-time", [now() - this.xhrCbStart, this.onload, xhr2], xhr2);
  }
  function onFetchBeforeStart(args) {
    var opts = args[1] || {};
    var url;
    if (typeof args[0] === "string") {
      url = args[0];
      if (url.length === 0 && isBrowserScope) {
        url = "" + globalScope.location.href;
      }
    } else if (args[0] && args[0].url) {
      url = args[0].url;
    } else if (globalScope?.URL && args[0] && args[0] instanceof URL) {
      url = args[0].href;
    } else if (typeof args[0].toString === "function") {
      url = args[0].toString();
    }
    if (typeof url !== "string" || url.length === 0) {
      return;
    }
    if (url) {
      this.parsedOrigin = parseUrl(url);
      this.sameOrigin = this.parsedOrigin.sameOrigin;
    }
    var payload = dt.generateTracePayload(this.parsedOrigin);
    if (!payload || !payload.newrelicHeader && !payload.traceContextParentHeader) {
      return;
    }
    if (args[0] && args[0].headers) {
      if (addHeaders(args[0].headers, payload)) {
        this.dt = payload;
      }
    } else {
      var clone = {};
      for (var key in opts) {
        clone[key] = opts[key];
      }
      clone.headers = new Headers(opts.headers || {});
      if (addHeaders(clone.headers, payload)) {
        this.dt = payload;
      }
      if (args.length > 1) {
        args[1] = clone;
      } else {
        args.push(clone);
      }
    }
    function addHeaders(headersObj, payload2) {
      var added = false;
      if (payload2.newrelicHeader) {
        headersObj.set("newrelic", payload2.newrelicHeader);
        added = true;
      }
      if (payload2.traceContextParentHeader) {
        headersObj.set("traceparent", payload2.traceContextParentHeader);
        if (payload2.traceContextStateHeader) {
          headersObj.set("tracestate", payload2.traceContextStateHeader);
        }
        added = true;
      }
      return added;
    }
  }
  function onFetchStart(fetchArguments, dtPayload) {
    this.params = {};
    this.metrics = {};
    this.startTime = now();
    this.dt = dtPayload;
    if (fetchArguments.length >= 1) this.target = fetchArguments[0];
    if (fetchArguments.length >= 2) this.opts = fetchArguments[1];
    var opts = this.opts || {};
    var target = this.target;
    addUrl(this, extractUrl(target));
    var method = ("" + (target && target instanceof origRequest && target.method || opts.method || "GET")).toUpperCase();
    this.params.method = method;
    this.body = opts.body;
    this.txSize = dataSize(opts.body) || 0;
  }
  function onFetchDone(_2, res) {
    this.endTime = now();
    if (!this.params) this.params = {};
    if (hasUndefinedHostname(this.params)) return;
    this.params.status = res ? res.status : 0;
    let responseSize;
    if (typeof this.rxSize === "string" && this.rxSize.length > 0) {
      responseSize = +this.rxSize;
    }
    const metrics = {
      txSize: this.txSize,
      rxSize: responseSize,
      duration: now() - this.startTime
    };
    handler("xhr", [this.params, metrics, this.startTime, this.endTime, "fetch"], this, FEATURE_NAMES.ajax);
  }
  function end(xhr2) {
    const params = this.params;
    const metrics = this.metrics;
    if (this.ended) return;
    this.ended = true;
    for (let i2 = 0; i2 < handlersLen; i2++) {
      xhr2.removeEventListener(handlers2[i2], this.listener, false);
    }
    if (params.aborted) return;
    if (hasUndefinedHostname(params)) return;
    metrics.duration = now() - this.startTime;
    if (!this.loadCaptureCalled && xhr2.readyState === 4) {
      captureXhrData(this, xhr2);
    } else if (params.status == null) {
      params.status = 0;
    }
    metrics.cbTime = this.cbTime;
    handler("xhr", [params, metrics, this.startTime, this.endTime, "xhr"], this, FEATURE_NAMES.ajax);
  }
  function captureXhrData(ctx, xhr2) {
    ctx.params.status = xhr2.status;
    var size = responseSizeFromXhr(xhr2, ctx.lastSize);
    if (size) ctx.metrics.rxSize = size;
    if (ctx.sameOrigin && xhr2.getAllResponseHeaders().indexOf(NR_CAT_HEADER) >= 0) {
      var header = xhr2.getResponseHeader(NR_CAT_HEADER);
      if (header) {
        handle(SUPPORTABILITY_METRIC, ["Ajax/CrossApplicationTracing/Header/Seen"], void 0, FEATURE_NAMES.metrics, ee2);
        ctx.params.cat = header.split(", ").pop();
      }
    }
    ctx.loadCaptureCalled = true;
  }
}
function addUrl(ctx, url) {
  var parsed = parseUrl(url);
  var params = ctx.params || ctx;
  params.hostname = parsed.hostname;
  params.port = parsed.port;
  params.protocol = parsed.protocol;
  params.host = parsed.hostname + ":" + parsed.port;
  params.pathname = parsed.pathname;
  ctx.parsedOrigin = parsed;
  ctx.sameOrigin = parsed.sameOrigin;
}

// node_modules/@newrelic/browser-agent/dist/esm/features/session_trace/instrument/index.js
init_handle();

// node_modules/@newrelic/browser-agent/dist/esm/common/wrap/wrap-history.js
init_contextual_ee();
init_wrap_function();
init_runtime();
var wrapped4 = {};
var HISTORY_FNS = ["pushState", "replaceState"];
function wrapHistory(sharedEE) {
  const ee2 = scopedEE4(sharedEE);
  if (!isBrowserScope || wrapped4[ee2.debugId]++) return ee2;
  wrapped4[ee2.debugId] = 1;
  var wrapFn = createWrapperWithEmitter(ee2);
  wrapFn.inPlace(window.history, HISTORY_FNS, "-");
  return ee2;
}
function scopedEE4(sharedEE) {
  return (sharedEE || globalInstance).get("history");
}

// node_modules/@newrelic/browser-agent/dist/esm/features/session_trace/instrument/index.js
init_wrap_events();
init_constants11();
init_features();
init_feature_gates();
init_now();

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/addToTrace.js
init_runtime();
init_handle();
init_console();
init_features();
init_constants();
init_sharedHandlers();
function setupAddToTraceAPI(agent) {
  setupAPI(ADD_TO_TRACE, function(evt) {
    if (!(evt && typeof evt === "object" && evt.name && evt.start)) return;
    const report2 = {
      n: evt.name,
      s: evt.start - originTime,
      e: (evt.end || evt.start) - originTime,
      o: evt.origin || "",
      t: "api"
    };
    if (report2.s < 0 || report2.e < 0 || report2.e < report2.s) {
      warn(61, {
        start: report2.s,
        end: report2.e
      });
      return;
    }
    handle("bstApi", [report2], void 0, FEATURE_NAMES.sessionTrace, agent.ee);
  }, agent);
}

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/finished.js
init_runtime();
init_handle();
init_console();
init_constants4();
init_features();
init_constants();
init_sharedHandlers();
function setupFinishedAPI(agent) {
  setupAPI(FINISHED, function(unixTime = Date.now()) {
    const relativeTime = unixTime - originTime;
    if (relativeTime < 0) warn(62, unixTime);
    handle(CUSTOM_METRIC_CHANNEL, [FINISHED, {
      time: relativeTime
    }], void 0, FEATURE_NAMES.metrics, agent.ee);
    agent.addToTrace({
      name: FINISHED,
      start: unixTime,
      origin: "nr"
    });
    handle(prefix + ADD_PAGE_ACTION, [relativeTime, FINISHED], void 0, FEATURE_NAMES.genericEvents, agent.ee);
  }, agent);
}

// node_modules/@newrelic/browser-agent/dist/esm/features/session_trace/instrument/index.js
var {
  BST_RESOURCE: BST_RESOURCE2,
  RESOURCE: RESOURCE2,
  START: START4,
  END: END3,
  FEATURE_NAME: FEATURE_NAME9,
  FN_END: FN_END2,
  FN_START: FN_START2,
  PUSH_STATE: PUSH_STATE2
} = constants_exports2;
var Instrument6 = class extends InstrumentBase {
  static featureName = FEATURE_NAME9;
  constructor(agentRef) {
    super(agentRef, FEATURE_NAME9);
    setupAddToTraceAPI(agentRef);
    setupFinishedAPI(agentRef);
    const canTrackSession = canEnableSessionTracking(agentRef.init);
    if (!canTrackSession) {
      this.deregisterDrain();
      return;
    }
    const thisInstrumentEE = this.ee;
    wrapHistory(thisInstrumentEE);
    this.eventsEE = wrapEvents(thisInstrumentEE);
    this.eventsEE.on(FN_START2, function(args, target) {
      this.bstStart = now();
    });
    this.eventsEE.on(FN_END2, function(args, target) {
      handle("bst", [args[0], target, this.bstStart, now()], void 0, FEATURE_NAMES.sessionTrace, thisInstrumentEE);
    });
    thisInstrumentEE.on(PUSH_STATE2 + START4, function(args) {
      this.time = now();
      this.startPath = location.pathname + location.hash;
    });
    thisInstrumentEE.on(PUSH_STATE2 + END3, function(args) {
      handle("bstHist", [location.pathname + location.hash, this.startPath, this.time], void 0, FEATURE_NAMES.sessionTrace, thisInstrumentEE);
    });
    let observer;
    try {
      observer = new PerformanceObserver((list2) => {
        const entries = list2.getEntries();
        handle(BST_RESOURCE2, [entries], void 0, FEATURE_NAMES.sessionTrace, thisInstrumentEE);
      });
      observer.observe({
        type: RESOURCE2,
        buffered: true
      });
    } catch (e2) {
    }
    this.importAggregator(agentRef, () => Promise.resolve().then(() => (init_aggregate6(), aggregate_exports6)), {
      resourceObserver: observer
    });
  }
};

// node_modules/@newrelic/browser-agent/dist/esm/features/session_replay/instrument/index.js
init_handle();
init_constants3();
init_utils();
init_constants12();

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/recordReplay.js
init_handle();
init_features();
init_constants();
init_sharedHandlers();
function setupRecordReplayAPI(agent) {
  setupAPI(RECORD_REPLAY, function() {
    handle(RECORD_REPLAY, [], void 0, FEATURE_NAMES.sessionReplay, agent.ee);
  }, agent);
}

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/pauseReplay.js
init_handle();
init_features();
init_constants();
init_sharedHandlers();
function setupPauseReplayAPI(agent) {
  setupAPI(PAUSE_REPLAY, function() {
    handle(PAUSE_REPLAY, [], void 0, FEATURE_NAMES.sessionReplay, agent.ee);
  }, agent);
}

// node_modules/@newrelic/browser-agent/dist/esm/features/session_replay/instrument/index.js
init_constants();
var Instrument7 = class extends InstrumentBase {
  static featureName = FEATURE_NAME10;
  /** @type {Promise|undefined} A promise that resolves when the recorder module is imported and added to the class. Undefined if the recorder has never been staged to import with `importRecorder`. */
  #stagedImport;
  /** The RRWEB recorder instance, if imported */
  recorder;
  constructor(agentRef) {
    super(agentRef, FEATURE_NAME10);
    setupRecordReplayAPI(agentRef);
    setupPauseReplayAPI(agentRef);
    let session;
    try {
      session = JSON.parse(localStorage.getItem("".concat(PREFIX, "_").concat(DEFAULT_KEY)));
    } catch (err2) {
    }
    if (hasReplayPrerequisite(agentRef.init)) {
      this.ee.on(RECORD_REPLAY, () => this.#apiStartOrRestartReplay());
    }
    if (this.#canPreloadRecorder(session)) {
      this.importRecorder().then((recorder) => {
        recorder.startRecording(TRIGGERS.PRELOAD, session?.sessionReplayMode);
      });
    }
    this.importAggregator(this.agentRef, () => Promise.resolve().then(() => (init_aggregate7(), aggregate_exports7)), this);
    this.ee.on("err", (e2) => {
      if (this.blocked) return;
      if (this.agentRef.runtime.isRecording) {
        this.errorNoticed = true;
        handle(ERROR_DURING_REPLAY, [e2], void 0, this.featureName, this.ee);
      }
    });
  }
  // At this point wherein session state exists already but we haven't init SessionEntity aka verify timers.
  #canPreloadRecorder(session) {
    if (!session) {
      return isPreloadAllowed(this.agentRef.init);
    } else if (session.sessionReplayMode === MODE.FULL || session.sessionReplayMode === MODE.ERROR) {
      return true;
    } else {
      return isPreloadAllowed(this.agentRef.init);
    }
  }
  /**
   * Returns a promise that imports the recorder module. Only lets the recorder module be imported and instantiated once. Rejects if failed to import/instantiate.
   * @returns {Promise}
   */
  importRecorder() {
    if (this.recorder) return Promise.resolve(this.recorder);
    this.#stagedImport ??= Promise.resolve().then(() => (init_recorder(), recorder_exports)).then(({
      Recorder: Recorder2
    }) => {
      this.recorder = new Recorder2(this);
      return this.recorder;
    }).catch((err2) => {
      this.ee.emit("internal-error", [err2]);
      this.blocked = true;
      throw err2;
    });
    return this.#stagedImport;
  }
  /**
   * Called whenever startReplay API is used. That could occur any time, pre or post load.
   */
  #apiStartOrRestartReplay() {
    if (this.blocked) return;
    if (this.featAggregate) {
      if (this.featAggregate.mode !== MODE.FULL) this.featAggregate.initializeRecording(MODE.FULL, true, TRIGGERS.API);
    } else {
      this.importRecorder().then(() => {
        this.recorder.startRecording(TRIGGERS.API, MODE.FULL);
      });
    }
  }
};

// node_modules/@newrelic/browser-agent/dist/esm/features/generic_events/instrument/index.js
init_runtime();
init_handle();
init_event_listener_opts();
init_invoke();
init_constants2();
init_features();
init_parse_url();

// node_modules/@newrelic/browser-agent/dist/esm/common/wrap/wrap-websocket.js
init_runtime();
init_unique_id();
init_now();
init_clean_url();
init_nreum();
init_page_visibility();
var wrapped5 = {};
var openWebSockets = /* @__PURE__ */ new Set();
function wrapWebSocket(sharedEE) {
  const originals = gosNREUMOriginals().o;
  if (!originals.WS) return sharedEE;
  const wsEE = sharedEE.get("websockets");
  if (wrapped5[wsEE.debugId]++) return wsEE;
  wrapped5[wsEE.debugId] = 1;
  subscribeToPageUnload(() => {
    const unloadTime = now();
    openWebSockets.forEach((ws) => {
      ws.nrData.closedAt = unloadTime;
      ws.nrData.closeCode = 1001;
      ws.nrData.closeReason = "Page navigating away";
      ws.nrData.closeWasClean = false;
      if (ws.nrData.openedAt) {
        ws.nrData.connectedDuration = unloadTime - ws.nrData.openedAt;
      }
      wsEE.emit("ws", [ws.nrData], ws);
    });
  });
  class WrappedWebSocket extends WebSocket {
    static name = "WebSocket";
    static toString() {
      return "function WebSocket() { [native code] }";
    }
    toString() {
      return "[object WebSocket]";
    }
    get [Symbol.toStringTag]() {
      return WrappedWebSocket.name;
    }
    // Private method to tag send, close, and event listener errors with WebSocket ID for JSErrors feature
    #tagError(error) {
      ;
      (error.__newrelic ??= {}).socketId = this.nrData.socketId;
      this.nrData.hasErrors ??= true;
    }
    constructor(...args) {
      super(...args);
      this.nrData = new WebSocketData(args[0], args[1]);
      this.addEventListener("open", () => {
        this.nrData.openedAt = now();
        ["protocol", "extensions", "binaryType"].forEach((prop2) => {
          this.nrData[prop2] = this[prop2];
        });
        openWebSockets.add(this);
      });
      this.addEventListener("message", (event) => {
        const {
          type,
          size
        } = getDataInfo(event.data);
        this.nrData.messageOrigin ??= cleanURL(event.origin);
        this.nrData.messageCount++;
        this.nrData.messageBytes += size;
        this.nrData.messageBytesMin = Math.min(this.nrData.messageBytesMin || Infinity, size);
        this.nrData.messageBytesMax = Math.max(this.nrData.messageBytesMax, size);
        if (!(this.nrData.messageTypes ?? "").includes(type)) {
          this.nrData.messageTypes = this.nrData.messageTypes ? "".concat(this.nrData.messageTypes, ",").concat(type) : type;
        }
      });
      this.addEventListener("close", (event) => {
        this.nrData.closedAt = now();
        this.nrData.closeCode = event.code;
        if (event.reason) this.nrData.closeReason = event.reason;
        this.nrData.closeWasClean = event.wasClean;
        this.nrData.connectedDuration = this.nrData.closedAt - this.nrData.openedAt;
        openWebSockets.delete(this);
        wsEE.emit("ws", [this.nrData], this);
      });
    }
    addEventListener(type, listener, ...rest) {
      const wsInstance = this;
      const wrappedListener = typeof listener === "function" ? function(...args) {
        try {
          return listener.apply(this, args);
        } catch (error) {
          wsInstance.#tagError(error);
          throw error;
        }
      } : listener?.handleEvent ? {
        // case for listener === object with handleEvent
        handleEvent: function(...args) {
          try {
            return listener.handleEvent.apply(listener, args);
          } catch (error) {
            wsInstance.#tagError(error);
            throw error;
          }
        }
      } : listener;
      return super.addEventListener(type, wrappedListener, ...rest);
    }
    send(data) {
      if (this.readyState === WebSocket.OPEN) {
        const {
          type,
          size
        } = getDataInfo(data);
        this.nrData.sendCount++;
        this.nrData.sendBytes += size;
        this.nrData.sendBytesMin = Math.min(this.nrData.sendBytesMin || Infinity, size);
        this.nrData.sendBytesMax = Math.max(this.nrData.sendBytesMax, size);
        if (!(this.nrData.sendTypes ?? "").includes(type)) {
          this.nrData.sendTypes = this.nrData.sendTypes ? "".concat(this.nrData.sendTypes, ",").concat(type) : type;
        }
      }
      try {
        return super.send(data);
      } catch (error) {
        this.#tagError(error);
        throw error;
      }
    }
    close(...args) {
      try {
        super.close(...args);
      } catch (error) {
        this.#tagError(error);
        throw error;
      }
    }
  }
  globalScope.WebSocket = WrappedWebSocket;
  return wsEE;
}
function getDataInfo(data) {
  if (typeof data === "string") {
    return {
      type: "string",
      size: new TextEncoder().encode(data).length
      // efficient way to calculate the # of UTF-8 bytes that WS sends (cannot use string length)
    };
  }
  if (data instanceof ArrayBuffer) {
    return {
      type: "ArrayBuffer",
      size: data.byteLength
    };
  }
  if (data instanceof Blob) {
    return {
      type: "Blob",
      size: data.size
    };
  }
  if (data instanceof DataView) {
    return {
      type: "DataView",
      size: data.byteLength
    };
  }
  if (ArrayBuffer.isView(data)) {
    return {
      type: "TypedArray",
      size: data.byteLength
    };
  }
  return {
    type: "unknown",
    size: 0
  };
}
var WebSocketData = class {
  /**
   * @param {string} requestedUrl - The URL passed to WebSocket constructor
   * @param {string|string[]} [requestedProtocols] - The protocols passed to WebSocket constructor
   */
  constructor(requestedUrl, requestedProtocols) {
    this.timestamp = now();
    this.currentUrl = cleanURL(window.location.href);
    this.socketId = generateRandomHexString(8);
    this.requestedUrl = cleanURL(requestedUrl);
    this.requestedProtocols = Array.isArray(requestedProtocols) ? requestedProtocols.join(",") : requestedProtocols || "";
    this.openedAt = void 0;
    this.protocol = void 0;
    this.extensions = void 0;
    this.binaryType = void 0;
    this.messageOrigin = void 0;
    this.messageCount = 0;
    this.messageBytes = 0;
    this.messageBytesMin = 0;
    this.messageBytesMax = 0;
    this.messageTypes = void 0;
    this.sendCount = 0;
    this.sendBytes = 0;
    this.sendBytesMin = 0;
    this.sendBytesMax = 0;
    this.sendTypes = void 0;
    this.closedAt = void 0;
    this.closeCode = void 0;
    this.closeReason = "unknown";
    this.closeWasClean = void 0;
    this.connectedDuration = 0;
    this.hasErrors = void 0;
  }
};

// node_modules/@newrelic/browser-agent/dist/esm/features/generic_events/instrument/index.js
var Instrument8 = class extends InstrumentBase {
  static featureName = FEATURE_NAME;
  constructor(agentRef) {
    super(agentRef, FEATURE_NAME);
    const websocketsEnabled = agentRef.init.feature_flags.includes("websockets");
    const genericEventSourceConfigs = [agentRef.init.page_action.enabled, agentRef.init.performance.capture_marks, agentRef.init.performance.capture_measures, agentRef.init.performance.resources.enabled, agentRef.init.user_actions.enabled, websocketsEnabled];
    setupAddPageActionAPI(agentRef);
    setupRecordCustomEventAPI(agentRef);
    setupFinishedAPI(agentRef);
    setupRegisterAPI(agentRef);
    setupMeasureAPI(agentRef);
    let historyEE, websocketsEE;
    if (websocketsEnabled) websocketsEE = wrapWebSocket(this.ee);
    if (isBrowserScope) {
      wrapFetch(this.ee);
      wrapXhr(this.ee);
      historyEE = wrapHistory(this.ee);
      if (agentRef.init.user_actions.enabled) {
        let isInternalTraffic = function(url) {
          const parsedUrl = parseUrl(url);
          return agentRef.beacons.includes(parsedUrl.hostname + ":" + parsedUrl.port);
        }, navigationChange = function() {
          historyEE.emit("navChange");
        };
        OBSERVED_EVENTS.forEach((eventType) => windowAddEventListener(eventType, (evt) => handle("ua", [evt], void 0, this.featureName, this.ee), true));
        OBSERVED_WINDOW_EVENTS.forEach(
          (eventType) => {
            const debounceHandler = debounce((evt) => {
              handle("ua", [evt], void 0, this.featureName, this.ee);
            }, 500, {
              leading: true
            });
            windowAddEventListener(eventType, debounceHandler);
          }
          // Capture is not used here so that we don't get element focus/blur events, only the window's as they do not bubble. They are also not cancellable, so no worries about being front of line.
        );
        globalScope.addEventListener("error", () => {
          handle("uaErr", [], void 0, FEATURE_NAMES.genericEvents, this.ee);
        }, eventListenerOpts(false, this.removeOnAbort?.signal));
        this.ee.on("open-xhr-start", (args, xhr2) => {
          if (!isInternalTraffic(args[1])) {
            xhr2.addEventListener("readystatechange", () => {
              if (xhr2.readyState === 2) {
                handle("uaXhr", [], void 0, FEATURE_NAMES.genericEvents, this.ee);
              }
            });
          }
        });
        this.ee.on("fetch-start", (fetchArguments) => {
          if (fetchArguments.length >= 1 && !isInternalTraffic(extractUrl(fetchArguments[0]))) {
            handle("uaXhr", [], void 0, FEATURE_NAMES.genericEvents, this.ee);
          }
        });
        historyEE.on("pushState-end", navigationChange);
        historyEE.on("replaceState-end", navigationChange);
        window.addEventListener("hashchange", navigationChange, eventListenerOpts(true, this.removeOnAbort?.signal));
        window.addEventListener("popstate", navigationChange, eventListenerOpts(true, this.removeOnAbort?.signal));
      }
      if (agentRef.init.performance.resources.enabled && globalScope.PerformanceObserver?.supportedEntryTypes.includes("resource")) {
        const observer = new PerformanceObserver((list2) => {
          list2.getEntries().forEach((entry) => {
            handle("browserPerformance.resource", [entry], void 0, this.featureName, this.ee);
          });
        });
        observer.observe({
          type: "resource",
          buffered: true
        });
      }
    }
    if (websocketsEnabled) {
      websocketsEE.on("ws", (nrData) => {
        handle("ws-complete", [nrData], void 0, this.featureName, this.ee);
      });
    }
    try {
      this.removeOnAbort = new AbortController();
    } catch (e2) {
    }
    this.abortHandler = () => {
      this.removeOnAbort?.abort();
      this.abortHandler = void 0;
    };
    if (genericEventSourceConfigs.some((x3) => x3)) this.importAggregator(agentRef, () => Promise.resolve().then(() => (init_aggregate8(), aggregate_exports8)));
    else this.deregisterDrain();
  }
};

// node_modules/@newrelic/browser-agent/dist/esm/features/logging/instrument/index.js
init_constants5();
init_utils2();

// node_modules/@newrelic/browser-agent/dist/esm/common/wrap/wrap-logger.js
init_contextual_ee();
init_event_context();
init_console();
init_wrap_function();
var contextMap = /* @__PURE__ */ new Map();
function wrapLogger(sharedEE, parent, loggerFn, context, autoCaptured = true) {
  if (!(typeof parent === "object" && !!parent && typeof loggerFn === "string" && !!loggerFn && typeof parent[loggerFn] === "function")) return warn(29);
  const ee2 = scopedEE5(sharedEE);
  const wrapFn = createWrapperWithEmitter(ee2);
  const ctx = new EventContext(contextId);
  ctx.level = context.level;
  ctx.customAttributes = context.customAttributes;
  ctx.autoCaptured = autoCaptured;
  const contextLookupKey = parent[loggerFn]?.[flag] || parent[loggerFn];
  contextMap.set(contextLookupKey, ctx);
  wrapFn.inPlace(parent, [loggerFn], "wrap-logger-", () => contextMap.get(contextLookupKey));
  return ee2;
}
function scopedEE5(sharedEE) {
  return (sharedEE || globalInstance).get("logger");
}

// node_modules/@newrelic/browser-agent/dist/esm/features/logging/instrument/index.js
init_runtime();

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/wrapLogger.js
init_constants5();
init_constants();
init_sharedHandlers();
function setupWrapLoggerAPI(agent) {
  setupAPI(WRAP_LOGGER, (parent, functionName, {
    customAttributes = {},
    level = LOG_LEVELS.INFO
  } = {}) => {
    wrapLogger(agent.ee, parent, functionName, {
      customAttributes,
      level
    }, false);
  }, agent);
}

// node_modules/@newrelic/browser-agent/dist/esm/features/logging/instrument/index.js
init_monkey_patched();
var Instrument9 = class extends InstrumentBase {
  static featureName = FEATURE_NAME3;
  constructor(agentRef) {
    super(agentRef, FEATURE_NAME3);
    setupLogAPI(agentRef);
    setupWrapLoggerAPI(agentRef);
    setupRegisterAPI(agentRef);
    const instanceEE = this.ee;
    const globals = ["log", "error", "warn", "info", "debug", "trace"];
    globals.forEach((method) => {
      isNative(globalScope.console[method]);
      wrapLogger(instanceEE, globalScope.console, method, {
        level: method === "log" ? "info" : method
      });
    });
    this.ee.on("wrap-logger-end", function handleLog([message]) {
      const {
        level,
        customAttributes,
        autoCaptured
      } = this;
      bufferLog(instanceEE, message, customAttributes, level, autoCaptured);
    });
    this.importAggregator(agentRef, () => Promise.resolve().then(() => (init_aggregate9(), aggregate_exports9)));
  }
};

// node_modules/@newrelic/browser-agent/dist/esm/features/soft_navigations/instrument/index.js
init_nreum();
init_runtime();
init_handle();
init_event_listener_opts();
init_invoke();
init_constants13();
init_now();

// node_modules/@newrelic/browser-agent/dist/esm/loaders/api/interaction.js
init_handle();
init_now();
init_constants4();
init_features();
init_constants();
init_sharedHandlers();
function setupInteractionAPI(agent) {
  const tracerEE = agent.ee.get("tracer");
  setupAPI(INTERACTION, function(options) {
    return new InteractionHandle().get(typeof options === "object" ? options : {});
  }, agent);
  function InteractionHandle() {
  }
  const InteractionApiProto = InteractionHandle.prototype = {
    createTracer: function(name, cb) {
      var contextStore = {};
      var ixn = this;
      var hasCb = typeof cb === "function";
      handle(SUPPORTABILITY_METRIC_CHANNEL, ["API/createTracer/called"], void 0, FEATURE_NAMES.metrics, agent.ee);
      return function() {
        tracerEE.emit((hasCb ? "" : "no-") + "fn-start", [now(), ixn, hasCb], contextStore);
        if (hasCb) {
          try {
            return cb.apply(this, arguments);
          } catch (err2) {
            const error = typeof err2 === "string" ? new Error(err2) : err2;
            tracerEE.emit("fn-err", [arguments, this, error], contextStore);
            throw error;
          } finally {
            tracerEE.emit("fn-end", [now()], contextStore);
          }
        }
      };
    }
  };
  ["actionText", "setName", "setAttribute", "save", "ignore", "onEnd", "getContext", "end", "get"].forEach((name) => {
    setupAPI.apply(this, [name, function() {
      handle(spaPrefix + name, [performance.now(), ...arguments], this, FEATURE_NAMES.softNav, agent.ee);
      return this;
    }, agent, InteractionApiProto]);
  });
  setupAPI(SET_CURRENT_ROUTE_NAME, function() {
    handle(spaPrefix + "routeName", [performance.now(), ...arguments], void 0, FEATURE_NAMES.softNav, agent.ee);
  }, agent);
}

// node_modules/@newrelic/browser-agent/dist/esm/features/soft_navigations/instrument/index.js
var UI_WAIT_INTERVAL = 1 / 10 * 1e3;
var Instrument10 = class extends InstrumentBase {
  static featureName = FEATURE_NAME11;
  constructor(agentRef) {
    super(agentRef, FEATURE_NAME11);
    setupInteractionAPI(agentRef);
    if (!isBrowserScope || !gosNREUMOriginals().o.MO) return;
    const historyEE = wrapHistory(this.ee);
    try {
      this.removeOnAbort = new AbortController();
    } catch (e2) {
    }
    INTERACTION_TRIGGERS.forEach((trigger) => {
      windowAddEventListener(trigger, (evt) => {
        processUserInteraction(evt);
      }, true, this.removeOnAbort?.signal);
    });
    const trackURLChange = () => handle("newURL", [now(), "" + window.location], void 0, this.featureName, this.ee);
    historyEE.on("pushState-end", trackURLChange);
    historyEE.on("replaceState-end", trackURLChange);
    windowAddEventListener(POPSTATE_TRIGGER, (evt) => {
      processUserInteraction(evt);
      handle("newURL", [evt.timeStamp, "" + window.location], void 0, this.featureName, this.ee);
    }, true, this.removeOnAbort?.signal);
    let oncePerFrame = false;
    const domObserver = new (gosNREUMOriginals()).o.MO((domChanges, observer) => {
      if (oncePerFrame) return;
      oncePerFrame = true;
      requestAnimationFrame(() => {
        handle("newDom", [now()], void 0, this.featureName, this.ee);
        oncePerFrame = false;
      });
    });
    const processUserInteraction = debounce((event) => {
      if (document.readyState === "loading") return;
      handle("newUIEvent", [event], void 0, this.featureName, this.ee);
      domObserver.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
      });
    }, UI_WAIT_INTERVAL, {
      leading: true
    });
    this.abortHandler = abort;
    this.importAggregator(agentRef, () => Promise.resolve().then(() => (init_aggregate10(), aggregate_exports10)), {
      domObserver
    });
    function abort() {
      this.removeOnAbort?.abort();
      domObserver.disconnect();
      this.abortHandler = void 0;
    }
  }
};

// node_modules/@newrelic/browser-agent/dist/esm/loaders/browser-agent.js
var BrowserAgent = class extends Agent {
  /**
   * @param {import('./agent').AgentOptions} options
   */
  constructor(options) {
    super({
      ...options,
      features: [Instrument5, Instrument, Instrument2, Instrument6, Instrument3, Instrument4, Instrument10, Instrument7, Instrument8, Instrument9],
      loaderType: "browser-agent"
    });
  }
};
export {
  BrowserAgent
};
/*! Bundled license information:

@newrelic/browser-agent/dist/esm/common/constants/runtime.js:
  (**
   * @file Contains constants about the environment the agent is running
   * within. These values are derived at the time the agent is first loaded.
   * @copyright 2023 New Relic Corporation. All rights reserved.
   * @license Apache-2.0
   *)

@newrelic/browser-agent/dist/esm/common/ids/bundle-id.js:
  (**
   * @file Contains a unique identifier for the running agent bundle
   * when loaded.
   * @copyright 2023 New Relic Corporation. All rights reserved.
   * @license Apache-2.0
   *)

@newrelic/browser-agent/dist/esm/common/util/submit-data.js:
  (**
   * @file Contains common methods used to transmit harvested data.
   * @copyright 2023 New Relic Corporation. All rights reserved.
   * @license Apache-2.0
   *)

@newrelic/rrweb/dist/rrweb.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)
*/

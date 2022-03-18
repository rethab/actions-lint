/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    return inputs;
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issueCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(9925);
const auth_1 = __nccwpck_require__(3702);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 3702:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' +
                Buffer.from(this.username + ':' + this.password).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] = 'Bearer ' + this.token;
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' + Buffer.from('PAT:' + this.token).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;


/***/ }),

/***/ 9925:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const http = __nccwpck_require__(3685);
const https = __nccwpck_require__(5687);
const pm = __nccwpck_require__(6443);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = new URL(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __nccwpck_require__(4294);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    ...((proxyUrl.username || proxyUrl.password) && {
                        proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                    }),
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new HttpClientError(msg, statusCode);
                err.result = response.result;
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 6443:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = new URL(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 1512:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeyValuePair = exports.DictionaryContextData = exports.ArrayContextData = exports.StringContextData = exports.NumberContextData = exports.BooleanContextData = exports.ContextData = exports.CASE_SENSITIVE_DICTIONARY_TYPE = exports.NUMBER_TYPE = exports.BOOLEAN_TYPE = exports.DICTIONARY_TYPE = exports.ARRAY_TYPE = exports.STRING_TYPE = void 0;
const nodes_1 = __nccwpck_require__(9248);
exports.STRING_TYPE = 0;
exports.ARRAY_TYPE = 1;
exports.DICTIONARY_TYPE = 2;
exports.BOOLEAN_TYPE = 3;
exports.NUMBER_TYPE = 4;
exports.CASE_SENSITIVE_DICTIONARY_TYPE = 5;
////////////////////////////////////////////////////////////////////////////////
// Context data classes
////////////////////////////////////////////////////////////////////////////////
class ContextData {
    constructor(type) {
        this.t = type;
    }
    get type() {
        return this.t ?? 0;
    }
    /**
     * Returns all context data object (depth first)
     * @param value The object to travese
     * @param omitKeys Whether to omit dictionary keys
     */
    static *traverse(value, omitKeys) {
        yield value;
        switch (value?.type) {
            case exports.ARRAY_TYPE:
            case exports.DICTIONARY_TYPE:
            case exports.CASE_SENSITIVE_DICTIONARY_TYPE: {
                let state = new TraversalState(undefined, value);
                while (state) {
                    if (state.moveNext(omitKeys ?? false)) {
                        value = state.current;
                        yield value;
                        switch (value?.type) {
                            case exports.ARRAY_TYPE:
                            case exports.DICTIONARY_TYPE:
                            case exports.CASE_SENSITIVE_DICTIONARY_TYPE:
                                state = new TraversalState(state, value);
                                break;
                        }
                    }
                    else {
                        state = state.parent;
                    }
                }
                break;
            }
        }
    }
    /**
     * Converts to ContextData from serialized ContextData.
     */
    static fromContextDataJSON(string) {
        return ContextData.fromDeserializedContextData(JSON.parse(string));
    }
    /**
     * Converts to ContextData from serialized ContextData that has already been JSON-parsed into regular JavaScript objects.
     */
    static fromDeserializedContextData(object) {
        switch (typeof object) {
            case "boolean":
                return new BooleanContextData(object);
            case "number":
                return new NumberContextData(object);
            case "string":
                return new StringContextData(object);
            case "object": {
                if (object === null) {
                    return null;
                }
                const type = Object.prototype.hasOwnProperty.call(object, "t")
                    ? object.t
                    : exports.STRING_TYPE;
                switch (type) {
                    case exports.BOOLEAN_TYPE:
                        return new BooleanContextData(object.b ?? false);
                    case exports.NUMBER_TYPE:
                        return new NumberContextData(object.n ?? 0);
                    case exports.STRING_TYPE:
                        return new StringContextData(object.s ?? "");
                    case exports.ARRAY_TYPE: {
                        const array = new ArrayContextData();
                        for (const item of object.a ?? []) {
                            array.push(ContextData.fromDeserializedContextData(item));
                        }
                        return array;
                    }
                    case exports.DICTIONARY_TYPE:
                    case exports.CASE_SENSITIVE_DICTIONARY_TYPE: {
                        const dictionary = new DictionaryContextData(type === exports.CASE_SENSITIVE_DICTIONARY_TYPE);
                        for (const pair of object.d ?? []) {
                            const key = pair.k ?? "";
                            const value = ContextData.fromDeserializedContextData(pair.v);
                            dictionary.set(key, value);
                        }
                        return dictionary;
                    }
                    default:
                        throw new Error(`Unexpected context type '${type}' when converting deserialized context data to context data`);
                }
            }
            default:
                throw new Error(`Unexpected type '${typeof object}' when converting deserialized context data to context data`);
        }
    }
    /**
     * Convert plain JSON objects into ContextData. Supports boolean, number, string, array, object, null
     */
    static fromJSON(string) {
        return ContextData.fromObject(JSON.parse(string));
    }
    /**
     * Convert plain JavaScript types into ContextData. Supports boolean, number, string, array, object, null, undefined.
     */
    static fromObject(object) {
        return ContextData.fromObjectInternal(object, 1, 100);
    }
    /**
     * Convert to plain JavaScript types: boolean, number, string, array, object, null.
     */
    static toObject(value) {
        switch (value?.type) {
            case null:
                return null;
            case exports.BOOLEAN_TYPE:
                return value.value;
            case exports.NUMBER_TYPE:
                return value.value;
            case exports.STRING_TYPE:
                return value.value;
            case exports.ARRAY_TYPE: {
                const array = value;
                const result = [];
                for (let i = 0; i < array.length; i++) {
                    result.push(ContextData.toObject(array.get(i)));
                }
                return result;
            }
            case exports.DICTIONARY_TYPE:
            case exports.CASE_SENSITIVE_DICTIONARY_TYPE: {
                const dictionary = value;
                const result = {};
                for (let i = 0; i < dictionary.keyCount; i++) {
                    const pair = dictionary.getPair(i);
                    result[pair.key] = ContextData.toObject(pair.value);
                }
                return result;
            }
            default:
                throw new Error(`Unexpected type '${value?.type}' when converting context data to object`);
        }
    }
    static fromObjectInternal(object, depth, maxDepth) {
        if (depth > 100) {
            throw new Error(`Reached max depth '${maxDepth}' when converting object to context data`);
        }
        switch (typeof object) {
            case "boolean":
                return new BooleanContextData(object);
            case "number":
                return new NumberContextData(object);
            case "string":
                return new StringContextData(object);
            case "undefined":
                return null;
            case "object":
                if (object === null) {
                    return null;
                }
                else if (Object.prototype.hasOwnProperty.call(object, "length")) {
                    const array = new ArrayContextData();
                    for (let i = 0; i < object.length; i++) {
                        array.push(ContextData.fromObjectInternal(object[i], depth + 1, maxDepth));
                    }
                    return array;
                }
                else {
                    const dictionary = new DictionaryContextData();
                    for (const key of Object.keys(object)) {
                        dictionary.set(key, ContextData.fromObjectInternal(object[key], depth + 1, maxDepth));
                    }
                    return dictionary;
                }
            default:
                throw new Error(`Unexpected type '${typeof object}' when converting object to context data`);
        }
    }
}
exports.ContextData = ContextData;
class BooleanContextData extends ContextData {
    constructor(boolean) {
        super(exports.BOOLEAN_TYPE);
        if (boolean !== false) {
            this.b = boolean;
        }
    }
    // Required for interface BooleanCompatible
    get compatibleValueKind() {
        return nodes_1.ValueKind.Boolean;
    }
    get value() {
        return this.b ?? false;
    }
    clone() {
        return new BooleanContextData(this.value);
    }
    // Required for interface BooleanCompatible
    getBoolean() {
        return this.value;
    }
}
exports.BooleanContextData = BooleanContextData;
class NumberContextData extends ContextData {
    constructor(number) {
        super(exports.NUMBER_TYPE);
        if (number !== 0) {
            this.n = number;
        }
    }
    // Required for interface NumberCompatible
    get compatibleValueKind() {
        return nodes_1.ValueKind.Number;
    }
    get value() {
        return this.n ?? 0;
    }
    clone() {
        return new NumberContextData(this.value);
    }
    // Required for interface NumberCompatible
    getNumber() {
        return this.value;
    }
}
exports.NumberContextData = NumberContextData;
class StringContextData extends ContextData {
    constructor(string) {
        super(exports.STRING_TYPE);
        if (string !== "") {
            this.s = string;
        }
    }
    // Required for interface StringCompatible
    get compatibleValueKind() {
        return nodes_1.ValueKind.String;
    }
    get value() {
        return this.s ?? "";
    }
    clone() {
        return new StringContextData(this.value);
    }
    // Required for interface StringCompatible
    getString() {
        return this.value;
    }
}
exports.StringContextData = StringContextData;
class ArrayContextData extends ContextData {
    constructor() {
        super(exports.ARRAY_TYPE);
        this.a = [];
    }
    // Required for interface ReadOnlyArrayCompatible
    get compatibleValueKind() {
        return nodes_1.ValueKind.Array;
    }
    get length() {
        return this.a.length;
    }
    push(item) {
        this.a.push(item);
    }
    get(index) {
        return this.a[index] ?? null;
    }
    clone() {
        const result = new ArrayContextData();
        for (let i = 0; i < this.length; i++) {
            result.push(this.get(i));
        }
        return result;
    }
    // Required for interface ReadOnlyArrayCompatible
    getArrayLength() {
        return this.length;
    }
    // Required for interface ReadOnlyArrayCompatible
    getArrayItem(index) {
        return this.get(index);
    }
}
exports.ArrayContextData = ArrayContextData;
class DictionaryContextData extends ContextData {
    constructor(caseSensitive) {
        super(caseSensitive ? exports.CASE_SENSITIVE_DICTIONARY_TYPE : exports.DICTIONARY_TYPE);
        this.d = [];
        this._getHiddenProperty = (propertyName, createDefaultValue) => {
            const func = this._getHiddenProperty;
            if (!Object.prototype.hasOwnProperty.call(func, propertyName)) {
                func[propertyName] = createDefaultValue();
            }
            return func[propertyName];
        };
    }
    get _indexLookup() {
        // Prevent index lookup from being serialized
        return this._getHiddenProperty("indexLookup", () => {
            return {};
        });
    }
    get keyCount() {
        return this.d.length;
    }
    // Required for interface ReadOnlyObjectCompatible
    get compatibleValueKind() {
        return nodes_1.ValueKind.Object;
    }
    get(key) {
        const lookupKey = this.getLookupKey(key);
        if (Object.prototype.hasOwnProperty.call(this._indexLookup, lookupKey)) {
            const index = this._indexLookup[lookupKey];
            return this.d[index].value;
        }
        return null;
    }
    getPair(index) {
        return this.d[index];
    }
    set(key, value) {
        const lookupKey = this.getLookupKey(key);
        if (Object.prototype.hasOwnProperty.call(this._indexLookup, lookupKey)) {
            const index = this._indexLookup[lookupKey];
            const existingPair = this.d[index];
            this.d[index] = new KeyValuePair(existingPair.key, value);
        }
        else {
            this.d.push(new KeyValuePair(key, value));
            this._indexLookup[lookupKey] = this.d.length - 1;
        }
    }
    // Required for interface ReadOnlyObjectCompatible
    hasObjectKey(key) {
        const lookupKey = this.getLookupKey(key);
        return Object.prototype.hasOwnProperty.call(this._indexLookup, lookupKey);
    }
    // Required for interface ReadOnlyObjectCompatible
    getObjectKeys() {
        const result = [];
        for (const pair of this.d) {
            result.push(pair.key);
        }
        return result;
    }
    // Required for interface ReadOnlyObjectCompatible
    getObjectKeyCount() {
        return this.d.length;
    }
    // Required for interface ReadOnlyObjectCompatible
    getObjectValue(key) {
        return this.get(key);
    }
    clone() {
        const result = new DictionaryContextData();
        for (const pair of this.d) {
            result.set(pair.key, pair.value);
        }
        return result;
    }
    /**
     * Translates to upper if case-insensitive
     */
    getLookupKey(key) {
        return this.type === exports.DICTIONARY_TYPE ? key.toUpperCase() : key;
    }
}
exports.DictionaryContextData = DictionaryContextData;
class KeyValuePair {
    constructor(key, value) {
        this.k = key;
        this.v = value;
    }
    get key() {
        return this.k;
    }
    get value() {
        return this.v;
    }
}
exports.KeyValuePair = KeyValuePair;
class TraversalState {
    constructor(parent, data) {
        this.index = -1;
        this.isKey = false;
        this.parent = parent;
        this._data = data;
    }
    moveNext(omitKeys) {
        switch (this._data.type) {
            case exports.ARRAY_TYPE: {
                const array = this._data;
                if (++this.index < array.length) {
                    this.current = array.get(this.index);
                    return true;
                }
                this.current = undefined;
                return false;
            }
            case exports.DICTIONARY_TYPE:
            case exports.CASE_SENSITIVE_DICTIONARY_TYPE: {
                const object = this._data;
                // Already returned the key, now return the value
                if (this.isKey) {
                    this.isKey = false;
                    this.current = object.getPair(this.index).value;
                    return true;
                }
                // Move next
                if (++this.index < object.keyCount) {
                    // Skip the key, return the value
                    if (omitKeys) {
                        this.isKey = false;
                        this.current = object.getPair(this.index).value;
                        return true;
                    }
                    // Return the key
                    this.isKey = true;
                    this.current = new StringContextData(object.getPair(this.index).key);
                    return true;
                }
                this.current = undefined;
                return false;
            }
            default:
                throw new Error(`Unexpected context data type '${this._data.type}' when traversing state`);
        }
    }
}
//# sourceMappingURL=context-data.js.map

/***/ }),

/***/ 9575:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OR = exports.AND = exports.EQUAL = exports.LESS_THAN_OR_EQUAL = exports.LESS_THAN = exports.GREATER_THAN_OR_EQUAL = exports.GREATER_THAN = exports.NOT_EQUAL = exports.NOT = exports.WILDCARD = exports.DEREFERENCE = exports.SEPARATOR = exports.END_PARAMETER = exports.END_INDEX = exports.END_GROUP = exports.START_PARAMETER = exports.START_INDEX = exports.START_GROUP = exports.TRUE = exports.NULL = exports.NEGATIVE_INFINITY = exports.NAN = exports.MAX_LENGTH = exports.MAX_DEPTH = exports.INFINITY = exports.FALSE = void 0;
exports.FALSE = "false";
exports.INFINITY = "Infinity";
exports.MAX_DEPTH = 50;
exports.MAX_LENGTH = 21000; // Under 85,000 large object heap threshold, even if .NET switches to UTF-32
exports.NAN = "NaN";
exports.NEGATIVE_INFINITY = "-Infinity";
exports.NULL = "null";
exports.TRUE = "true";
// Punctuation
exports.START_GROUP = "("; // logical grouping
exports.START_INDEX = "[";
exports.START_PARAMETER = "("; // function call
exports.END_GROUP = ")"; // logical grouping
exports.END_INDEX = "]";
exports.END_PARAMETER = ")"; // function calll
exports.SEPARATOR = ",";
exports.DEREFERENCE = ".";
exports.WILDCARD = "*";
// Operators
exports.NOT = "!";
exports.NOT_EQUAL = "!=";
exports.GREATER_THAN = ">";
exports.GREATER_THAN_OR_EQUAL = ">=";
exports.LESS_THAN = "<";
exports.LESS_THAN_OR_EQUAL = "<=";
exports.EQUAL = "==";
exports.AND = "&&";
exports.OR = "||";
//# sourceMappingURL=expression-constants.js.map

/***/ }),

/***/ 8170:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.indent = exports.stringEscape = exports.parseNumber = exports.testPrimitive = exports.testLegalKeyword = exports.formatValue = void 0;
const expression_constants_1 = __nccwpck_require__(9575);
const nodes_1 = __nccwpck_require__(9248);
function formatValue(value, kind) {
    switch (kind) {
        case nodes_1.ValueKind.Null:
            return expression_constants_1.NULL;
        case nodes_1.ValueKind.Boolean:
            return value ? expression_constants_1.TRUE : expression_constants_1.FALSE;
        case nodes_1.ValueKind.Number:
            return `${value}`;
        case nodes_1.ValueKind.String: {
            const strValue = value;
            return `'${stringEscape(strValue)}'`;
        }
        case nodes_1.ValueKind.Array:
            return "Array";
        case nodes_1.ValueKind.Object:
            return "Object";
        default:
            // Should never reach here
            throw new Error(`Unable to convert to format value. Unexpected value kind '${kind}'`);
    }
}
exports.formatValue = formatValue;
function testLegalKeyword(str) {
    if (!str) {
        return false;
    }
    const first = str[0];
    if ((first >= "a" && first <= "z") ||
        (first >= "A" && first <= "Z") ||
        first == "_") {
        for (let i = 0; i < str.length; i++) {
            const c = str[i];
            if ((c >= "a" && c <= "z") ||
                (c >= "A" && c <= "Z") ||
                (c >= "0" && c <= "9") ||
                c == "_" ||
                c == "-") {
                // Intentionally empty
            }
            else {
                return false;
            }
        }
        return true;
    }
    else {
        return false;
    }
}
exports.testLegalKeyword = testLegalKeyword;
function testPrimitive(kind) {
    switch (kind) {
        case nodes_1.ValueKind.Null:
        case nodes_1.ValueKind.Boolean:
        case nodes_1.ValueKind.Number:
        case nodes_1.ValueKind.String:
            return true;
        default:
            return false;
    }
}
exports.testPrimitive = testPrimitive;
function parseNumber(str) {
    return Number(str);
}
exports.parseNumber = parseNumber;
function stringEscape(value) {
    return value.replace(/'/g, "''");
}
exports.stringEscape = stringEscape;
function indent(level, str) {
    const result = [];
    for (let i = 0; i < level; i++) {
        result.push(str);
    }
    return result.join("");
}
exports.indent = indent;
//# sourceMappingURL=expression-utility.js.map

/***/ }),

/***/ 9102:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Contains = void 0;
const nodes_1 = __nccwpck_require__(9248);
class Contains extends nodes_1.FunctionNode {
    get traceFullyRealized() {
        return false;
    }
    evaluateCore(context) {
        let found = false;
        const left = this.parameters[0].evaluate(context);
        if (left.isPrimitive) {
            const leftString = left.convertToString();
            const right = this.parameters[1].evaluate(context);
            if (right.isPrimitive) {
                const rightString = right.convertToString();
                found = leftString.toUpperCase().indexOf(rightString.toUpperCase()) >= 0;
            }
        }
        else {
            const collection = left.getCollectionInterface();
            if (collection?.compatibleValueKind === nodes_1.ValueKind.Array) {
                const array = collection;
                const length = array.getArrayLength();
                if (length > 0) {
                    const right = this.parameters[1].evaluate(context);
                    for (let i = 0; i < length; i++) {
                        const itemResult = new nodes_1.EvaluationResult(new nodes_1.CanonicalValue(array.getArrayItem(i)));
                        if (right.abstractEqual(itemResult)) {
                            found = true;
                            break;
                        }
                    }
                }
            }
        }
        return {
            value: found,
            memory: undefined,
        };
    }
}
exports.Contains = Contains;
//# sourceMappingURL=contains.js.map

/***/ }),

/***/ 1967:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EndsWith = void 0;
const nodes_1 = __nccwpck_require__(9248);
class EndsWith extends nodes_1.FunctionNode {
    get traceFullyRealized() {
        return false;
    }
    evaluateCore(context) {
        let found = false;
        const left = this.parameters[0].evaluate(context);
        if (left.isPrimitive) {
            const leftString = left.convertToString();
            const right = this.parameters[1].evaluate(context);
            if (right.isPrimitive) {
                const rightString = right.convertToString();
                found = leftString.toUpperCase().endsWith(rightString.toUpperCase());
            }
        }
        return {
            value: found,
            memory: undefined,
        };
    }
}
exports.EndsWith = EndsWith;
//# sourceMappingURL=ends-with.js.map

/***/ }),

/***/ 1406:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Format = void 0;
const nodes_1 = __nccwpck_require__(9248);
class Format extends nodes_1.FunctionNode {
    evaluateCore(context) {
        const format = this.parameters[0].evaluate(context).convertToString();
        let index = 0;
        const result = new FormatResultBuilder(this, context, this.createMemoryCounter(context));
        while (index < format.length) {
            const lbrace = format.indexOf("{", index);
            let rbrace = format.indexOf("}", index);
            // Left brace
            if (lbrace >= 0 && (rbrace < 0 || rbrace > lbrace)) {
                // Escaped left brace
                if (Format.safeCharAt(format, lbrace + 1) === "{") {
                    result.appendString(format.substr(index, lbrace - index + 1));
                    index = lbrace + 2;
                    continue;
                }
                // Left brace, number, optional format specifiers, right brace
                if (rbrace > lbrace + 1) {
                    const argIndex = Format.readArgIndex(format, lbrace + 1);
                    if (argIndex.success) {
                        const formatSpecifiers = Format.readFormatSpecifiers(format, argIndex.endIndex + 1);
                        if (formatSpecifiers.success) {
                            rbrace = formatSpecifiers.rbrace;
                            // Check parameter count
                            if (argIndex.result > this.parameters.length - 2) {
                                throw new Error(`The following format string references more arguments than were supplied: ${format}`);
                            }
                            // Append the portion before the left brace
                            if (lbrace > index) {
                                result.appendString(format.substr(index, lbrace - index));
                            }
                            // Append the arg
                            result.appendArgument(argIndex.result, formatSpecifiers.result);
                            index = rbrace + 1;
                            continue;
                        }
                    }
                }
                throw new Error(`The following format string is invalid: ${format}`);
            }
            // Right brace
            else if (rbrace >= 0) {
                // Escaped right brace
                if (Format.safeCharAt(format, rbrace + 1) === "}") {
                    result.appendString(format.substr(index, rbrace - index + 1));
                    index = rbrace + 2;
                }
                else {
                    throw new Error(`The following format string is invalid: ${format}`);
                }
            }
            // Last segment
            else {
                result.appendString(format.substr(index));
                break;
            }
        }
        return {
            value: result.build(),
            memory: undefined,
        };
    }
    static format(memoryCounter, format, args) {
        const result = [];
        let index = 0;
        while (index < format.length) {
            const lbrace = format.indexOf("{", index);
            let rbrace = format.indexOf("}", index);
            // Left brace
            if (lbrace >= 0 && (rbrace < 0 || rbrace > lbrace)) {
                // Escaped left brace
                if (Format.safeCharAt(format, lbrace + 1) === "{") {
                    result.push(format.substr(index, lbrace - index + 1));
                    memoryCounter.addString(result[result.length - 1]);
                    index = lbrace + 2;
                    continue;
                }
                // Left brace, number, optional format specifiers, right brace
                if (rbrace > lbrace + 1) {
                    const argIndex = Format.readArgIndex(format, lbrace + 1);
                    if (argIndex.success) {
                        const formatSpecifiers = Format.readFormatSpecifiers(format, argIndex.endIndex + 1);
                        if (formatSpecifiers.success) {
                            if (formatSpecifiers.result) {
                                throw new Error("Format specifies not currently supported");
                            }
                            rbrace = formatSpecifiers.rbrace;
                            // Check parameter count
                            if (argIndex.result > args.length - 1) {
                                throw new Error(`The following format string references more arguments than were supplied: ${format}`);
                            }
                            // Append the portion before the left brace
                            if (lbrace > index) {
                                result.push(format.substr(index, lbrace - index));
                                memoryCounter.addString(result[result.length - 1]);
                            }
                            // Append the arg
                            result.push(`${args[argIndex.result]}`);
                            memoryCounter.addString(result[result.length - 1]);
                            index = rbrace + 1;
                            continue;
                        }
                    }
                }
                throw new Error(`The following format string is invalid: ${format}`);
            }
            // Right brace
            else if (rbrace >= 0) {
                // Escaped right brace
                if (Format.safeCharAt(format, rbrace + 1) === "}") {
                    result.push(format.substr(index, rbrace - index + 1));
                    memoryCounter.addString(result[result.length - 1]);
                    index = rbrace + 2;
                }
                else {
                    throw new Error(`The following format string is invalid: ${format}`);
                }
            }
            // Last segment
            else {
                result.push(format.substr(index));
                memoryCounter.addString(result[result.length - 1]);
                break;
            }
        }
        return result.join("");
    }
    static readArgIndex(string, startIndex) {
        // Count the number of digits
        let length = 0;
        while (true) {
            const nextChar = Format.safeCharAt(string, startIndex + length);
            if (nextChar >= "0" && nextChar <= "9") {
                length++;
            }
            else {
                break;
            }
        }
        // Validate at least one digit
        if (length < 1) {
            return {
                success: false,
            };
        }
        // Parse the number
        const endIndex = startIndex + length - 1;
        const result = parseInt(string.substr(startIndex, length));
        return {
            success: !isNaN(result),
            result: result,
            endIndex: endIndex,
        };
    }
    static readFormatSpecifiers(string, startIndex) {
        // No format specifiers
        let c = Format.safeCharAt(string, startIndex);
        if (c === "}") {
            return {
                success: true,
                result: "",
                rbrace: startIndex,
            };
        }
        // Validate starts with ":"
        if (c !== ":") {
            return {
                success: false,
                result: "",
                rbrace: 0,
            };
        }
        // Read the specifiers
        const specifiers = [];
        let index = (startIndex = 1);
        while (true) {
            // Validate not the end of the string
            if (index >= string.length) {
                return {
                    success: false,
                    result: "",
                    rbrace: 0,
                };
            }
            c = string[index];
            // Not right-brace
            if (c !== "}") {
                specifiers.push(c);
                index++;
            }
            // Escaped right-brace
            else if (Format.safeCharAt(string, index + 1) === "}") {
                specifiers.push("}");
                index += 2;
            }
            // Closing right-brace
            else {
                return {
                    success: true,
                    result: specifiers.join(""),
                    rbrace: index,
                };
            }
        }
    }
    static safeCharAt(string, index) {
        if (string.length > index) {
            return string[index];
        }
        return "\0";
    }
}
exports.Format = Format;
class FormatResultBuilder {
    constructor(node, context, counter) {
        this._cache = [];
        this._segments = [];
        this._node = node;
        this._context = context;
        this._counter = counter;
        while (this._cache.length < node.parameters.length - 1) {
            this._cache.push(undefined);
        }
    }
    build() {
        // Build the final string. This is when lazy segments are evaluated.
        return this._segments
            .map((x) => x?.isLazyString === true
            ? x.value
            : x)
            .join("");
    }
    // Append a static value
    appendString(value) {
        if (value.length > 0) {
            // Track memory
            this._counter.addString(value);
            // Append the segment
            this._segments.push(value);
        }
    }
    // Append an argument
    appendArgument(argIndex, formatSpecifiers) {
        // Delay execution until the .build() is called
        this._segments.push(new LazyString(() => {
            let result;
            // Get the arg from the cache
            let argValue = this._cache[argIndex];
            // Evaluate the arg and cache the result
            if (argValue === undefined) {
                // The evaluation result is required when format specifiers are used. Otherwise the string
                // result is required. Go ahead and store both values. Since convertToString() produces tracing,
                // we need to run that now so the tracing appears in order in the log.
                const evaluationResult = this._node.parameters[argIndex + 1].evaluate(this._context);
                const stringResult = evaluationResult.convertToString();
                argValue = {
                    evaluationResult,
                    stringResult,
                };
                this._cache[argIndex] = argValue;
            }
            // No format specifiers
            if (!formatSpecifiers) {
                result = argValue.stringResult;
            }
            // Invalid
            else {
                throw new Error(`The format specifiers '${formatSpecifiers}' are not valid for objects of type '${argValue.evaluationResult.kind}'`);
            }
            // Track memory
            if (result) {
                this._counter.addString(result);
            }
            return result;
        }));
    }
}
class LazyString {
    constructor(getValue) {
        this.isLazyString = true;
        this._getValue = getValue;
    }
    get value() {
        if (this._value === undefined) {
            this._value = this._getValue();
        }
        return this._value;
    }
}
//# sourceMappingURL=format.js.map

/***/ }),

/***/ 3551:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FromJson = void 0;
const context_data_1 = __nccwpck_require__(1512);
const nodes_1 = __nccwpck_require__(9248);
class FromJson extends nodes_1.FunctionNode {
    evaluateCore(context) {
        const json = this.parameters[0].evaluate(context).convertToString();
        const contextData = context_data_1.ContextData.fromJSON(json);
        const memory = this.createMemoryCounter(context);
        memory.addContextData(contextData, true);
        return {
            value: contextData,
            memory: new nodes_1.ResultMemory(memory.currentBytes, true),
        };
    }
}
exports.FromJson = FromJson;
//# sourceMappingURL=from-json.js.map

/***/ }),

/***/ 4602:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Join = void 0;
const nodes_1 = __nccwpck_require__(9248);
class Join extends nodes_1.FunctionNode {
    get traceFullyRealized() {
        return true;
    }
    evaluateCore(context) {
        const items = this.parameters[0].evaluate(context);
        const collection = items.getCollectionInterface();
        // Array
        if (collection?.compatibleValueKind === nodes_1.ValueKind.Array) {
            const array = collection;
            const length = array.getArrayLength();
            let result = [];
            if (length > 0) {
                const memory = this.createMemoryCounter(context);
                // Append the first item
                const item = array.getArrayItem(0);
                const itemResult = new nodes_1.EvaluationResult(new nodes_1.CanonicalValue(item));
                const itemString = itemResult.convertToString();
                memory.addString(itemString);
                result.push(itemString);
                // More items?
                if (length > 1) {
                    let separator = ",";
                    if (this.parameters.length > 1) {
                        const separatorResult = this.parameters[1].evaluate(context);
                        if (separatorResult.isPrimitive) {
                            separator = separatorResult.convertToString();
                        }
                    }
                    for (let i = 0; i < length; i++) {
                        // Append the separator
                        memory.addString(separator);
                        result.push(separator);
                        // Append the next item
                        const nextItem = array.getArrayItem(i);
                        const nextItemResult = new nodes_1.EvaluationResult(new nodes_1.CanonicalValue(nextItem));
                        const nextItemString = nextItemResult.convertToString();
                        memory.addString(nextItemString);
                        result.push(nextItemString);
                    }
                }
            }
            return {
                value: result,
                memory: undefined,
            };
        }
        // Primitive
        else if (items.isPrimitive) {
            return {
                value: items.convertToString(),
                memory: undefined,
            };
        }
        // Otherwise return empty string
        else {
            return {
                value: "",
                memory: undefined,
            };
        }
    }
}
exports.Join = Join;
//# sourceMappingURL=join.js.map

/***/ }),

/***/ 7022:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StartsWith = void 0;
const nodes_1 = __nccwpck_require__(9248);
class StartsWith extends nodes_1.FunctionNode {
    get traceFullyRealized() {
        return false;
    }
    evaluateCore(context) {
        let found = false;
        const left = this.parameters[0].evaluate(context);
        if (left.isPrimitive) {
            const leftString = left.convertToString();
            const right = this.parameters[1].evaluate(context);
            if (right.isPrimitive) {
                const rightString = right.convertToString();
                found = leftString.toUpperCase().startsWith(rightString.toUpperCase());
            }
        }
        return {
            value: found,
            memory: undefined,
        };
    }
}
exports.StartsWith = StartsWith;
//# sourceMappingURL=starts-with.js.map

/***/ }),

/***/ 599:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToJson = void 0;
const expressionUtility = __importStar(__nccwpck_require__(8170));
const nodes_1 = __nccwpck_require__(9248);
class ToJson extends nodes_1.FunctionNode {
    evaluateCore(context) {
        const json = [];
        const memory = this.createMemoryCounter(context);
        let current = this.parameters[0].evaluate(context);
        const ancestors = [];
        do {
            // Descend as much as possible
            while (true) {
                // Collection
                const collection = current.getCollectionInterface();
                if (collection) {
                    // Array
                    if (collection.compatibleValueKind === nodes_1.ValueKind.Array) {
                        const array = collection;
                        if (array.getArrayLength() > 0) {
                            // Write array start
                            ToJson.writeArrayStart(json, memory, ancestors);
                            // Move to first item
                            const enumerator = new ArrayEnumerator(context, current);
                            enumerator.moveNext();
                            ancestors.push(enumerator);
                            current = enumerator.current;
                        }
                        else {
                            // Write empty array
                            ToJson.writeEmptyArray(json, memory, ancestors);
                            break;
                        }
                    }
                    // Object
                    else if (collection.compatibleValueKind === nodes_1.ValueKind.Object) {
                        const object = collection;
                        if (object.getObjectKeyCount() > 0) {
                            // Write object start
                            ToJson.writeObjectStart(json, memory, ancestors);
                            // Move to first pair
                            const enumerator = new ObjectEnumerator(context, current);
                            enumerator.moveNext();
                            ancestors.push(enumerator);
                            // Write key
                            ToJson.writeObjectKey(json, memory, enumerator.current.key, ancestors);
                            // Move to value
                            current = enumerator.current.value;
                        }
                        else {
                            // Write empty object
                            ToJson.writeEmptyObject(json, memory, ancestors);
                            break;
                        }
                    }
                    else {
                        throw new Error(`Unexpected collection kind '${collection.compatibleValueKind}'`);
                    }
                }
                // Primitive
                else {
                    // Write value
                    ToJson.writeValue(json, memory, current, ancestors);
                    break;
                }
            }
            // Next sibling or ancestor sibling
            do {
                if (ancestors.length > 0) {
                    const parent = ancestors[ancestors.length - 1];
                    // Parent array
                    if (parent.kind === nodes_1.ValueKind.Array) {
                        const arrayEnumerator = parent;
                        // Move to next item
                        if (arrayEnumerator.moveNext()) {
                            current = arrayEnumerator.current;
                            break;
                        }
                        // Move to parent
                        else {
                            ancestors.pop();
                            current = arrayEnumerator.array;
                            // Write array end
                            ToJson.writeArrayEnd(json, memory, ancestors);
                        }
                    }
                    // Parent object
                    else if (parent.kind === nodes_1.ValueKind.Object) {
                        const objectEnumerator = parent;
                        // Move to next pair
                        if (objectEnumerator.moveNext()) {
                            // Write key
                            ToJson.writeObjectKey(json, memory, objectEnumerator.current.key, ancestors);
                            // Move to value
                            current = objectEnumerator.current.value;
                            break;
                        }
                        // Move to parent
                        else {
                            ancestors.pop();
                            current = objectEnumerator.object;
                            // Write object end
                            ToJson.writeObjectEnd(json, memory, ancestors);
                        }
                    }
                    else {
                        throw new Error(`Unexpected parent collection kind '${parent.kind}'`);
                    }
                }
                else {
                    current = undefined;
                }
            } while (current);
        } while (current);
        return {
            value: json.join(""),
            memory: undefined,
        };
    }
    static writeArrayStart(json, memory, ancestors) {
        const string = ToJson.prefixValue("[", ancestors);
        memory.addString(string);
        json.push(string);
    }
    static writeObjectStart(json, memory, ancestors) {
        const string = ToJson.prefixValue("{", ancestors);
        memory.addString(string);
        json.push(string);
    }
    static writeArrayEnd(json, memory, ancestors) {
        const string = `\n${expressionUtility.indent(ancestors.length, "  ")}]`;
        memory.addString(string);
        json.push(string);
    }
    static writeObjectEnd(json, memory, ancestors) {
        const string = `\n${expressionUtility.indent(ancestors.length, "  ")}}`;
        memory.addString(string);
        json.push(string);
    }
    static writeEmptyArray(json, memory, ancestors) {
        const string = ToJson.prefixValue("[]", ancestors);
        memory.addString(string);
        json.push(string);
    }
    static writeEmptyObject(json, memory, ancestors) {
        const string = ToJson.prefixValue("{}", ancestors);
        memory.addString(string);
        json.push(string);
    }
    static writeObjectKey(json, memory, key, ancestors) {
        const string = ToJson.prefixValue(JSON.stringify(key.convertToString()), ancestors, true);
        memory.addString(string);
        json.push(string);
    }
    static writeValue(json, memory, value, ancestors) {
        let string;
        switch (value.kind) {
            case nodes_1.ValueKind.Null:
                string = "null";
                break;
            case nodes_1.ValueKind.Boolean:
                string = value.value ? "true" : "false";
                break;
            case nodes_1.ValueKind.Number:
                string = value.convertToString();
                break;
            case nodes_1.ValueKind.String:
                string = JSON.stringify(value.value);
                break;
            default:
                string = "{}"; // The value is an object we don't know how to traverse
                break;
        }
        string = ToJson.prefixValue(string, ancestors);
        memory.addString(string);
        json.push(string);
    }
    static prefixValue(value, ancestors, isObjectKey = false) {
        const level = ancestors.length;
        const parent = level > 0 ? ancestors[ancestors.length - 1] : undefined;
        if (!isObjectKey && parent?.kind === nodes_1.ValueKind.Object) {
            return `: ${value}`;
        }
        else if (level > 0) {
            return `${parent.isFirst ? "" : ","}\n${expressionUtility.indent(level, "  ")}${value}`;
        }
        else {
            return value;
        }
    }
}
exports.ToJson = ToJson;
class ArrayEnumerator {
    constructor(context, array) {
        this._index = -1;
        this._context = context;
        this.array = array;
    }
    get kind() {
        return nodes_1.ValueKind.Array;
    }
    get isFirst() {
        return this._index === 0;
    }
    moveNext() {
        const array = this.array.value;
        if (this._index + 1 < array.getArrayLength()) {
            this._index++;
            this.current = new nodes_1.EvaluationResult(new nodes_1.CanonicalValue(array.getArrayItem(this._index)));
            return true;
        }
        else {
            this.current = undefined;
            return false;
        }
    }
}
class ObjectEnumerator {
    constructor(context, object) {
        this._index = -1;
        this._context = context;
        this.object = object;
        this._keys = object.value.getObjectKeys();
    }
    get kind() {
        return nodes_1.ValueKind.Object;
    }
    get isFirst() {
        return this._index === 0;
    }
    moveNext() {
        if (this._index + 1 < this._keys.length) {
            this._index++;
            const object = this.object.value;
            const keyString = this._keys[this._index];
            const key = new nodes_1.EvaluationResult(new nodes_1.CanonicalValue(keyString));
            const value = new nodes_1.EvaluationResult(new nodes_1.CanonicalValue(object.getObjectValue(keyString)));
            this.current = {
                key,
                value,
            };
            return true;
        }
        else {
            this.current = undefined;
            return false;
        }
    }
}
//# sourceMappingURL=to-json.js.map

/***/ }),

/***/ 2908:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LexicalAnalyzer = exports.Token = exports.TokenKind = exports.Associativity = void 0;
const expressionUtility = __importStar(__nccwpck_require__(8170));
const expression_constants_1 = __nccwpck_require__(9575);
const nodes_1 = __nccwpck_require__(9248);
const or_1 = __nccwpck_require__(1121);
const and_1 = __nccwpck_require__(4061);
const equal_1 = __nccwpck_require__(4049);
const less_than_or_equal_1 = __nccwpck_require__(440);
const less_than_1 = __nccwpck_require__(5921);
const greater_than_or_equal_1 = __nccwpck_require__(7215);
const greater_than_1 = __nccwpck_require__(4692);
const not_equal_1 = __nccwpck_require__(8003);
const not_1 = __nccwpck_require__(8646);
const operators_1 = __nccwpck_require__(4495);
var Associativity;
(function (Associativity) {
    Associativity[Associativity["None"] = 0] = "None";
    Associativity[Associativity["LeftToRight"] = 1] = "LeftToRight";
    Associativity[Associativity["RightToLeft"] = 2] = "RightToLeft";
})(Associativity = exports.Associativity || (exports.Associativity = {}));
var TokenKind;
(function (TokenKind) {
    // Punctuation
    TokenKind[TokenKind["StartGroup"] = 0] = "StartGroup";
    TokenKind[TokenKind["StartIndex"] = 1] = "StartIndex";
    TokenKind[TokenKind["StartParameters"] = 2] = "StartParameters";
    TokenKind[TokenKind["EndGroup"] = 3] = "EndGroup";
    TokenKind[TokenKind["EndIndex"] = 4] = "EndIndex";
    TokenKind[TokenKind["EndParameters"] = 5] = "EndParameters";
    TokenKind[TokenKind["Separator"] = 6] = "Separator";
    TokenKind[TokenKind["Dereference"] = 7] = "Dereference";
    TokenKind[TokenKind["Wildcard"] = 8] = "Wildcard";
    TokenKind[TokenKind["LogicalOperator"] = 9] = "LogicalOperator";
    // Values
    TokenKind[TokenKind["Null"] = 10] = "Null";
    TokenKind[TokenKind["Boolean"] = 11] = "Boolean";
    TokenKind[TokenKind["Number"] = 12] = "Number";
    TokenKind[TokenKind["String"] = 13] = "String";
    TokenKind[TokenKind["PropertyName"] = 14] = "PropertyName";
    TokenKind[TokenKind["Function"] = 15] = "Function";
    TokenKind[TokenKind["NamedContext"] = 16] = "NamedContext";
    TokenKind[TokenKind["Unexpected"] = 17] = "Unexpected";
})(TokenKind = exports.TokenKind || (exports.TokenKind = {}));
class Token {
    constructor(kind, rawValue, index, parsedValue) {
        this.kind = kind;
        this.rawValue = rawValue;
        this.index = index;
        this.parsedValue = parsedValue;
    }
    get associativity() {
        switch (this.kind) {
            case TokenKind.StartGroup:
                return Associativity.None;
            case TokenKind.LogicalOperator:
                if (this.rawValue === expression_constants_1.NOT) {
                    return Associativity.RightToLeft;
                }
                break;
        }
        return this.isOperator ? Associativity.LeftToRight : Associativity.None;
    }
    get isOperator() {
        switch (this.kind) {
            case TokenKind.StartGroup: // "(" logical grouping
            case TokenKind.StartIndex: // "["
            case TokenKind.StartParameters: // "(" function call
            case TokenKind.EndGroup: // ")" logical grouping
            case TokenKind.EndIndex: // "]"
            case TokenKind.EndParameters: // ")" function call
            case TokenKind.Separator: // ","
            case TokenKind.Dereference: // "."
            case TokenKind.LogicalOperator: // "!", "==", etc
                return true;
            default:
                return false;
        }
    }
    /**
     * Operator precedence. The value is only meaningful for operator tokens.
     */
    get precedence() {
        switch (this.kind) {
            case TokenKind.StartGroup: // "(" logical grouping
                return 20;
            case TokenKind.StartIndex: // "["
            case TokenKind.StartParameters: // "(" function call
            case TokenKind.Dereference: // "."
                return 19;
            case TokenKind.LogicalOperator:
                switch (this.rawValue) {
                    case expression_constants_1.NOT: // "!"
                        return 16;
                    case expression_constants_1.GREATER_THAN: // ">"
                    case expression_constants_1.GREATER_THAN_OR_EQUAL: // ">="
                    case expression_constants_1.LESS_THAN: // "<"
                    case expression_constants_1.LESS_THAN_OR_EQUAL: // "<="
                        return 11;
                    case expression_constants_1.EQUAL: // "=="
                    case expression_constants_1.NOT_EQUAL: // "!="
                        return 10;
                    case expression_constants_1.AND: // "&&"
                        return 6;
                    case expression_constants_1.OR: // "||"
                        return 5;
                }
                break;
            case TokenKind.EndGroup: // ")" logical grouping
            case TokenKind.EndIndex: // "]"
            case TokenKind.EndParameters: // ")" function call
            case TokenKind.Separator: // ","
                return 1;
        }
        return 0;
    }
    /**
     * Expected number of operands. The value is only meaningful for standalone unary operators and binary operators.
     */
    get operandCount() {
        switch (this.kind) {
            case TokenKind.StartIndex: // "["
            case TokenKind.Dereference: // "."
                return 2;
            case TokenKind.LogicalOperator:
                switch (this.rawValue) {
                    case expression_constants_1.NOT: // "!"
                        return 1;
                    case expression_constants_1.GREATER_THAN: // ">"
                    case expression_constants_1.GREATER_THAN_OR_EQUAL: // ">="
                    case expression_constants_1.LESS_THAN: // "<"
                    case expression_constants_1.LESS_THAN_OR_EQUAL: // "<="
                    case expression_constants_1.EQUAL: // "=="
                    case expression_constants_1.NOT_EQUAL: // "!="
                    case expression_constants_1.AND: // "&&"
                    case expression_constants_1.OR: // "|"
                        return 2;
                }
                break;
        }
        return 0;
    }
    toNode() {
        switch (this.kind) {
            case TokenKind.StartIndex: // "["
            case TokenKind.Dereference: // "."
                return new operators_1.Index();
            case TokenKind.LogicalOperator:
                switch (this.rawValue) {
                    case expression_constants_1.NOT: // "!"
                        return new not_1.Not();
                    case expression_constants_1.NOT_EQUAL: // "!="
                        return new not_equal_1.NotEqual();
                    case expression_constants_1.GREATER_THAN: // ">"
                        return new greater_than_1.GreaterThan();
                    case expression_constants_1.GREATER_THAN_OR_EQUAL: // ">="
                        return new greater_than_or_equal_1.GreaterThanOrEqual();
                    case expression_constants_1.LESS_THAN: // "<"
                        return new less_than_1.LessThan();
                    case expression_constants_1.LESS_THAN_OR_EQUAL: // "<="
                        return new less_than_or_equal_1.LessThanOrEqual();
                    case expression_constants_1.EQUAL: // "=="
                        return new equal_1.Equal();
                    case expression_constants_1.AND: // "&&"
                        return new and_1.And();
                    case expression_constants_1.OR: // "||"
                        return new or_1.Or();
                    default:
                        throw new Error(`Unexpected logical operator '${this.rawValue}' when creating node`);
                }
            case TokenKind.Null:
            case TokenKind.Boolean:
            case TokenKind.Number:
            case TokenKind.String:
                return new nodes_1.LiteralNode(this.parsedValue);
            case TokenKind.PropertyName:
                return new nodes_1.LiteralNode(this.rawValue);
            case TokenKind.Wildcard: // "*"
                return new nodes_1.WildcardNode();
        }
        throw new Error(`Unexpected kind '${this.kind}' when creating node`);
    }
}
exports.Token = Token;
class LexicalAnalyzer {
    constructor(expression) {
        /** Unclosed start token */
        this._unclosedTokens = [];
        /** Index within raw expression string */
        this._index = 0;
        this._expression = expression;
    }
    get _lastUnclosedToken() {
        if (this._unclosedTokens.length == 0) {
            return undefined;
        }
        return this._unclosedTokens[this._unclosedTokens.length - 1];
    }
    get hasUnclosedTokens() {
        return this._unclosedTokens.length > 0;
    }
    getNextToken() {
        // Skip whitespace
        while (this._index < this._expression.length &&
            /\s/.test(this._expression[this._index])) {
            this._index++;
        }
        // End of string
        if (this._index >= this._expression.length) {
            return undefined;
        }
        let token;
        // Read the first character to determine the type of token
        const c = this._expression[this._index];
        switch (c) {
            case expression_constants_1.START_GROUP: // "("
                // Function call
                if (this._lastToken?.kind === TokenKind.Function) {
                    token = this.createToken(TokenKind.StartParameters, c, this._index++);
                }
                // Logical grouping
                else {
                    token = this.createToken(TokenKind.StartGroup, c, this._index++);
                }
                break;
            case expression_constants_1.START_INDEX: // "["
                token = this.createToken(TokenKind.StartIndex, c, this._index++);
                break;
            case expression_constants_1.END_GROUP: // ")"
                // Function call
                if (this._lastUnclosedToken?.kind === TokenKind.StartParameters) {
                    // "(" function call
                    token = this.createToken(TokenKind.EndParameters, c, this._index++);
                }
                // Logical grouping
                else {
                    token = this.createToken(TokenKind.EndGroup, c, this._index++);
                }
                break;
            case expression_constants_1.END_INDEX: // "]"
                token = this.createToken(TokenKind.EndIndex, c, this._index++);
                break;
            case expression_constants_1.SEPARATOR: // ","
                token = this.createToken(TokenKind.Separator, c, this._index++);
                break;
            case expression_constants_1.WILDCARD: // "*"
                token = this.createToken(TokenKind.Wildcard, c, this._index++);
                break;
            case "'":
                token = this.readStringToken();
                break;
            case "!": // "!" and "!="
            case ">": // ">" and ">="
            case "<": // "<" and "<="
            case "=": // "=="
            case "&": // "&&"
            case "|": // "||"
                token = this.readOperator();
                break;
            default:
                if (c == ".") {
                    // Number
                    if (this._lastToken == null ||
                        this._lastToken.kind == TokenKind.Separator || // ","
                        this._lastToken.kind == TokenKind.StartGroup || // "(" logical grouping
                        this._lastToken.kind == TokenKind.StartIndex || // "["
                        this._lastToken.kind == TokenKind.StartParameters || // "(" function call
                        this._lastToken.kind == TokenKind.LogicalOperator) {
                        // "!", "==", etc
                        token = this.readNumberToken();
                    }
                    // "."
                    else {
                        token = this.createToken(TokenKind.Dereference, c, this._index++);
                    }
                }
                else if (c == "-" || c == "+" || (c >= "0" && c <= "9")) {
                    token = this.readNumberToken();
                }
                else {
                    token = this.readKeywordToken();
                }
                break;
        }
        this._lastToken = token;
        return token;
    }
    readNumberToken() {
        const startIndex = this._index;
        do {
            this._index++;
        } while (this._index < this._expression.length &&
            (!LexicalAnalyzer.testTokenBoundary(this._expression[this._index]) ||
                this._expression[this._index] === "."));
        const length = this._index - startIndex;
        const str = this._expression.substr(startIndex, length);
        const n = expressionUtility.parseNumber(str);
        if (isNaN(n)) {
            return this.createToken(TokenKind.Unexpected, str, startIndex);
        }
        return this.createToken(TokenKind.Number, str, startIndex, n);
    }
    readKeywordToken() {
        // Read to the end of the keyword
        const startIndex = this._index;
        this._index++; // Skip the first char. It is already known to be the start of the keyword
        while (this._index < this._expression.length &&
            !LexicalAnalyzer.testTokenBoundary(this._expression[this._index])) {
            this._index++;
        }
        // Test if valid keyword character sequence
        const length = this._index - startIndex;
        const str = this._expression.substr(startIndex, length);
        if (expressionUtility.testLegalKeyword(str)) {
            // Test if follows property dereference operator
            if (this._lastToken?.kind === TokenKind.Dereference) {
                return this.createToken(TokenKind.PropertyName, str, startIndex);
            }
            switch (str) {
                // Null
                case expression_constants_1.NULL:
                    return this.createToken(TokenKind.Null, str, startIndex);
                // Boolean
                case expression_constants_1.TRUE:
                    return this.createToken(TokenKind.Boolean, str, startIndex, true);
                case expression_constants_1.FALSE:
                    return this.createToken(TokenKind.Boolean, str, startIndex, false);
                // NaN
                case expression_constants_1.NAN:
                    return this.createToken(TokenKind.Number, str, startIndex, NaN);
                // Infinity
                case expression_constants_1.INFINITY:
                    return this.createToken(TokenKind.Number, str, startIndex, Infinity);
            }
            // Lookahead
            let tempIndex = this._index;
            while (tempIndex < this._expression.length &&
                /\s/.test(this._expression[tempIndex])) {
                tempIndex++;
            }
            // Function
            if (tempIndex < this._expression.length &&
                this._expression[tempIndex] == expression_constants_1.START_GROUP) {
                // "("
                return this.createToken(TokenKind.Function, str, startIndex);
            }
            // Named-context
            else {
                return this.createToken(TokenKind.NamedContext, str, startIndex);
            }
        }
        // Invalid keyword
        else {
            return this.createToken(TokenKind.Unexpected, str, startIndex);
        }
    }
    readStringToken() {
        const startIndex = this._index;
        let c;
        let closed = false;
        let str = "";
        this._index++; // Skip the leading single-quote
        while (this._index < this._expression.length) {
            c = this._expression[this._index++];
            if (c === "'") {
                // End of string
                if (this._index >= this._expression.length ||
                    this._expression[this._index] != "'") {
                    closed = true;
                    break;
                }
                // Escaped single quote
                this._index++;
            }
            str += c;
        }
        const length = this._index - startIndex;
        const rawValue = this._expression.substr(startIndex, length);
        if (closed) {
            return this.createToken(TokenKind.String, rawValue, startIndex, str);
        }
        return this.createToken(TokenKind.Unexpected, rawValue, startIndex);
    }
    readOperator() {
        const startIndex = this._index;
        let raw;
        this._index++;
        // Check for a two-character operator
        if (this._index < this._expression.length) {
            this._index++;
            raw = this._expression.substr(startIndex, 2);
            switch (raw) {
                case expression_constants_1.NOT_EQUAL:
                case expression_constants_1.GREATER_THAN_OR_EQUAL:
                case expression_constants_1.LESS_THAN_OR_EQUAL:
                case expression_constants_1.EQUAL:
                case expression_constants_1.AND:
                case expression_constants_1.OR:
                    return this.createToken(TokenKind.LogicalOperator, raw, startIndex);
            }
            // Backup
            this._index--;
        }
        // Check for one-character operator
        raw = this._expression.substr(startIndex, 1);
        switch (raw) {
            case expression_constants_1.NOT:
            case expression_constants_1.GREATER_THAN:
            case expression_constants_1.LESS_THAN:
                return this.createToken(TokenKind.LogicalOperator, raw, startIndex);
        }
        // Unexpected
        while (this._index < this._expression.length &&
            !LexicalAnalyzer.testTokenBoundary(this._expression[this._index])) {
            this._index++;
        }
        const length = this._index - startIndex;
        raw = this._expression.substr(startIndex, length);
        return this.createToken(TokenKind.Unexpected, raw, startIndex);
    }
    createToken(kind, rawValue, index, parsedValue) {
        // Check whether the current token is legal based on the last token
        let legal = false;
        switch (kind) {
            case TokenKind.StartGroup: // "(" logical grouping
                // Is first or follows "," or "(" or "[" or a logical operator
                legal = this.checkLastToken(undefined, TokenKind.Separator, TokenKind.StartGroup, TokenKind.StartParameters, TokenKind.StartIndex, TokenKind.LogicalOperator);
                break;
            case TokenKind.StartIndex: // "["
                // Follows ")", "]", "*", a property name, or a named-context
                legal = this.checkLastToken(TokenKind.EndGroup, TokenKind.EndParameters, TokenKind.EndIndex, TokenKind.Wildcard, TokenKind.PropertyName, TokenKind.NamedContext);
                break;
            case TokenKind.StartParameters: // "(" function call
                // Follows a function
                legal = this.checkLastToken(TokenKind.Function);
                break;
            case TokenKind.EndGroup: // ")" logical grouping
                // Follows ")", "]", "*", a literal, a property name, or a named-context
                legal = this.checkLastToken(TokenKind.EndGroup, TokenKind.EndParameters, TokenKind.EndIndex, TokenKind.Wildcard, TokenKind.Null, TokenKind.Boolean, TokenKind.Number, TokenKind.String, TokenKind.PropertyName, TokenKind.NamedContext);
                break;
            case TokenKind.EndIndex: // "]"
                // Follows ")", "]", "*", a literal, a property name, or a named-context
                legal = this.checkLastToken(TokenKind.EndGroup, TokenKind.EndParameters, TokenKind.EndIndex, TokenKind.Wildcard, TokenKind.Null, TokenKind.Boolean, TokenKind.Number, TokenKind.String, TokenKind.PropertyName, TokenKind.NamedContext);
                break;
            case TokenKind.EndParameters: // ")" function call
                // Follows "(" function call, ")", "]", "*", a literal, a property name, or a named-context
                legal = this.checkLastToken(TokenKind.StartParameters, TokenKind.EndGroup, TokenKind.EndParameters, TokenKind.EndIndex, TokenKind.Wildcard, TokenKind.Null, TokenKind.Boolean, TokenKind.Number, TokenKind.String, TokenKind.PropertyName, TokenKind.NamedContext);
                break;
            case TokenKind.Separator: // ","
                // Follows ")", "]", "*", a literal, a property name, or a named-context
                legal = this.checkLastToken(TokenKind.EndGroup, TokenKind.EndParameters, TokenKind.EndIndex, TokenKind.Wildcard, TokenKind.Null, TokenKind.Boolean, TokenKind.Number, TokenKind.String, TokenKind.PropertyName, TokenKind.NamedContext);
                break;
            case TokenKind.Dereference: // "."
                // Follows ")", "]", "*", a property name, or a named-context
                legal = this.checkLastToken(TokenKind.EndGroup, TokenKind.EndParameters, TokenKind.EndIndex, TokenKind.Wildcard, TokenKind.PropertyName, TokenKind.NamedContext);
                break;
            case TokenKind.Wildcard: // "*"
                // Follows "[" or "."
                legal = this.checkLastToken(TokenKind.StartIndex, TokenKind.Dereference);
                break;
            case TokenKind.LogicalOperator: // "!", "==", etc
                switch (rawValue) {
                    case expression_constants_1.NOT:
                        // Is first or follows "," or "(" or "[" or a logical operator
                        legal = this.checkLastToken(undefined, TokenKind.Separator, TokenKind.StartGroup, TokenKind.StartParameters, TokenKind.StartIndex, TokenKind.LogicalOperator);
                        break;
                    default:
                        // Follows ")", "]", "*", a literal, a property name, or a named-context
                        legal = this.checkLastToken(TokenKind.EndGroup, TokenKind.EndParameters, TokenKind.EndIndex, TokenKind.Wildcard, TokenKind.Null, TokenKind.Boolean, TokenKind.Number, TokenKind.String, TokenKind.PropertyName, TokenKind.NamedContext);
                        break;
                }
                break;
            case TokenKind.Null:
            case TokenKind.Boolean:
            case TokenKind.Number:
            case TokenKind.String:
                // Is first or follows "," or "[" or "(" or a logical operator (e.g. "!" or "==" etc)
                legal = this.checkLastToken(undefined, TokenKind.Separator, TokenKind.StartIndex, TokenKind.StartGroup, TokenKind.StartParameters, TokenKind.LogicalOperator);
                break;
            case TokenKind.PropertyName:
                // Follows "."
                legal = this.checkLastToken(TokenKind.Dereference);
                break;
            case TokenKind.Function:
                // Is first or follows "," or "[" or "(" or a logical operator (e.g. "!" or "==" etc)
                legal = this.checkLastToken(undefined, TokenKind.Separator, TokenKind.StartIndex, TokenKind.StartGroup, TokenKind.StartParameters, TokenKind.LogicalOperator);
                break;
            case TokenKind.NamedContext:
                // Is first or follows "," or "[" or "(" or a logical operator (e.g. "!" or "==" etc)
                legal = this.checkLastToken(undefined, TokenKind.Separator, TokenKind.StartIndex, TokenKind.StartGroup, TokenKind.StartParameters, TokenKind.LogicalOperator);
                break;
        }
        // Illegal
        if (!legal) {
            return new Token(TokenKind.Unexpected, rawValue, index);
        }
        // Legal so far
        const token = new Token(kind, rawValue, index, parsedValue);
        switch (kind) {
            case TokenKind.StartGroup: // "(" logical grouping
            case TokenKind.StartIndex: // "["
            case TokenKind.StartParameters: // "(" function call
                // Track start token
                this._unclosedTokens.push(token);
                break;
            case TokenKind.EndGroup: // ")" logical grouping
                // Check inside logical grouping
                if (this._lastUnclosedToken?.kind !== TokenKind.StartGroup) {
                    return new Token(TokenKind.Unexpected, rawValue, index);
                }
                // Pop start token
                this._unclosedTokens.pop();
                break;
            case TokenKind.EndIndex: // "]"
                // Check inside indexer
                if (this._lastUnclosedToken?.kind != TokenKind.StartIndex) {
                    return new Token(TokenKind.Unexpected, rawValue, index);
                }
                // Pop start token
                this._unclosedTokens.pop();
                break;
            case TokenKind.EndParameters: // ")" function call
                // Check inside function call
                if (this._lastUnclosedToken?.kind !== TokenKind.StartParameters) {
                    return new Token(TokenKind.Unexpected, rawValue, index);
                }
                // Pop start token
                this._unclosedTokens.pop();
                break;
            case TokenKind.Separator: // ","
                // Check inside function call
                if (this._lastUnclosedToken?.kind !== TokenKind.StartParameters) {
                    return new Token(TokenKind.Unexpected, rawValue, index);
                }
                break;
        }
        return token;
    }
    checkLastToken(...allowed) {
        const lastKind = this._lastToken?.kind;
        return allowed.some((x) => x === lastKind);
    }
    static testTokenBoundary(c) {
        switch (c) {
            case expression_constants_1.START_GROUP: // "("
            case expression_constants_1.START_INDEX: // "["
            case expression_constants_1.END_GROUP: // ")"
            case expression_constants_1.END_INDEX: // "]"
            case expression_constants_1.SEPARATOR: // ","
            case expression_constants_1.DEREFERENCE: // "."
            case "!": // "!" and "!="
            case ">": // ">" and ">="
            case "<": // "<" and "<="
            case "=": // "=="
            case "&": // "&&"
            case "|": // "||"
                return true;
            default:
                return /\s/.test(c);
        }
    }
}
exports.LexicalAnalyzer = LexicalAnalyzer;
//# sourceMappingURL=lexical-analyzer.js.map

/***/ }),

/***/ 9248:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResultMemory = exports.MemoryCounter = exports.CanonicalValue = exports.ValueKind = exports.EvaluationContext = exports.EvaluationResult = exports.EvaluationOptions = exports.FunctionNode = exports.ContainerNode = exports.SimpleNamedContextNode = exports.NamedContextNode = exports.WildcardNode = exports.LiteralNode = exports.AbstractExpressionNode = exports.NodeType = void 0;
const trace_writer_1 = __nccwpck_require__(6918);
const expressionUtility = __importStar(__nccwpck_require__(8170));
const expression_constants_1 = __nccwpck_require__(9575);
const context_data_1 = __nccwpck_require__(1512);
////////////////////////////////////////////////////////////////////////////////
// Expression node classes
////////////////////////////////////////////////////////////////////////////////
var NodeType;
(function (NodeType) {
    NodeType[NodeType["Literal"] = 0] = "Literal";
    NodeType[NodeType["Wildcard"] = 1] = "Wildcard";
    NodeType[NodeType["Container"] = 2] = "Container";
    NodeType[NodeType["NamedContext"] = 3] = "NamedContext";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
class AbstractExpressionNode {
    constructor() {
        /** Used for tracing. Indicates the nest-level */
        this._level = 0;
        /** Used for tracing. Indicates the name of a non-literal node */
        this.name = "";
    }
    /**
     * Entry point when evaluating an expression tree
     */
    evaluateTree(trace, state, options) {
        // SDK consumer error
        if (this.parent) {
            throw new Error(`Expected IExpressionNode.Evaluate to be called on a root node only`);
        }
        // Evaluate
        trace = trace ?? new trace_writer_1.NoOperationTraceWriter();
        const context = new EvaluationContext(trace, state, options, this);
        trace.info(`Evaluating: ${this.convertToExpression()}`);
        const result = this.evaluate(context);
        // Trace the result
        this.traceTreeResult(context, result.value, result.kind);
        return result;
    }
    /**
     * This function is intended only for ExpressionNode authors to call when evaluating a child node.
     * The EvaluationContext caches result-state specific to the evaluation of the entire expression tree.
     * */
    evaluate(context) {
        // Evaluate
        this._level = !this.parent ? 0 : this.parent._level + 1;
        context.trace.verbose(`${expressionUtility.indent(this._level, "..")}Evaluating ${this.name}`);
        const coreResult = this.evaluateCore(context);
        if (!coreResult.memory) {
            coreResult.memory = new ResultMemory();
        }
        // Convert to canonical value
        const canonicalResult = new CanonicalValue(coreResult.value);
        // The depth can be safely trimmed when the total size of the core result is known,
        // or when the total size of the core result can easily be determined.
        const trimDepth = coreResult.memory.isTotal ||
            (!canonicalResult.raw &&
                expressionUtility.testPrimitive(canonicalResult.kind));
        // Account for the memory overhead of the core result
        let coreBytes;
        if (typeof coreResult.memory.bytes === "number") {
            coreBytes = coreResult.memory.bytes;
        }
        else {
            const objectToCalculate = canonicalResult.raw ?? canonicalResult.value;
            coreBytes =
                typeof objectToCalculate === "string"
                    ? MemoryCounter.calculateStringBytes(objectToCalculate)
                    : MemoryCounter.MIN_OBJECT_SIZE; // Add something
        }
        context.memory.addAmount(this._level, coreBytes, trimDepth);
        // Account for the memory overhead of the conversion result
        if (canonicalResult.raw) {
            const conversionBytes = typeof canonicalResult.value === "string"
                ? MemoryCounter.calculateStringBytes(canonicalResult.value)
                : MemoryCounter.MIN_OBJECT_SIZE;
            context.memory.addAmount(this._level, conversionBytes);
        }
        const result = new EvaluationResult(canonicalResult, this._level);
        const message = `${expressionUtility.indent(this._level, "..")}=> ${expressionUtility.formatValue(canonicalResult.value, canonicalResult.kind)}`;
        context.trace.verbose(message);
        // Store the trace result
        if (this.traceFullyRealized) {
            context.setTraceResult(this, result);
        }
        return result;
    }
    createMemoryCounter(context) {
        return new MemoryCounter(this, context.options.maxMemory);
    }
    traceTreeResult(context, result, kind) {
        // Get the realized expression
        const realizedExpression = this.convertToRealizedExpression(context);
        // Format the result
        const traceValue = expressionUtility.formatValue(result, kind);
        // Only trace the realized expression when meaningfully different
        if (realizedExpression !== traceValue) {
            if (kind === ValueKind.Number &&
                realizedExpression === `'${traceValue}'`) {
                // Intentionally empty. Don't bother tracing the realized expression when the result is a
                // number and the realized expression is a precisely matching string.
            }
            else {
                context.trace.info(`Expanded: ${realizedExpression}`);
            }
        }
        // Always trace the result
        context.trace.info(`Result: ${traceValue}`);
    }
}
exports.AbstractExpressionNode = AbstractExpressionNode;
class LiteralNode extends AbstractExpressionNode {
    constructor(val) {
        super();
        const canonicalValue = new CanonicalValue(val);
        this.name = ValueKind[canonicalValue.kind];
        this.value = canonicalValue.value;
        this.kind = canonicalValue.kind;
    }
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return expressionUtility.formatValue(this.value, this.kind);
    }
    convertToRealizedExpression(context) {
        return expressionUtility.formatValue(this.value, this.kind);
    }
    get nodeType() {
        return NodeType.Literal;
    }
    /** Evalutes the node */
    evaluateCore(context) {
        return {
            value: this.value,
            memory: undefined,
        };
    }
}
exports.LiteralNode = LiteralNode;
class WildcardNode extends AbstractExpressionNode {
    // Prevent the value from being stored on the evaluation context.
    // This avoids unneccessarily duplicating the value in memory.
    get traceFullyRealized() {
        return false;
    }
    get nodeType() {
        return NodeType.Wildcard;
    }
    convertToExpression() {
        return expression_constants_1.WILDCARD;
    }
    convertToRealizedExpression(context) {
        return expression_constants_1.WILDCARD;
    }
    evaluateCore(context) {
        return {
            value: expression_constants_1.WILDCARD,
            memory: undefined,
        };
    }
}
exports.WildcardNode = WildcardNode;
class NamedContextNode extends AbstractExpressionNode {
    get traceFullyRealized() {
        return true;
    }
    get nodeType() {
        return NodeType.NamedContext;
    }
    convertToExpression() {
        return this.name;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return this.name;
    }
}
exports.NamedContextNode = NamedContextNode;
class SimpleNamedContextNode extends NamedContextNode {
    constructor(value) {
        super();
        this._value = value;
    }
    evaluateCore(context) {
        return {
            value: this._value,
            memory: undefined,
        };
    }
}
exports.SimpleNamedContextNode = SimpleNamedContextNode;
class ContainerNode extends AbstractExpressionNode {
    constructor() {
        super(...arguments);
        this._parameters = [];
    }
    get nodeType() {
        return NodeType.Container;
    }
    get parameters() {
        return this._parameters;
    }
    addParameter(node) {
        this._parameters.push(node);
        node.parent = this;
    }
}
exports.ContainerNode = ContainerNode;
class FunctionNode extends ContainerNode {
    /**
     * Generally this should not be overridden. True indicates the result of the node is traced as part of the "expanded"
     * (i.e. "realized") trace information. Otherwise the node expression is printed, and parameters to the node may or
     * may not be fully realized - depending on each respective parameter's trace-fully-realized setting.
     *
     * The purpose is so the end user can understand how their expression expanded at run time. For example, consider
     * the expression: eq(variables.publish, 'true'). The runtime-expanded expression may be: eq('true', 'true')
     */
    get traceFullyRealized() {
        return true;
    }
    /** Do not override. Used internally for tracing only. */
    convertToExpression() {
        return `${this.name}(${this.parameters
            .map((x) => x.convertToExpression())
            .join(", ")})`;
    }
    /** Do not override. Used internally for tracing only. */
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `${this.name}(${this.parameters.map((x) => x.convertToRealizedExpression(context))})`;
    }
}
exports.FunctionNode = FunctionNode;
////////////////////////////////////////////////////////////////////////////////
// Evaluation classes
////////////////////////////////////////////////////////////////////////////////
class EvaluationOptions {
    constructor(copy) {
        if (copy) {
            this.maxMemory = copy.maxMemory;
        }
        else {
            this.maxMemory = 0;
        }
    }
}
exports.EvaluationOptions = EvaluationOptions;
/**
 * Contains the result of the evaluation of a node. The value is canonicalized.
 * This class contains helper methods for comparison, coercion, etc.
 */
class EvaluationResult {
    constructor(value, level) {
        this._level = level ?? 0;
        this.value = value.value;
        this.kind = value.kind;
        this.raw = value.raw;
    }
    get isFalsy() {
        switch (this.kind) {
            case ValueKind.Null:
                return true;
            case ValueKind.Boolean: {
                const b = this.value;
                return b;
            }
            case ValueKind.Number: {
                const n = this.value;
                return n == 0 || isNaN(n);
            }
            case ValueKind.String: {
                const s = this.value;
                return s === "";
            }
            default:
                return false;
        }
    }
    get isTruthy() {
        return !this.isFalsy;
    }
    get isPrimitive() {
        return expressionUtility.testPrimitive(this.kind);
    }
    /**
     * Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
     * Except string comparison is ignore-case, and objects are not coerced to primitives.
     */
    abstractEqual(right) {
        return EvaluationResult.abstractEqual(this.value, right.value, this.kind, right.kind);
    }
    /**
     * Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
     * Except string comparison is ignore-case, and objects are not coerced to primitives.
     */
    abstractGreaterThan(right) {
        return EvaluationResult.abstractGreaterThan(this.value, right.value, this.kind, right.kind);
    }
    /**
     * Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
     * Except string comparison is ignore-case, and objects are not coerced to primitives.
     */
    abstractGreaterThanOrEqual(right) {
        return (EvaluationResult.abstractEqual(this.value, right.value, this.kind, right.kind) ||
            EvaluationResult.abstractGreaterThan(this.value, right.value, this.kind, right.kind));
    }
    /**
     * Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
     * Except string comparison is ignore-case, and objects are not coerced to primitives.
     */
    abstractLessThan(right) {
        return EvaluationResult.abstractLessThan(this.value, right.value, this.kind, right.kind);
    }
    /**
     * Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
     * Except string comparison is ignore-case, and objects are not coerced to primitives.
     */
    abstractLessThanOrEqual(right) {
        return (EvaluationResult.abstractEqual(this.value, right.value, this.kind, right.kind) ||
            EvaluationResult.abstractLessThan(this.value, right.value, this.kind, right.kind));
    }
    /**
     * Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
     * Except string comparison is ignore-case, and objects are not coerced to primitives.
     */
    abstractNotEqual(right) {
        return !EvaluationResult.abstractEqual(this.value, right.value, this.kind, right.kind);
    }
    convertToNumber() {
        return EvaluationResult.convertToNumber(this.value, this.kind);
    }
    convertToString() {
        switch (this.kind) {
            case ValueKind.Null:
                return "";
            case ValueKind.Boolean:
                return this.value ? expression_constants_1.TRUE : expression_constants_1.FALSE;
            case ValueKind.Number:
                // The value -0 should convert to '0'
                if (Object.is(this.value, -0)) {
                    return "0";
                }
                return this.value.toString();
            case ValueKind.String:
                return this.value;
            default:
                return ValueKind[this.kind];
        }
    }
    getCollectionInterface() {
        if (this.kind === ValueKind.Object || this.kind === ValueKind.Array) {
            switch (this.value[COMPATIBLE_VALUE_KIND] ?? -1) {
                case ValueKind.Array:
                    return this.value;
                case ValueKind.Object:
                    return this.value;
            }
        }
        return;
    }
    /**
     * Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
     * Except string comparison is ignore-case, and objects are not coerced to primitives.
     */
    static abstractEqual(canonicalLeftValue, canonicalRightValue, leftKind, rightKind) {
        const coercionResult = EvaluationResult.coerceTypes(canonicalLeftValue, canonicalRightValue, leftKind, rightKind);
        canonicalLeftValue = coercionResult.canonicalLeftValue;
        canonicalRightValue = coercionResult.canonicalRightValue;
        leftKind = coercionResult.leftKind;
        rightKind = coercionResult.rightKind;
        // Same kind
        if (leftKind === rightKind) {
            switch (leftKind) {
                // Null
                case ValueKind.Null:
                    return true;
                // Number
                case ValueKind.Number:
                    if (isNaN(canonicalLeftValue) || isNaN(canonicalRightValue)) {
                        return false;
                    }
                    return canonicalLeftValue === canonicalRightValue;
                // String
                case ValueKind.String:
                    return (canonicalLeftValue.toUpperCase() ==
                        canonicalRightValue.toUpperCase());
                // Boolean
                case ValueKind.Boolean:
                    return canonicalLeftValue === canonicalRightValue;
                // Object
                // Array
                case ValueKind.Object:
                case ValueKind.Array:
                    return canonicalLeftValue === canonicalRightValue; // Same reference?
            }
        }
        return false;
    }
    /**
     * Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
     * Except string comparison is ignore-case, and objects are not coerced to primitives.
     */
    static abstractGreaterThan(canonicalLeftValue, canonicalRightValue, leftKind, rightKind) {
        const coercionResult = EvaluationResult.coerceTypes(canonicalLeftValue, canonicalRightValue, leftKind, rightKind);
        canonicalLeftValue = coercionResult.canonicalLeftValue;
        canonicalRightValue = coercionResult.canonicalRightValue;
        leftKind = coercionResult.leftKind;
        rightKind = coercionResult.rightKind;
        // Same kind
        if (leftKind === rightKind) {
            switch (leftKind) {
                // Nummber
                case ValueKind.Number:
                    if (isNaN(canonicalLeftValue) || isNaN(canonicalRightValue)) {
                        return false;
                    }
                    return canonicalLeftValue > canonicalRightValue;
                // String
                case ValueKind.String:
                    return (canonicalLeftValue.toUpperCase() >
                        canonicalRightValue.toUpperCase());
                // Boolean
                case ValueKind.Boolean:
                    return canonicalLeftValue && !canonicalRightValue;
            }
        }
        return false;
    }
    /**
     * Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
     * Except string comparison is ignore-case, and objects are not coerced to primitives.
     */
    static abstractLessThan(canonicalLeftValue, canonicalRightValue, leftKind, rightKind) {
        const coercionResult = EvaluationResult.coerceTypes(canonicalLeftValue, canonicalRightValue, leftKind, rightKind);
        canonicalLeftValue = coercionResult.canonicalLeftValue;
        canonicalRightValue = coercionResult.canonicalRightValue;
        leftKind = coercionResult.leftKind;
        rightKind = coercionResult.rightKind;
        // Same kind
        if (leftKind === rightKind) {
            switch (leftKind) {
                // Nummber
                case ValueKind.Number:
                    if (isNaN(canonicalLeftValue) || isNaN(canonicalRightValue)) {
                        return false;
                    }
                    return canonicalLeftValue < canonicalRightValue;
                // String
                case ValueKind.String:
                    return (canonicalLeftValue.toUpperCase() <
                        canonicalRightValue.toUpperCase());
                // Boolean
                case ValueKind.Boolean:
                    return !canonicalLeftValue && canonicalRightValue;
            }
        }
        return false;
    }
    static coerceTypes(canonicalLeftValue, canonicalRightValue, leftKind, rightKind) {
        // Same kind
        if (leftKind === rightKind) {
            // Intentionally empty
        }
        // Number, String
        else if (leftKind === ValueKind.Number && rightKind === ValueKind.String) {
            canonicalRightValue = EvaluationResult.convertToNumber(canonicalRightValue, rightKind);
            rightKind = ValueKind.Number;
        }
        // String, Number
        else if (leftKind === ValueKind.String && rightKind === ValueKind.Number) {
            canonicalLeftValue = EvaluationResult.convertToNumber(canonicalLeftValue, leftKind);
            leftKind = ValueKind.Number;
        }
        // Boolean|Null, Any
        else if (leftKind === ValueKind.Boolean || leftKind === ValueKind.Null) {
            canonicalLeftValue = EvaluationResult.convertToNumber(canonicalLeftValue, leftKind);
            leftKind = ValueKind.Number;
            return EvaluationResult.coerceTypes(canonicalLeftValue, canonicalRightValue, leftKind, rightKind);
        }
        // Any, Boolean|Null
        else if (rightKind === ValueKind.Boolean || rightKind === ValueKind.Null) {
            canonicalRightValue = EvaluationResult.convertToNumber(canonicalRightValue, rightKind);
            rightKind = ValueKind.Number;
            return EvaluationResult.coerceTypes(canonicalLeftValue, canonicalRightValue, leftKind, rightKind);
        }
        return {
            canonicalLeftValue,
            canonicalRightValue,
            leftKind,
            rightKind,
        };
    }
    /**
     * For primitives, follows the Javascript rules (the Number function in Javascript). Otherwise NaN.
     */
    static convertToNumber(canonicalValue, kind) {
        switch (kind) {
            case ValueKind.Null:
                return 0;
            case ValueKind.Boolean:
                return canonicalValue === true ? 1 : 0;
            case ValueKind.Number:
                return canonicalValue;
            case ValueKind.String:
                return expressionUtility.parseNumber(canonicalValue);
        }
        return NaN;
    }
}
exports.EvaluationResult = EvaluationResult;
/**
 * Stores context related to the evaluation of an expression tree
 */
class EvaluationContext {
    constructor(trace, state, options, node) {
        this._traceResults = new Map();
        this.trace = trace;
        this.state = state;
        // Copy the options
        options = new EvaluationOptions(options);
        if (options.maxMemory === 0) {
            // Set a reasonable default max memory
            options.maxMemory = 1048576; // 1mb
        }
        this.options = options;
        this.memory = new EvaluationMemory(options.maxMemory, node);
        this._traceMemory = new MemoryCounter(undefined, options.maxMemory);
    }
    setTraceResult(node, result) {
        // Remove if previously added. This typically should not happen. This could happen
        // due to a badly authored function. So we'll handle it and track memory correctly.
        const previousResult = this._traceResults.get(node);
        if (previousResult) {
            this._traceMemory.subtractString(previousResult);
            this._traceResults.delete(node);
        }
        // Check max memory
        const value = expressionUtility.formatValue(result.value, result.kind);
        if (this._traceMemory.tryAddString(value)) {
            // Store the result
            this._traceResults.set(node, value);
        }
    }
    getTraceResult(node) {
        return this._traceResults.get(node);
    }
}
exports.EvaluationContext = EvaluationContext;
////////////////////////////////////////////////////////////////////////////////
// Value types, canonicalization, and interfaces for type compatibility
////////////////////////////////////////////////////////////////////////////////
var ValueKind;
(function (ValueKind) {
    ValueKind[ValueKind["Array"] = 0] = "Array";
    ValueKind[ValueKind["Boolean"] = 1] = "Boolean";
    ValueKind[ValueKind["Null"] = 2] = "Null";
    ValueKind[ValueKind["Number"] = 3] = "Number";
    ValueKind[ValueKind["Object"] = 4] = "Object";
    ValueKind[ValueKind["String"] = 5] = "String";
})(ValueKind = exports.ValueKind || (exports.ValueKind = {}));
class CanonicalValue {
    constructor(value) {
        switch (typeof value) {
            case "undefined":
                this.value = null;
                this.kind = ValueKind.Null;
                return;
            case "boolean":
                this.value = value;
                this.kind = ValueKind.Boolean;
                return;
            case "number":
                this.value = value;
                this.kind = ValueKind.Number;
                return;
            case "string":
                this.value = value;
                this.kind = ValueKind.String;
                return;
        }
        if (value === null) {
            this.value = null;
            this.kind = ValueKind.Null;
            return;
        }
        switch (value[COMPATIBLE_VALUE_KIND]) {
            case ValueKind.Null:
                this.value = null;
                this.kind = ValueKind.Null;
                return;
            case ValueKind.Boolean: {
                const b = value;
                this.value = b.getBoolean();
                this.kind = ValueKind.Boolean;
                return;
            }
            case ValueKind.Number: {
                const n = value;
                this.value = n.getNumber();
                this.kind = ValueKind.Number;
                return;
            }
            case ValueKind.String: {
                const s = value;
                this.value = s.getString();
                this.kind = ValueKind.String;
                return;
            }
            case ValueKind.Object:
                this.value = value;
                this.kind = ValueKind.Object;
                return;
            case ValueKind.Array:
                this.value = value;
                this.kind = ValueKind.Array;
                return;
        }
        this.value = value;
        this.kind = ValueKind.Object;
    }
}
exports.CanonicalValue = CanonicalValue;
const COMPATIBLE_VALUE_KIND = "compatibleValueKind";
////////////////////////////////////////////////////////////////////////////////
// Classes related to tracking memory utilization
////////////////////////////////////////////////////////////////////////////////
/**
 * Helper class for ExpressionNode authors. This class helps calculate memory overhead for a result object.
 */
class MemoryCounter {
    constructor(node, maxBytes) {
        this._currentBytes = 0;
        this._node = node;
        this.maxBytes = (maxBytes ?? 0) > 0 ? maxBytes : 2147483647; // max int32
    }
    get currentBytes() {
        return this._currentBytes;
    }
    addAmount(bytes) {
        if (!this.tryAddAmount(bytes)) {
            if (this._node) {
                throw new Error(`The maximum allowed memory size was exceeded while evaluating the following expression: ${this._node.convertToExpression()}`);
            }
            throw new Error("The maximum allowed memory size was exceeded");
        }
    }
    addContextData(value, traverse) {
        this.addAmount(MemoryCounter.calculateContextDataBytes(value, traverse));
    }
    addMinObjectSize() {
        this.addAmount(MemoryCounter.MIN_OBJECT_SIZE);
    }
    addPointer() {
        this.addAmount(MemoryCounter.POINTER_SIZE);
    }
    addString(value) {
        this.addAmount(MemoryCounter.calculateStringBytes(value));
    }
    subtractAmount(bytes) {
        if (bytes > this._currentBytes) {
            throw new Error("Bytes to subtract exceeds total bytes");
        }
        this._currentBytes -= bytes;
    }
    subtractString(value) {
        this.subtractAmount(MemoryCounter.calculateStringBytes(value));
    }
    tryAddAmount(bytes) {
        bytes += this._currentBytes;
        if (bytes > this.maxBytes) {
            return false;
        }
        this._currentBytes = bytes;
        return true;
    }
    tryAddString(value) {
        return this.tryAddAmount(MemoryCounter.calculateStringBytes(value));
    }
    static calculateStringBytes(value) {
        // This measurement doesn't have to be perfect.
        // https://codeblog.jonskeet.uk/2011/04/05/of-memory-and-strings/
        return MemoryCounter.STRING_BASE_OVERHEAD + value.length * 2;
    }
    static calculateContextDataBytes(value, traverse) {
        let result = 0;
        const values = traverse ? context_data_1.ContextData.traverse(value) : [value];
        for (const item of values) {
            // This measurement doesn't have to be perfect
            // https://codeblog.jonskeet.uk/2011/04/05/of-memory-and-strings/
            switch (item?.type) {
                case context_data_1.STRING_TYPE: {
                    const str = item.value;
                    result += this.MIN_OBJECT_SIZE + this.calculateStringBytes(str);
                    break;
                }
                case context_data_1.ARRAY_TYPE:
                case context_data_1.DICTIONARY_TYPE:
                case context_data_1.CASE_SENSITIVE_DICTIONARY_TYPE:
                case context_data_1.BOOLEAN_TYPE:
                case context_data_1.NUMBER_TYPE:
                    // Min object size is good enough. Allows for base + a few fields.
                    result += this.MIN_OBJECT_SIZE;
                    break;
                case undefined:
                    result += this.POINTER_SIZE;
                    break;
                default:
                    throw new Error(`Unexpected pipeline context data type '${item?.type}'`);
            }
        }
        return result;
    }
}
exports.MemoryCounter = MemoryCounter;
MemoryCounter.MIN_OBJECT_SIZE = 24;
MemoryCounter.POINTER_SIZE = 8;
MemoryCounter.STRING_BASE_OVERHEAD = 26;
class ResultMemory {
    constructor(bytes = undefined, isTotal = undefined) {
        /**
         * Indicates whether Bytes represents the total size of the result.
         * True indicates the accounting-overhead of downstream parameters can be discarded.
         *
         * For example, consider a function fromJson() which takes a string paramter,
         * and returns an object. The object is newly created and a rough
         * measurement should be returned for the amount of bytes it consumes in memory.
         * Set isTotal to true, since new object contains no references
         * to previously allocated memory.
         *
         * For another example, consider a function which wraps a complex parameter result.
         * The field bytes should be set to the amount of newly allocated memory.
         * However since the object references previously allocated memory, set isTotal
         * to false.
         */
        this.isTotal = false;
        if (bytes !== undefined) {
            this.bytes = bytes;
        }
        if (isTotal !== undefined) {
            this.isTotal = isTotal;
        }
    }
}
exports.ResultMemory = ResultMemory;
/**
 * This is an internal class.
 *
 * This class is used to track current memory consumption
 * across the entire expression evaluation.
 */
class EvaluationMemory {
    constructor(maxBytes, node) {
        this._depths = [];
        this._maxActiveDepth = -1;
        this._totalBytes = 0;
        this._maxBytes = maxBytes;
        this._node = node;
    }
    addAmount(depth, bytes, trimDepth) {
        // Trim depth
        if (trimDepth) {
            while (this._maxActiveDepth > depth) {
                const bytes = this._depths[this._maxActiveDepth];
                if (bytes > 0) {
                    // Coherency check
                    if (bytes > this._totalBytes) {
                        throw new Error("Bytes to subtract exceeds total bytes");
                    }
                    // Subtract from the total
                    this._totalBytes -= bytes;
                    // Reset the bytes
                    this._depths[this._maxActiveDepth] = 0;
                }
                this._maxActiveDepth--;
            }
        }
        // Grow the depths
        if (depth > this._maxActiveDepth) {
            // Grow the array
            while (this._depths.length <= depth) {
                this._depths.push(0);
            }
            // Adjust the max active depth
            this._maxActiveDepth = depth;
        }
        // Add to the depth
        this._depths[depth] += bytes;
        // Add to the total
        this._totalBytes += bytes;
        // Check max
        if (this._totalBytes > this._maxBytes) {
            throw new Error(`The maximum allowed memory size was exceeded while evaluating the following expression: ${this._node.convertToExpression()}`);
        }
    }
}
//# sourceMappingURL=nodes.js.map

/***/ }),

/***/ 4061:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.And = void 0;
const nodes_1 = __nccwpck_require__(9248);
class And extends nodes_1.ContainerNode {
    constructor() {
        super(...arguments);
        this.isAndOperator = true;
    }
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return `(${this.parameters
            .map((x) => x.convertToExpression())
            .join(" && ")})`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `(${this.parameters
            .map((x) => x.convertToRealizedExpression(context))
            .join(" && ")})`;
    }
    evaluateCore(context) {
        let result;
        for (const parameter of this.parameters) {
            result = parameter.evaluate(context);
            if (result.isFalsy) {
                break;
            }
        }
        return {
            value: result?.value,
            memory: undefined,
        };
    }
}
exports.And = And;
//# sourceMappingURL=and.js.map

/***/ }),

/***/ 4049:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Equal = void 0;
const nodes_1 = __nccwpck_require__(9248);
class Equal extends nodes_1.ContainerNode {
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return `(${this.parameters[0].convertToExpression()} == ${this.parameters[1].convertToExpression()})`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `(${this.parameters[0].convertToRealizedExpression(context)} == ${this.parameters[1].convertToRealizedExpression(context)})`;
    }
    evaluateCore(context) {
        const left = this.parameters[0].evaluate(context);
        const right = this.parameters[1].evaluate(context);
        return {
            value: left.abstractEqual(right),
            memory: undefined,
        };
    }
}
exports.Equal = Equal;
//# sourceMappingURL=equal.js.map

/***/ }),

/***/ 7215:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GreaterThanOrEqual = void 0;
const nodes_1 = __nccwpck_require__(9248);
class GreaterThanOrEqual extends nodes_1.ContainerNode {
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return `(${this.parameters[0].convertToExpression()} >= ${this.parameters[1].convertToExpression()})`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `(${this.parameters[0].convertToRealizedExpression(context)} >= ${this.parameters[1].convertToRealizedExpression(context)})`;
    }
    evaluateCore(context) {
        const left = this.parameters[0].evaluate(context);
        const right = this.parameters[1].evaluate(context);
        return {
            value: left.abstractGreaterThanOrEqual(right),
            memory: undefined,
        };
    }
}
exports.GreaterThanOrEqual = GreaterThanOrEqual;
//# sourceMappingURL=greater-than-or-equal.js.map

/***/ }),

/***/ 4692:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GreaterThan = void 0;
const nodes_1 = __nccwpck_require__(9248);
class GreaterThan extends nodes_1.ContainerNode {
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return `(${this.parameters[0].convertToExpression()} > ${this.parameters[1].convertToExpression()})`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `(${this.parameters[0].convertToRealizedExpression(context)} > ${this.parameters[1].convertToRealizedExpression(context)})`;
    }
    evaluateCore(context) {
        const left = this.parameters[0].evaluate(context);
        const right = this.parameters[1].evaluate(context);
        return {
            value: left.abstractGreaterThan(right),
            memory: undefined,
        };
    }
}
exports.GreaterThan = GreaterThan;
//# sourceMappingURL=greater-than.js.map

/***/ }),

/***/ 4495:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Index = void 0;
const expressionUtility = __importStar(__nccwpck_require__(8170));
const nodes_1 = __nccwpck_require__(9248);
class Index extends nodes_1.ContainerNode {
    get traceFullyRealized() {
        return true;
    }
    convertToExpression() {
        // Dot format, for example: github.sha
        if (this.parameters[1].nodeType == nodes_1.NodeType.Literal) {
            const literal = this.parameters[1];
            if (literal.kind === nodes_1.ValueKind.String &&
                expressionUtility.testLegalKeyword(literal.value)) {
                return `${this.parameters[0].convertToExpression()}.${literal.value}`;
            }
        }
        // Index format, for example: commits[0]
        return `${this.parameters[0].convertToExpression()}[${this.parameters[1].convertToExpression()}]`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `${this.parameters[0].convertToRealizedExpression(context)}[${this.parameters[1].convertToRealizedExpression(context)}]`;
    }
    evaluateCore(context) {
        const left = this.parameters[0].evaluate(context);
        const collection = left.getCollectionInterface();
        // Not a collection
        if (!collection) {
            return {
                value: this.parameters[1].nodeType === nodes_1.NodeType.Wildcard
                    ? new FilteredArray()
                    : undefined,
                memory: undefined,
            };
        }
        // Filtered array
        else if (collection.compatibleValueKind === nodes_1.ValueKind.Array &&
            collection?.isFilteredArray === true) {
            return this.handleFilteredArray(context, collection);
        }
        // Array
        else if (collection.compatibleValueKind === nodes_1.ValueKind.Array) {
            return this.handleArray(context, collection);
        }
        // Object
        else if (collection.compatibleValueKind === nodes_1.ValueKind.Object) {
            return this.handleObject(context, collection);
        }
        return {
            value: undefined,
            memory: undefined,
        };
    }
    handleFilteredArray(context, filteredArray) {
        const result = new FilteredArray();
        const counter = this.createMemoryCounter(context);
        const indexHelper = new IndexHelper(context, this.parameters[1]);
        // Apply the index to each nested object or array
        const length = filteredArray.getArrayLength();
        for (let i = 0; i < length; i++) {
            const item = filteredArray.getArrayItem(i);
            // Leverage the expression sdK to traverse the object
            const itemResult = new nodes_1.EvaluationResult(new nodes_1.CanonicalValue(item));
            const collection = itemResult.getCollectionInterface();
            // Nested object
            if (collection?.compatibleValueKind === nodes_1.ValueKind.Object) {
                const nestedObject = collection;
                // Wildcard
                if (indexHelper.isWildcard) {
                    for (const nestedKey of nestedObject.getObjectKeys()) {
                        const nestedValue = nestedObject.getObjectValue(nestedKey);
                        result.add(nestedValue);
                        counter.addPointer();
                    }
                }
                // String
                else if (indexHelper.hasStringIndex) {
                    if (nestedObject.hasObjectKey(indexHelper.stringIndex)) {
                        const nestedValue = nestedObject.getObjectValue(indexHelper.stringIndex);
                        result.add(nestedValue);
                        counter.addPointer();
                    }
                }
            }
            // Nested array
            else if (collection?.compatibleValueKind === nodes_1.ValueKind.Array) {
                const nestedArray = collection;
                // Wildcard
                if (indexHelper.isWildcard) {
                    const nestedLength = nestedArray.getArrayLength();
                    for (let nestedIndex = 0; nestedIndex < nestedLength; nestedIndex++) {
                        const nestedItem = nestedArray.getArrayItem(nestedIndex);
                        result.add(nestedItem);
                        counter.addPointer();
                    }
                }
                // String
                else if (indexHelper.hasIntegerIndex &&
                    indexHelper.integerIndex < nestedArray.getArrayLength()) {
                    result.add(nestedArray.getArrayItem(indexHelper.integerIndex));
                    counter.addPointer();
                }
            }
        }
        return {
            value: result,
            memory: new nodes_1.ResultMemory(counter.currentBytes),
        };
    }
    handleObject(context, object) {
        const indexHelper = new IndexHelper(context, this.parameters[1]);
        // Wildcard
        if (indexHelper.isWildcard) {
            const filteredArray = new FilteredArray();
            const counter = this.createMemoryCounter(context);
            counter.addMinObjectSize();
            for (const key of object.getObjectKeys()) {
                filteredArray.add(object.getObjectValue(key));
                counter.addPointer();
            }
            return {
                value: filteredArray,
                memory: new nodes_1.ResultMemory(counter.currentBytes),
            };
        }
        // String
        else if (indexHelper.hasStringIndex &&
            object.hasObjectKey(indexHelper.stringIndex)) {
            return {
                value: object.getObjectValue(indexHelper.stringIndex),
                memory: undefined,
            };
        }
        return {
            value: undefined,
            memory: undefined,
        };
    }
    handleArray(context, array) {
        const indexHelper = new IndexHelper(context, this.parameters[1]);
        // Wildcard
        if (indexHelper.isWildcard) {
            const filtered = new FilteredArray();
            const counter = this.createMemoryCounter(context);
            counter.addMinObjectSize();
            const length = array.getArrayLength();
            for (let i = 0; i < length; i++) {
                filtered.add(array.getArrayItem(i));
                counter.addPointer();
            }
            return {
                value: filtered,
                memory: new nodes_1.ResultMemory(counter.currentBytes),
            };
        }
        // Integer
        else if (indexHelper.hasIntegerIndex &&
            indexHelper.integerIndex < array.getArrayLength()) {
            return {
                value: array.getArrayItem(indexHelper.integerIndex),
                memory: undefined,
            };
        }
        return {
            value: undefined,
            memory: undefined,
        };
    }
}
exports.Index = Index;
class FilteredArray {
    constructor() {
        this._list = [];
        this.compatibleValueKind = nodes_1.ValueKind.Array;
        this.isFilteredArray = true;
    }
    add(item) {
        this._list.push(item);
    }
    getArrayLength() {
        return this._list.length;
    }
    getArrayItem(index) {
        return this._list[index];
    }
}
class IndexHelper {
    constructor(context, parameter) {
        this._parameter = parameter;
        this._result = parameter.evaluate(context);
    }
    get isWildcard() {
        return this._parameter.nodeType === nodes_1.NodeType.Wildcard;
    }
    get hasIntegerIndex() {
        return this.integerIndex !== null;
    }
    get hasStringIndex() {
        return this.stringIndex !== null;
    }
    get integerIndex() {
        if (this._integerIndex === undefined) {
            let doubleIndex = this._result.convertToNumber();
            if (isNaN(doubleIndex) || doubleIndex < 0) {
                this._integerIndex = null;
            }
            doubleIndex = Math.floor(doubleIndex);
            if (doubleIndex > 2147483647) {
                // max integer in most languages
                this._integerIndex = null;
            }
            this._integerIndex = doubleIndex;
        }
        return this._integerIndex;
    }
    get stringIndex() {
        if (this._stringIndex === undefined) {
            this._stringIndex = this._result.isPrimitive
                ? this._result.convertToString()
                : null;
        }
        return this._stringIndex;
    }
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 440:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LessThanOrEqual = void 0;
const nodes_1 = __nccwpck_require__(9248);
class LessThanOrEqual extends nodes_1.ContainerNode {
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return `(${this.parameters[0].convertToExpression()} <= ${this.parameters[1].convertToExpression()})`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `(${this.parameters[0].convertToRealizedExpression(context)} <= ${this.parameters[1].convertToRealizedExpression(context)})`;
    }
    evaluateCore(context) {
        const left = this.parameters[0].evaluate(context);
        const right = this.parameters[1].evaluate(context);
        return {
            value: left.abstractLessThanOrEqual(right),
            memory: undefined,
        };
    }
}
exports.LessThanOrEqual = LessThanOrEqual;
//# sourceMappingURL=less-than-or-equal.js.map

/***/ }),

/***/ 5921:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LessThan = void 0;
const nodes_1 = __nccwpck_require__(9248);
class LessThan extends nodes_1.ContainerNode {
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return `(${this.parameters[0].convertToExpression()} < ${this.parameters[1].convertToExpression()})`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `(${this.parameters[0].convertToRealizedExpression(context)} < ${this.parameters[1].convertToRealizedExpression(context)})`;
    }
    evaluateCore(context) {
        const left = this.parameters[0].evaluate(context);
        const right = this.parameters[1].evaluate(context);
        return {
            value: left.abstractLessThan(right),
            memory: undefined,
        };
    }
}
exports.LessThan = LessThan;
//# sourceMappingURL=less-than.js.map

/***/ }),

/***/ 8003:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotEqual = void 0;
const nodes_1 = __nccwpck_require__(9248);
class NotEqual extends nodes_1.ContainerNode {
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return `(${this.parameters[0].convertToExpression()} != ${this.parameters[1].convertToExpression()})`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `(${this.parameters[0].convertToRealizedExpression(context)} != ${this.parameters[1].convertToRealizedExpression(context)})`;
    }
    evaluateCore(context) {
        const left = this.parameters[0].evaluate(context);
        const right = this.parameters[1].evaluate(context);
        return {
            value: left.abstractNotEqual(right),
            memory: undefined,
        };
    }
}
exports.NotEqual = NotEqual;
//# sourceMappingURL=not-equal.js.map

/***/ }),

/***/ 8646:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Not = void 0;
const nodes_1 = __nccwpck_require__(9248);
class Not extends nodes_1.ContainerNode {
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return `!${this.parameters[0].convertToExpression()}`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `!${this.parameters[0].convertToRealizedExpression(context)}`;
    }
    evaluateCore(context) {
        const result = this.parameters[0].evaluate(context);
        return {
            value: result.isFalsy,
            memory: undefined,
        };
    }
}
exports.Not = Not;
//# sourceMappingURL=not.js.map

/***/ }),

/***/ 1121:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Or = void 0;
const nodes_1 = __nccwpck_require__(9248);
class Or extends nodes_1.ContainerNode {
    constructor() {
        super(...arguments);
        this.isOrOperator = true;
    }
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return `(${this.parameters
            .map((x) => x.convertToExpression())
            .join(" || ")})`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `(${this.parameters
            .map((x) => x.convertToRealizedExpression(context))
            .join(" || ")})`;
    }
    evaluateCore(context) {
        let result;
        for (const parameter of this.parameters) {
            result = parameter.evaluate(context);
            if (result.isTruthy) {
                break;
            }
        }
        return {
            value: result?.value,
            memory: undefined,
        };
    }
}
exports.Or = Or;
//# sourceMappingURL=or.js.map

/***/ }),

/***/ 314:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateExpressionSyntax = exports.createExpressionTree = void 0;
const trace_writer_1 = __nccwpck_require__(6918);
const nodes_1 = __nccwpck_require__(9248);
const lexical_analyzer_1 = __nccwpck_require__(2908);
const expression_constants_1 = __nccwpck_require__(9575);
const contains_1 = __nccwpck_require__(9102);
const ends_with_1 = __nccwpck_require__(1967);
const format_1 = __nccwpck_require__(1406);
const join_1 = __nccwpck_require__(4602);
const starts_with_1 = __nccwpck_require__(7022);
const to_json_1 = __nccwpck_require__(599);
const from_json_1 = __nccwpck_require__(3551);
const WELL_KNOWN_FUNCTIONS = {};
function addFunction(name, minParameters, maxParameters, createNode) {
    WELL_KNOWN_FUNCTIONS[name.toUpperCase()] = {
        name,
        minParameters,
        maxParameters,
        createNode,
    };
}
addFunction("contains", 2, 2, () => new contains_1.Contains());
addFunction("endsWith", 2, 2, () => new ends_with_1.EndsWith());
addFunction("format", 1, 255, () => new format_1.Format());
addFunction("join", 1, 2, () => new join_1.Join());
addFunction("startsWith", 2, 2, () => new starts_with_1.StartsWith());
addFunction("toJson", 1, 1, () => new to_json_1.ToJson());
addFunction("fromJson", 1, 1, () => new from_json_1.FromJson());
function createExpressionTree(expression, trace, namedContexts, functions) {
    const context = new ParseContext(expression, trace, namedContexts, functions);
    context.trace.info(`Parsing expression: <${expression}>`);
    return createTreeInternal(context);
}
exports.createExpressionTree = createExpressionTree;
function validateExpressionSyntax(expression, trace) {
    const context = new ParseContext(expression, trace, undefined, undefined, true);
    context.trace.info(`Validating expression syntax: <${expression}>`);
    return createTreeInternal(context);
}
exports.validateExpressionSyntax = validateExpressionSyntax;
function createTreeInternal(context) {
    // Push the tokens
    for (;;) {
        context.token = context.lexicalAnalyzer.getNextToken();
        // No more tokens
        if (!context.token) {
            break;
        }
        // Unexpected
        else if (context.token.kind === lexical_analyzer_1.TokenKind.Unexpected) {
            throw createParseError(ParseErrorKind.UnexpectedSymbol, context.token, context.expression);
        }
        // Operator
        else if (context.token.isOperator) {
            pushOperator(context);
        }
        // Operand
        else {
            pushOperand(context);
        }
        context.lastToken = context.token;
    }
    // No tokens
    if (!context.lastToken) {
        return undefined;
    }
    // Check unexpected end of expression
    if (context.operators.length > 0) {
        let unexpectedLastToken = false;
        switch (context.lastToken.kind) {
            case lexical_analyzer_1.TokenKind.EndGroup: // ")" logical grouping
            case lexical_analyzer_1.TokenKind.EndIndex: // "]"
            case lexical_analyzer_1.TokenKind.EndParameters: // ")" function call
                // Legal
                break;
            case lexical_analyzer_1.TokenKind.Function:
                // Illegal
                unexpectedLastToken = true;
                break;
            default:
                unexpectedLastToken = context.lastToken.isOperator;
                break;
        }
        if (unexpectedLastToken || context.lexicalAnalyzer.hasUnclosedTokens) {
            throw createParseError(ParseErrorKind.UnexpectedEndOfExpression, context.lastToken, context.expression);
        }
    }
    // Flush operators
    while (context.operators.length > 0) {
        flushTopOperator(context);
    }
    // Coherency check - verify exactly one operand
    if (context.operands.length !== 1) {
        throw new Error("Expected exactly one operand");
    }
    // Check max depth
    const result = context.operands[0];
    checkMaxDepth(context, result);
    return result;
}
function pushOperand(context) {
    // Create the node
    let node;
    switch (context.token.kind) {
        // Function
        case lexical_analyzer_1.TokenKind.Function: {
            const name = context.token.rawValue;
            const functionInfo = getFunctionInfo(context, name);
            if (functionInfo) {
                node = functionInfo.createNode();
                node.name = name;
            }
            else if (context.allowUnknownKeywords) {
                node = new NoOperationFunction();
                node.name = name;
            }
            else {
                throw createParseError(ParseErrorKind.UnrecognizedFunction, context.token, context.expression);
            }
            break;
        }
        // Named-context
        case lexical_analyzer_1.TokenKind.NamedContext: {
            const name = context.token.rawValue;
            const namedContextInfo = context.extensionNamedContexts[name.toUpperCase()];
            if (namedContextInfo) {
                node = namedContextInfo.createNode();
                node.name = name;
            }
            else if (context.allowUnknownKeywords) {
                node = new NoOperationNamedContext();
                node.name = name;
            }
            else {
                throw createParseError(ParseErrorKind.UnrecognizedNamedContext, context.token, context.expression);
            }
            break;
        }
        // Otherwise simple
        default:
            node = context.token.toNode();
            break;
    }
    // Push the operand
    context.operands.push(node);
}
function pushOperator(context) {
    // Flush higher or equal precedence
    if (context.token.associativity === lexical_analyzer_1.Associativity.LeftToRight) {
        const precedence = context.token.precedence;
        while (context.operators.length > 0) {
            const topOperator = context.operators[context.operators.length - 1];
            if (precedence <= topOperator.precedence &&
                topOperator.kind !== lexical_analyzer_1.TokenKind.StartGroup && // Unless top is "(" logical grouping
                topOperator.kind !== lexical_analyzer_1.TokenKind.StartIndex && // or unless top is "["
                topOperator.kind !== lexical_analyzer_1.TokenKind.StartParameters && // or unless top is "("
                topOperator.kind !== lexical_analyzer_1.TokenKind.Separator) {
                // or unless top is ","
                flushTopOperator(context);
                continue;
            }
            break;
        }
    }
    // Push the operator
    context.operators.push(context.token);
    // Process closing operators now, since context.lastToken is required
    // to accurately process TokenKind.EndParameters
    switch (context.token.kind) {
        case lexical_analyzer_1.TokenKind.EndGroup: // ")" logical grouping
        case lexical_analyzer_1.TokenKind.EndIndex: // "]"
        case lexical_analyzer_1.TokenKind.EndParameters: // ")" function call
            flushTopOperator(context);
            break;
    }
}
function flushTopOperator(context) {
    // Special handling for closing operators
    switch (context.operators[context.operators.length - 1].kind) {
        case lexical_analyzer_1.TokenKind.EndIndex: // "]"
            flushTopEndIndex(context);
            return;
        case lexical_analyzer_1.TokenKind.EndGroup: // ")" logical grouping
            flushTopEndGroup(context);
            return;
        case lexical_analyzer_1.TokenKind.EndParameters: // ")" function call
            flushTopEndParameters(context);
            return;
    }
    // Pop the operator
    const operator = context.operators.pop();
    // Create the node
    const node = operator.toNode();
    // Pop the operands, add to the node
    const operands = popOperands(context, operator.operandCount);
    for (const operand of operands) {
        // Flatten nested And
        if (node?.isAndOperator === true) {
            if (operand?.isAndOperator === true) {
                const nestedAnd = operand;
                for (const nestedParameter of nestedAnd.parameters) {
                    node.addParameter(nestedParameter);
                }
                continue;
            }
        }
        // Flatten nested Or
        else if (node?.isOrOperator === true) {
            if (operand?.isOrOperator === true) {
                const nestedOr = operand;
                for (const nestedParameter of nestedOr.parameters) {
                    node.addParameter(nestedParameter);
                }
                continue;
            }
        }
        node.addParameter(operand);
    }
    // Push the node to thee operand stack
    context.operands.push(node);
}
/**
 * Flushes the ")" logical grouping operator
 */
function flushTopEndGroup(context) {
    // Pop the operators
    popOperator(context, lexical_analyzer_1.TokenKind.EndGroup); // ")" logical grouping
    popOperator(context, lexical_analyzer_1.TokenKind.StartGroup); // "(" logical grouping
}
/**
 * Flushes the "]" operator
 */
function flushTopEndIndex(context) {
    // Pop the operators
    popOperator(context, lexical_analyzer_1.TokenKind.EndIndex); // "]"
    const operator = popOperator(context, lexical_analyzer_1.TokenKind.StartIndex); // "["
    // Create the node
    const node = operator.toNode();
    // Pop the operands, add to the node
    const operands = popOperands(context, operator.operandCount);
    for (const operand of operands) {
        node.addParameter(operand);
    }
    // Push the node to the operand stack
    context.operands.push(node);
}
/**
 * Flushes the ")" function call operator
 */
function flushTopEndParameters(context) {
    // Pop the operator
    let operator = popOperator(context, lexical_analyzer_1.TokenKind.EndParameters); // ")" function call
    // Coherency check - top operator is the current token
    if (operator !== context.token) {
        throw new Error("Expected the operator to be the current token");
    }
    let func;
    // No parameters
    if (context.lastToken.kind === lexical_analyzer_1.TokenKind.StartParameters) {
        // Node already exists on the operand stack
        func = context.operands[context.operands.length - 1];
    }
    // Has parameters
    else {
        // Pop the operands
        let parameterCount = 1;
        while (context.operators[context.operators.length - 1].kind ===
            lexical_analyzer_1.TokenKind.Separator) {
            parameterCount++;
            context.operators.pop();
        }
        const functionOperands = popOperands(context, parameterCount);
        // Node already exists on the operand stack
        func = context.operands[context.operands.length - 1];
        // Add the operands to the node
        for (const operand of functionOperands) {
            func.addParameter(operand);
        }
    }
    // Pop the "(" operator too
    operator = popOperator(context, lexical_analyzer_1.TokenKind.StartParameters);
    // Check min/max parameter count
    const functionInfo = getFunctionInfo(context, func.name);
    if (!functionInfo && context.allowUnknownKeywords) {
        // Don't check min/max
    }
    else if (func.parameters.length < functionInfo.minParameters) {
        throw createParseError(ParseErrorKind.TooFewParameters, operator, context.expression);
    }
    else if (func.parameters.length > functionInfo.maxParameters) {
        throw createParseError(ParseErrorKind.TooManyParameters, operator, context.expression);
    }
}
/**
 * Pops N operands from the operand stack. The operands are returned
 * in their natural listed order, i.e. not last-in-first-out.
 */
function popOperands(context, count) {
    const result = [];
    while (count-- > 0) {
        result.unshift(context.operands.pop());
    }
    return result;
}
/**
 * Pops an operator and asserts it is the expected kind.
 */
function popOperator(context, expected) {
    const token = context.operators.pop();
    if (token.kind !== expected) {
        throw new Error(`Expected operator '${expected}' to be popped. Actual '${token.kind}'`);
    }
    return token;
}
/**
 * Checks the max depth of the expression tree
 */
function checkMaxDepth(context, node, depth = 1) {
    if (depth > expression_constants_1.MAX_DEPTH) {
        throw createParseError(ParseErrorKind.ExceededMaxDepth, undefined, context.expression);
    }
    if (node.nodeType === nodes_1.NodeType.Container) {
        const container = node;
        for (const parameter of container.parameters) {
            checkMaxDepth(context, parameter, depth + 1);
        }
    }
}
function getFunctionInfo(context, name) {
    const upperName = name.toUpperCase();
    return (WELL_KNOWN_FUNCTIONS[upperName] ?? context.extensionFunctions[upperName]);
}
function createParseError(kind, token, expression) {
    let description;
    switch (kind) {
        case ParseErrorKind.ExceededMaxDepth:
            description = `Exceeded max expression depth ${expression_constants_1.MAX_DEPTH}`;
            break;
        case ParseErrorKind.ExceededMaxLength:
            description = `Exceeded max expression length ${expression_constants_1.MAX_LENGTH}`;
            break;
        case ParseErrorKind.TooFewParameters:
            description = "Too few parameters supplied";
            break;
        case ParseErrorKind.TooManyParameters:
            description = "Too many parameters supplied";
            break;
        case ParseErrorKind.UnexpectedEndOfExpression:
            description = "Unexpected end of expression";
            break;
        case ParseErrorKind.UnexpectedSymbol:
            description = "Unexpected symbol";
            break;
        case ParseErrorKind.UnrecognizedFunction:
            description = "Unrecognized function";
            break;
        case ParseErrorKind.UnrecognizedNamedContext:
            description = "Unrecognized named-context";
            break;
        default:
            // Should never reach here
            throw new Error(`Unexpected parse exception kind '${kind}'`);
    }
    if (!token) {
        return new Error(description);
    }
    return new Error(`${description}: '${token.rawValue}'. Located at position ${token.index + 1} within expression: ${expression}`);
}
class NoOperationNamedContext extends nodes_1.NamedContextNode {
    evaluateCore(context) {
        return {
            value: undefined,
            memory: undefined,
        };
    }
}
class NoOperationFunction extends nodes_1.FunctionNode {
    evaluateCore(context) {
        return {
            value: undefined,
            memory: undefined,
        };
    }
}
class ParseContext {
    constructor(expression, trace, namedContexts, functions, allowUnknownKeywords) {
        this.extensionFunctions = {};
        this.extensionNamedContexts = {};
        this.operands = [];
        this.operators = [];
        this.expression = expression;
        if (this.expression.length > expression_constants_1.MAX_LENGTH) {
            throw createParseError(ParseErrorKind.ExceededMaxLength, undefined, expression);
        }
        this.trace = trace ?? new trace_writer_1.NoOperationTraceWriter();
        for (const namedContextInfo of namedContexts ?? []) {
            this.extensionNamedContexts[namedContextInfo.name.toUpperCase()] =
                namedContextInfo;
        }
        for (const functionInfo of functions ?? []) {
            this.extensionFunctions[functionInfo.name.toUpperCase()] = functionInfo;
        }
        this.lexicalAnalyzer = new lexical_analyzer_1.LexicalAnalyzer(this.expression);
        this.allowUnknownKeywords = allowUnknownKeywords ?? false;
    }
}
var ParseErrorKind;
(function (ParseErrorKind) {
    ParseErrorKind[ParseErrorKind["ExceededMaxDepth"] = 0] = "ExceededMaxDepth";
    ParseErrorKind[ParseErrorKind["ExceededMaxLength"] = 1] = "ExceededMaxLength";
    ParseErrorKind[ParseErrorKind["TooFewParameters"] = 2] = "TooFewParameters";
    ParseErrorKind[ParseErrorKind["TooManyParameters"] = 3] = "TooManyParameters";
    ParseErrorKind[ParseErrorKind["UnexpectedEndOfExpression"] = 4] = "UnexpectedEndOfExpression";
    ParseErrorKind[ParseErrorKind["UnexpectedSymbol"] = 5] = "UnexpectedSymbol";
    ParseErrorKind[ParseErrorKind["UnrecognizedFunction"] = 6] = "UnrecognizedFunction";
    ParseErrorKind[ParseErrorKind["UnrecognizedNamedContext"] = 7] = "UnrecognizedNamedContext";
})(ParseErrorKind || (ParseErrorKind = {}));
//# sourceMappingURL=parser.js.map

/***/ }),

/***/ 6918:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoOperationTraceWriter = void 0;
class NoOperationTraceWriter {
    info(message) { }
    verbose(message) { }
}
exports.NoOperationTraceWriter = NoOperationTraceWriter;
//# sourceMappingURL=trace-writer.js.map

/***/ }),

/***/ 6140:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JSONObjectReader = void 0;
const tokens_1 = __nccwpck_require__(5457);
const parse_event_1 = __nccwpck_require__(5239);
class JSONObjectReader {
    constructor(fileId, input) {
        this._fileId = fileId;
        // todo: remove these or hide behind env var
        // console.log(`parsing: '${input}'`)
        const value = JSON.parse(input);
        this._generator = this.getParseEvents(value, true);
        this._current = this._generator.next();
    }
    allowLiteral() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.Literal) {
                this._current = this._generator.next();
                // console.log("ParseEvent=Literal")
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowSequenceStart() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.SequenceStart) {
                this._current = this._generator.next();
                // console.log("ParseEvent=SequenceStart")
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowSequenceEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.SequenceEnd) {
                this._current = this._generator.next();
                // console.log("ParseEvent=SequenceEnd")
                return true;
            }
        }
        return false;
    }
    allowMappingStart() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.MappingStart) {
                this._current = this._generator.next();
                // console.log("ParseEvent=MappingStart")
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowMappingEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.MappingEnd) {
                this._current = this._generator.next();
                // console.log("ParseEvent=MappingEnd")
                return true;
            }
        }
        return false;
    }
    validateEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.DocumentEnd) {
                this._current = this._generator.next();
                // console.log("ParseEvent=DocumentEnd")
                return;
            }
        }
        throw new Error("Expected end of reader");
    }
    validateStart() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.DocumentStart) {
                this._current = this._generator.next();
                // console.log("ParseEvent=DocumentStart")
                return;
            }
        }
        throw new Error("Expected start of reader");
    }
    /**
     * Returns all tokens (depth first)
     */
    *getParseEvents(value, root) {
        if (root) {
            yield new parse_event_1.ParseEvent(parse_event_1.EventType.DocumentStart, undefined);
        }
        switch (typeof value) {
            case "undefined":
                yield new parse_event_1.ParseEvent(parse_event_1.EventType.Literal, new tokens_1.NullToken(this._fileId, undefined, undefined));
                break;
            case "boolean":
                yield new parse_event_1.ParseEvent(parse_event_1.EventType.Literal, new tokens_1.BooleanToken(this._fileId, undefined, undefined, value));
                break;
            case "number":
                yield new parse_event_1.ParseEvent(parse_event_1.EventType.Literal, new tokens_1.NumberToken(this._fileId, undefined, undefined, value));
                break;
            case "string":
                yield new parse_event_1.ParseEvent(parse_event_1.EventType.Literal, new tokens_1.StringToken(this._fileId, undefined, undefined, value));
                break;
            case "object":
                // null
                if (value === null) {
                    yield new parse_event_1.ParseEvent(parse_event_1.EventType.Literal, new tokens_1.NullToken(this._fileId, undefined, undefined));
                }
                // array
                else if (Object.prototype.hasOwnProperty.call(value, "length")) {
                    yield new parse_event_1.ParseEvent(parse_event_1.EventType.SequenceStart, new tokens_1.SequenceToken(this._fileId, undefined, undefined));
                    for (const item of value) {
                        for (const e of this.getParseEvents(item)) {
                            yield e;
                        }
                    }
                    yield new parse_event_1.ParseEvent(parse_event_1.EventType.SequenceEnd, undefined);
                }
                // object
                else {
                    yield new parse_event_1.ParseEvent(parse_event_1.EventType.MappingStart, new tokens_1.MappingToken(this._fileId, undefined, undefined));
                    for (const key of Object.keys(value)) {
                        yield new parse_event_1.ParseEvent(parse_event_1.EventType.Literal, new tokens_1.StringToken(this._fileId, undefined, undefined, key));
                        for (const e of this.getParseEvents(value[key])) {
                            yield e;
                        }
                    }
                    yield new parse_event_1.ParseEvent(parse_event_1.EventType.MappingEnd, undefined);
                }
                break;
            default:
                throw new Error(`Unexpected value type '${typeof value}' when reading object`);
        }
        if (root) {
            yield new parse_event_1.ParseEvent(parse_event_1.EventType.DocumentEnd, undefined);
        }
    }
}
exports.JSONObjectReader = JSONObjectReader;
//# sourceMappingURL=json-object-reader.js.map

/***/ }),

/***/ 5239:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventType = exports.ParseEvent = void 0;
class ParseEvent {
    constructor(type, token) {
        this.type = type;
        this.token = token;
    }
}
exports.ParseEvent = ParseEvent;
var EventType;
(function (EventType) {
    EventType[EventType["Literal"] = 0] = "Literal";
    EventType[EventType["SequenceStart"] = 1] = "SequenceStart";
    EventType[EventType["SequenceEnd"] = 2] = "SequenceEnd";
    EventType[EventType["MappingStart"] = 3] = "MappingStart";
    EventType[EventType["MappingEnd"] = 4] = "MappingEnd";
    EventType[EventType["DocumentStart"] = 5] = "DocumentStart";
    EventType[EventType["DocumentEnd"] = 6] = "DocumentEnd";
})(EventType = exports.EventType || (exports.EventType = {}));
//# sourceMappingURL=parse-event.js.map

/***/ }),

/***/ 6029:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OneOfDefinition = exports.PropertyValue = exports.MappingDefinition = exports.SequenceDefinition = exports.StringDefinition = exports.NumberDefinition = exports.BooleanDefinition = exports.NullDefinition = exports.ScalarDefinition = exports.Definition = exports.TemplateSchema = exports.DefinitionType = void 0;
const template_constants_1 = __nccwpck_require__(4379);
const template_context_1 = __nccwpck_require__(4869);
const template_memory_1 = __nccwpck_require__(3431);
const template_reader_1 = __nccwpck_require__(6084);
const tokens_1 = __nccwpck_require__(5457);
const trace_writer_1 = __nccwpck_require__(3192);
var DefinitionType;
(function (DefinitionType) {
    DefinitionType[DefinitionType["Null"] = 0] = "Null";
    DefinitionType[DefinitionType["Boolean"] = 1] = "Boolean";
    DefinitionType[DefinitionType["Number"] = 2] = "Number";
    DefinitionType[DefinitionType["String"] = 3] = "String";
    DefinitionType[DefinitionType["Sequence"] = 4] = "Sequence";
    DefinitionType[DefinitionType["Mapping"] = 5] = "Mapping";
    DefinitionType[DefinitionType["OneOf"] = 6] = "OneOf";
})(DefinitionType = exports.DefinitionType || (exports.DefinitionType = {}));
/**
 * This models the root schema object and contains definitions
 */
class TemplateSchema {
    constructor(mapping) {
        this.definitions = {};
        this.version = "";
        // Add built-in type: null
        this.definitions[template_constants_1.NULL] = new NullDefinition();
        // Add built-in type: boolean
        this.definitions[template_constants_1.BOOLEAN] = new BooleanDefinition();
        // Add built-in type: number
        this.definitions[template_constants_1.NUMBER] = new NumberDefinition();
        // Add built-in type: string
        this.definitions[template_constants_1.STRING] = new StringDefinition();
        // Add built-in type: sequence
        const sequenceDefinition = new SequenceDefinition();
        sequenceDefinition.itemType = template_constants_1.ANY;
        this.definitions[template_constants_1.SEQUENCE] = sequenceDefinition;
        // Add built-in type: mapping
        const mappingDefinition = new MappingDefinition();
        mappingDefinition.looseKeyType = template_constants_1.STRING;
        mappingDefinition.looseValueType = template_constants_1.ANY;
        this.definitions[template_constants_1.MAPPING] = mappingDefinition;
        // Add built-in type: any
        const anyDefinition = new OneOfDefinition();
        anyDefinition.oneOf.push(template_constants_1.NULL);
        anyDefinition.oneOf.push(template_constants_1.BOOLEAN);
        anyDefinition.oneOf.push(template_constants_1.NUMBER);
        anyDefinition.oneOf.push(template_constants_1.STRING);
        anyDefinition.oneOf.push(template_constants_1.SEQUENCE);
        anyDefinition.oneOf.push(template_constants_1.MAPPING);
        this.definitions[template_constants_1.ANY] = anyDefinition;
        if (mapping) {
            for (let i = 0; i < mapping.count; i++) {
                const pair = mapping.get(i);
                const key = pair.key.assertString(`${template_constants_1.TEMPLATE_SCHEMA} key`);
                switch (key.value) {
                    case template_constants_1.VERSION: {
                        this.version = pair.value.assertString(`${template_constants_1.TEMPLATE_SCHEMA} ${template_constants_1.VERSION}`).value;
                        break;
                    }
                    case template_constants_1.DEFINITIONS: {
                        const definitions = pair.value.assertMapping(`${template_constants_1.TEMPLATE_SCHEMA} ${template_constants_1.DEFINITIONS}`);
                        for (let j = 0; j < definitions.count; j++) {
                            const definitionsPair = definitions.get(j);
                            const definitionsKey = definitionsPair.key.assertString(`${template_constants_1.TEMPLATE_SCHEMA} ${template_constants_1.DEFINITIONS} key`);
                            const definitionsValue = definitionsPair.value.assertMapping(`${template_constants_1.TEMPLATE_SCHEMA} ${template_constants_1.DEFINITIONS} value`);
                            let definition;
                            for (let k = 0; k < definitionsValue.count; k++) {
                                const definitionPair = definitionsValue.get(k);
                                const definitionKey = definitionPair.key.assertString(`${template_constants_1.DEFINITION} key`);
                                switch (definitionKey.value) {
                                    case template_constants_1.NULL:
                                        definition = new NullDefinition(definitionsValue);
                                        break;
                                    case template_constants_1.BOOLEAN:
                                        definition = new BooleanDefinition(definitionsValue);
                                        break;
                                    case template_constants_1.NUMBER:
                                        definition = new NumberDefinition(definitionsValue);
                                        break;
                                    case template_constants_1.STRING:
                                        definition = new StringDefinition(definitionsValue);
                                        break;
                                    case template_constants_1.SEQUENCE:
                                        definition = new SequenceDefinition(definitionsValue);
                                        break;
                                    case template_constants_1.MAPPING:
                                        definition = new MappingDefinition(definitionsValue);
                                        break;
                                    case template_constants_1.ONE_OF:
                                        definition = new OneOfDefinition(definitionsValue);
                                        break;
                                    case template_constants_1.CONTEXT:
                                    case template_constants_1.DESCRIPTION:
                                        continue;
                                    default:
                                        definitionKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} mapping key`); // throws
                                        break;
                                }
                                break;
                            }
                            if (!definition) {
                                throw new Error(`Not enough information to construct definition '${definitionsKey.value}'`);
                            }
                            this.definitions[definitionsKey.value] = definition;
                        }
                        break;
                    }
                    default:
                        key.assertUnexpectedValue(`${template_constants_1.TEMPLATE_SCHEMA} key`); // throws
                        break;
                }
            }
        }
    }
    /**
     * Looks up a definition by name
     */
    getDefinition(name) {
        const result = this.definitions[name];
        if (result) {
            return result;
        }
        throw new Error(`Schema definition '${name}' not found`);
    }
    /**
     * Expands one-of definitions and returns all scalar definitions
     */
    getScalarDefinitions(definition) {
        const result = [];
        switch (definition.definitionType) {
            case DefinitionType.Null:
            case DefinitionType.Boolean:
            case DefinitionType.Number:
            case DefinitionType.String:
                result.push(definition);
                break;
            case DefinitionType.OneOf: {
                const oneOf = definition;
                for (const nestedName of oneOf.oneOf) {
                    const nestedDefinition = this.getDefinition(nestedName);
                    switch (nestedDefinition.definitionType) {
                        case DefinitionType.Null:
                        case DefinitionType.Boolean:
                        case DefinitionType.Number:
                        case DefinitionType.String:
                            result.push(nestedDefinition);
                            break;
                    }
                }
                break;
            }
        }
        return result;
    }
    /**
     * Expands one-of definitions and returns all matching definitions by type
     */
    getDefinitionsOfType(definition, type) {
        const result = [];
        if (definition.definitionType === type) {
            result.push(definition);
        }
        else if (definition.definitionType === DefinitionType.OneOf) {
            const oneOf = definition;
            for (const nestedName of oneOf.oneOf) {
                const nestedDefinition = this.getDefinition(nestedName);
                if (nestedDefinition.definitionType === type) {
                    result.push(nestedDefinition);
                }
            }
        }
        return result;
    }
    /**
     * Attempts match the property name to a property defined by any of the specified definitions.
     * If matched, any unmatching definitions are filtered from the definitions array.
     * Returns the type information for the matched property.
     */
    matchPropertyAndFilter(definitions, propertyName) {
        let result;
        // Check for a matching well-known property
        let notFoundInSome = false;
        for (const definition of definitions) {
            const propertyValue = definition.properties[propertyName];
            if (propertyValue) {
                result = propertyValue.type;
            }
            else {
                notFoundInSome = true;
            }
        }
        // Filter the matched definitions if needed
        if (result && notFoundInSome) {
            for (let i = 0; i < definitions.length;) {
                if (definitions[i].properties[propertyName]) {
                    i++;
                }
                else {
                    definitions.splice(i, 1);
                }
            }
        }
        return result;
    }
    validate() {
        const oneOfDefinitions = {};
        for (const name of Object.keys(this.definitions)) {
            if (!name.match(TemplateSchema._definitionNamePattern)) {
                throw new Error(`Invalid definition name '${name}'`);
            }
            const definition = this.definitions[name];
            // Delay validation for 'one-of' definitions
            if (definition.definitionType === DefinitionType.OneOf) {
                oneOfDefinitions[name] = definition;
            }
            // Otherwise validate now
            else {
                definition.validate(this, name);
            }
        }
        // Validate 'one-of' definitions
        for (const name of Object.keys(oneOfDefinitions)) {
            const oneOf = oneOfDefinitions[name];
            oneOf.validate(this, name);
        }
    }
    /**
     * Loads a user-defined schema file
     */
    static load(objectReader) {
        const context = new template_context_1.TemplateContext(new template_context_1.TemplateValidationErrors(10, 500), new template_memory_1.TemplateMemory(50, 1048576), TemplateSchema.getInternalSchema(), new trace_writer_1.NoOperationTraceWriter());
        const readTemplateResult = (0, template_reader_1.readTemplate)(context, template_constants_1.TEMPLATE_SCHEMA, objectReader, undefined);
        context.errors.check();
        const mapping = readTemplateResult.value.assertMapping(template_constants_1.TEMPLATE_SCHEMA);
        const schema = new TemplateSchema(mapping);
        schema.validate();
        return schema;
    }
    /**
     * Gets the internal schema used for reading user-defined schema files
     */
    static getInternalSchema() {
        if (TemplateSchema._internalSchema === undefined) {
            const schema = new TemplateSchema();
            // template-schema
            let mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.VERSION] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.DEFINITIONS] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.DEFINITIONS));
            schema.definitions[template_constants_1.TEMPLATE_SCHEMA] = mappingDefinition;
            // definitions
            mappingDefinition = new MappingDefinition();
            mappingDefinition.looseKeyType = template_constants_1.NON_EMPTY_STRING;
            mappingDefinition.looseValueType = template_constants_1.DEFINITION;
            schema.definitions[template_constants_1.DEFINITIONS] = mappingDefinition;
            // definition
            let oneOfDefinition = new OneOfDefinition();
            oneOfDefinition.oneOf.push(template_constants_1.NULL_DEFINITION);
            oneOfDefinition.oneOf.push(template_constants_1.BOOLEAN_DEFINITION);
            oneOfDefinition.oneOf.push(template_constants_1.NUMBER_DEFINITION);
            oneOfDefinition.oneOf.push(template_constants_1.STRING_DEFINITION);
            oneOfDefinition.oneOf.push(template_constants_1.SEQUENCE_DEFINITION);
            oneOfDefinition.oneOf.push(template_constants_1.MAPPING_DEFINITION);
            oneOfDefinition.oneOf.push(template_constants_1.ONE_OF_DEFINITION);
            schema.definitions[template_constants_1.DEFINITION] = oneOfDefinition;
            // null-definition
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.DESCRIPTION] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.STRING));
            mappingDefinition.properties[template_constants_1.CONTEXT] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.SEQUENCE_OF_NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.NULL] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.NULL_DEFINITION_PROPERTIES));
            schema.definitions[template_constants_1.NULL_DEFINITION] = mappingDefinition;
            // null-definition-properties
            mappingDefinition = new MappingDefinition();
            schema.definitions[template_constants_1.NULL_DEFINITION_PROPERTIES] = mappingDefinition;
            // boolean-definition
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.DESCRIPTION] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.STRING));
            mappingDefinition.properties[template_constants_1.CONTEXT] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.SEQUENCE_OF_NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.BOOLEAN] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.BOOLEAN_DEFINITION_PROPERTIES));
            schema.definitions[template_constants_1.BOOLEAN_DEFINITION] = mappingDefinition;
            // boolean-definition-properties
            mappingDefinition = new MappingDefinition();
            schema.definitions[template_constants_1.BOOLEAN_DEFINITION_PROPERTIES] = mappingDefinition;
            // number-definition
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.DESCRIPTION] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.STRING));
            mappingDefinition.properties[template_constants_1.CONTEXT] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.SEQUENCE_OF_NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.NUMBER] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.NUMBER_DEFINITION_PROPERTIES));
            schema.definitions[template_constants_1.NUMBER_DEFINITION] = mappingDefinition;
            // number-definition-properties
            mappingDefinition = new MappingDefinition();
            schema.definitions[template_constants_1.NUMBER_DEFINITION_PROPERTIES] = mappingDefinition;
            // string-definition
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.DESCRIPTION] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.STRING));
            mappingDefinition.properties[template_constants_1.CONTEXT] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.SEQUENCE_OF_NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.STRING] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.STRING_DEFINITION_PROPERTIES));
            schema.definitions[template_constants_1.STRING_DEFINITION] = mappingDefinition;
            // string-definition-properties
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.CONSTANT] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.IGNORE_CASE] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.BOOLEAN));
            mappingDefinition.properties[template_constants_1.REQUIRE_NON_EMPTY] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.BOOLEAN));
            schema.definitions[template_constants_1.STRING_DEFINITION_PROPERTIES] = mappingDefinition;
            // sequence-definition
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.DESCRIPTION] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.STRING));
            mappingDefinition.properties[template_constants_1.CONTEXT] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.SEQUENCE_OF_NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.SEQUENCE] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.SEQUENCE_DEFINITION_PROPERTIES));
            schema.definitions[template_constants_1.SEQUENCE_DEFINITION] = mappingDefinition;
            // sequence-definition-properties
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.ITEM_TYPE] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.NON_EMPTY_STRING));
            schema.definitions[template_constants_1.SEQUENCE_DEFINITION_PROPERTIES] = mappingDefinition;
            // mapping-definition
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.DESCRIPTION] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.STRING));
            mappingDefinition.properties[template_constants_1.CONTEXT] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.SEQUENCE_OF_NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.MAPPING] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.MAPPING_DEFINITION_PROPERTIES));
            schema.definitions[template_constants_1.MAPPING_DEFINITION] = mappingDefinition;
            // mapping-definition-properties
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.PROPERTIES] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.PROPERTIES));
            mappingDefinition.properties[template_constants_1.LOOSE_KEY_TYPE] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.LOOSE_VALUE_TYPE] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.NON_EMPTY_STRING));
            schema.definitions[template_constants_1.MAPPING_DEFINITION_PROPERTIES] = mappingDefinition;
            // properties
            mappingDefinition = new MappingDefinition();
            mappingDefinition.looseKeyType = template_constants_1.NON_EMPTY_STRING;
            mappingDefinition.looseValueType = template_constants_1.PROPERTY_VALUE;
            schema.definitions[template_constants_1.PROPERTIES] = mappingDefinition;
            // property-value
            oneOfDefinition = new OneOfDefinition();
            oneOfDefinition.oneOf.push(template_constants_1.NON_EMPTY_STRING);
            oneOfDefinition.oneOf.push(template_constants_1.MAPPING_PROPERTY_VALUE);
            schema.definitions[template_constants_1.PROPERTY_VALUE] = oneOfDefinition;
            // mapping-property-value
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.TYPE] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.REQUIRED] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.BOOLEAN));
            schema.definitions[template_constants_1.MAPPING_PROPERTY_VALUE] = mappingDefinition;
            // one-of-definition
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.DESCRIPTION] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.STRING));
            mappingDefinition.properties[template_constants_1.CONTEXT] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.SEQUENCE_OF_NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.ONE_OF] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.SEQUENCE_OF_NON_EMPTY_STRING));
            schema.definitions[template_constants_1.ONE_OF_DEFINITION] = mappingDefinition;
            // non-empty-string
            const stringDefinition = new StringDefinition();
            stringDefinition.requireNonEmpty = true;
            schema.definitions[template_constants_1.NON_EMPTY_STRING] = stringDefinition;
            // sequence-of-non-empty-string
            const sequenceDefinition = new SequenceDefinition();
            sequenceDefinition.itemType = template_constants_1.NON_EMPTY_STRING;
            schema.definitions[template_constants_1.SEQUENCE_OF_NON_EMPTY_STRING] = sequenceDefinition;
            schema.validate();
            TemplateSchema._internalSchema = schema;
        }
        return TemplateSchema._internalSchema;
    }
}
exports.TemplateSchema = TemplateSchema;
TemplateSchema._definitionNamePattern = /^[a-zA-Z_][a-zA-Z0-9_-]*$/;
/**
 * Defines the allowable schema for a user defined type
 */
class Definition {
    constructor(definition) {
        /**
         * Used by the template reader to determine allowed expression values and functions.
         * Also used by the template reader to validate function min/max parameters.
         */
        this.readerContext = [];
        /**
         * Used by the template evaluator to determine allowed expression values and functions.
         * The min/max parameter info is omitted.
         */
        this.evaluatorContext = [];
        if (definition) {
            for (let i = 0; i < definition.count;) {
                const definitionKey = definition
                    .get(i)
                    .key.assertString(`${template_constants_1.DEFINITION} key`);
                switch (definitionKey.value) {
                    case template_constants_1.CONTEXT: {
                        const context = definition
                            .get(i)
                            .value.assertSequence(`${template_constants_1.DEFINITION} ${template_constants_1.CONTEXT}`);
                        definition.remove(i);
                        const seenReaderContext = {};
                        const seenEvaluatorContext = {};
                        for (let j = 0; j < context.count; j++) {
                            const itemStr = context
                                .get(j)
                                .assertString(`${template_constants_1.CONTEXT} item`).value;
                            const upperItemStr = itemStr.toUpperCase();
                            if (seenReaderContext[upperItemStr]) {
                                throw new Error(`Duplicate context item '${itemStr}'`);
                            }
                            seenReaderContext[upperItemStr] = true;
                            this.readerContext.push(itemStr);
                            // Remove min/max parameter info
                            const paramIndex = itemStr.indexOf("(");
                            const modifiedItemStr = paramIndex > 0
                                ? itemStr.substr(0, paramIndex + 1) + ")"
                                : itemStr;
                            const upperModifiedItemStr = modifiedItemStr.toUpperCase();
                            if (seenEvaluatorContext[upperModifiedItemStr]) {
                                throw new Error(`Duplicate context item '${modifiedItemStr}'`);
                            }
                            seenEvaluatorContext[upperModifiedItemStr] = true;
                            this.evaluatorContext.push(modifiedItemStr);
                        }
                        break;
                    }
                    case template_constants_1.DESCRIPTION: {
                        definition.remove(i);
                        break;
                    }
                    default: {
                        i++;
                        break;
                    }
                }
            }
        }
    }
}
exports.Definition = Definition;
class ScalarDefinition extends Definition {
    constructor(definition) {
        super(definition);
    }
}
exports.ScalarDefinition = ScalarDefinition;
class NullDefinition extends ScalarDefinition {
    constructor(definition) {
        super(definition);
        if (definition) {
            for (let i = 0; i < definition.count; i++) {
                const definitionPair = definition.get(i);
                const definitionKey = definitionPair.key.assertString(`${template_constants_1.DEFINITION} key`);
                switch (definitionKey.value) {
                    case template_constants_1.NULL: {
                        const mapping = definitionPair.value.assertMapping(`${template_constants_1.DEFINITION} ${template_constants_1.NULL}`);
                        for (let j = 0; j < mapping.count; j++) {
                            const mappingPair = mapping.get(j);
                            const mappingKey = mappingPair.key.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.NULL} key`);
                            switch (mappingKey.value) {
                                default:
                                    mappingKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} ${template_constants_1.NULL} key`); // throws
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return DefinitionType.Null;
    }
    isMatch(literal) {
        return literal.templateTokenType === tokens_1.NULL_TYPE;
    }
    validate(schema, name) { }
}
exports.NullDefinition = NullDefinition;
class BooleanDefinition extends ScalarDefinition {
    constructor(definition) {
        super(definition);
        if (definition) {
            for (let i = 0; i < definition.count; i++) {
                const definitionPair = definition.get(i);
                const definitionKey = definitionPair.key.assertString(`${template_constants_1.DEFINITION} key`);
                switch (definitionKey.value) {
                    case template_constants_1.BOOLEAN: {
                        const mapping = definitionPair.value.assertMapping(`${template_constants_1.DEFINITION} ${template_constants_1.BOOLEAN}`);
                        for (let j = 0; j < mapping.count; j++) {
                            const mappingPair = mapping.get(j);
                            const mappingKey = mappingPair.key.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.BOOLEAN} key`);
                            switch (mappingKey.value) {
                                default:
                                    mappingKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} ${template_constants_1.BOOLEAN} key`); // throws
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return DefinitionType.Boolean;
    }
    isMatch(literal) {
        return literal.templateTokenType === tokens_1.BOOLEAN_TYPE;
    }
    validate(schema, name) { }
}
exports.BooleanDefinition = BooleanDefinition;
class NumberDefinition extends ScalarDefinition {
    constructor(definition) {
        super(definition);
        if (definition) {
            for (let i = 0; i < definition.count; i++) {
                const definitionPair = definition.get(i);
                const definitionKey = definitionPair.key.assertString(`${template_constants_1.DEFINITION} key`);
                switch (definitionKey.value) {
                    case template_constants_1.NUMBER: {
                        const mapping = definitionPair.value.assertMapping(`${template_constants_1.DEFINITION} ${template_constants_1.NUMBER}`);
                        for (let j = 0; j < mapping.count; j++) {
                            const mappingPair = mapping.get(j);
                            const mappingKey = mappingPair.key.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.NUMBER} key`);
                            switch (mappingKey.value) {
                                default:
                                    mappingKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} ${template_constants_1.NUMBER} key`); // throws
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return DefinitionType.Number;
    }
    isMatch(literal) {
        return literal.templateTokenType === tokens_1.NUMBER_TYPE;
    }
    validate(schema, name) { }
}
exports.NumberDefinition = NumberDefinition;
class StringDefinition extends ScalarDefinition {
    constructor(definition) {
        super(definition);
        this.constant = "";
        this.ignoreCase = false;
        this.requireNonEmpty = false;
        if (definition) {
            for (let i = 0; i < definition.count; i++) {
                const definitionPair = definition.get(i);
                const definitionKey = definitionPair.key.assertString(`${template_constants_1.DEFINITION} key`);
                switch (definitionKey.value) {
                    case template_constants_1.STRING: {
                        const mapping = definitionPair.value.assertMapping(`${template_constants_1.DEFINITION} ${template_constants_1.STRING}`);
                        for (let j = 0; j < mapping.count; j++) {
                            const mappingPair = mapping.get(j);
                            const mappingKey = mappingPair.key.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.STRING} key`);
                            switch (mappingKey.value) {
                                case template_constants_1.CONSTANT: {
                                    const constantStringToken = mappingPair.value.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.STRING} ${template_constants_1.CONSTANT}`);
                                    this.constant = constantStringToken.value;
                                    break;
                                }
                                case template_constants_1.IGNORE_CASE: {
                                    const ignoreCaseBooleanToken = mappingPair.value.assertBoolean(`${template_constants_1.DEFINITION} ${template_constants_1.STRING} ${template_constants_1.IGNORE_CASE}`);
                                    this.ignoreCase = ignoreCaseBooleanToken.value;
                                    break;
                                }
                                case template_constants_1.REQUIRE_NON_EMPTY: {
                                    const requireNonEmptyBooleanToken = mappingPair.value.assertBoolean(`${template_constants_1.DEFINITION} ${template_constants_1.STRING} ${template_constants_1.REQUIRE_NON_EMPTY}`);
                                    this.requireNonEmpty = requireNonEmptyBooleanToken.value;
                                    break;
                                }
                                default:
                                    mappingKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} ${template_constants_1.STRING} key`); // throws
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return DefinitionType.String;
    }
    isMatch(literal) {
        if (literal.templateTokenType === tokens_1.STRING_TYPE) {
            const value = literal.value;
            if (this.constant) {
                return this.ignoreCase
                    ? this.constant.toUpperCase() === value.toUpperCase()
                    : this.constant === value;
            }
            else if (this.requireNonEmpty) {
                return !!value;
            }
            else {
                return true;
            }
        }
        return false;
    }
    validate(schema, name) {
        if (this.constant && this.requireNonEmpty) {
            throw new Error(`Properties '${template_constants_1.CONSTANT}' and '${template_constants_1.REQUIRE_NON_EMPTY}' cannot both be set`);
        }
    }
}
exports.StringDefinition = StringDefinition;
class SequenceDefinition extends Definition {
    constructor(definition) {
        super(definition);
        this.itemType = "";
        if (definition) {
            for (let i = 0; i < definition.count; i++) {
                const definitionPair = definition.get(i);
                const definitionKey = definitionPair.key.assertString(`${template_constants_1.DEFINITION} key`);
                switch (definitionKey.value) {
                    case template_constants_1.SEQUENCE: {
                        const mapping = definitionPair.value.assertMapping(`${template_constants_1.DEFINITION} ${template_constants_1.SEQUENCE}`);
                        for (let j = 0; j < mapping.count; j++) {
                            const mappingPair = mapping.get(j);
                            const mappingKey = mappingPair.key.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.SEQUENCE} key`);
                            switch (mappingKey.value) {
                                case template_constants_1.ITEM_TYPE: {
                                    const itemType = mappingPair.value.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.SEQUENCE} ${template_constants_1.ITEM_TYPE}`);
                                    this.itemType = itemType.value;
                                    break;
                                }
                                default:
                                    mappingKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} ${template_constants_1.SEQUENCE} key`); // throws
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return DefinitionType.Sequence;
    }
    validate(schema, name) {
        if (!this.itemType) {
            throw new Error(`'${name}' does not defined '${template_constants_1.ITEM_TYPE}'`);
        }
        // Lookup item type
        schema.getDefinition(this.itemType);
    }
}
exports.SequenceDefinition = SequenceDefinition;
class MappingDefinition extends Definition {
    constructor(definition) {
        super(definition);
        this.properties = {};
        this.looseKeyType = "";
        this.looseValueType = "";
        if (definition) {
            for (let i = 0; i < definition.count; i++) {
                const definitionPair = definition.get(i);
                const definitionKey = definitionPair.key.assertString(`${template_constants_1.DEFINITION} key`);
                switch (definitionKey.value) {
                    case template_constants_1.MAPPING: {
                        const mapping = definitionPair.value.assertMapping(`${template_constants_1.DEFINITION} ${template_constants_1.MAPPING}`);
                        for (let j = 0; j < mapping.count; j++) {
                            const mappingPair = mapping.get(j);
                            const mappingKey = mappingPair.key.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.MAPPING} key`);
                            switch (mappingKey.value) {
                                case template_constants_1.PROPERTIES: {
                                    const properties = mappingPair.value.assertMapping(`${template_constants_1.DEFINITION} ${template_constants_1.MAPPING} ${template_constants_1.PROPERTIES}`);
                                    for (let k = 0; k < properties.count; k++) {
                                        const propertiesPair = properties.get(k);
                                        const propertyName = propertiesPair.key.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.MAPPING} ${template_constants_1.PROPERTIES} key`);
                                        this.properties[propertyName.value] = new PropertyValue(propertiesPair.value);
                                    }
                                    break;
                                }
                                case template_constants_1.LOOSE_KEY_TYPE: {
                                    const looseKeyType = mappingPair.value.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.MAPPING} ${template_constants_1.LOOSE_KEY_TYPE}`);
                                    this.looseKeyType = looseKeyType.value;
                                    break;
                                }
                                case template_constants_1.LOOSE_VALUE_TYPE: {
                                    const looseValueType = mappingPair.value.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.MAPPING} ${template_constants_1.LOOSE_VALUE_TYPE}`);
                                    this.looseValueType = looseValueType.value;
                                    break;
                                }
                                default:
                                    mappingKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} ${template_constants_1.MAPPING} key`); // throws
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return DefinitionType.Mapping;
    }
    validate(schema, name) {
        // Lookup loose key type
        if (this.looseKeyType) {
            schema.getDefinition(this.looseKeyType);
            // Lookup loose value type
            if (this.looseValueType) {
                schema.getDefinition(this.looseValueType);
            }
            else {
                throw new Error(`Property '${template_constants_1.LOOSE_KEY_TYPE}' is defined but '${template_constants_1.LOOSE_VALUE_TYPE}' is not defined on '${name}'`);
            }
        }
        // Otherwise validate loose value type not be defined
        else if (this.looseValueType) {
            throw new Error(`Property '${template_constants_1.LOOSE_VALUE_TYPE}' is defined but '${template_constants_1.LOOSE_KEY_TYPE}' is not defined on '${name}'`);
        }
        // Lookup each property
        for (const propertyName of Object.keys(this.properties)) {
            const propertyValue = this.properties[propertyName];
            if (!propertyValue.type) {
                throw new Error(`Type not specified for the property '${propertyName}' on '${name}'`);
            }
            schema.getDefinition(propertyValue.type);
        }
    }
}
exports.MappingDefinition = MappingDefinition;
class PropertyValue {
    constructor(token) {
        this.type = "";
        this.required = false;
        if (token.templateTokenType === tokens_1.STRING_TYPE) {
            this.type = token.value;
        }
        else {
            const mapping = token.assertMapping(template_constants_1.MAPPING_PROPERTY_VALUE);
            for (let i = 0; i < mapping.count; i++) {
                const mappingPair = mapping.get(i);
                const mappingKey = mappingPair.key.assertString(`${template_constants_1.MAPPING_PROPERTY_VALUE} key`);
                switch (mappingKey.value) {
                    case template_constants_1.TYPE:
                        this.type = mappingPair.value.assertString(`${template_constants_1.MAPPING_PROPERTY_VALUE} ${template_constants_1.TYPE}`).value;
                        break;
                    case template_constants_1.REQUIRED:
                        this.required = mappingPair.value.assertBoolean(`${template_constants_1.MAPPING_PROPERTY_VALUE} ${template_constants_1.REQUIRED}`).value;
                        break;
                    default:
                        mappingKey.assertUnexpectedValue(`${template_constants_1.MAPPING_PROPERTY_VALUE} key`); // throws
                }
            }
        }
    }
}
exports.PropertyValue = PropertyValue;
/**
 * Must resolve to exactly one of the referenced definitions
 */
class OneOfDefinition extends Definition {
    constructor(definition) {
        super(definition);
        this.oneOf = [];
        if (definition) {
            for (let i = 0; i < definition.count; i++) {
                const definitionPair = definition.get(i);
                const definitionKey = definitionPair.key.assertString(`${template_constants_1.DEFINITION} key`);
                switch (definitionKey.value) {
                    case template_constants_1.ONE_OF: {
                        const oneOf = definitionPair.value.assertSequence(`${template_constants_1.DEFINITION} ${template_constants_1.ONE_OF}`);
                        for (let j = 0; j < oneOf.count; j++) {
                            const oneOfItem = oneOf
                                .get(j)
                                .assertString(`${template_constants_1.DEFINITION} ${template_constants_1.ONE_OF} item`);
                            this.oneOf.push(oneOfItem.value);
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} key`); // throws
                        break;
                }
            }
        }
    }
    get definitionType() {
        return DefinitionType.OneOf;
    }
    validate(schema, name) {
        if (this.oneOf.length === 0) {
            throw new Error(`'${name}' does not contain any references`);
        }
        let foundLooseKeyType = false;
        const mappingDefinitions = [];
        let sequenceDefinition;
        let nullDefinition;
        let booleanDefinition;
        let numberDefinition;
        const stringDefinitions = [];
        const seenNestedTypes = {};
        for (const nestedType of this.oneOf) {
            if (seenNestedTypes[nestedType]) {
                throw new Error(`'${name}' contains duplicate nested type '${nestedType}'`);
            }
            seenNestedTypes[nestedType] = true;
            const nestedDefinition = schema.getDefinition(nestedType);
            if (nestedDefinition.readerContext.length > 0) {
                throw new Error(`'${name}' is a one-of definition and references another definition that defines context. This is currently not supported.`);
            }
            switch (nestedDefinition.definitionType) {
                case DefinitionType.Mapping: {
                    const mappingDefinition = nestedDefinition;
                    mappingDefinitions.push(mappingDefinition);
                    if (mappingDefinition.looseKeyType) {
                        foundLooseKeyType = true;
                    }
                    break;
                }
                case DefinitionType.Sequence: {
                    // Multiple sequence definitions not allowed
                    if (sequenceDefinition) {
                        throw new Error(`'${name}' refers to more than one definition of type '${template_constants_1.SEQUENCE}'`);
                    }
                    sequenceDefinition = nestedDefinition;
                    break;
                }
                case DefinitionType.Null: {
                    // Multiple null definitions not allowed
                    if (nullDefinition) {
                        throw new Error(`'${name}' refers to more than one definition of type '${template_constants_1.NULL}'`);
                    }
                    nullDefinition = nestedDefinition;
                    break;
                }
                case DefinitionType.Boolean: {
                    // Multiple boolean definitions not allowed
                    if (booleanDefinition) {
                        throw new Error(`'${name}' refers to more than one definition of type '${template_constants_1.BOOLEAN}'`);
                    }
                    booleanDefinition = nestedDefinition;
                    break;
                }
                case DefinitionType.Number: {
                    // Multiple number definitions not allowed
                    if (numberDefinition) {
                        throw new Error(`'${name}' refers to more than one definition of type '${template_constants_1.NUMBER}'`);
                    }
                    numberDefinition = nestedDefinition;
                    break;
                }
                case DefinitionType.String: {
                    const stringDefinition = nestedDefinition;
                    // Multiple string definitions
                    if (stringDefinitions.length > 0 &&
                        (!stringDefinitions[0].constant || !stringDefinition.constant)) {
                        throw new Error(`'${name}' refers to more than one '${template_constants_1.SCALAR}', but some do not set '${template_constants_1.CONSTANT}'`);
                    }
                    stringDefinitions.push(stringDefinition);
                    break;
                }
                default:
                    throw new Error(`'${name}' refers to a definition with type '${nestedDefinition.definitionType}'`);
            }
        }
        if (mappingDefinitions.length > 1) {
            if (foundLooseKeyType) {
                throw new Error(`'${name}' refers to two mappings and at least one sets '${template_constants_1.LOOSE_KEY_TYPE}'. This is not currently supported.`);
            }
            const seenProperties = {};
            for (const mappingDefinition of mappingDefinitions) {
                for (const propertyName of Object.keys(mappingDefinition.properties)) {
                    const newPropertyValue = mappingDefinition.properties[propertyName];
                    // Already seen
                    const existingPropertyValue = seenProperties[propertyName];
                    if (existingPropertyValue) {
                        // Types match
                        if (existingPropertyValue.type === newPropertyValue.type) {
                            continue;
                        }
                        // Collision
                        throw new Error(`'${name}' contains two mappings with the same property, but each refers to a different type. All matching properties must refer to the same type.`);
                    }
                    // New
                    else {
                        seenProperties[propertyName] = newPropertyValue;
                    }
                }
            }
        }
    }
}
exports.OneOfDefinition = OneOfDefinition;
//# sourceMappingURL=schema.js.map

/***/ }),

/***/ 4379:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VERSION = exports.TEMPLATE_SCHEMA = exports.STRUCTURE = exports.STRING_DEFINITION_PROPERTIES = exports.STRING_DEFINITION = exports.STRING = exports.SEQUENCE_OF_NON_EMPTY_STRING = exports.TYPE = exports.SEQUENCE_DEFINITION_PROPERTIES = exports.SEQUENCE_DEFINITION = exports.SEQUENCE = exports.SCALAR = exports.REQUIRE_NON_EMPTY = exports.REQUIRED = exports.PROPERTIES = exports.PROPERTY_VALUE = exports.OPEN_EXPRESSION = exports.ONE_OF_DEFINITION = exports.ONE_OF = exports.NUMBER_DEFINITION_PROPERTIES = exports.NUMBER_DEFINITION = exports.NUMBER = exports.NULL_DEFINITION_PROPERTIES = exports.NULL_DEFINITION = exports.NULL = exports.NON_EMPTY_STRING = exports.MAPPING_PROPERTY_VALUE = exports.MAPPING_DEFINITION_PROPERTIES = exports.MAPPING_DEFINITION = exports.MAPPING = exports.MAX_CONSTANT = exports.LOOSE_VALUE_TYPE = exports.LOOSE_KEY_TYPE = exports.ITEM_TYPE = exports.INSERT_DIRECTIVE = exports.IGNORE_CASE = exports.DESCRIPTION = exports.DEFINITIONS = exports.DEFINITION = exports.CONTEXT = exports.CONSTANT = exports.CLOSE_EXPRESSION = exports.BOOLEAN_DEFINITION_PROPERTIES = exports.BOOLEAN_DEFINITION = exports.BOOLEAN = exports.ANY = void 0;
exports.ANY = "any";
exports.BOOLEAN = "boolean";
exports.BOOLEAN_DEFINITION = "boolean-definition";
exports.BOOLEAN_DEFINITION_PROPERTIES = "boolean-definition-properties";
exports.CLOSE_EXPRESSION = "}}";
exports.CONSTANT = "constant";
exports.CONTEXT = "context";
exports.DEFINITION = "definition";
exports.DEFINITIONS = "definitions";
exports.DESCRIPTION = "description";
exports.IGNORE_CASE = "ignore-case";
exports.INSERT_DIRECTIVE = "insert";
exports.ITEM_TYPE = "item-type";
exports.LOOSE_KEY_TYPE = "loose-key-type";
exports.LOOSE_VALUE_TYPE = "loose-value-type";
exports.MAX_CONSTANT = "MAX";
exports.MAPPING = "mapping";
exports.MAPPING_DEFINITION = "mapping-definition";
exports.MAPPING_DEFINITION_PROPERTIES = "mapping-definition-properties";
exports.MAPPING_PROPERTY_VALUE = "mapping-property-value";
exports.NON_EMPTY_STRING = "non-empty-string";
exports.NULL = "null";
exports.NULL_DEFINITION = "null-definition";
exports.NULL_DEFINITION_PROPERTIES = "null-definition-properties";
exports.NUMBER = "number";
exports.NUMBER_DEFINITION = "number-definition";
exports.NUMBER_DEFINITION_PROPERTIES = "number-definition-properties";
exports.ONE_OF = "one-of";
exports.ONE_OF_DEFINITION = "one-of-definition";
exports.OPEN_EXPRESSION = "${{";
exports.PROPERTY_VALUE = "property-value";
exports.PROPERTIES = "properties";
exports.REQUIRED = "required";
exports.REQUIRE_NON_EMPTY = "require-non-empty";
exports.SCALAR = "scalar";
exports.SEQUENCE = "sequence";
exports.SEQUENCE_DEFINITION = "sequence-definition";
exports.SEQUENCE_DEFINITION_PROPERTIES = "sequence-definition-properties";
exports.TYPE = "type";
exports.SEQUENCE_OF_NON_EMPTY_STRING = "sequence-of-non-empty-string";
exports.STRING = "string";
exports.STRING_DEFINITION = "string-definition";
exports.STRING_DEFINITION_PROPERTIES = "string-definition-properties";
exports.STRUCTURE = "structure";
exports.TEMPLATE_SCHEMA = "template-schema";
exports.VERSION = "version";
//# sourceMappingURL=template-constants.js.map

/***/ }),

/***/ 4869:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TemplateValidationError = exports.TemplateValidationErrors = exports.TemplateContext = void 0;
/**
 * Context object that is flowed through while loading and evaluating object templates
 */
class TemplateContext {
    constructor(errors, memory, schema, trace) {
        this._fileIds = {};
        this._fileNames = [];
        /**
         * Available functions within expression contexts
         */
        this.expressionFunctions = [];
        /**
         * Available values within expression contexts
         */
        this.expressionNamedContexts = [];
        this.state = {};
        this.errors = errors;
        this.memory = memory;
        this.schema = schema;
        this.trace = trace;
    }
    error(tokenOrFileId, err) {
        const token = tokenOrFileId;
        const prefix = this.getErrorPrefix(token?.file ?? tokenOrFileId, token?.line, token?.col);
        let message = err?.message ?? `${err}`;
        if (prefix) {
            message = `${prefix} ${message}`;
        }
        this.errors.addFromMessage(message);
        this.trace.error(message);
    }
    /**
     * Gets or adds the file ID
     */
    getFileId(file) {
        const key = file.toUpperCase();
        let id = this._fileIds[key];
        if (id === undefined) {
            id = this._fileNames.length + 1;
            this._fileIds[key] = id;
            this._fileNames.push(file);
            this.memory.addString(file);
        }
        return id;
    }
    /**
     * Looks up a file name by ID. Returns undefined if not found.
     */
    getFileName(fileId) {
        return this._fileNames.length >= fileId
            ? this._fileNames[fileId - 1]
            : undefined;
    }
    /**
     * Gets a copy of the file table
     */
    getFileTable() {
        return this._fileNames.slice();
    }
    getErrorPrefix(fileId, line, column) {
        const fileName = fileId !== undefined ? this.getFileName(fileId) : undefined;
        if (fileName) {
            if (line !== undefined && column !== undefined) {
                return `${fileName} (Line: ${line}, Col: ${column})`;
            }
            else {
                return fileName;
            }
        }
        else if (line !== undefined && column !== undefined) {
            return `(Line: ${line}, Col: ${column})`;
        }
        else {
            return "";
        }
    }
}
exports.TemplateContext = TemplateContext;
/**
 * Provides information about errors which occurred during validation
 */
class TemplateValidationErrors {
    constructor(maxErrors, maxMessageLength) {
        this._errors = [];
        this._maxErrors = maxErrors ?? 0;
        this._maxMessageLength = maxMessageLength ?? 0;
    }
    get count() {
        return this._errors.length;
    }
    addFromMessage(message) {
        this.add(new TemplateValidationError(message));
    }
    addFromError(err, messagePrefix) {
        let message = err?.message || `${err}`;
        if (messagePrefix) {
            message = `${messagePrefix} ${message}`;
        }
        this.add(new TemplateValidationError(message));
    }
    add(err) {
        const errs = Object.prototype.hasOwnProperty.call(err, "length")
            ? err
            : [err];
        for (let e of errs) {
            // Check max errors
            if (this._maxErrors <= 0 || this._errors.length < this._maxErrors) {
                // Check max message length
                if (this._maxMessageLength > 0 &&
                    e.message.length > this._maxMessageLength) {
                    e = new TemplateValidationError(e.message.substr(0, this._maxMessageLength) + "[...]", e.code);
                }
                this._errors.push(e);
            }
        }
    }
    /**
     * Throws if any errors
     * @param prefix The error message prefix
     */
    check(prefix) {
        if (this._errors.length <= 0) {
            return;
        }
        if (!prefix) {
            prefix = "The template is not valid.";
        }
        throw new Error(`${prefix} ${this._errors.map((x) => x.message).join(",")}`);
    }
    clear() {
        this._errors = [];
    }
    getErrors() {
        return this._errors.slice();
    }
}
exports.TemplateValidationErrors = TemplateValidationErrors;
/**
 * Provides information about an error which occurred during validation
 */
class TemplateValidationError {
    constructor(message, code) {
        this.message = message;
        this.code = code;
    }
}
exports.TemplateValidationError = TemplateValidationError;
//# sourceMappingURL=template-context.js.map

/***/ }),

/***/ 3431:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TemplateMemory = void 0;
const nodes_1 = __nccwpck_require__(9248);
const tokens_1 = __nccwpck_require__(5457);
/**
 * Tracks characteristics about the current memory usage (CPU, stack, size)
 */
class TemplateMemory {
    constructor(maxDepth, maxBytes) {
        this._currentDepth = 0;
        this._memoryCounter = new nodes_1.MemoryCounter(undefined, maxBytes);
        this.maxDepth = maxDepth;
        this.maxBytes = maxBytes;
    }
    get currentBytes() {
        return this._memoryCounter.currentBytes;
    }
    addAmount(bytes) {
        this._memoryCounter.addAmount(bytes);
    }
    addString(value) {
        this._memoryCounter.addString(value);
    }
    addToken(value, traverse) {
        this._memoryCounter.addAmount(TemplateMemory.calculateTokenBytes(value, traverse));
    }
    subtractAmount(bytes) {
        this._memoryCounter.subtractAmount(bytes);
    }
    subtractToken(value, traverse) {
        this._memoryCounter.subtractAmount(TemplateMemory.calculateTokenBytes(value, traverse));
    }
    incrementDepth() {
        if (this._currentDepth + 1 > this.maxDepth) {
            throw new Error("Maximum object depth exceeded");
        }
        this._currentDepth++;
    }
    decrementDepth() {
        if (this._currentDepth === 0) {
            throw new Error("Depth may not be decremented below zero");
        }
        this._currentDepth--;
    }
    static calculateTokenBytes(value, traverse) {
        let result = 0;
        for (const item of tokens_1.TemplateToken.traverse(value, traverse)) {
            // This measurement doesn't have to be perfect
            // https://codeblog.jonskeet.uk/2011/04/05/of-memory-and-strings/
            switch (item.templateTokenType) {
                case tokens_1.NULL_TYPE:
                case tokens_1.BOOLEAN_TYPE:
                case tokens_1.NUMBER_TYPE:
                    result += nodes_1.MemoryCounter.MIN_OBJECT_SIZE;
                    break;
                case tokens_1.STRING_TYPE: {
                    const stringToken = item;
                    result +=
                        nodes_1.MemoryCounter.MIN_OBJECT_SIZE +
                            nodes_1.MemoryCounter.calculateStringBytes(stringToken.value);
                    break;
                }
                case tokens_1.SEQUENCE_TYPE:
                case tokens_1.MAPPING_TYPE:
                case tokens_1.INSERT_EXPRESSION_TYPE:
                    // Min object size is good enough. Allows for base + a few fields.
                    result += nodes_1.MemoryCounter.MIN_OBJECT_SIZE;
                    break;
                case tokens_1.BASIC_EXPRESSION_TYPE: {
                    const basicExpression = item;
                    result +=
                        nodes_1.MemoryCounter.MIN_OBJECT_SIZE +
                            nodes_1.MemoryCounter.calculateStringBytes(basicExpression.expression);
                    break;
                }
                default:
                    throw new Error(`Unexpected template type '${item.templateTokenType}`);
            }
        }
        return result;
    }
}
exports.TemplateMemory = TemplateMemory;
//# sourceMappingURL=template-memory.js.map

/***/ }),

/***/ 6084:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// template-reader *just* does schema validation
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.readTemplate = void 0;
const schema_1 = __nccwpck_require__(6029);
const template_constants_1 = __nccwpck_require__(4379);
const tokens_1 = __nccwpck_require__(5457);
const expressionUtility = __importStar(__nccwpck_require__(8170));
const WHITESPACE_PATTERN = /\s/;
function readTemplate(context, type, objectReader, fileId) {
    const reader = new TemplateReader(context, objectReader, fileId);
    const originalBytes = context.memory.currentBytes;
    let value;
    try {
        objectReader.validateStart();
        const definition = new DefinitionInfo(context.schema, type);
        value = reader.readValue(definition);
        objectReader.validateEnd();
    }
    catch (err) {
        context.error(fileId, err);
    }
    return {
        value: value,
        bytes: context.memory.currentBytes - originalBytes,
    };
}
exports.readTemplate = readTemplate;
class TemplateReader {
    constructor(context, objectReader, fileId) {
        this._context = context;
        this._schema = context.schema;
        this._memory = context.memory;
        this._objectReader = objectReader;
        this._fileId = fileId;
    }
    readValue(definition) {
        // Scalar
        const literal = this._objectReader.allowLiteral();
        if (literal) {
            let scalar = this.parseScalar(literal, definition.allowedContext);
            scalar = this.validate(scalar, definition);
            this._memory.addToken(scalar, false);
            return scalar;
        }
        // Sequence
        const sequence = this._objectReader.allowSequenceStart();
        if (sequence) {
            this._memory.incrementDepth();
            this._memory.addToken(sequence, false);
            const sequenceDefinition = definition.getDefinitionsOfType(schema_1.DefinitionType.Sequence)[0];
            // Legal
            if (sequenceDefinition) {
                const itemDefinition = new DefinitionInfo(definition, sequenceDefinition.itemType);
                // Add each item
                while (!this._objectReader.allowSequenceEnd()) {
                    const item = this.readValue(itemDefinition);
                    sequence.add(item);
                }
            }
            // Illegal
            else {
                // Error
                this._context.error(sequence, "A sequence was not expected");
                // Skip each item
                while (!this._objectReader.allowSequenceEnd()) {
                    this.skipValue();
                }
            }
            this._memory.decrementDepth();
            return sequence;
        }
        // Mapping
        const mapping = this._objectReader.allowMappingStart();
        if (mapping) {
            this._memory.incrementDepth();
            this._memory.addToken(mapping, false);
            const mappingDefinitions = definition.getDefinitionsOfType(schema_1.DefinitionType.Mapping);
            // Legal
            if (mappingDefinitions.length > 0) {
                if (mappingDefinitions.length > 1 ||
                    Object.keys(mappingDefinitions[0].properties).length > 0 ||
                    !mappingDefinitions[0].looseKeyType) {
                    this.handleMappingWithWellKnownProperties(definition, mappingDefinitions, mapping);
                }
                else {
                    const keyDefinition = new DefinitionInfo(definition, mappingDefinitions[0].looseKeyType);
                    const valueDefinition = new DefinitionInfo(definition, mappingDefinitions[0].looseValueType);
                    this.handleMappingWithAllLooseProperties(definition, keyDefinition, valueDefinition, mapping);
                }
            }
            // Illegal
            else {
                this._context.error(mapping, "A mapping was not expected");
                while (this._objectReader.allowMappingEnd()) {
                    this.skipValue();
                    this.skipValue();
                }
            }
            this._memory.decrementDepth();
            return mapping;
        }
        throw new Error("Expected a scalar value, a sequence, or a mapping");
    }
    handleMappingWithWellKnownProperties(definition, mappingDefinitions, mapping) {
        // Check if loose properties are allowed
        let looseKeyType;
        let looseValueType;
        let looseKeyDefinition;
        let looseValueDefinition;
        if (mappingDefinitions[0].looseKeyType) {
            looseKeyType = mappingDefinitions[0].looseKeyType;
            looseValueType = mappingDefinitions[0].looseValueType;
        }
        const upperKeys = {};
        let hasExpressionKey = false;
        let rawLiteral;
        while ((rawLiteral = this._objectReader.allowLiteral())) {
            const nextKeyScalar = this.parseScalar(rawLiteral, definition.allowedContext);
            // Expression
            if (nextKeyScalar.isExpression) {
                hasExpressionKey = true;
                // Legal
                if (definition.allowedContext.length > 0) {
                    this._memory.addToken(nextKeyScalar, false);
                    const anyDefinition = new DefinitionInfo(definition, template_constants_1.ANY);
                    mapping.add(nextKeyScalar, this.readValue(anyDefinition));
                }
                // Illegal
                else {
                    this._context.error(nextKeyScalar, "A template expression is not allowed in this context");
                    this.skipValue();
                }
                continue;
            }
            // Convert to StringToken if required
            const nextKey = nextKeyScalar.templateTokenType === tokens_1.STRING_TYPE
                ? nextKeyScalar
                : new tokens_1.StringToken(nextKeyScalar.file, nextKeyScalar.line, nextKeyScalar.col, nextKeyScalar.toString());
            // Duplicate
            const upperKey = nextKey.value.toUpperCase();
            if (upperKeys[upperKey]) {
                this._context.error(nextKey, `'${nextKey.value}' is already defined`);
                this.skipValue();
                continue;
            }
            upperKeys[upperKey] = true;
            // Well known
            const nextValueType = this._schema.matchPropertyAndFilter(mappingDefinitions, nextKey.value);
            if (nextValueType) {
                this._memory.addToken(nextKey, false);
                const nextValueDefinition = new DefinitionInfo(definition, nextValueType);
                const nextValue = this.readValue(nextValueDefinition);
                mapping.add(nextKey, nextValue);
                continue;
            }
            // Loose
            if (looseKeyType) {
                if (!looseKeyDefinition) {
                    looseKeyDefinition = new DefinitionInfo(definition, looseKeyType);
                    looseValueDefinition = new DefinitionInfo(definition, looseValueType);
                }
                this.validate(nextKey, looseKeyDefinition);
                this._memory.addToken(nextKey, false);
                const nextValue = this.readValue(looseValueDefinition);
                mapping.add(nextKey, nextValue);
                continue;
            }
            // Error
            this._context.error(nextKey, `Unexpected value '${nextKey.value}'`);
            this.skipValue();
        }
        // Unable to filter to one definition
        if (mappingDefinitions.length > 1) {
            const hitCount = {};
            for (const mappingDefinition of mappingDefinitions) {
                for (const key of Object.keys(mappingDefinition.properties)) {
                    hitCount[key] = (hitCount[key] ?? 0) + 1;
                }
            }
            const nonDuplicates = [];
            for (const key of Object.keys(hitCount)) {
                if (hitCount[key] === 1) {
                    nonDuplicates.push(key);
                }
            }
            this._context.error(mapping, `There's not enough info to determine what you meant. Add one of these properties: ${nonDuplicates
                .sort()
                .join(", ")}`);
        }
        // Check required properties
        else if (mappingDefinitions.length === 1 && !hasExpressionKey) {
            for (const propertyName of Object.keys(mappingDefinitions[0].properties)) {
                const propertyValue = mappingDefinitions[0].properties[propertyName];
                if (propertyValue.required && !upperKeys[propertyName.toUpperCase()]) {
                    this._context.error(mapping, `Required property is missing: ${propertyName}`);
                }
            }
        }
        this.expectMappingEnd();
    }
    handleMappingWithAllLooseProperties(mappingDefinition, keyDefinition, valueDefinition, mapping) {
        let nextValue;
        const upperKeys = {};
        let rawLiteral;
        while ((rawLiteral = this._objectReader.allowLiteral())) {
            const nextKeyScalar = this.parseScalar(rawLiteral, mappingDefinition.allowedContext);
            // Expression
            if (nextKeyScalar.isExpression) {
                // Legal
                if (mappingDefinition.allowedContext.length > 0) {
                    this._memory.addToken(nextKeyScalar, false);
                    nextValue = this.readValue(valueDefinition);
                    mapping.add(nextKeyScalar, nextValue);
                }
                // Illegal
                else {
                    this._context.error(nextKeyScalar, "A template expression is not allowed in this context");
                    this.skipValue();
                }
                continue;
            }
            // Convert to StringToken if required
            const nextKey = nextKeyScalar.templateTokenType === tokens_1.STRING_TYPE
                ? nextKeyScalar
                : new tokens_1.StringToken(nextKeyScalar.file, nextKeyScalar.line, nextKeyScalar.col, nextKeyScalar.toString());
            // Duplicate
            const upperKey = nextKey.value.toUpperCase();
            if (upperKeys[upperKey]) {
                this._context.error(nextKey, `'${nextKey.value}' is already defined`);
                this.skipValue();
                continue;
            }
            upperKeys[upperKey] = true;
            // Validate
            this.validate(nextKey, keyDefinition);
            this._memory.addToken(nextKey, false);
            // Add the pair
            nextValue = this.readValue(valueDefinition);
            mapping.add(nextKey, nextValue);
        }
        this.expectMappingEnd();
    }
    expectMappingEnd() {
        if (!this._objectReader.allowMappingEnd()) {
            throw new Error("Expected mapping end"); // Should never happen
        }
    }
    skipValue() {
        // Scalar
        if (this._objectReader.allowLiteral()) {
            // Intentionally empty
        }
        // Sequence
        else if (this._objectReader.allowSequenceStart()) {
            this._memory.incrementDepth();
            while (!this._objectReader.allowSequenceEnd()) {
                this.skipValue();
            }
            this._memory.decrementDepth();
        }
        // Mapping
        else if (this._objectReader.allowMappingStart()) {
            this._memory.incrementDepth();
            while (!this._objectReader.allowMappingEnd()) {
                this.skipValue();
                this.skipValue();
            }
            this._memory.decrementDepth();
        }
        // Unexpected
        else {
            throw new Error("Expected a scalar value, a sequence, or a mapping");
        }
    }
    validate(scalar, definition) {
        switch (scalar.templateTokenType) {
            case tokens_1.NULL_TYPE:
            case tokens_1.BOOLEAN_TYPE:
            case tokens_1.NUMBER_TYPE:
            case tokens_1.STRING_TYPE: {
                const literal = scalar;
                // Legal
                const scalarDefinitions = definition.getScalarDefinitions();
                if (scalarDefinitions.some((x) => x.isMatch(literal))) {
                    return scalar;
                }
                // Not a string, convert
                if (literal.templateTokenType !== tokens_1.STRING_TYPE) {
                    const stringLiteral = new tokens_1.StringToken(literal.file, literal.line, literal.col, literal.toString());
                    // Legal
                    if (scalarDefinitions.some((x) => x.isMatch(stringLiteral))) {
                        return stringLiteral;
                    }
                }
                // Illegal
                this._context.error(literal, `Unexpected value '${literal.toString()}'`);
                return scalar;
            }
            case tokens_1.BASIC_EXPRESSION_TYPE:
                // Illegal
                if (definition.allowedContext.length === 0) {
                    this._context.error(scalar, "A template expression is not allowed in this context");
                }
                return scalar;
            default:
                this._context.error(scalar, `Unexpected value '${scalar.toString()}'`);
                return scalar;
        }
    }
    parseScalar(token, allowedContext) {
        // Not a string
        if (token.templateTokenType !== tokens_1.STRING_TYPE) {
            return token;
        }
        // Check if the value is definitely a literal
        const raw = token.toString();
        let startExpression = raw.indexOf(template_constants_1.OPEN_EXPRESSION);
        if (startExpression < 0) {
            // Doesn't contain "${{"
            return token;
        }
        // Break the value into segments of LiteralToken and ExpressionToken
        const segments = [];
        let i = 0;
        while (i < raw.length) {
            // An expression starts here
            if (i === startExpression) {
                // Find the end of the expression - i.e. "}}"
                startExpression = i;
                let endExpression = -1;
                let inString = false;
                for (i += template_constants_1.OPEN_EXPRESSION.length; i < raw.length; i++) {
                    if (raw[i] === "'") {
                        inString = !inString; // Note, this handles escaped single quotes gracefully. E.x. 'foo''bar'
                    }
                    else if (!inString && raw[i] === "}" && raw[i - 1] === "}") {
                        endExpression = i;
                        i++;
                        break;
                    }
                }
                // Check if not closed
                if (endExpression < startExpression) {
                    this._context.error(token, "The expression is not closed. An unescaped ${{ sequence was found, but the closing }} sequence was not found.");
                    return token;
                }
                // Parse the expression
                const rawExpression = raw.substr(startExpression + template_constants_1.OPEN_EXPRESSION.length, endExpression -
                    startExpression +
                    1 -
                    template_constants_1.OPEN_EXPRESSION.length -
                    template_constants_1.CLOSE_EXPRESSION.length);
                const parseExpressionResult = this.parseExpression(token.line, token.col, rawExpression, allowedContext);
                // Check for error
                if (parseExpressionResult.error) {
                    this._context.error(token, parseExpressionResult.error);
                    return token;
                }
                // Check if a directive was used when not allowed
                const expression = parseExpressionResult.expression;
                if (expression.directive && (startExpression !== 0 || i < raw.length)) {
                    this._context.error(token, `The directive '${expression.directive}' is not allowed in this context. Directives are not supported for expressions that are embedded within a string. Directives are only supported when the entire value is an expression.`);
                    return token;
                }
                // Add the segment
                segments.push(expression);
                // Look for the next expression
                startExpression = raw.indexOf(template_constants_1.OPEN_EXPRESSION, i);
            }
            // The next expression is further ahead
            else if (i < startExpression) {
                // Append the segment
                this.addString(segments, token.line, token.col, raw.substr(i, startExpression - i));
                // Adjust the position
                i = startExpression;
            }
            // No remaining expressions
            else {
                this.addString(segments, token.line, token.col, raw.substr(i));
                break;
            }
        }
        // Check if can convert to a literal
        // For example, the escaped expression: ${{ '{{ this is a literal }}' }}
        if (segments.length === 1 &&
            segments[0].templateTokenType === tokens_1.BASIC_EXPRESSION_TYPE) {
            const basicExpression = segments[0];
            const str = this.getExpressionString(basicExpression.expression);
            if (str !== undefined) {
                return new tokens_1.StringToken(this._fileId, token.line, token.col, str);
            }
        }
        // Check if only one segment
        if (segments.length === 1) {
            return segments[0];
        }
        // Build the new expression, using the format function
        const format = [];
        const args = [];
        let argIndex = 0;
        for (const segment of segments) {
            if (segment.templateTokenType === tokens_1.STRING_TYPE) {
                const literal = segment;
                const text = expressionUtility
                    .stringEscape(literal.value) // Escape quotes
                    .replace(/\{/g, "{{") // Escape braces
                    .replace(/\}/g, "}}");
                format.push(text);
            }
            else {
                format.push(`{${argIndex}}`); // Append format arg
                argIndex++;
                const expression = segment;
                args.push(", ");
                args.push(expression.expression);
            }
        }
        return new tokens_1.BasicExpressionToken(this._fileId, token.line, token.col, `format('${format.join("")}'${args.join("")})`);
    }
    parseExpression(line, column, value, allowedContext) {
        const trimmed = value.trim();
        // Check if the value is empty
        if (!trimmed) {
            return {
                error: new Error("An expression was expected"),
            };
        }
        // Try to find a matching directive
        const matchDirectiveResult = this.matchDirective(trimmed, template_constants_1.INSERT_DIRECTIVE, 0);
        if (matchDirectiveResult.isMatch) {
            return {
                expression: new tokens_1.InsertExpressionToken(this._fileId, line, column),
            };
        }
        else if (matchDirectiveResult.error) {
            return {
                error: matchDirectiveResult.error,
            };
        }
        // Check if valid expression
        try {
            tokens_1.ExpressionToken.validateExpression(trimmed, allowedContext);
        }
        catch (err) {
            return {
                error: err,
            };
        }
        // Return the expression
        return {
            expression: new tokens_1.BasicExpressionToken(this._fileId, line, column, trimmed),
            error: undefined,
        };
    }
    addString(segments, line, column, value) {
        // If the last segment was a LiteralToken, then append to the last segment
        if (segments.length > 0 &&
            segments[segments.length - 1].templateTokenType === tokens_1.STRING_TYPE) {
            const lastSegment = segments[segments.length - 1];
            segments[segments.length - 1] = new tokens_1.StringToken(this._fileId, line, column, `${lastSegment.value}${value}`);
        }
        // Otherwise add a new LiteralToken
        else {
            segments.push(new tokens_1.StringToken(this._fileId, line, column, value));
        }
    }
    matchDirective(trimmed, directive, expectedParameters) {
        const parameters = [];
        if (trimmed.startsWith(directive) &&
            (trimmed.length === directive.length ||
                WHITESPACE_PATTERN.test(trimmed[directive.length]))) {
            let startIndex = directive.length;
            let inString = false;
            let parens = 0;
            for (let i = startIndex; i < trimmed.length; i++) {
                const c = trimmed[i];
                if (WHITESPACE_PATTERN.test(c) && !inString && parens == 0) {
                    if (startIndex < 1) {
                        parameters.push(trimmed.substr(startIndex, i - startIndex));
                    }
                    startIndex = i + 1;
                }
                else if (c === "'") {
                    inString = !inString;
                }
                else if (c === "(" && !inString) {
                    parens++;
                }
                else if (c === ")" && !inString) {
                    parens--;
                }
            }
            if (startIndex < trimmed.length) {
                parameters.push(trimmed.substr(startIndex));
            }
            if (expectedParameters != parameters.length) {
                return {
                    isMatch: false,
                    parameters: [],
                    error: new Error(`Exactly ${expectedParameters} parameter(s) were expected following the directive '${directive}'. Actual parameter count: ${parameters.length}`),
                };
            }
            return {
                isMatch: true,
                parameters: parameters,
            };
        }
        return {
            isMatch: false,
            parameters: parameters,
        };
    }
    getExpressionString(trimmed) {
        const result = [];
        let inString = false;
        for (let i = 0; i < trimmed.length; i++) {
            const c = trimmed[i];
            if (c === "'") {
                inString = !inString;
                if (inString && i !== 0) {
                    result.push(c);
                }
            }
            else if (!inString) {
                return undefined;
            }
            else {
                result.push(c);
            }
        }
        return result.join("");
    }
}
class DefinitionInfo {
    constructor(schemaOrParent, name) {
        this.isDefinitionInfo = true;
        const parent = schemaOrParent?.isDefinitionInfo === true
            ? schemaOrParent
            : undefined;
        this._schema =
            parent === undefined ? schemaOrParent : parent._schema;
        // Lookup the definition
        this.definition = this._schema.getDefinition(name);
        // Record allowed context
        if (this.definition.readerContext.length > 0) {
            this.allowedContext = [];
            // Copy parent allowed context
            const upperSeen = {};
            for (const context of parent?.allowedContext ?? []) {
                this.allowedContext.push(context);
                upperSeen[context.toUpperCase()] = true;
            }
            // Append context if unseen
            for (const context of this.definition.readerContext) {
                const upper = context.toUpperCase();
                if (!upperSeen[upper]) {
                    this.allowedContext.push(context);
                    upperSeen[upper] = true;
                }
            }
        }
        else {
            this.allowedContext = parent?.allowedContext ?? [];
        }
    }
    getScalarDefinitions() {
        return this._schema.getScalarDefinitions(this.definition);
    }
    getDefinitionsOfType(type) {
        return this._schema.getDefinitionsOfType(this.definition, type);
    }
}
//# sourceMappingURL=template-reader.js.map

/***/ }),

/***/ 5457:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeyValuePair = exports.EvaluateTokenResult = exports.InsertExpressionToken = exports.BasicExpressionToken = exports.MappingToken = exports.SequenceToken = exports.ExpressionToken = exports.StringToken = exports.NumberToken = exports.BooleanToken = exports.NullToken = exports.LiteralToken = exports.ScalarToken = exports.TemplateToken = exports.NULL_TYPE = exports.NUMBER_TYPE = exports.BOOLEAN_TYPE = exports.INSERT_EXPRESSION_TYPE = exports.BASIC_EXPRESSION_TYPE = exports.MAPPING_TYPE = exports.SEQUENCE_TYPE = exports.STRING_TYPE = void 0;
const parser_1 = __nccwpck_require__(314);
const nodes_1 = __nccwpck_require__(9248);
const format_1 = __nccwpck_require__(1406);
const template_constants_1 = __nccwpck_require__(4379);
const expression_constants_1 = __nccwpck_require__(9575);
exports.STRING_TYPE = 0;
exports.SEQUENCE_TYPE = 1;
exports.MAPPING_TYPE = 2;
exports.BASIC_EXPRESSION_TYPE = 3;
exports.INSERT_EXPRESSION_TYPE = 4;
exports.BOOLEAN_TYPE = 5;
exports.NUMBER_TYPE = 6;
exports.NULL_TYPE = 7;
class TemplateToken {
    /**
     * Base class for all template tokens
     */
    constructor(type, file, line, col) {
        this.type = type;
        this.file = file;
        this.line = line;
        this.col = col;
    }
    get templateTokenType() {
        return this.type;
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertNull(objectDescription) {
        if (this.type === exports.NULL_TYPE) {
            return this;
        }
        throw new Error(`Unexpected type '${this.type}' encountered while reading '${objectDescription}'. The type '${exports.NULL_TYPE}' was expected.`);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertBoolean(objectDescription) {
        if (this.type === exports.BOOLEAN_TYPE) {
            return this;
        }
        throw new Error(`Unexpected type '${this.type}' encountered while reading '${objectDescription}'. The type '${exports.BOOLEAN_TYPE}' was expected.`);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertNumber(objectDescription) {
        if (this.type === exports.NUMBER_TYPE) {
            return this;
        }
        throw new Error(`Unexpected type '${this.type}' encountered while reading '${objectDescription}'. The type '${exports.NUMBER_TYPE}' was expected.`);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertString(objectDescription) {
        if (this.type === exports.STRING_TYPE) {
            return this;
        }
        throw new Error(`Unexpected type '${this.type}' encountered while reading '${objectDescription}'. The type '${exports.STRING_TYPE}' was expected.`);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertScalar(objectDescription) {
        if (this?.isScalar === true) {
            return this;
        }
        throw new Error(`Unexpected type '${this.type}' encountered while reading '${objectDescription}'. A scalar type was expected.`);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertSequence(objectDescription) {
        if (this.type === exports.SEQUENCE_TYPE) {
            return this;
        }
        throw new Error(`Unexpected type '${this.type}' encountered while reading '${objectDescription}'. The type '${exports.SEQUENCE_TYPE}' was expected.`);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertMapping(objectDescription) {
        if (this.type === exports.MAPPING_TYPE) {
            return this;
        }
        throw new Error(`Unexpected type '${this.type}' encountered while reading '${objectDescription}'. The type '${exports.MAPPING_TYPE}' was expected.`);
    }
    /**
     * Converts to TemplateToken from serialized Template that has already been JSON-parsed into regular JavaScript objects.
     */
    static fromDeserializedTemplateToken(object) {
        switch (typeof object) {
            case "boolean":
                return new BooleanToken(undefined, undefined, undefined, object);
            case "number":
                return new NumberToken(undefined, undefined, undefined, object);
            case "string":
                return new StringToken(undefined, undefined, undefined, object);
            case "object": {
                if (object === null) {
                    return new NullToken(undefined, undefined, undefined);
                }
                const type = object.type ?? exports.STRING_TYPE;
                const file = object.file;
                const line = object.line;
                const col = object.col;
                switch (type) {
                    case exports.NULL_TYPE:
                        return new NullToken(file, line, col);
                    case exports.BOOLEAN_TYPE: {
                        return new BooleanToken(file, line, col, object.bool ?? false);
                    }
                    case exports.NUMBER_TYPE: {
                        return new NumberToken(file, line, col, object.num ?? 0);
                    }
                    case exports.STRING_TYPE: {
                        return new StringToken(file, line, col, object.lit ?? "");
                    }
                    case exports.SEQUENCE_TYPE: {
                        const sequence = new SequenceToken(file, line, col);
                        for (const item of object.seq ?? []) {
                            sequence.add(TemplateToken.fromDeserializedTemplateToken(item));
                        }
                        return sequence;
                    }
                    case exports.MAPPING_TYPE: {
                        const mapping = new MappingToken(file, line, col);
                        for (const pair of object.map ?? []) {
                            mapping.add(TemplateToken.fromDeserializedTemplateToken(pair.key), TemplateToken.fromDeserializedTemplateToken(pair.value));
                        }
                        return mapping;
                    }
                    case exports.BASIC_EXPRESSION_TYPE:
                        return new BasicExpressionToken(file, line, col, object.expr ?? "");
                    case exports.INSERT_EXPRESSION_TYPE:
                        return new InsertExpressionToken(file, line, col);
                    default:
                        throw new Error(`Unexpected type '${type}' when converting deserialized template token to template token`);
                }
            }
            default:
                throw new Error(`Unexpected type '${typeof object}' when converting deserialized template token to template token`);
        }
    }
    /**
     * Returns all tokens (depth first)
     * @param value The object to travese
     * @param omitKeys Whether to omit mapping keys
     */
    static *traverse(value, omitKeys) {
        yield value;
        switch (value.templateTokenType) {
            case exports.SEQUENCE_TYPE:
            case exports.MAPPING_TYPE: {
                let state = new TraversalState(undefined, value);
                while (state) {
                    if (state.moveNext(omitKeys ?? false)) {
                        value = state.current;
                        yield value;
                        switch (value.type) {
                            case exports.SEQUENCE_TYPE:
                            case exports.MAPPING_TYPE:
                                state = new TraversalState(state, value);
                                break;
                        }
                    }
                    else {
                        state = state.parent;
                    }
                }
                break;
            }
        }
    }
}
exports.TemplateToken = TemplateToken;
/**
 * Base class for everything that is not a mapping or sequence
 */
class ScalarToken extends TemplateToken {
    constructor(type, file, line, col) {
        super(type, file, line, col);
    }
    get isScalar() {
        return true;
    }
    static trimDisplayString(displayString) {
        let firstLine = displayString.trimStart();
        const firstNewLine = firstLine.indexOf("\n");
        const firstCarriageReturn = firstLine.indexOf("\r");
        if (firstNewLine >= 0 || firstCarriageReturn >= 0) {
            firstLine = firstLine.substr(0, Math.min(firstNewLine >= 0 ? firstNewLine : Number.MAX_VALUE, firstCarriageReturn >= 0 ? firstCarriageReturn : Number.MAX_VALUE));
        }
        return firstLine;
    }
}
exports.ScalarToken = ScalarToken;
class LiteralToken extends ScalarToken {
    constructor(type, file, line, col) {
        super(type, file, line, col);
    }
    get isLiteral() {
        return true;
    }
    get isExpression() {
        return false;
    }
    toDisplayString() {
        return ScalarToken.trimDisplayString(this.toString());
    }
    /**
     * Throws a good debug message when an unexpected literal value is encountered
     */
    assertUnexpectedValue(objectDescription) {
        throw new Error(`Error while reading '${objectDescription}'. Unexpected value '${this.toString()}'`);
    }
}
exports.LiteralToken = LiteralToken;
class NullToken extends LiteralToken {
    constructor(file, line, col) {
        super(exports.NULL_TYPE, file, line, col);
    }
    get compatibleValueKind() {
        return nodes_1.ValueKind.Null;
    }
    clone(omitSource) {
        return omitSource
            ? new NullToken(undefined, undefined, undefined)
            : new NullToken(this.file, this.line, this.col);
    }
    toString() {
        return "";
    }
}
exports.NullToken = NullToken;
class BooleanToken extends LiteralToken {
    constructor(file, line, col, value) {
        super(exports.BOOLEAN_TYPE, file, line, col);
        this.bool = value;
    }
    get value() {
        return this.bool;
    }
    get compatibleValueKind() {
        return nodes_1.ValueKind.Boolean;
    }
    clone(omitSource) {
        return omitSource
            ? new BooleanToken(undefined, undefined, undefined, this.bool)
            : new BooleanToken(this.file, this.line, this.col, this.bool);
    }
    toString() {
        return this.bool ? "true" : "false";
    }
    /**
     * Required for interface BooleanCompatible
     */
    getBoolean() {
        return this.bool;
    }
}
exports.BooleanToken = BooleanToken;
class NumberToken extends LiteralToken {
    constructor(file, line, col, value) {
        super(exports.NUMBER_TYPE, file, line, col);
        this.num = value;
    }
    get value() {
        return this.num;
    }
    get compatibleValueKind() {
        return nodes_1.ValueKind.Number;
    }
    clone(omitSource) {
        return omitSource
            ? new NumberToken(undefined, undefined, undefined, this.num)
            : new NumberToken(this.file, this.line, this.col, this.num);
    }
    toString() {
        return `${this.num}`;
    }
    /**
     * Required for interface NumberCompatible
     */
    getNumber() {
        return this.num;
    }
}
exports.NumberToken = NumberToken;
class StringToken extends LiteralToken {
    constructor(file, line, col, value) {
        super(exports.STRING_TYPE, file, line, col);
        this.lit = value;
    }
    get value() {
        return this.lit;
    }
    get compatibleValueKind() {
        return nodes_1.ValueKind.String;
    }
    clone(omitSource) {
        return omitSource
            ? new StringToken(undefined, undefined, undefined, this.lit)
            : new StringToken(this.file, this.line, this.col, this.lit);
    }
    toString() {
        return this.lit;
    }
    /**
     * Required for interface StringCompatible
     */
    getString() {
        return this.lit;
    }
}
exports.StringToken = StringToken;
class ExpressionToken extends ScalarToken {
    constructor(type, file, line, col, directive) {
        super(type, file, line, col);
        this.directive = directive;
    }
    get isLiteral() {
        return false;
    }
    get isExpression() {
        return true;
    }
    static validateExpression(expression, allowedContext) {
        // Create dummy named contexts and functions
        const namedContexts = [];
        const functions = [];
        if (allowedContext.length > 0) {
            for (const contextItem of allowedContext) {
                const match = contextItem.match(ExpressionToken.FUNCTION_REGEXP);
                if (match) {
                    const functionName = match[1];
                    const minParameters = Number.parseInt(match[2]);
                    const maxParametersRaw = match[3];
                    const maxParameters = maxParametersRaw === template_constants_1.MAX_CONSTANT
                        ? Number.MAX_SAFE_INTEGER
                        : Number.parseInt(maxParametersRaw);
                    functions.push({
                        name: functionName,
                        minParameters: minParameters,
                        maxParameters: maxParameters,
                        createNode: () => new DummyFunction(),
                    });
                }
                else {
                    namedContexts.push({
                        name: contextItem,
                        createNode: () => new nodes_1.SimpleNamedContextNode(undefined),
                    });
                }
            }
        }
        // Parse
        (0, parser_1.createExpressionTree)(expression, undefined, namedContexts, functions);
    }
}
exports.ExpressionToken = ExpressionToken;
ExpressionToken.FUNCTION_REGEXP = /^([a-zA-Z0-9_]+)\(([0-9]+),([0-9]+|MAX)\)$/;
class SequenceToken extends TemplateToken {
    constructor(file, line, col) {
        super(exports.SEQUENCE_TYPE, file, line, col);
        this.seq = [];
    }
    get count() {
        return this.seq.length;
    }
    get isScalar() {
        return false;
    }
    get isLiteral() {
        return false;
    }
    get isExpression() {
        return false;
    }
    /**
     * Required for interface ReadOnlyObjectCompatible
     */
    get compatibleValueKind() {
        return nodes_1.ValueKind.Array;
    }
    add(value) {
        this.seq.push(value);
    }
    get(index) {
        return this.seq[index];
    }
    clone(omitSource) {
        const result = omitSource
            ? new SequenceToken(undefined, undefined, undefined)
            : new SequenceToken(this.file, this.line, this.col);
        for (const item of this.seq) {
            result.add(item.clone(omitSource));
        }
        return result;
    }
    /**
     * Required for interface ReadOnlyObjectCompatible
     */
    getArrayLength() {
        return this.seq.length;
    }
    /**
     * Required for interface ReadOnlyObjectCompatible
     */
    getArrayItem(index) {
        return this.seq[index];
    }
}
exports.SequenceToken = SequenceToken;
class MappingToken extends TemplateToken {
    constructor(file, line, col) {
        super(exports.MAPPING_TYPE, file, line, col);
        this.map = [];
        this._getHiddenProperty = (propertyName, createDefaultValue) => {
            const func = this._getHiddenProperty;
            if (!Object.prototype.hasOwnProperty.call(func, propertyName)) {
                func[propertyName] = createDefaultValue();
            }
            return func[propertyName];
        };
        this._setHiddenProperty = (propertyName, value) => {
            const func = this._setHiddenProperty;
            func[propertyName] = value;
        };
    }
    get count() {
        return this.map.length;
    }
    get isScalar() {
        return false;
    }
    get isLiteral() {
        return false;
    }
    get isExpression() {
        return false;
    }
    /**
     * Required for interface ReadOnlyObjectCompatible
     */
    get compatibleValueKind() {
        return nodes_1.ValueKind.Object;
    }
    add(key, value) {
        this.map.push(new KeyValuePair(key, value));
        this.clearDictionary();
    }
    get(index) {
        return this.map[index];
    }
    remove(index) {
        this.map.splice(index, 1);
        this.clearDictionary();
    }
    clone(omitSource) {
        const result = omitSource
            ? new MappingToken(undefined, undefined, undefined)
            : new MappingToken(this.file, this.line, this.col);
        for (const item of this.map) {
            result.add(item.key.clone(omitSource), item.value.clone(omitSource));
        }
        return result;
    }
    /**
     * Required for interface ReadOnlyObjectCompatible
     */
    hasObjectKey(key) {
        this.initializeDictionary();
        const upperKey = key.toUpperCase();
        return Object.prototype.hasOwnProperty.call(this.getDictionaryIndexLookup(), upperKey);
    }
    /**
     * Required for interface ReadOnlyObjectCompatible
     */
    getObjectKeys() {
        this.initializeDictionary();
        return this.getDictionaryPairs().map((x) => x.key);
    }
    /**
     * Required for interface ReadOnlyObjectCompatible
     */
    getObjectKeyCount() {
        this.initializeDictionary();
        return this.getDictionaryPairs().length;
    }
    /**
     * Required for interface ReadOnlyObjectCompatible
     */
    getObjectValue(key) {
        this.initializeDictionary();
        const upperKey = key.toUpperCase();
        const index = this.getDictionaryIndexLookup()[upperKey];
        if (index === undefined) {
            return undefined;
        }
        else {
            return this.getDictionaryPairs()[index].value;
        }
    }
    /**
     * Clears the dictionary used for the expressions interface ReadOnlyObjectCompatible
     */
    clearDictionary() {
        this._setHiddenProperty("dictionaryPairs", []);
        this._setHiddenProperty("dictionaryIndexLookup", {});
    }
    /**
     * Gets the key value pairs used for the interface ReadOnlyObjectCompatible
     */
    getDictionaryPairs() {
        return this._getHiddenProperty("dictionaryPairs", () => {
            return [];
        });
    }
    /**
     * Gets the index lookup used for the interface ReadOnlyObjectCompatible
     */
    getDictionaryIndexLookup() {
        return this._getHiddenProperty("dictionaryIndexLookup", () => {
            return {};
        });
    }
    /**
     * Initializes the dictionary used for the expressions interface ReadOnlyObjectCompatible
     */
    initializeDictionary() {
        // Case insensitive dictionary already built?
        const pairs = this.getDictionaryPairs();
        if (pairs.length > 0) {
            return;
        }
        // Build a case insensitive dictionary
        const indexLookup = this.getDictionaryIndexLookup();
        for (const pair of this.map) {
            if (pair.key.templateTokenType === exports.STRING_TYPE) {
                const key = pair.key.value;
                const upperKey = key.toUpperCase();
                if (indexLookup[upperKey] === undefined) {
                    indexLookup[upperKey] = pairs.length;
                    pairs.push(new StringKeyValuePair(key, pair.value));
                }
            }
        }
    }
}
exports.MappingToken = MappingToken;
class BasicExpressionToken extends ExpressionToken {
    constructor(file, line, col, expression) {
        super(exports.BASIC_EXPRESSION_TYPE, file, line, col, undefined);
        this.expr = expression;
    }
    get expression() {
        return this.expr;
    }
    clone(omitSource) {
        return omitSource
            ? new BasicExpressionToken(undefined, undefined, undefined, this.expr)
            : new BasicExpressionToken(this.file, this.line, this.col, this.expr);
    }
    toString() {
        return `${template_constants_1.OPEN_EXPRESSION} ${this.expr} ${template_constants_1.CLOSE_EXPRESSION}`;
    }
    toDisplayString() {
        let displayString = "";
        const expressionNode = (0, parser_1.validateExpressionSyntax)(this.expr, undefined);
        if (expressionNode.nodeType === nodes_1.NodeType.Container &&
            expressionNode.name.toUpperCase() === "FORMAT") {
            // Make sure the first parameter is a literal string so we can format it
            const formatNode = expressionNode;
            if (formatNode.parameters.length > 1 &&
                formatNode.parameters[0].nodeType === nodes_1.NodeType.Literal &&
                formatNode.parameters[0].kind === nodes_1.ValueKind.String) {
                // Get the format args
                const formatArgs = formatNode.parameters
                    .slice(1)
                    .map((x) => BasicExpressionToken.convertToFormatArg(x));
                const memoryCounter = new nodes_1.MemoryCounter(undefined, 1048576); // 1mb
                try {
                    displayString = format_1.Format.format(memoryCounter, formatNode.parameters[0].value, formatArgs);
                }
                catch {
                    // Intentionally empty.
                    // If this operation fails, then revert to default display name.
                }
            }
        }
        return ScalarToken.trimDisplayString(displayString || this.toString());
    }
    evaluateStringToken(context) {
        const originalBytes = context.memory.currentBytes;
        let value;
        const tree = (0, parser_1.createExpressionTree)(this.expr, undefined, context.expressionNamedContexts, context.expressionFunctions);
        if (!tree) {
            throw new Error("Unexpected empty expression");
        }
        const options = new nodes_1.EvaluationOptions();
        options.maxMemory = context.memory.maxBytes;
        const result = tree.evaluateTree(context.trace, context, options);
        if (result.isPrimitive) {
            value = this.createStringToken(context, result.convertToString());
        }
        else {
            context.error(this, "Expected a string");
            value = this.createStringToken(context, this.expr);
        }
        return new EvaluateTokenResult(value, context.memory.currentBytes - originalBytes);
    }
    evaluateSequenceToken(context) {
        const originalBytes = context.memory.currentBytes;
        let value;
        const tree = (0, parser_1.createExpressionTree)(this.expr, undefined, context.expressionNamedContexts, context.expressionFunctions);
        if (!tree) {
            throw new Error("Unexpected empty expression");
        }
        const options = new nodes_1.EvaluationOptions();
        options.maxMemory = context.memory.maxBytes;
        const result = tree.evaluateTree(context.trace, context, options);
        value = this.convertToTemplateToken(context, result);
        if (value.templateTokenType !== exports.SEQUENCE_TYPE) {
            context.error(this, "Expected a sequence");
            value = this.createSequenceToken(context);
        }
        return new EvaluateTokenResult(value, context.memory.currentBytes - originalBytes);
    }
    evaluateMappingToken(context) {
        const originalBytes = context.memory.currentBytes;
        let value;
        const tree = (0, parser_1.createExpressionTree)(this.expr, undefined, context.expressionNamedContexts, context.expressionFunctions);
        if (!tree) {
            throw new Error("Unexpected empty expression");
        }
        const options = new nodes_1.EvaluationOptions();
        options.maxMemory = context.memory.maxBytes;
        const result = tree.evaluateTree(context.trace, context, options);
        value = this.convertToTemplateToken(context, result);
        if (value.templateTokenType !== exports.MAPPING_TYPE) {
            context.error(this, "Expected a mapping");
            value = this.createMappingToken(context);
        }
        return new EvaluateTokenResult(value, context.memory.currentBytes - originalBytes);
    }
    evaluateTemplateToken(context) {
        const originalBytes = context.memory.currentBytes;
        const tree = (0, parser_1.createExpressionTree)(this.expr, undefined, context.expressionNamedContexts, context.expressionFunctions);
        if (!tree) {
            throw new Error("Unexpected empty expression");
        }
        const options = new nodes_1.EvaluationOptions();
        options.maxMemory = context.memory.maxBytes;
        const result = tree.evaluateTree(context.trace, context, options);
        const value = this.convertToTemplateToken(context, result);
        return new EvaluateTokenResult(value, context.memory.currentBytes - originalBytes);
    }
    convertToTemplateToken(context, result) {
        // Literal
        const literal = this.convertToLiteralToken(context, result);
        if (literal) {
            return literal;
        }
        // Known raw types
        else if (result.raw !== null) {
            const type = result.raw?.templateTokenType;
            switch (type) {
                case exports.SEQUENCE_TYPE:
                case exports.MAPPING_TYPE: {
                    const token = result.raw;
                    context.memory.addToken(token, true);
                    return token;
                }
            }
        }
        // Leverage the expression SDK to traverse the object
        const collection = result.getCollectionInterface();
        switch (collection?.compatibleValueKind) {
            case nodes_1.ValueKind.Object: {
                const mapping = this.createMappingToken(context);
                const object = collection;
                for (const key of object.getObjectKeys()) {
                    const keyToken = this.createStringToken(context, key);
                    const valueResult = new nodes_1.EvaluationResult(new nodes_1.CanonicalValue(object.getObjectValue(key)));
                    const valueToken = this.convertToTemplateToken(context, valueResult);
                    mapping.add(keyToken, valueToken);
                }
                return mapping;
            }
            case nodes_1.ValueKind.Array: {
                const sequence = this.createSequenceToken(context);
                const array = collection;
                const length = array.getArrayLength();
                for (let i = 0; i < length; i++) {
                    const itemResult = new nodes_1.EvaluationResult(new nodes_1.CanonicalValue(array.getArrayItem(i)));
                    const itemToken = this.convertToTemplateToken(context, itemResult);
                    sequence.add(itemToken);
                }
                return sequence;
            }
            default:
                throw new Error("Unable to convert the object to a template token");
        }
    }
    convertToLiteralToken(context, result) {
        let literal;
        switch (result.kind) {
            case nodes_1.ValueKind.Null:
                literal = new NullToken(this.file, this.line, this.col);
                break;
            case nodes_1.ValueKind.Boolean:
                literal = new BooleanToken(this.file, this.line, this.col, result.value);
                break;
            case nodes_1.ValueKind.Number:
                literal = new NumberToken(this.file, this.line, this.col, result.value);
                break;
            case nodes_1.ValueKind.String:
                literal = new StringToken(this.file, this.line, this.col, result.value);
                break;
        }
        if (literal) {
            context.memory.addToken(literal, false);
        }
        return literal;
    }
    createStringToken(context, value) {
        const result = new StringToken(this.file, this.line, this.col, value);
        context.memory.addToken(result, false);
        return result;
    }
    createSequenceToken(context) {
        const result = new SequenceToken(this.file, this.line, this.col);
        context.memory.addToken(result, false);
        return result;
    }
    createMappingToken(context) {
        const result = new MappingToken(this.file, this.line, this.col);
        context.memory.addToken(result, false);
        return result;
    }
    static convertToFormatArg(node) {
        let nodeString = node.convertToExpression();
        // If the node is a container, see if it starts with '(' and ends with ')' so we can simplify the string
        // Should only simplify if only one '(' or ')' exists in the string
        // We are trying to simplify the case (a || b) to a || b
        // But we should avoid simplifying ( a && b
        if (node.nodeType === nodes_1.NodeType.Container &&
            nodeString.length > 2 &&
            nodeString[0] === expression_constants_1.START_PARAMETER &&
            nodeString[nodeString.length - 1] === expression_constants_1.END_PARAMETER &&
            nodeString.lastIndexOf(expression_constants_1.START_PARAMETER) === 0 &&
            nodeString.indexOf(expression_constants_1.END_PARAMETER) === nodeString.length - 1) {
            nodeString = nodeString.substr(1, nodeString.length - 2);
        }
        return `${template_constants_1.OPEN_EXPRESSION} ${nodeString} ${template_constants_1.CLOSE_EXPRESSION}`;
    }
}
exports.BasicExpressionToken = BasicExpressionToken;
class InsertExpressionToken extends ExpressionToken {
    constructor(file, line, col) {
        super(exports.INSERT_EXPRESSION_TYPE, file, line, col, template_constants_1.INSERT_DIRECTIVE);
    }
    clone(omitSource) {
        return omitSource
            ? new InsertExpressionToken(undefined, undefined, undefined)
            : new InsertExpressionToken(this.file, this.line, this.col);
    }
    toString() {
        return `${template_constants_1.OPEN_EXPRESSION} ${template_constants_1.INSERT_DIRECTIVE} ${template_constants_1.CLOSE_EXPRESSION}`;
    }
    toDisplayString() {
        return ScalarToken.trimDisplayString(this.toString());
    }
}
exports.InsertExpressionToken = InsertExpressionToken;
class EvaluateTokenResult {
    constructor(value, bytes) {
        this.value = value;
        this.bytes = bytes;
    }
}
exports.EvaluateTokenResult = EvaluateTokenResult;
class KeyValuePair {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
exports.KeyValuePair = KeyValuePair;
class StringKeyValuePair {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
class DummyFunction extends nodes_1.FunctionNode {
    evaluateCore(context) {
        return {
            value: undefined,
            memory: undefined,
        };
    }
}
class TraversalState {
    constructor(parent, token) {
        this.index = -1;
        this.isKey = false;
        this.parent = parent;
        this._token = token;
    }
    moveNext(omitKeys) {
        switch (this._token.templateTokenType) {
            case exports.SEQUENCE_TYPE: {
                const sequence = this._token;
                if (++this.index < sequence.count) {
                    this.current = sequence.get(this.index);
                    return true;
                }
                this.current = undefined;
                return false;
            }
            case exports.MAPPING_TYPE: {
                const mapping = this._token;
                // Already returned the key, now return the value
                if (this.isKey) {
                    this.isKey = false;
                    this.current = mapping.get(this.index).value;
                    return true;
                }
                // Move next
                if (++this.index < mapping.count) {
                    // Skip the key, return the value
                    if (omitKeys) {
                        this.isKey = false;
                        this.current = mapping.get(this.index).value;
                        return true;
                    }
                    // Return the key
                    this.isKey = true;
                    this.current = mapping.get(this.index).key;
                    return true;
                }
                this.current = undefined;
                return false;
            }
            default:
                throw new Error(`Unexpected token type '${this._token.templateTokenType}' when traversing state`);
        }
    }
}
//# sourceMappingURL=tokens.js.map

/***/ }),

/***/ 3192:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoOperationTraceWriter = void 0;
class NoOperationTraceWriter {
    error(message) { }
    info(message) { }
    verbose(message) { }
}
exports.NoOperationTraceWriter = NoOperationTraceWriter;
//# sourceMappingURL=trace-writer.js.map

/***/ }),

/***/ 5338:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.STRATEGY = exports.WORKFLOW_ROOT = void 0;
exports.WORKFLOW_ROOT = "workflow-root";
exports.STRATEGY = "strategy";
//# sourceMappingURL=workflow-constants.js.map

/***/ }),

/***/ 9781:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseWorkflow = void 0;
const templateReader = __importStar(__nccwpck_require__(6084));
const workflow_constants_1 = __nccwpck_require__(5338);
const yaml_object_reader_1 = __nccwpck_require__(4710);
const template_context_1 = __nccwpck_require__(4869);
const template_memory_1 = __nccwpck_require__(3431);
const workflow_schema_1 = __nccwpck_require__(9403);
function parseWorkflow(entryFileName, files, trace) {
    const context = new template_context_1.TemplateContext(new template_context_1.TemplateValidationErrors(), new template_memory_1.TemplateMemory(50, 1048576), (0, workflow_schema_1.getWorkflowSchema)(), trace);
    files.forEach((x) => context.getFileId(x.name));
    const fileId = context.getFileId(entryFileName);
    const fileContent = files[fileId - 1].content;
    const result = templateReader.readTemplate(context, workflow_constants_1.WORKFLOW_ROOT, new yaml_object_reader_1.YamlObjectReader(fileId, fileContent), fileId);
    return {
        value: result.value,
        errors: context.errors.getErrors(),
    };
}
exports.parseWorkflow = parseWorkflow;
//# sourceMappingURL=workflow-parser.js.map

/***/ }),

/***/ 9403:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getWorkflowSchema = void 0;
const json_object_reader_1 = __nccwpck_require__(6140);
const schema_1 = __nccwpck_require__(6029);
const fs = __importStar(__nccwpck_require__(7147));
const path = __importStar(__nccwpck_require__(1017));
let schema;
function getWorkflowSchema() {
    if (schema === undefined) {
        const json = fs
            .readFileSync(path.join(__dirname, "workflow-schema.json"))
            .toString();
        schema = schema_1.TemplateSchema.load(new json_object_reader_1.JSONObjectReader(undefined, json));
    }
    return schema;
}
exports.getWorkflowSchema = getWorkflowSchema;
//# sourceMappingURL=workflow-schema.js.map

/***/ }),

/***/ 4710:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.YamlObjectReader = void 0;
const yaml_1 = __nccwpck_require__(4083);
const tokens_1 = __nccwpck_require__(5457);
const parse_event_1 = __nccwpck_require__(5239);
class YamlObjectReader {
    constructor(fileId, content) {
        this.lineCounter = new yaml_1.LineCounter();
        this._generator = this.getNodes((0, yaml_1.parseDocument)(content.trim(), { lineCounter: this.lineCounter }));
        this.fileId = fileId;
    }
    *getNodes(node) {
        let { line, col } = this.getLinePos(node);
        if ((0, yaml_1.isDocument)(node)) {
            yield new parse_event_1.ParseEvent(parse_event_1.EventType.DocumentStart);
            for (const item of this.getNodes(node.contents)) {
                yield item;
            }
            yield new parse_event_1.ParseEvent(parse_event_1.EventType.DocumentEnd);
        }
        if ((0, yaml_1.isCollection)(node)) {
            if ((0, yaml_1.isSeq)(node)) {
                yield new parse_event_1.ParseEvent(parse_event_1.EventType.SequenceStart, new tokens_1.SequenceToken(this.fileId, line, col));
            }
            else if ((0, yaml_1.isMap)(node)) {
                yield new parse_event_1.ParseEvent(parse_event_1.EventType.MappingStart, new tokens_1.MappingToken(this.fileId, line, col));
            }
            for (const item of node.items) {
                for (const child of this.getNodes(item)) {
                    yield child;
                }
            }
            if ((0, yaml_1.isSeq)(node)) {
                yield new parse_event_1.ParseEvent(parse_event_1.EventType.SequenceEnd);
            }
            else if ((0, yaml_1.isMap)(node)) {
                yield new parse_event_1.ParseEvent(parse_event_1.EventType.MappingEnd);
            }
        }
        if ((0, yaml_1.isScalar)(node)) {
            yield new parse_event_1.ParseEvent(parse_event_1.EventType.Literal, YamlObjectReader.getLiteralToken(this.fileId, line, col, node));
        }
        if ((0, yaml_1.isPair)(node)) {
            const scalarKey = node.key;
            ({ line, col } = this.getLinePos(scalarKey));
            const key = scalarKey.value;
            yield new parse_event_1.ParseEvent(parse_event_1.EventType.Literal, new tokens_1.StringToken(this.fileId, line, col, key));
            for (const child of this.getNodes(node.value)) {
                yield child;
            }
        }
    }
    getLinePos(node) {
        const range = node?.range ?? [];
        const startPos = range[0];
        return startPos !== undefined
            ? this.lineCounter.linePos(startPos)
            : { line: undefined, col: undefined };
    }
    static getLiteralToken(fileId, line, col, token) {
        const value = token.value;
        if (!value && value !== false) {
            return new tokens_1.NullToken(fileId, line, col);
        }
        switch (typeof value) {
            case "number":
                return new tokens_1.NumberToken(fileId, line, col, value);
            case "boolean":
                return new tokens_1.BooleanToken(fileId, line, col, value);
            case "string":
                return new tokens_1.StringToken(fileId, line, col, value);
            default:
                throw new Error(`Unexpected value type '${typeof value}' when reading object`);
        }
    }
    allowLiteral() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.Literal) {
                this._current = this._generator.next();
                // console.log("ParseEvent=Literal")
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowSequenceStart() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.SequenceStart) {
                this._current = this._generator.next();
                // console.log("ParseEvent=SequenceStart")
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowSequenceEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.SequenceEnd) {
                this._current = this._generator.next();
                // console.log("ParseEvent=SequenceEnd")
                return true;
            }
        }
        return false;
    }
    allowMappingStart() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.MappingStart) {
                this._current = this._generator.next();
                // console.log("ParseEvent=MappingStart")
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowMappingEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.MappingEnd) {
                this._current = this._generator.next();
                // console.log("ParseEvent=MappingEnd")
                return true;
            }
        }
        return false;
    }
    validateEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.DocumentEnd) {
                this._current = this._generator.next();
                // console.log("ParseEvent=DocumentEnd")
                return;
            }
        }
        throw new Error("Expected end of reader");
    }
    validateStart() {
        if (!this._current) {
            this._current = this._generator.next();
        }
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.DocumentStart) {
                this._current = this._generator.next();
                // console.log("ParseEvent=DocumentStart")
                return;
            }
        }
        throw new Error("Expected start of reader");
    }
}
exports.YamlObjectReader = YamlObjectReader;
//# sourceMappingURL=yaml-object-reader.js.map

/***/ }),

/***/ 4351:
/***/ ((module) => {

/*! *****************************************************************************
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
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 7672:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = void 0;
const workflow_parser_1 = __nccwpck_require__(9781);
const tokens_1 = __nccwpck_require__(5457);
const linter_1 = __nccwpck_require__(4756);
const trace_writer_1 = __nccwpck_require__(3192);
function run(core, fs) {
    const file = core.getInput('files', { required: true });
    const content = fs.readFileSync(file, 'utf8');
    const { value, errors } = (0, workflow_parser_1.parseWorkflow)(file, [{ name: file, content }], new trace_writer_1.NoOperationTraceWriter());
    if (!value ||
        !(value instanceof tokens_1.MappingToken) ||
        value.getObjectKeys().length === 0) {
        throw new Error(`Not a valid YAML file: ${file}`);
    }
    if (errors.length > 0) {
        errors.forEach((error) => core.error(error.message));
    }
    const problems = new linter_1.Linter().lint(value);
    if (problems.length === 0 && errors.length === 0) {
        core.info('Linted 1 file');
        return;
    }
    for (const problem of problems) {
        printProblem(core, problem);
    }
    core.setFailed('Found problems');
}
exports.run = run;
function printProblem(core, p) {
    core.error(p.message);
}


/***/ }),

/***/ 4756:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Linter = void 0;
const inconsistent_action_versions_rule_1 = __nccwpck_require__(9883);
const missing_action_version_rule_1 = __nccwpck_require__(9775);
const required_input_with_default_rule_1 = __nccwpck_require__(378);
const undeclared_inputs_rule_1 = __nccwpck_require__(1640);
const unused_inputs_rule_1 = __nccwpck_require__(7261);
class Linter {
    lint(template) {
        const rules = [
            new unused_inputs_rule_1.UnusedInputsRule(),
            new undeclared_inputs_rule_1.UndeclaredInputsRule(),
            new inconsistent_action_versions_rule_1.InconsistentActionVersionsRule(),
            new missing_action_version_rule_1.MissingActionVersionRule(),
            new required_input_with_default_rule_1.RequiredInputWithDefaultRule(),
        ];
        const problems = [];
        for (const rule of rules) {
            const ruleProblems = rule.check(template);
            problems.push(...ruleProblems);
        }
        return problems;
    }
}
exports.Linter = Linter;


/***/ }),

/***/ 9883:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InconsistentActionVersionsRule = void 0;
const rule_1 = __nccwpck_require__(3040);
class InconsistentActionVersionsRule extends rule_1.Rule {
    check(template) {
        const actions = this.groupActionsByName(template);
        const problems = [];
        for (const [name, coordinates] of actions) {
            for (const { ref, position } of coordinates) {
                const otherVersions = coordinates.filter((coordinate) => coordinate.ref !== ref);
                if (otherVersions.length > 0) {
                    problems.push({
                        message: `${name} also seen with ${otherVersions
                            .map(({ ref }) => ref)
                            .join(', ')}`,
                        position,
                    });
                }
            }
        }
        return problems;
    }
    groupActionsByName(template) {
        const usedActions = this.getUsedActions(template);
        const actionVersions = new Map();
        for (const action of usedActions) {
            const at = action.name.indexOf('@');
            if (at === -1) {
                continue;
            }
            const actionName = action.name.substring(0, at);
            const actionVersion = action.name.substring(at + 1);
            const seenVersions = actionVersions.get(actionName) || [];
            seenVersions.push({ ref: actionVersion, position: action.position });
            actionVersions.set(actionName, seenVersions);
        }
        return actionVersions;
    }
}
exports.InconsistentActionVersionsRule = InconsistentActionVersionsRule;


/***/ }),

/***/ 9775:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MissingActionVersionRule = void 0;
const rule_1 = __nccwpck_require__(3040);
class MissingActionVersionRule extends rule_1.Rule {
    check(template) {
        const actions = this.getUsedActions(template);
        const problems = [];
        for (const action of actions) {
            if (action.name.indexOf('@') === -1) {
                problems.push({
                    message: `${action.name} has no reference`,
                    position: action.position,
                });
            }
        }
        return problems;
    }
}
exports.MissingActionVersionRule = MissingActionVersionRule;


/***/ }),

/***/ 378:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequiredInputWithDefaultRule = void 0;
const rule_1 = __nccwpck_require__(3040);
class RequiredInputWithDefaultRule extends rule_1.Rule {
    check(template) {
        const problems = [];
        const declaredInputs = this.getDeclaredInputs(template);
        for (const inputKey of declaredInputs.getObjectKeys()) {
            const input = declaredInputs.getObjectValue(inputKey);
            const hasDefault = input.getObjectValue('default');
            const required = input.getObjectValue('required');
            const isRequired = required && required.value;
            if (isRequired && hasDefault) {
                problems.push({
                    message: `Input ${inputKey} is required but has a default value.`,
                    position: {
                        line: input.line,
                        column: input.col,
                    },
                });
            }
        }
        return problems;
    }
}
exports.RequiredInputWithDefaultRule = RequiredInputWithDefaultRule;


/***/ }),

/***/ 3040:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Rule = exports.EmptyMappingToken = void 0;
const tokens_1 = __nccwpck_require__(5457);
exports.EmptyMappingToken = new tokens_1.MappingToken(undefined, undefined, undefined);
class Rule {
    getDeclaredInputs(template) {
        const triggers = template.getObjectValue('on');
        if (!triggers)
            return exports.EmptyMappingToken;
        const workflowCall = triggers.getObjectValue('workflow_call');
        if (workflowCall instanceof tokens_1.MappingToken) {
            return workflowCall.getObjectValue('inputs');
        }
        return exports.EmptyMappingToken;
    }
    getUsedInputs(template) {
        const inputs = [];
        const jobs = template.getObjectValue('jobs');
        for (const jobKey of jobs.getObjectKeys()) {
            const job = jobs.getObjectValue(jobKey);
            const steps = job.getObjectValue('steps');
            for (let stepIndex = 0; stepIndex < steps.getArrayLength(); stepIndex++) {
                const step = steps.getArrayItem(stepIndex);
                const actionInputs = step.getObjectValue('with');
                if (actionInputs) {
                    for (const actionInputKey of actionInputs.getObjectKeys()) {
                        const actionInput = actionInputs.getObjectValue(actionInputKey);
                        if (actionInput instanceof tokens_1.BasicExpressionToken) {
                            inputs.push(...this.getInputsFromExpression(actionInput));
                        }
                    }
                }
                const runStep = step.getObjectValue('run');
                if (runStep) {
                    inputs.push(...this.getInputsFromExpression(runStep));
                }
            }
        }
        return inputs;
    }
    getInputsFromExpression(expression) {
        const inputs = [];
        if (expression.expression.startsWith('inputs.')) {
            inputs.push({
                name: expression.expression.substring(7),
                position: {
                    line: expression.line,
                    column: expression.col,
                },
            });
        }
        else if (expression.expression.startsWith('format(')) {
            // expressions look like so: format('{0}', inputs.foo
            const argsPosition = expression.expression.lastIndexOf("'");
            const args = expression.expression
                .substring(argsPosition + 3, expression.expression.length - 1)
                .split(',')
                .map((arg) => arg.trim());
            for (const arg of args) {
                if (arg.startsWith('inputs.')) {
                    inputs.push({
                        name: arg.substring(7),
                        position: {
                            line: expression.line,
                            column: expression.col,
                        },
                    });
                }
            }
        }
        return inputs;
    }
    getUsedActions(template) {
        const jobs = template.getObjectValue('jobs');
        const usedActions = [];
        for (const jobKey of jobs.getObjectKeys()) {
            const job = jobs.getObjectValue(jobKey);
            const steps = job.getObjectValue('steps');
            for (let stepIndex = 0; stepIndex < steps.getArrayLength(); stepIndex++) {
                const step = steps.getArrayItem(stepIndex);
                const action = step.getObjectValue('uses');
                if (!action)
                    continue;
                usedActions.push({
                    name: action.value,
                    position: {
                        line: action.line,
                        column: action.col,
                    },
                });
            }
        }
        return usedActions;
    }
}
exports.Rule = Rule;


/***/ }),

/***/ 1640:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UndeclaredInputsRule = void 0;
const rule_1 = __nccwpck_require__(3040);
class UndeclaredInputsRule extends rule_1.Rule {
    check(template) {
        const declaredInputs = this.getDeclaredInputs(template);
        const usedInputs = this.getUsedInputs(template);
        const problems = [];
        for (const usedInput of usedInputs) {
            if (!declaredInputs.getObjectValue(usedInput.name)) {
                problems.push({
                    message: `Input "${usedInput.name}" is not declared`,
                    position: usedInput.position,
                });
            }
        }
        return problems;
    }
}
exports.UndeclaredInputsRule = UndeclaredInputsRule;


/***/ }),

/***/ 7261:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UnusedInputsRule = void 0;
const rule_1 = __nccwpck_require__(3040);
class UnusedInputsRule extends rule_1.Rule {
    check(template) {
        const declaredInputs = this.getDeclaredInputs(template);
        const usedInputs = this.getUsedInputs(template);
        const problems = [];
        // unused
        for (const inputName of declaredInputs.getObjectKeys()) {
            if (!usedInputs.map((usedInput) => usedInput.name).includes(inputName)) {
                const input = declaredInputs.getObjectValue(inputName);
                problems.push({
                    message: `Input "${inputName}" is not used`,
                    position: {
                        line: input.line,
                        column: input.col,
                    },
                });
            }
        }
        return problems;
    }
}
exports.UnusedInputsRule = UnusedInputsRule;


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 8109:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(1399);
var Scalar = __nccwpck_require__(9338);
var resolveBlockMap = __nccwpck_require__(2986);
var resolveBlockSeq = __nccwpck_require__(2289);
var resolveFlowCollection = __nccwpck_require__(45);

function composeCollection(CN, ctx, token, tagToken, onError) {
    let coll;
    switch (token.type) {
        case 'block-map': {
            coll = resolveBlockMap.resolveBlockMap(CN, ctx, token, onError);
            break;
        }
        case 'block-seq': {
            coll = resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError);
            break;
        }
        case 'flow-collection': {
            coll = resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError);
            break;
        }
    }
    if (!tagToken)
        return coll;
    const tagName = ctx.directives.tagName(tagToken.source, msg => onError(tagToken, 'TAG_RESOLVE_FAILED', msg));
    if (!tagName)
        return coll;
    // Cast needed due to: https://github.com/Microsoft/TypeScript/issues/3841
    const Coll = coll.constructor;
    if (tagName === '!' || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
    }
    const expType = Node.isMap(coll) ? 'map' : 'seq';
    let tag = ctx.schema.tags.find(t => t.collection === expType && t.tag === tagName);
    if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt && kt.collection === expType) {
            ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
            tag = kt;
        }
        else {
            onError(tagToken, 'TAG_RESOLVE_FAILED', `Unresolved tag: ${tagName}`, true);
            coll.tag = tagName;
            return coll;
        }
    }
    const res = tag.resolve(coll, msg => onError(tagToken, 'TAG_RESOLVE_FAILED', msg), ctx.options);
    const node = Node.isNode(res)
        ? res
        : new Scalar.Scalar(res);
    node.range = coll.range;
    node.tag = tagName;
    if (tag === null || tag === void 0 ? void 0 : tag.format)
        node.format = tag.format;
    return node;
}

exports.composeCollection = composeCollection;


/***/ }),

/***/ 5050:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Document = __nccwpck_require__(42);
var composeNode = __nccwpck_require__(8676);
var resolveEnd = __nccwpck_require__(1250);
var resolveProps = __nccwpck_require__(6985);

function composeDoc(options, directives, { offset, start, value, end }, onError) {
    const opts = Object.assign({ directives }, options);
    const doc = new Document.Document(undefined, opts);
    const ctx = {
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
    };
    const props = resolveProps.resolveProps(start, {
        indicator: 'doc-start',
        next: value || (end === null || end === void 0 ? void 0 : end[0]),
        offset,
        onError,
        startOnNewline: true
    });
    if (props.found) {
        doc.directives.marker = true;
        if (value &&
            (value.type === 'block-map' || value.type === 'block-seq') &&
            !props.hasNewline)
            onError(props.end, 'MISSING_CHAR', 'Block collection cannot start on same line with directives-end marker');
    }
    doc.contents = value
        ? composeNode.composeNode(ctx, value, props, onError)
        : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
    const contentEnd = doc.contents.range[2];
    const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
    if (re.comment)
        doc.comment = re.comment;
    doc.range = [offset, contentEnd, re.offset];
    return doc;
}

exports.composeDoc = composeDoc;


/***/ }),

/***/ 8676:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Alias = __nccwpck_require__(5639);
var composeCollection = __nccwpck_require__(8109);
var composeScalar = __nccwpck_require__(4766);
var resolveEnd = __nccwpck_require__(1250);
var utilEmptyScalarPosition = __nccwpck_require__(8781);

const CN = { composeNode, composeEmptyNode };
function composeNode(ctx, token, props, onError) {
    const { spaceBefore, comment, anchor, tag } = props;
    let node;
    switch (token.type) {
        case 'alias':
            node = composeAlias(ctx, token, onError);
            if (anchor || tag)
                onError(token, 'ALIAS_PROPS', 'An alias node must not specify any properties');
            break;
        case 'scalar':
        case 'single-quoted-scalar':
        case 'double-quoted-scalar':
        case 'block-scalar':
            node = composeScalar.composeScalar(ctx, token, tag, onError);
            if (anchor)
                node.anchor = anchor.source.substring(1);
            break;
        case 'block-map':
        case 'block-seq':
        case 'flow-collection':
            node = composeCollection.composeCollection(CN, ctx, token, tag, onError);
            if (anchor)
                node.anchor = anchor.source.substring(1);
            break;
        default:
            console.log(token);
            throw new Error(`Unsupporten token type: ${token.type}`);
    }
    if (anchor && node.anchor === '')
        onError(anchor, 'BAD_ALIAS', 'Anchor cannot be an empty string');
    if (spaceBefore)
        node.spaceBefore = true;
    if (comment) {
        if (token.type === 'scalar' && token.source === '')
            node.comment = comment;
        else
            node.commentBefore = comment;
    }
    if (ctx.options.keepSourceTokens)
        node.srcToken = token;
    return node;
}
function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag }, onError) {
    const token = {
        type: 'scalar',
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ''
    };
    const node = composeScalar.composeScalar(ctx, token, tag, onError);
    if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === '')
            onError(anchor, 'BAD_ALIAS', 'Anchor cannot be an empty string');
    }
    if (spaceBefore)
        node.spaceBefore = true;
    if (comment)
        node.comment = comment;
    return node;
}
function composeAlias({ options }, { offset, source, end }, onError) {
    const alias = new Alias.Alias(source.substring(1));
    if (alias.source === '')
        onError(offset, 'BAD_ALIAS', 'Alias cannot be an empty string');
    const valueEnd = offset + source.length;
    const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
    alias.range = [offset, valueEnd, re.offset];
    if (re.comment)
        alias.comment = re.comment;
    return alias;
}

exports.composeEmptyNode = composeEmptyNode;
exports.composeNode = composeNode;


/***/ }),

/***/ 4766:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(1399);
var Scalar = __nccwpck_require__(9338);
var resolveBlockScalar = __nccwpck_require__(9485);
var resolveFlowScalar = __nccwpck_require__(7578);

function composeScalar(ctx, token, tagToken, onError) {
    const { value, type, comment, range } = token.type === 'block-scalar'
        ? resolveBlockScalar.resolveBlockScalar(token, ctx.options.strict, onError)
        : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
    const tagName = tagToken
        ? ctx.directives.tagName(tagToken.source, msg => onError(tagToken, 'TAG_RESOLVE_FAILED', msg))
        : null;
    const tag = tagToken && tagName
        ? findScalarTagByName(ctx.schema, value, tagName, tagToken, onError)
        : token.type === 'scalar'
            ? findScalarTagByTest(ctx, value, token, onError)
            : ctx.schema[Node.SCALAR];
    let scalar;
    try {
        const res = tag.resolve(value, msg => onError(tagToken || token, 'TAG_RESOLVE_FAILED', msg), ctx.options);
        scalar = Node.isScalar(res) ? res : new Scalar.Scalar(res);
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken || token, 'TAG_RESOLVE_FAILED', msg);
        scalar = new Scalar.Scalar(value);
    }
    scalar.range = range;
    scalar.source = value;
    if (type)
        scalar.type = type;
    if (tagName)
        scalar.tag = tagName;
    if (tag.format)
        scalar.format = tag.format;
    if (comment)
        scalar.comment = comment;
    return scalar;
}
function findScalarTagByName(schema, value, tagName, tagToken, onError) {
    var _a;
    if (tagName === '!')
        return schema[Node.SCALAR]; // non-specific tag
    const matchWithTest = [];
    for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
            if (tag.default && tag.test)
                matchWithTest.push(tag);
            else
                return tag;
        }
    }
    for (const tag of matchWithTest)
        if ((_a = tag.test) === null || _a === void 0 ? void 0 : _a.test(value))
            return tag;
    const kt = schema.knownTags[tagName];
    if (kt && !kt.collection) {
        // Ensure that the known tag is available for stringifying,
        // but does not get used by default.
        schema.tags.push(Object.assign({}, kt, { default: false, test: undefined }));
        return kt;
    }
    onError(tagToken, 'TAG_RESOLVE_FAILED', `Unresolved tag: ${tagName}`, tagName !== 'tag:yaml.org,2002:str');
    return schema[Node.SCALAR];
}
function findScalarTagByTest({ directives, schema }, value, token, onError) {
    const tag = schema.tags.find(tag => { var _a; return tag.default && ((_a = tag.test) === null || _a === void 0 ? void 0 : _a.test(value)); }) || schema[Node.SCALAR];
    if (schema.compat) {
        const compat = schema.compat.find(tag => { var _a; return tag.default && ((_a = tag.test) === null || _a === void 0 ? void 0 : _a.test(value)); }) ||
            schema[Node.SCALAR];
        if (tag.tag !== compat.tag) {
            const ts = directives.tagString(tag.tag);
            const cs = directives.tagString(compat.tag);
            const msg = `Value may be parsed as either ${ts} or ${cs}`;
            onError(token, 'TAG_RESOLVE_FAILED', msg, true);
        }
    }
    return tag;
}

exports.composeScalar = composeScalar;


/***/ }),

/***/ 9493:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var directives = __nccwpck_require__(5400);
var Document = __nccwpck_require__(42);
var errors = __nccwpck_require__(4236);
var Node = __nccwpck_require__(1399);
var options = __nccwpck_require__(7425);
var composeDoc = __nccwpck_require__(5050);
var resolveEnd = __nccwpck_require__(1250);

function getErrorPos(src) {
    if (typeof src === 'number')
        return [src, src + 1];
    if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
    const { offset, source } = src;
    return [offset, offset + (typeof source === 'string' ? source.length : 1)];
}
function parsePrelude(prelude) {
    var _a;
    let comment = '';
    let atComment = false;
    let afterEmptyLine = false;
    for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
            case '#':
                comment +=
                    (comment === '' ? '' : afterEmptyLine ? '\n\n' : '\n') +
                        (source.substring(1) || ' ');
                atComment = true;
                afterEmptyLine = false;
                break;
            case '%':
                if (((_a = prelude[i + 1]) === null || _a === void 0 ? void 0 : _a[0]) !== '#')
                    i += 1;
                atComment = false;
                break;
            default:
                // This may be wrong after doc-end, but in that case it doesn't matter
                if (!atComment)
                    afterEmptyLine = true;
                atComment = false;
        }
    }
    return { comment, afterEmptyLine };
}
/**
 * Compose a stream of CST nodes into a stream of YAML Documents.
 *
 * ```ts
 * import { Composer, Parser } from 'yaml'
 *
 * const src: string = ...
 * const tokens = new Parser().parse(src)
 * const docs = new Composer().compose(tokens)
 * ```
 */
class Composer {
    constructor(options$1 = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning) => {
            const pos = getErrorPos(source);
            if (warning)
                this.warnings.push(new errors.YAMLWarning(pos, code, message));
            else
                this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        this.directives = new directives.Directives({
            version: options$1.version || options.defaultOptions.version
        });
        this.options = options$1;
    }
    decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        //console.log({ dc: doc.comment, prelude, comment })
        if (comment) {
            const dc = doc.contents;
            if (afterDoc) {
                doc.comment = doc.comment ? `${doc.comment}\n${comment}` : comment;
            }
            else if (afterEmptyLine || doc.directives.marker || !dc) {
                doc.commentBefore = comment;
            }
            else if (Node.isCollection(dc) && !dc.flow && dc.items.length > 0) {
                let it = dc.items[0];
                if (Node.isPair(it))
                    it = it.key;
                const cb = it.commentBefore;
                it.commentBefore = cb ? `${comment}\n${cb}` : comment;
            }
            else {
                const cb = dc.commentBefore;
                dc.commentBefore = cb ? `${comment}\n${cb}` : comment;
            }
        }
        if (afterDoc) {
            Array.prototype.push.apply(doc.errors, this.errors);
            Array.prototype.push.apply(doc.warnings, this.warnings);
        }
        else {
            doc.errors = this.errors;
            doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
    }
    /**
     * Current stream status information.
     *
     * Mostly useful at the end of input for an empty stream.
     */
    streamInfo() {
        return {
            comment: parsePrelude(this.prelude).comment,
            directives: this.directives,
            errors: this.errors,
            warnings: this.warnings
        };
    }
    /**
     * Compose tokens into documents.
     *
     * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
     * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
     */
    *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
            yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
    }
    /** Advance the composer by one CST token. */
    *next(token) {
        if (process.env.LOG_STREAM)
            console.dir(token, { depth: null });
        switch (token.type) {
            case 'directive':
                this.directives.add(token.source, (offset, message, warning) => {
                    const pos = getErrorPos(token);
                    pos[0] += offset;
                    this.onError(pos, 'BAD_DIRECTIVE', message, warning);
                });
                this.prelude.push(token.source);
                this.atDirectives = true;
                break;
            case 'document': {
                const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
                if (this.atDirectives && !doc.directives.marker)
                    this.onError(token, 'MISSING_CHAR', 'Missing directives-end indicator line');
                this.decorate(doc, false);
                if (this.doc)
                    yield this.doc;
                this.doc = doc;
                this.atDirectives = false;
                break;
            }
            case 'byte-order-mark':
            case 'space':
                break;
            case 'comment':
            case 'newline':
                this.prelude.push(token.source);
                break;
            case 'error': {
                const msg = token.source
                    ? `${token.message}: ${JSON.stringify(token.source)}`
                    : token.message;
                const error = new errors.YAMLParseError(getErrorPos(token), 'UNEXPECTED_TOKEN', msg);
                if (this.atDirectives || !this.doc)
                    this.errors.push(error);
                else
                    this.doc.errors.push(error);
                break;
            }
            case 'doc-end': {
                if (!this.doc) {
                    const msg = 'Unexpected doc-end without preceding document';
                    this.errors.push(new errors.YAMLParseError(getErrorPos(token), 'UNEXPECTED_TOKEN', msg));
                    break;
                }
                const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
                this.decorate(this.doc, true);
                if (end.comment) {
                    const dc = this.doc.comment;
                    this.doc.comment = dc ? `${dc}\n${end.comment}` : end.comment;
                }
                this.doc.range[2] = end.offset;
                break;
            }
            default:
                this.errors.push(new errors.YAMLParseError(getErrorPos(token), 'UNEXPECTED_TOKEN', `Unsupported token ${token.type}`));
        }
    }
    /**
     * Call at end of input to yield any remaining document.
     *
     * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
     * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
     */
    *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
            this.decorate(this.doc, true);
            yield this.doc;
            this.doc = null;
        }
        else if (forceDoc) {
            const opts = Object.assign({ directives: this.directives }, this.options);
            const doc = new Document.Document(undefined, opts);
            if (this.atDirectives)
                this.onError(endOffset, 'MISSING_CHAR', 'Missing directives-end indicator line');
            doc.range = [0, endOffset, endOffset];
            this.decorate(doc, false);
            yield doc;
        }
    }
}

exports.Composer = Composer;


/***/ }),

/***/ 2986:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Pair = __nccwpck_require__(246);
var YAMLMap = __nccwpck_require__(6011);
var resolveProps = __nccwpck_require__(6985);
var utilContainsNewline = __nccwpck_require__(976);
var utilFlowIndentCheck = __nccwpck_require__(3669);
var utilMapIncludes = __nccwpck_require__(6899);

const startColMsg = 'All mapping items must start at the same column';
function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError) {
    var _a;
    const map = new YAMLMap.YAMLMap(ctx.schema);
    if (ctx.atRoot)
        ctx.atRoot = false;
    let offset = bm.offset;
    for (const collItem of bm.items) {
        const { start, key, sep, value } = collItem;
        // key properties
        const keyProps = resolveProps.resolveProps(start, {
            indicator: 'explicit-key-ind',
            next: key || (sep === null || sep === void 0 ? void 0 : sep[0]),
            offset,
            onError,
            startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
            if (key) {
                if (key.type === 'block-seq')
                    onError(offset, 'BLOCK_AS_IMPLICIT_KEY', 'A block sequence may not be used as an implicit map key');
                else if ('indent' in key && key.indent !== bm.indent)
                    onError(offset, 'BAD_INDENT', startColMsg);
            }
            if (!keyProps.anchor && !keyProps.tag && !sep) {
                // TODO: assert being at last item?
                if (keyProps.comment) {
                    if (map.comment)
                        map.comment += '\n' + keyProps.comment;
                    else
                        map.comment = keyProps.comment;
                }
                continue;
            }
        }
        else if (((_a = keyProps.found) === null || _a === void 0 ? void 0 : _a.indent) !== bm.indent)
            onError(offset, 'BAD_INDENT', startColMsg);
        if (implicitKey && utilContainsNewline.containsNewline(key))
            onError(key, // checked by containsNewline()
            'MULTILINE_IMPLICIT_KEY', 'Implicit keys need to be on a single line');
        // key value
        const keyStart = keyProps.end;
        const keyNode = key
            ? composeNode(ctx, key, keyProps, onError)
            : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
            onError(keyStart, 'DUPLICATE_KEY', 'Map keys must be unique');
        // value properties
        const valueProps = resolveProps.resolveProps(sep || [], {
            indicator: 'map-value-ind',
            next: value,
            offset: keyNode.range[2],
            onError,
            startOnNewline: !key || key.type === 'block-scalar'
        });
        offset = valueProps.end;
        if (valueProps.found) {
            if (implicitKey) {
                if ((value === null || value === void 0 ? void 0 : value.type) === 'block-map' && !valueProps.hasNewline)
                    onError(offset, 'BLOCK_AS_IMPLICIT_KEY', 'Nested mappings are not allowed in compact mappings');
                if (ctx.options.strict &&
                    keyProps.start < valueProps.found.offset - 1024)
                    onError(keyNode.range, 'KEY_OVER_1024_CHARS', 'The : indicator must be at most 1024 chars after the start of an implicit block mapping key');
            }
            // value value
            const valueNode = value
                ? composeNode(ctx, value, valueProps, onError)
                : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
            if (ctx.schema.compat)
                utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
            offset = valueNode.range[2];
            const pair = new Pair.Pair(keyNode, valueNode);
            if (ctx.options.keepSourceTokens)
                pair.srcToken = collItem;
            map.items.push(pair);
        }
        else {
            // key with no value
            if (implicitKey)
                onError(keyNode.range, 'MISSING_CHAR', 'Implicit map keys need to be followed by map values');
            if (valueProps.comment) {
                if (keyNode.comment)
                    keyNode.comment += '\n' + valueProps.comment;
                else
                    keyNode.comment = valueProps.comment;
            }
            const pair = new Pair.Pair(keyNode);
            if (ctx.options.keepSourceTokens)
                pair.srcToken = collItem;
            map.items.push(pair);
        }
    }
    map.range = [bm.offset, offset, offset];
    return map;
}

exports.resolveBlockMap = resolveBlockMap;


/***/ }),

/***/ 9485:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(9338);

function resolveBlockScalar(scalar, strict, onError) {
    const start = scalar.offset;
    const header = parseBlockScalarHeader(scalar, strict, onError);
    if (!header)
        return { value: '', type: null, comment: '', range: [start, start, start] };
    const type = header.mode === '>' ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
    const lines = scalar.source ? splitLines(scalar.source) : [];
    // determine the end of content & start of chomping
    let chompStart = lines.length;
    for (let i = lines.length - 1; i >= 0; --i) {
        const content = lines[i][1];
        if (content === '' || content === '\r')
            chompStart = i;
        else
            break;
    }
    // shortcut for empty contents
    if (!scalar.source || chompStart === 0) {
        const value = header.chomp === '+' ? '\n'.repeat(Math.max(0, lines.length - 1)) : '';
        let end = start + header.length;
        if (scalar.source)
            end += scalar.source.length;
        return { value, type, comment: header.comment, range: [start, end, end] };
    }
    // find the indentation level to trim from start
    let trimIndent = scalar.indent + header.indent;
    let offset = scalar.offset + header.length;
    let contentStart = 0;
    for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === '' || content === '\r') {
            if (header.indent === 0 && indent.length > trimIndent)
                trimIndent = indent.length;
        }
        else {
            if (indent.length < trimIndent) {
                const message = 'Block scalars with more-indented leading empty lines must use an explicit indentation indicator';
                onError(offset + indent.length, 'MISSING_CHAR', message);
            }
            if (header.indent === 0)
                trimIndent = indent.length;
            contentStart = i;
            break;
        }
        offset += indent.length + content.length + 1;
    }
    let value = '';
    let sep = '';
    let prevMoreIndented = false;
    // leading whitespace is kept intact
    for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + '\n';
    for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === '\r';
        if (crlf)
            content = content.slice(0, -1);
        /* istanbul ignore if already caught in lexer */
        if (content && indent.length < trimIndent) {
            const src = header.indent
                ? 'explicit indentation indicator'
                : 'first line';
            const message = `Block scalar lines must not be less indented than their ${src}`;
            onError(offset - content.length - (crlf ? 2 : 1), 'BAD_INDENT', message);
            indent = '';
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
            value += sep + indent.slice(trimIndent) + content;
            sep = '\n';
        }
        else if (indent.length > trimIndent || content[0] === '\t') {
            // more-indented content within a folded block
            if (sep === ' ')
                sep = '\n';
            else if (!prevMoreIndented && sep === '\n')
                sep = '\n\n';
            value += sep + indent.slice(trimIndent) + content;
            sep = '\n';
            prevMoreIndented = true;
        }
        else if (content === '') {
            // empty line
            if (sep === '\n')
                value += '\n';
            else
                sep = '\n';
        }
        else {
            value += sep + content;
            sep = ' ';
            prevMoreIndented = false;
        }
    }
    switch (header.chomp) {
        case '-':
            break;
        case '+':
            for (let i = chompStart; i < lines.length; ++i)
                value += '\n' + lines[i][0].slice(trimIndent);
            if (value[value.length - 1] !== '\n')
                value += '\n';
            break;
        default:
            value += '\n';
    }
    const end = start + header.length + scalar.source.length;
    return { value, type, comment: header.comment, range: [start, end, end] };
}
function parseBlockScalarHeader({ offset, props }, strict, onError) {
    /* istanbul ignore if should not happen */
    if (props[0].type !== 'block-scalar-header') {
        onError(props[0], 'IMPOSSIBLE', 'Block scalar header not found');
        return null;
    }
    const { source } = props[0];
    const mode = source[0];
    let indent = 0;
    let chomp = '';
    let error = -1;
    for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === '-' || ch === '+'))
            chomp = ch;
        else {
            const n = Number(ch);
            if (!indent && n)
                indent = n;
            else if (error === -1)
                error = offset + i;
        }
    }
    if (error !== -1)
        onError(error, 'UNEXPECTED_TOKEN', `Block scalar header includes extra characters: ${source}`);
    let hasSpace = false;
    let comment = '';
    let length = source.length;
    for (let i = 1; i < props.length; ++i) {
        const token = props[i];
        switch (token.type) {
            case 'space':
                hasSpace = true;
            // fallthrough
            case 'newline':
                length += token.source.length;
                break;
            case 'comment':
                if (strict && !hasSpace) {
                    const message = 'Comments must be separated from other tokens by white space characters';
                    onError(token, 'MISSING_CHAR', message);
                }
                length += token.source.length;
                comment = token.source.substring(1);
                break;
            case 'error':
                onError(token, 'UNEXPECTED_TOKEN', token.message);
                length += token.source.length;
                break;
            /* istanbul ignore next should not happen */
            default: {
                const message = `Unexpected token in block scalar header: ${token.type}`;
                onError(token, 'UNEXPECTED_TOKEN', message);
                const ts = token.source;
                if (ts && typeof ts === 'string')
                    length += ts.length;
            }
        }
    }
    return { mode, indent, chomp, comment, length };
}
/** @returns Array of lines split up as `[indent, content]` */
function splitLines(source) {
    const split = source.split(/\n( *)/);
    const first = split[0];
    const m = first.match(/^( *)/);
    const line0 = m && m[1] ? [m[1], first.slice(m[1].length)] : ['', first];
    const lines = [line0];
    for (let i = 1; i < split.length; i += 2)
        lines.push([split[i], split[i + 1]]);
    return lines;
}

exports.resolveBlockScalar = resolveBlockScalar;


/***/ }),

/***/ 2289:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var YAMLSeq = __nccwpck_require__(5161);
var resolveProps = __nccwpck_require__(6985);
var utilFlowIndentCheck = __nccwpck_require__(3669);

function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError) {
    const seq = new YAMLSeq.YAMLSeq(ctx.schema);
    if (ctx.atRoot)
        ctx.atRoot = false;
    let offset = bs.offset;
    for (const { start, value } of bs.items) {
        const props = resolveProps.resolveProps(start, {
            indicator: 'seq-item-ind',
            next: value,
            offset,
            onError,
            startOnNewline: true
        });
        offset = props.end;
        if (!props.found) {
            if (props.anchor || props.tag || value) {
                if (value && value.type === 'block-seq')
                    onError(offset, 'BAD_INDENT', 'All sequence items must start at the same column');
                else
                    onError(offset, 'MISSING_CHAR', 'Sequence item without - indicator');
            }
            else {
                // TODO: assert being at last item?
                if (props.comment)
                    seq.comment = props.comment;
                continue;
            }
        }
        const node = value
            ? composeNode(ctx, value, props, onError)
            : composeEmptyNode(ctx, offset, start, null, props, onError);
        if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
        offset = node.range[2];
        seq.items.push(node);
    }
    seq.range = [bs.offset, offset, offset];
    return seq;
}

exports.resolveBlockSeq = resolveBlockSeq;


/***/ }),

/***/ 1250:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function resolveEnd(end, offset, reqSpace, onError) {
    let comment = '';
    if (end) {
        let hasSpace = false;
        let sep = '';
        for (const token of end) {
            const { source, type } = token;
            switch (type) {
                case 'space':
                    hasSpace = true;
                    break;
                case 'comment': {
                    if (reqSpace && !hasSpace)
                        onError(token, 'MISSING_CHAR', 'Comments must be separated from other tokens by white space characters');
                    const cb = source.substring(1) || ' ';
                    if (!comment)
                        comment = cb;
                    else
                        comment += sep + cb;
                    sep = '';
                    break;
                }
                case 'newline':
                    if (comment)
                        sep += source;
                    hasSpace = true;
                    break;
                default:
                    onError(token, 'UNEXPECTED_TOKEN', `Unexpected ${type} at node end`);
            }
            offset += source.length;
        }
    }
    return { comment, offset };
}

exports.resolveEnd = resolveEnd;


/***/ }),

/***/ 45:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(1399);
var Pair = __nccwpck_require__(246);
var YAMLMap = __nccwpck_require__(6011);
var YAMLSeq = __nccwpck_require__(5161);
var resolveEnd = __nccwpck_require__(1250);
var resolveProps = __nccwpck_require__(6985);
var utilContainsNewline = __nccwpck_require__(976);
var utilMapIncludes = __nccwpck_require__(6899);

const blockMsg = 'Block collections are not allowed within flow collections';
const isBlock = (token) => token && (token.type === 'block-map' || token.type === 'block-seq');
function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError) {
    const isMap = fc.start.source === '{';
    const fcName = isMap ? 'flow map' : 'flow sequence';
    const coll = isMap
        ? new YAMLMap.YAMLMap(ctx.schema)
        : new YAMLSeq.YAMLSeq(ctx.schema);
    coll.flow = true;
    const atRoot = ctx.atRoot;
    if (atRoot)
        ctx.atRoot = false;
    let offset = fc.offset + fc.start.source.length;
    for (let i = 0; i < fc.items.length; ++i) {
        const collItem = fc.items[i];
        const { start, key, sep, value } = collItem;
        const props = resolveProps.resolveProps(start, {
            flow: fcName,
            indicator: 'explicit-key-ind',
            next: key || (sep === null || sep === void 0 ? void 0 : sep[0]),
            offset,
            onError,
            startOnNewline: false
        });
        if (!props.found) {
            if (!props.anchor && !props.tag && !sep && !value) {
                if (i === 0 && props.comma)
                    onError(props.comma, 'UNEXPECTED_TOKEN', `Unexpected , in ${fcName}`);
                else if (i < fc.items.length - 1)
                    onError(props.start, 'UNEXPECTED_TOKEN', `Unexpected empty item in ${fcName}`);
                if (props.comment) {
                    if (coll.comment)
                        coll.comment += '\n' + props.comment;
                    else
                        coll.comment = props.comment;
                }
                offset = props.end;
                continue;
            }
            if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
                onError(key, // checked by containsNewline()
                'MULTILINE_IMPLICIT_KEY', 'Implicit keys of flow sequence pairs need to be on a single line');
        }
        if (i === 0) {
            if (props.comma)
                onError(props.comma, 'UNEXPECTED_TOKEN', `Unexpected , in ${fcName}`);
        }
        else {
            if (!props.comma)
                onError(props.start, 'MISSING_CHAR', `Missing , between ${fcName} items`);
            if (props.comment) {
                let prevItemComment = '';
                loop: for (const st of start) {
                    switch (st.type) {
                        case 'comma':
                        case 'space':
                            break;
                        case 'comment':
                            prevItemComment = st.source.substring(1);
                            break loop;
                        default:
                            break loop;
                    }
                }
                if (prevItemComment) {
                    let prev = coll.items[coll.items.length - 1];
                    if (Node.isPair(prev))
                        prev = prev.value || prev.key;
                    if (prev.comment)
                        prev.comment += '\n' + prevItemComment;
                    else
                        prev.comment = prevItemComment;
                    props.comment = props.comment.substring(prevItemComment.length + 1);
                }
            }
        }
        if (!isMap && !sep && !props.found) {
            // item is a value in a seq
            // → key & sep are empty, start does not include ? or :
            const valueNode = value
                ? composeNode(ctx, value, props, onError)
                : composeEmptyNode(ctx, props.end, sep, null, props, onError);
            coll.items.push(valueNode);
            offset = valueNode.range[2];
            if (isBlock(value))
                onError(valueNode.range, 'BLOCK_IN_FLOW', blockMsg);
        }
        else {
            // item is a key+value pair
            // key value
            const keyStart = props.end;
            const keyNode = key
                ? composeNode(ctx, key, props, onError)
                : composeEmptyNode(ctx, keyStart, start, null, props, onError);
            if (isBlock(key))
                onError(keyNode.range, 'BLOCK_IN_FLOW', blockMsg);
            // value properties
            const valueProps = resolveProps.resolveProps(sep || [], {
                flow: fcName,
                indicator: 'map-value-ind',
                next: value,
                offset: keyNode.range[2],
                onError,
                startOnNewline: false
            });
            if (valueProps.found) {
                if (!isMap && !props.found && ctx.options.strict) {
                    if (sep)
                        for (const st of sep) {
                            if (st === valueProps.found)
                                break;
                            if (st.type === 'newline') {
                                onError(st, 'MULTILINE_IMPLICIT_KEY', 'Implicit keys of flow sequence pairs need to be on a single line');
                                break;
                            }
                        }
                    if (props.start < valueProps.found.offset - 1024)
                        onError(valueProps.found, 'KEY_OVER_1024_CHARS', 'The : indicator must be at most 1024 chars after the start of an implicit flow sequence key');
                }
            }
            else if (value) {
                if ('source' in value && value.source && value.source[0] === ':')
                    onError(value, 'MISSING_CHAR', `Missing space after : in ${fcName}`);
                else
                    onError(valueProps.start, 'MISSING_CHAR', `Missing , or : between ${fcName} items`);
            }
            // value value
            const valueNode = value
                ? composeNode(ctx, value, valueProps, onError)
                : valueProps.found
                    ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError)
                    : null;
            if (valueNode) {
                if (isBlock(value))
                    onError(valueNode.range, 'BLOCK_IN_FLOW', blockMsg);
            }
            else if (valueProps.comment) {
                if (keyNode.comment)
                    keyNode.comment += '\n' + valueProps.comment;
                else
                    keyNode.comment = valueProps.comment;
            }
            const pair = new Pair.Pair(keyNode, valueNode);
            if (ctx.options.keepSourceTokens)
                pair.srcToken = collItem;
            if (isMap) {
                const map = coll;
                if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
                    onError(keyStart, 'DUPLICATE_KEY', 'Map keys must be unique');
                map.items.push(pair);
            }
            else {
                const map = new YAMLMap.YAMLMap(ctx.schema);
                map.flow = true;
                map.items.push(pair);
                coll.items.push(map);
            }
            offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
    }
    const expectedEnd = isMap ? '}' : ']';
    const [ce, ...ee] = fc.end;
    let cePos = offset;
    if (ce && ce.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
    else {
        const name = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot
            ? `${name} must end with a ${expectedEnd}`
            : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? 'MISSING_CHAR' : 'BAD_INDENT', msg);
        if (ce && ce.source.length !== 1)
            ee.unshift(ce);
    }
    if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
            if (coll.comment)
                coll.comment += '\n' + end.comment;
            else
                coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
    }
    else {
        coll.range = [fc.offset, cePos, cePos];
    }
    return coll;
}

exports.resolveFlowCollection = resolveFlowCollection;


/***/ }),

/***/ 7578:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(9338);
var resolveEnd = __nccwpck_require__(1250);

function resolveFlowScalar(scalar, strict, onError) {
    const { offset, type, source, end } = scalar;
    let _type;
    let value;
    const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
    switch (type) {
        case 'scalar':
            _type = Scalar.Scalar.PLAIN;
            value = plainValue(source, _onError);
            break;
        case 'single-quoted-scalar':
            _type = Scalar.Scalar.QUOTE_SINGLE;
            value = singleQuotedValue(source, _onError);
            break;
        case 'double-quoted-scalar':
            _type = Scalar.Scalar.QUOTE_DOUBLE;
            value = doubleQuotedValue(source, _onError);
            break;
        /* istanbul ignore next should not happen */
        default:
            onError(scalar, 'UNEXPECTED_TOKEN', `Expected a flow scalar value, but found: ${type}`);
            return {
                value: '',
                type: null,
                comment: '',
                range: [offset, offset + source.length, offset + source.length]
            };
    }
    const valueEnd = offset + source.length;
    const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
    return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
    };
}
function plainValue(source, onError) {
    let badChar = '';
    switch (source[0]) {
        /* istanbul ignore next should not happen */
        case '\t':
            badChar = 'a tab character';
            break;
        case ',':
            badChar = 'flow indicator character ,';
            break;
        case '%':
            badChar = 'directive indicator character %';
            break;
        case '|':
        case '>': {
            badChar = `block scalar indicator ${source[0]}`;
            break;
        }
        case '@':
        case '`': {
            badChar = `reserved character ${source[0]}`;
            break;
        }
    }
    if (badChar)
        onError(0, 'BAD_SCALAR_START', `Plain value cannot start with ${badChar}`);
    return foldLines(source);
}
function singleQuotedValue(source, onError) {
    if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, 'MISSING_CHAR', "Missing closing 'quote");
    return foldLines(source.slice(1, -1)).replace(/''/g, "'");
}
function foldLines(source) {
    /**
     * The negative lookbehind here and in the `re` RegExp is to
     * prevent causing a polynomial search time in certain cases.
     *
     * The try-catch is for Safari, which doesn't support this yet:
     * https://caniuse.com/js-regexp-lookbehind
     */
    let first, line;
    try {
        first = new RegExp('(.*?)(?<![ \t])[ \t]*\r?\n', 'sy');
        line = new RegExp('[ \t]*(.*?)(?:(?<![ \t])[ \t]*)?\r?\n', 'sy');
    }
    catch (_) {
        first = /(.*?)[ \t]*\r?\n/sy;
        line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
    }
    let match = first.exec(source);
    if (!match)
        return source;
    let res = match[1];
    let sep = ' ';
    let pos = first.lastIndex;
    line.lastIndex = pos;
    while ((match = line.exec(source))) {
        if (match[1] === '') {
            if (sep === '\n')
                res += sep;
            else
                sep = '\n';
        }
        else {
            res += sep + match[1];
            sep = ' ';
        }
        pos = line.lastIndex;
    }
    const last = /[ \t]*(.*)/sy;
    last.lastIndex = pos;
    match = last.exec(source);
    return res + sep + ((match && match[1]) || '');
}
function doubleQuotedValue(source, onError) {
    let res = '';
    for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === '\r' && source[i + 1] === '\n')
            continue;
        if (ch === '\n') {
            const { fold, offset } = foldNewline(source, i);
            res += fold;
            i = offset;
        }
        else if (ch === '\\') {
            let next = source[++i];
            const cc = escapeCodes[next];
            if (cc)
                res += cc;
            else if (next === '\n') {
                // skip escaped newlines, but still trim the following line
                next = source[i + 1];
                while (next === ' ' || next === '\t')
                    next = source[++i + 1];
            }
            else if (next === '\r' && source[i + 1] === '\n') {
                // skip escaped CRLF newlines, but still trim the following line
                next = source[++i + 1];
                while (next === ' ' || next === '\t')
                    next = source[++i + 1];
            }
            else if (next === 'x' || next === 'u' || next === 'U') {
                const length = { x: 2, u: 4, U: 8 }[next];
                res += parseCharCode(source, i + 1, length, onError);
                i += length;
            }
            else {
                const raw = source.substr(i - 1, 2);
                onError(i - 1, 'BAD_DQ_ESCAPE', `Invalid escape sequence ${raw}`);
                res += raw;
            }
        }
        else if (ch === ' ' || ch === '\t') {
            // trim trailing whitespace
            const wsStart = i;
            let next = source[i + 1];
            while (next === ' ' || next === '\t')
                next = source[++i + 1];
            if (next !== '\n' && !(next === '\r' && source[i + 2] === '\n'))
                res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        }
        else {
            res += ch;
        }
    }
    if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, 'MISSING_CHAR', 'Missing closing "quote');
    return res;
}
/**
 * Fold a single newline into a space, multiple newlines to N - 1 newlines.
 * Presumes `source[offset] === '\n'`
 */
function foldNewline(source, offset) {
    let fold = '';
    let ch = source[offset + 1];
    while (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
        if (ch === '\r' && source[offset + 2] !== '\n')
            break;
        if (ch === '\n')
            fold += '\n';
        offset += 1;
        ch = source[offset + 1];
    }
    if (!fold)
        fold = ' ';
    return { fold, offset };
}
const escapeCodes = {
    '0': '\0',
    a: '\x07',
    b: '\b',
    e: '\x1b',
    f: '\f',
    n: '\n',
    r: '\r',
    t: '\t',
    v: '\v',
    N: '\u0085',
    _: '\u00a0',
    L: '\u2028',
    P: '\u2029',
    ' ': ' ',
    '"': '"',
    '/': '/',
    '\\': '\\',
    '\t': '\t'
};
function parseCharCode(source, offset, length, onError) {
    const cc = source.substr(offset, length);
    const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
    const code = ok ? parseInt(cc, 16) : NaN;
    if (isNaN(code)) {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, 'BAD_DQ_ESCAPE', `Invalid escape sequence ${raw}`);
        return raw;
    }
    return String.fromCodePoint(code);
}

exports.resolveFlowScalar = resolveFlowScalar;


/***/ }),

/***/ 6985:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function resolveProps(tokens, { flow, indicator, next, offset, onError, startOnNewline }) {
    let spaceBefore = false;
    let atNewline = startOnNewline;
    let hasSpace = startOnNewline;
    let comment = '';
    let commentSep = '';
    let hasNewline = false;
    let reqSpace = false;
    let anchor = null;
    let tag = null;
    let comma = null;
    let found = null;
    let start = null;
    for (const token of tokens) {
        if (reqSpace) {
            if (token.type !== 'space' &&
                token.type !== 'newline' &&
                token.type !== 'comma')
                onError(token.offset, 'MISSING_CHAR', 'Tags and anchors must be separated from the next token by white space');
            reqSpace = false;
        }
        switch (token.type) {
            case 'space':
                // At the doc level, tabs at line start may be parsed
                // as leading white space rather than indentation.
                // In a flow collection, only the parser handles indent.
                if (!flow &&
                    atNewline &&
                    indicator !== 'doc-start' &&
                    token.source[0] === '\t')
                    onError(token, 'TAB_AS_INDENT', 'Tabs are not allowed as indentation');
                hasSpace = true;
                break;
            case 'comment': {
                if (!hasSpace)
                    onError(token, 'MISSING_CHAR', 'Comments must be separated from other tokens by white space characters');
                const cb = token.source.substring(1) || ' ';
                if (!comment)
                    comment = cb;
                else
                    comment += commentSep + cb;
                commentSep = '';
                atNewline = false;
                break;
            }
            case 'newline':
                if (atNewline) {
                    if (comment)
                        comment += token.source;
                    else
                        spaceBefore = true;
                }
                else
                    commentSep += token.source;
                atNewline = true;
                hasNewline = true;
                hasSpace = true;
                break;
            case 'anchor':
                if (anchor)
                    onError(token, 'MULTIPLE_ANCHORS', 'A node can have at most one anchor');
                anchor = token;
                if (start === null)
                    start = token.offset;
                atNewline = false;
                hasSpace = false;
                reqSpace = true;
                break;
            case 'tag': {
                if (tag)
                    onError(token, 'MULTIPLE_TAGS', 'A node can have at most one tag');
                tag = token;
                if (start === null)
                    start = token.offset;
                atNewline = false;
                hasSpace = false;
                reqSpace = true;
                break;
            }
            case indicator:
                // Could here handle preceding comments differently
                if (anchor || tag)
                    onError(token, 'BAD_PROP_ORDER', `Anchors and tags must be after the ${token.source} indicator`);
                if (found)
                    onError(token, 'UNEXPECTED_TOKEN', `Unexpected ${token.source} in ${flow || 'collection'}`);
                found = token;
                atNewline = false;
                hasSpace = false;
                break;
            case 'comma':
                if (flow) {
                    if (comma)
                        onError(token, 'UNEXPECTED_TOKEN', `Unexpected , in ${flow}`);
                    comma = token;
                    atNewline = false;
                    hasSpace = false;
                    break;
                }
            // else fallthrough
            default:
                onError(token, 'UNEXPECTED_TOKEN', `Unexpected ${token.type} token`);
                atNewline = false;
                hasSpace = false;
        }
    }
    const last = tokens[tokens.length - 1];
    const end = last ? last.offset + last.source.length : offset;
    if (reqSpace &&
        next &&
        next.type !== 'space' &&
        next.type !== 'newline' &&
        next.type !== 'comma' &&
        (next.type !== 'scalar' || next.source !== ''))
        onError(next.offset, 'MISSING_CHAR', 'Tags and anchors must be separated from the next token by white space');
    return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        end,
        start: start !== null && start !== void 0 ? start : end
    };
}

exports.resolveProps = resolveProps;


/***/ }),

/***/ 976:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function containsNewline(key) {
    if (!key)
        return null;
    switch (key.type) {
        case 'alias':
        case 'scalar':
        case 'double-quoted-scalar':
        case 'single-quoted-scalar':
            if (key.source.includes('\n'))
                return true;
            if (key.end)
                for (const st of key.end)
                    if (st.type === 'newline')
                        return true;
            return false;
        case 'flow-collection':
            for (const it of key.items) {
                for (const st of it.start)
                    if (st.type === 'newline')
                        return true;
                if (it.sep)
                    for (const st of it.sep)
                        if (st.type === 'newline')
                            return true;
                if (containsNewline(it.key) || containsNewline(it.value))
                    return true;
            }
            return false;
        default:
            return true;
    }
}

exports.containsNewline = containsNewline;


/***/ }),

/***/ 8781:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function emptyScalarPosition(offset, before, pos) {
    if (before) {
        if (pos === null)
            pos = before.length;
        for (let i = pos - 1; i >= 0; --i) {
            let st = before[i];
            switch (st.type) {
                case 'space':
                case 'comment':
                case 'newline':
                    offset -= st.source.length;
                    continue;
            }
            // Technically, an empty scalar is immediately after the last non-empty
            // node, but it's more useful to place it after any whitespace.
            st = before[++i];
            while ((st === null || st === void 0 ? void 0 : st.type) === 'space') {
                offset += st.source.length;
                st = before[++i];
            }
            break;
        }
    }
    return offset;
}

exports.emptyScalarPosition = emptyScalarPosition;


/***/ }),

/***/ 3669:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var utilContainsNewline = __nccwpck_require__(976);

function flowIndentCheck(indent, fc, onError) {
    if ((fc === null || fc === void 0 ? void 0 : fc.type) === 'flow-collection') {
        const end = fc.end[0];
        if (end.indent === indent &&
            (end.source === ']' || end.source === '}') &&
            utilContainsNewline.containsNewline(fc)) {
            const msg = 'Flow end indicator should be more indented than parent';
            onError(end, 'BAD_INDENT', msg, true);
        }
    }
}

exports.flowIndentCheck = flowIndentCheck;


/***/ }),

/***/ 6899:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(1399);

function mapIncludes(ctx, items, search) {
    const { uniqueKeys } = ctx.options;
    if (uniqueKeys === false)
        return false;
    const isEqual = typeof uniqueKeys === 'function'
        ? uniqueKeys
        : (a, b) => a === b ||
            (Node.isScalar(a) &&
                Node.isScalar(b) &&
                a.value === b.value &&
                !(a.value === '<<' && ctx.schema.merge));
    return items.some(pair => isEqual(pair.key, search));
}

exports.mapIncludes = mapIncludes;


/***/ }),

/***/ 42:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Alias = __nccwpck_require__(5639);
var Collection = __nccwpck_require__(3466);
var Node = __nccwpck_require__(1399);
var Pair = __nccwpck_require__(246);
var toJS = __nccwpck_require__(2463);
var options = __nccwpck_require__(7425);
var Schema = __nccwpck_require__(6831);
var stringify = __nccwpck_require__(8409);
var stringifyDocument = __nccwpck_require__(5225);
var anchors = __nccwpck_require__(8459);
var applyReviver = __nccwpck_require__(3412);
var createNode = __nccwpck_require__(9652);
var directives = __nccwpck_require__(5400);

class Document {
    constructor(value, replacer, options$1) {
        /** A comment before this Document */
        this.commentBefore = null;
        /** A comment immediately after this Document */
        this.comment = null;
        /** Errors encountered during parsing. */
        this.errors = [];
        /** Warnings encountered during parsing. */
        this.warnings = [];
        Object.defineProperty(this, Node.NODE_TYPE, { value: Node.DOC });
        let _replacer = null;
        if (typeof replacer === 'function' || Array.isArray(replacer)) {
            _replacer = replacer;
        }
        else if (options$1 === undefined && replacer) {
            options$1 = replacer;
            replacer = undefined;
        }
        const opt = Object.assign({}, options.defaultOptions, options$1);
        this.options = opt;
        let { version } = opt;
        if (options$1 === null || options$1 === void 0 ? void 0 : options$1.directives) {
            this.directives = options$1.directives.atDocument();
            if (this.directives.yaml.explicit)
                version = this.directives.yaml.version;
        }
        else
            this.directives = new directives.Directives({ version });
        this.setSchema(version, options$1);
        if (value === undefined)
            this.contents = null;
        else {
            this.contents = this.createNode(value, _replacer, options$1);
        }
    }
    /**
     * Create a deep copy of this Document and its contents.
     *
     * Custom Node values that inherit from `Object` still refer to their original instances.
     */
    clone() {
        const copy = Object.create(Document.prototype, {
            [Node.NODE_TYPE]: { value: Node.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
            copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = Node.isNode(this.contents)
            ? this.contents.clone(copy.schema)
            : this.contents;
        if (this.range)
            copy.range = this.range.slice();
        return copy;
    }
    /** Adds a value to the document. */
    add(value) {
        if (assertCollection(this.contents))
            this.contents.add(value);
    }
    /** Adds a value to the document. */
    addIn(path, value) {
        if (assertCollection(this.contents))
            this.contents.addIn(path, value);
    }
    /**
     * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
     *
     * If `node` already has an anchor, `name` is ignored.
     * Otherwise, the `node.anchor` value will be set to `name`,
     * or if an anchor with that name is already present in the document,
     * `name` will be used as a prefix for a new unique anchor.
     * If `name` is undefined, the generated anchor will use 'a' as a prefix.
     */
    createAlias(node, name) {
        if (!node.anchor) {
            const prev = anchors.anchorNames(this);
            node.anchor =
                !name || prev.has(name) ? anchors.findNewAnchor(name || 'a', prev) : name;
        }
        return new Alias.Alias(node.anchor);
    }
    createNode(value, replacer, options) {
        let _replacer = undefined;
        if (typeof replacer === 'function') {
            value = replacer.call({ '': value }, '', value);
            _replacer = replacer;
        }
        else if (Array.isArray(replacer)) {
            const keyToStr = (v) => typeof v === 'number' || v instanceof String || v instanceof Number;
            const asStr = replacer.filter(keyToStr).map(String);
            if (asStr.length > 0)
                replacer = replacer.concat(asStr);
            _replacer = replacer;
        }
        else if (options === undefined && replacer) {
            options = replacer;
            replacer = undefined;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options || {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(this, anchorPrefix || 'a');
        const ctx = {
            aliasDuplicateObjects: aliasDuplicateObjects !== null && aliasDuplicateObjects !== void 0 ? aliasDuplicateObjects : true,
            keepUndefined: keepUndefined !== null && keepUndefined !== void 0 ? keepUndefined : false,
            onAnchor,
            onTagObj,
            replacer: _replacer,
            schema: this.schema,
            sourceObjects
        };
        const node = createNode.createNode(value, tag, ctx);
        if (flow && Node.isCollection(node))
            node.flow = true;
        setAnchors();
        return node;
    }
    /**
     * Convert a key and a value into a `Pair` using the current schema,
     * recursively wrapping all values as `Scalar` or `Collection` nodes.
     */
    createPair(key, value, options = {}) {
        const k = this.createNode(key, null, options);
        const v = this.createNode(value, null, options);
        return new Pair.Pair(k, v);
    }
    /**
     * Removes a value from the document.
     * @returns `true` if the item was found and removed.
     */
    delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
    }
    /**
     * Removes a value from the document.
     * @returns `true` if the item was found and removed.
     */
    deleteIn(path) {
        if (Collection.isEmptyPath(path)) {
            if (this.contents == null)
                return false;
            this.contents = null;
            return true;
        }
        return assertCollection(this.contents)
            ? this.contents.deleteIn(path)
            : false;
    }
    /**
     * Returns item at `key`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     */
    get(key, keepScalar) {
        return Node.isCollection(this.contents)
            ? this.contents.get(key, keepScalar)
            : undefined;
    }
    /**
     * Returns item at `path`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     */
    getIn(path, keepScalar) {
        if (Collection.isEmptyPath(path))
            return !keepScalar && Node.isScalar(this.contents)
                ? this.contents.value
                : this.contents;
        return Node.isCollection(this.contents)
            ? this.contents.getIn(path, keepScalar)
            : undefined;
    }
    /**
     * Checks if the document includes a value with the key `key`.
     */
    has(key) {
        return Node.isCollection(this.contents) ? this.contents.has(key) : false;
    }
    /**
     * Checks if the document includes a value at `path`.
     */
    hasIn(path) {
        if (Collection.isEmptyPath(path))
            return this.contents !== undefined;
        return Node.isCollection(this.contents) ? this.contents.hasIn(path) : false;
    }
    /**
     * Sets a value in this document. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     */
    set(key, value) {
        if (this.contents == null) {
            this.contents = Collection.collectionFromPath(this.schema, [key], value);
        }
        else if (assertCollection(this.contents)) {
            this.contents.set(key, value);
        }
    }
    /**
     * Sets a value in this document. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     */
    setIn(path, value) {
        if (Collection.isEmptyPath(path))
            this.contents = value;
        else if (this.contents == null) {
            this.contents = Collection.collectionFromPath(this.schema, Array.from(path), value);
        }
        else if (assertCollection(this.contents)) {
            this.contents.setIn(path, value);
        }
    }
    /**
     * Change the YAML version and schema used by the document.
     * A `null` version disables support for directives, explicit tags, anchors, and aliases.
     * It also requires the `schema` option to be given as a `Schema` instance value.
     *
     * Overrides all previously set schema options.
     */
    setSchema(version, options = {}) {
        if (typeof version === 'number')
            version = String(version);
        let opt;
        switch (version) {
            case '1.1':
                if (this.directives)
                    this.directives.yaml.version = '1.1';
                else
                    this.directives = new directives.Directives({ version: '1.1' });
                opt = { merge: true, resolveKnownTags: false, schema: 'yaml-1.1' };
                break;
            case '1.2':
                if (this.directives)
                    this.directives.yaml.version = '1.2';
                else
                    this.directives = new directives.Directives({ version: '1.2' });
                opt = { merge: false, resolveKnownTags: true, schema: 'core' };
                break;
            case null:
                if (this.directives)
                    delete this.directives;
                opt = null;
                break;
            default: {
                const sv = JSON.stringify(version);
                throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
            }
        }
        // Not using `instanceof Schema` to allow for duck typing
        if (options.schema instanceof Object)
            this.schema = options.schema;
        else if (opt)
            this.schema = new Schema.Schema(Object.assign(opt, options));
        else
            throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
    }
    // json & jsonArg are only used from toJSON()
    toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
            anchors: new Map(),
            doc: this,
            keep: !json,
            mapAsMap: mapAsMap === true,
            mapKeyWarned: false,
            maxAliasCount: typeof maxAliasCount === 'number' ? maxAliasCount : 100,
            stringify: stringify.stringify
        };
        const res = toJS.toJS(this.contents, jsonArg || '', ctx);
        if (typeof onAnchor === 'function')
            for (const { count, res } of ctx.anchors.values())
                onAnchor(res, count);
        return typeof reviver === 'function'
            ? applyReviver.applyReviver(reviver, { '': res }, '', res)
            : res;
    }
    /**
     * A JSON representation of the document `contents`.
     *
     * @param jsonArg Used by `JSON.stringify` to indicate the array index or
     *   property name.
     */
    toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
    }
    /** A YAML representation of the document. */
    toString(options = {}) {
        if (this.errors.length > 0)
            throw new Error('Document with errors cannot be stringified');
        if ('indent' in options &&
            (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
            const s = JSON.stringify(options.indent);
            throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
    }
}
function assertCollection(contents) {
    if (Node.isCollection(contents))
        return true;
    throw new Error('Expected a YAML collection as document contents');
}

exports.Document = Document;


/***/ }),

/***/ 8459:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(1399);
var visit = __nccwpck_require__(6796);

/**
 * Verify that the input string is a valid anchor.
 *
 * Will throw on errors.
 */
function anchorIsValid(anchor) {
    if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
    }
    return true;
}
function anchorNames(root) {
    const anchors = new Set();
    visit.visit(root, {
        Value(_key, node) {
            if (node.anchor)
                anchors.add(node.anchor);
        }
    });
    return anchors;
}
/** Find a new anchor name with the given `prefix` and a one-indexed suffix. */
function findNewAnchor(prefix, exclude) {
    for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!exclude.has(name))
            return name;
    }
}
function createNodeAnchors(doc, prefix) {
    const aliasObjects = [];
    const sourceObjects = new Map();
    let prevAnchors = null;
    return {
        onAnchor(source) {
            aliasObjects.push(source);
            if (!prevAnchors)
                prevAnchors = anchorNames(doc);
            const anchor = findNewAnchor(prefix, prevAnchors);
            prevAnchors.add(anchor);
            return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors() {
            for (const source of aliasObjects) {
                const ref = sourceObjects.get(source);
                if (typeof ref === 'object' &&
                    ref.anchor &&
                    (Node.isScalar(ref.node) || Node.isCollection(ref.node))) {
                    ref.node.anchor = ref.anchor;
                }
                else {
                    const error = new Error('Failed to resolve repeated object (this should not happen)');
                    error.source = source;
                    throw error;
                }
            }
        },
        sourceObjects
    };
}

exports.anchorIsValid = anchorIsValid;
exports.anchorNames = anchorNames;
exports.createNodeAnchors = createNodeAnchors;
exports.findNewAnchor = findNewAnchor;


/***/ }),

/***/ 3412:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * Applies the JSON.parse reviver algorithm as defined in the ECMA-262 spec,
 * in section 24.5.1.1 "Runtime Semantics: InternalizeJSONProperty" of the
 * 2021 edition: https://tc39.es/ecma262/#sec-json.parse
 *
 * Includes extensions for handling Map and Set objects.
 */
function applyReviver(reviver, obj, key, val) {
    if (val && typeof val === 'object') {
        if (Array.isArray(val)) {
            for (let i = 0, len = val.length; i < len; ++i) {
                const v0 = val[i];
                const v1 = applyReviver(reviver, val, String(i), v0);
                if (v1 === undefined)
                    delete val[i];
                else if (v1 !== v0)
                    val[i] = v1;
            }
        }
        else if (val instanceof Map) {
            for (const k of Array.from(val.keys())) {
                const v0 = val.get(k);
                const v1 = applyReviver(reviver, val, k, v0);
                if (v1 === undefined)
                    val.delete(k);
                else if (v1 !== v0)
                    val.set(k, v1);
            }
        }
        else if (val instanceof Set) {
            for (const v0 of Array.from(val)) {
                const v1 = applyReviver(reviver, val, v0, v0);
                if (v1 === undefined)
                    val.delete(v0);
                else if (v1 !== v0) {
                    val.delete(v0);
                    val.add(v1);
                }
            }
        }
        else {
            for (const [k, v0] of Object.entries(val)) {
                const v1 = applyReviver(reviver, val, k, v0);
                if (v1 === undefined)
                    delete val[k];
                else if (v1 !== v0)
                    val[k] = v1;
            }
        }
    }
    return reviver.call(obj, key, val);
}

exports.applyReviver = applyReviver;


/***/ }),

/***/ 9652:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Alias = __nccwpck_require__(5639);
var Node = __nccwpck_require__(1399);
var Scalar = __nccwpck_require__(9338);

const defaultTagPrefix = 'tag:yaml.org,2002:';
function findTagObject(value, tagName, tags) {
    if (tagName) {
        const match = tags.filter(t => t.tag === tagName);
        const tagObj = match.find(t => !t.format) || match[0];
        if (!tagObj)
            throw new Error(`Tag ${tagName} not found`);
        return tagObj;
    }
    return tags.find(t => t.identify && t.identify(value) && !t.format);
}
function createNode(value, tagName, ctx) {
    var _a, _b;
    if (Node.isDocument(value))
        value = value.contents;
    if (Node.isNode(value))
        return value;
    if (Node.isPair(value)) {
        const map = (_b = (_a = ctx.schema[Node.MAP]).createNode) === null || _b === void 0 ? void 0 : _b.call(_a, ctx.schema, null, ctx);
        map.items.push(value);
        return map;
    }
    if (value instanceof String ||
        value instanceof Number ||
        value instanceof Boolean ||
        (typeof BigInt === 'function' && value instanceof BigInt) // not supported everywhere
    ) {
        // https://tc39.es/ecma262/#sec-serializejsonproperty
        value = value.valueOf();
    }
    const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
    // Detect duplicate references to the same object & use Alias nodes for all
    // after first. The `ref` wrapper allows for circular references to resolve.
    let ref = undefined;
    if (aliasDuplicateObjects && value && typeof value === 'object') {
        ref = sourceObjects.get(value);
        if (ref) {
            if (!ref.anchor)
                ref.anchor = onAnchor(value);
            return new Alias.Alias(ref.anchor);
        }
        else {
            ref = { anchor: null, node: null };
            sourceObjects.set(value, ref);
        }
    }
    if (tagName && tagName.startsWith('!!'))
        tagName = defaultTagPrefix + tagName.slice(2);
    let tagObj = findTagObject(value, tagName, schema.tags);
    if (!tagObj) {
        if (value && typeof value.toJSON === 'function')
            value = value.toJSON();
        if (!value || typeof value !== 'object') {
            const node = new Scalar.Scalar(value);
            if (ref)
                ref.node = node;
            return node;
        }
        tagObj =
            value instanceof Map
                ? schema[Node.MAP]
                : Symbol.iterator in Object(value)
                    ? schema[Node.SEQ]
                    : schema[Node.MAP];
    }
    if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
    }
    const node = (tagObj === null || tagObj === void 0 ? void 0 : tagObj.createNode)
        ? tagObj.createNode(ctx.schema, value, ctx)
        : new Scalar.Scalar(value);
    if (tagName)
        node.tag = tagName;
    if (ref)
        ref.node = node;
    return node;
}

exports.createNode = createNode;


/***/ }),

/***/ 5400:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(1399);
var visit = __nccwpck_require__(6796);

const escapeChars = {
    '!': '%21',
    ',': '%2C',
    '[': '%5B',
    ']': '%5D',
    '{': '%7B',
    '}': '%7D'
};
const escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, ch => escapeChars[ch]);
class Directives {
    constructor(yaml, tags) {
        /**
         * The directives-end/doc-start marker `---`. If `null`, a marker may still be
         * included in the document's stringified representation.
         */
        this.marker = null;
        this.yaml = Object.assign({}, Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, Directives.defaultTags, tags);
    }
    clone() {
        const copy = new Directives(this.yaml, this.tags);
        copy.marker = this.marker;
        return copy;
    }
    /**
     * During parsing, get a Directives instance for the current document and
     * update the stream state according to the current version's spec.
     */
    atDocument() {
        const res = new Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
            case '1.1':
                this.atNextDocument = true;
                break;
            case '1.2':
                this.atNextDocument = false;
                this.yaml = {
                    explicit: Directives.defaultYaml.explicit,
                    version: '1.2'
                };
                this.tags = Object.assign({}, Directives.defaultTags);
                break;
        }
        return res;
    }
    /**
     * @param onError - May be called even if the action was successful
     * @returns `true` on success
     */
    add(line, onError) {
        if (this.atNextDocument) {
            this.yaml = { explicit: Directives.defaultYaml.explicit, version: '1.1' };
            this.tags = Object.assign({}, Directives.defaultTags);
            this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name = parts.shift();
        switch (name) {
            case '%TAG': {
                if (parts.length !== 2) {
                    onError(0, '%TAG directive should contain exactly two parts');
                    if (parts.length < 2)
                        return false;
                }
                const [handle, prefix] = parts;
                this.tags[handle] = prefix;
                return true;
            }
            case '%YAML': {
                this.yaml.explicit = true;
                if (parts.length < 1) {
                    onError(0, '%YAML directive should contain exactly one part');
                    return false;
                }
                const [version] = parts;
                if (version === '1.1' || version === '1.2') {
                    this.yaml.version = version;
                    return true;
                }
                else {
                    onError(6, `Unsupported YAML version ${version}`, true);
                    return false;
                }
            }
            default:
                onError(0, `Unknown directive ${name}`, true);
                return false;
        }
    }
    /**
     * Resolves a tag, matching handles to those defined in %TAG directives.
     *
     * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
     *   `'!local'` tag, or `null` if unresolvable.
     */
    tagName(source, onError) {
        if (source === '!')
            return '!'; // non-specific tag
        if (source[0] !== '!') {
            onError(`Not a valid tag: ${source}`);
            return null;
        }
        if (source[1] === '<') {
            const verbatim = source.slice(2, -1);
            if (verbatim === '!' || verbatim === '!!') {
                onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
                return null;
            }
            if (source[source.length - 1] !== '>')
                onError('Verbatim tags must end with a >');
            return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/);
        if (!suffix)
            onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle];
        if (prefix)
            return prefix + decodeURIComponent(suffix);
        if (handle === '!')
            return source; // local tag
        onError(`Could not resolve tag: ${source}`);
        return null;
    }
    /**
     * Given a fully resolved tag, returns its printable string form,
     * taking into account current tag prefixes and defaults.
     */
    tagString(tag) {
        for (const [handle, prefix] of Object.entries(this.tags)) {
            if (tag.startsWith(prefix))
                return handle + escapeTagName(tag.substring(prefix.length));
        }
        return tag[0] === '!' ? tag : `!<${tag}>`;
    }
    toString(doc) {
        const lines = this.yaml.explicit
            ? [`%YAML ${this.yaml.version || '1.2'}`]
            : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && Node.isNode(doc.contents)) {
            const tags = {};
            visit.visit(doc.contents, (_key, node) => {
                if (Node.isNode(node) && node.tag)
                    tags[node.tag] = true;
            });
            tagNames = Object.keys(tags);
        }
        else
            tagNames = [];
        for (const [handle, prefix] of tagEntries) {
            if (handle === '!!' && prefix === 'tag:yaml.org,2002:')
                continue;
            if (!doc || tagNames.some(tn => tn.startsWith(prefix)))
                lines.push(`%TAG ${handle} ${prefix}`);
        }
        return lines.join('\n');
    }
}
Directives.defaultYaml = { explicit: false, version: '1.2' };
Directives.defaultTags = { '!!': 'tag:yaml.org,2002:' };

exports.Directives = Directives;


/***/ }),

/***/ 4236:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


class YAMLError extends Error {
    constructor(name, pos, code, message) {
        super();
        this.name = name;
        this.code = code;
        this.message = message;
        this.pos = pos;
    }
}
class YAMLParseError extends YAMLError {
    constructor(pos, code, message) {
        super('YAMLParseError', pos, code, message);
    }
}
class YAMLWarning extends YAMLError {
    constructor(pos, code, message) {
        super('YAMLWarning', pos, code, message);
    }
}
const prettifyError = (src, lc) => (error) => {
    if (error.pos[0] === -1)
        return;
    error.linePos = error.pos.map(pos => lc.linePos(pos));
    const { line, col } = error.linePos[0];
    error.message += ` at line ${line}, column ${col}`;
    let ci = col - 1;
    let lineStr = src
        .substring(lc.lineStarts[line - 1], lc.lineStarts[line])
        .replace(/[\n\r]+$/, '');
    // Trim to max 80 chars, keeping col position near the middle
    if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = '…' + lineStr.substring(trimStart);
        ci -= trimStart - 1;
    }
    if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + '…';
    // Include previous line in context if pointing at line start
    if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        // Regexp won't match if start is trimmed
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
            prev = prev.substring(0, 79) + '…\n';
        lineStr = prev + lineStr;
    }
    if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error.linePos[1];
        if (end && end.line === line && end.col > col) {
            count = Math.min(end.col - col, 80 - ci);
        }
        const pointer = ' '.repeat(ci) + '^'.repeat(count);
        error.message += `:\n\n${lineStr}\n${pointer}\n`;
    }
};

exports.YAMLError = YAMLError;
exports.YAMLParseError = YAMLParseError;
exports.YAMLWarning = YAMLWarning;
exports.prettifyError = prettifyError;


/***/ }),

/***/ 4083:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var composer = __nccwpck_require__(9493);
var Document = __nccwpck_require__(42);
var Schema = __nccwpck_require__(6831);
var errors = __nccwpck_require__(4236);
var Alias = __nccwpck_require__(5639);
var Node = __nccwpck_require__(1399);
var Pair = __nccwpck_require__(246);
var Scalar = __nccwpck_require__(9338);
var YAMLMap = __nccwpck_require__(6011);
var YAMLSeq = __nccwpck_require__(5161);
var options = __nccwpck_require__(7425);
var cst = __nccwpck_require__(9169);
var lexer = __nccwpck_require__(5976);
var lineCounter = __nccwpck_require__(1929);
var parser = __nccwpck_require__(3328);
var publicApi = __nccwpck_require__(8649);
var visit = __nccwpck_require__(6796);



exports.Composer = composer.Composer;
exports.Document = Document.Document;
exports.Schema = Schema.Schema;
exports.YAMLError = errors.YAMLError;
exports.YAMLParseError = errors.YAMLParseError;
exports.YAMLWarning = errors.YAMLWarning;
exports.Alias = Alias.Alias;
exports.isAlias = Node.isAlias;
exports.isCollection = Node.isCollection;
exports.isDocument = Node.isDocument;
exports.isMap = Node.isMap;
exports.isNode = Node.isNode;
exports.isPair = Node.isPair;
exports.isScalar = Node.isScalar;
exports.isSeq = Node.isSeq;
exports.Pair = Pair.Pair;
exports.Scalar = Scalar.Scalar;
exports.YAMLMap = YAMLMap.YAMLMap;
exports.YAMLSeq = YAMLSeq.YAMLSeq;
exports.defaultOptions = options.defaultOptions;
exports.CST = cst;
exports.Lexer = lexer.Lexer;
exports.LineCounter = lineCounter.LineCounter;
exports.Parser = parser.Parser;
exports.parse = publicApi.parse;
exports.parseAllDocuments = publicApi.parseAllDocuments;
exports.parseDocument = publicApi.parseDocument;
exports.stringify = publicApi.stringify;
exports.visit = visit.visit;


/***/ }),

/***/ 6909:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function debug(logLevel, ...messages) {
    if (logLevel === 'debug')
        console.log(...messages);
}
function warn(logLevel, warning) {
    if (logLevel === 'debug' || logLevel === 'warn') {
        if (typeof process !== 'undefined' && process.emitWarning)
            process.emitWarning(warning);
        else
            console.warn(warning);
    }
}

exports.debug = debug;
exports.warn = warn;


/***/ }),

/***/ 5639:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var anchors = __nccwpck_require__(8459);
var visit = __nccwpck_require__(6796);
var Node = __nccwpck_require__(1399);

class Alias extends Node.NodeBase {
    constructor(source) {
        super(Node.ALIAS);
        this.source = source;
        Object.defineProperty(this, 'tag', {
            set() {
                throw new Error('Alias nodes cannot have tags');
            }
        });
    }
    /**
     * Resolve the value of this alias within `doc`, finding the last
     * instance of the `source` anchor before this node.
     */
    resolve(doc) {
        let found = undefined;
        visit.visit(doc, {
            Node: (_key, node) => {
                if (node === this)
                    return visit.visit.BREAK;
                if (node.anchor === this.source)
                    found = node;
            }
        });
        return found;
    }
    toJSON(_arg, ctx) {
        if (!ctx)
            return { source: this.source };
        const { anchors, doc, maxAliasCount } = ctx;
        const source = this.resolve(doc);
        if (!source) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new ReferenceError(msg);
        }
        const data = anchors.get(source);
        /* istanbul ignore if */
        if (!data || data.res === undefined) {
            const msg = 'This should not happen: Alias anchor was not resolved?';
            throw new ReferenceError(msg);
        }
        if (maxAliasCount >= 0) {
            data.count += 1;
            if (data.aliasCount === 0)
                data.aliasCount = getAliasCount(doc, source, anchors);
            if (data.count * data.aliasCount > maxAliasCount) {
                const msg = 'Excessive alias count indicates a resource exhaustion attack';
                throw new ReferenceError(msg);
            }
        }
        return data.res;
    }
    toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
            anchors.anchorIsValid(this.source);
            if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
                const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
                throw new Error(msg);
            }
            if (ctx.implicitKey)
                return `${src} `;
        }
        return src;
    }
}
function getAliasCount(doc, node, anchors) {
    if (Node.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors && source && anchors.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
    }
    else if (Node.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
            const c = getAliasCount(doc, item, anchors);
            if (c > count)
                count = c;
        }
        return count;
    }
    else if (Node.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors);
        const vc = getAliasCount(doc, node.value, anchors);
        return Math.max(kc, vc);
    }
    return 1;
}

exports.Alias = Alias;


/***/ }),

/***/ 3466:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var createNode = __nccwpck_require__(9652);
var Node = __nccwpck_require__(1399);

function collectionFromPath(schema, path, value) {
    let v = value;
    for (let i = path.length - 1; i >= 0; --i) {
        const k = path[i];
        if (typeof k === 'number' && Number.isInteger(k) && k >= 0) {
            const a = [];
            a[k] = v;
            v = a;
        }
        else {
            v = new Map([[k, v]]);
        }
    }
    return createNode.createNode(v, undefined, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
            throw new Error('This should not happen, please report a bug.');
        },
        schema,
        sourceObjects: new Map()
    });
}
// null, undefined, or an empty non-string iterable (e.g. [])
const isEmptyPath = (path) => path == null ||
    (typeof path === 'object' && !!path[Symbol.iterator]().next().done);
class Collection extends Node.NodeBase {
    constructor(type, schema) {
        super(type);
        Object.defineProperty(this, 'schema', {
            value: schema,
            configurable: true,
            enumerable: false,
            writable: true
        });
    }
    /**
     * Create a copy of this collection.
     *
     * @param schema - If defined, overwrites the original's schema
     */
    clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
            copy.schema = schema;
        copy.items = copy.items.map(it => Node.isNode(it) || Node.isPair(it) ? it.clone(schema) : it);
        if (this.range)
            copy.range = this.range.slice();
        return copy;
    }
    /**
     * Adds a value to the collection. For `!!map` and `!!omap` the value must
     * be a Pair instance or a `{ key, value }` object, which may not have a key
     * that already exists in the map.
     */
    addIn(path, value) {
        if (isEmptyPath(path))
            this.add(value);
        else {
            const [key, ...rest] = path;
            const node = this.get(key, true);
            if (Node.isCollection(node))
                node.addIn(rest, value);
            else if (node === undefined && this.schema)
                this.set(key, collectionFromPath(this.schema, rest, value));
            else
                throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
    }
    /**
     * Removes a value from the collection.
     * @returns `true` if the item was found and removed.
     */
    deleteIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
            return this.delete(key);
        const node = this.get(key, true);
        if (Node.isCollection(node))
            return node.deleteIn(rest);
        else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
    /**
     * Returns item at `key`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     */
    getIn(path, keepScalar) {
        const [key, ...rest] = path;
        const node = this.get(key, true);
        if (rest.length === 0)
            return !keepScalar && Node.isScalar(node) ? node.value : node;
        else
            return Node.isCollection(node) ? node.getIn(rest, keepScalar) : undefined;
    }
    hasAllNullValues(allowScalar) {
        return this.items.every(node => {
            if (!Node.isPair(node))
                return false;
            const n = node.value;
            return (n == null ||
                (allowScalar &&
                    Node.isScalar(n) &&
                    n.value == null &&
                    !n.commentBefore &&
                    !n.comment &&
                    !n.tag));
        });
    }
    /**
     * Checks if the collection includes a value with the key `key`.
     */
    hasIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
            return this.has(key);
        const node = this.get(key, true);
        return Node.isCollection(node) ? node.hasIn(rest) : false;
    }
    /**
     * Sets a value in this collection. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     */
    setIn(path, value) {
        const [key, ...rest] = path;
        if (rest.length === 0) {
            this.set(key, value);
        }
        else {
            const node = this.get(key, true);
            if (Node.isCollection(node))
                node.setIn(rest, value);
            else if (node === undefined && this.schema)
                this.set(key, collectionFromPath(this.schema, rest, value));
            else
                throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
    }
}
Collection.maxFlowStringSingleLineLength = 60;

exports.Collection = Collection;
exports.collectionFromPath = collectionFromPath;
exports.isEmptyPath = isEmptyPath;


/***/ }),

/***/ 1399:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


const ALIAS = Symbol.for('yaml.alias');
const DOC = Symbol.for('yaml.document');
const MAP = Symbol.for('yaml.map');
const PAIR = Symbol.for('yaml.pair');
const SCALAR = Symbol.for('yaml.scalar');
const SEQ = Symbol.for('yaml.seq');
const NODE_TYPE = Symbol.for('yaml.node.type');
const isAlias = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === ALIAS;
const isDocument = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === DOC;
const isMap = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === MAP;
const isPair = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === PAIR;
const isScalar = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === SCALAR;
const isSeq = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === SEQ;
function isCollection(node) {
    if (node && typeof node === 'object')
        switch (node[NODE_TYPE]) {
            case MAP:
            case SEQ:
                return true;
        }
    return false;
}
function isNode(node) {
    if (node && typeof node === 'object')
        switch (node[NODE_TYPE]) {
            case ALIAS:
            case MAP:
            case SCALAR:
            case SEQ:
                return true;
        }
    return false;
}
const hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
class NodeBase {
    constructor(type) {
        Object.defineProperty(this, NODE_TYPE, { value: type });
    }
    /** Create a copy of this node.  */
    clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
            copy.range = this.range.slice();
        return copy;
    }
}

exports.ALIAS = ALIAS;
exports.DOC = DOC;
exports.MAP = MAP;
exports.NODE_TYPE = NODE_TYPE;
exports.NodeBase = NodeBase;
exports.PAIR = PAIR;
exports.SCALAR = SCALAR;
exports.SEQ = SEQ;
exports.hasAnchor = hasAnchor;
exports.isAlias = isAlias;
exports.isCollection = isCollection;
exports.isDocument = isDocument;
exports.isMap = isMap;
exports.isNode = isNode;
exports.isPair = isPair;
exports.isScalar = isScalar;
exports.isSeq = isSeq;


/***/ }),

/***/ 246:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var createNode = __nccwpck_require__(9652);
var stringifyPair = __nccwpck_require__(4875);
var addPairToJSMap = __nccwpck_require__(4676);
var Node = __nccwpck_require__(1399);

function createPair(key, value, ctx) {
    const k = createNode.createNode(key, undefined, ctx);
    const v = createNode.createNode(value, undefined, ctx);
    return new Pair(k, v);
}
class Pair {
    constructor(key, value = null) {
        Object.defineProperty(this, Node.NODE_TYPE, { value: Node.PAIR });
        this.key = key;
        this.value = value;
    }
    clone(schema) {
        let { key, value } = this;
        if (Node.isNode(key))
            key = key.clone(schema);
        if (Node.isNode(value))
            value = value.clone(schema);
        return new Pair(key, value);
    }
    toJSON(_, ctx) {
        const pair = ctx && ctx.mapAsMap ? new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
    }
    toString(ctx, onComment, onChompKeep) {
        return ctx && ctx.doc
            ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep)
            : JSON.stringify(this);
    }
}

exports.Pair = Pair;
exports.createPair = createPair;


/***/ }),

/***/ 9338:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(1399);
var toJS = __nccwpck_require__(2463);

const isScalarValue = (value) => !value || (typeof value !== 'function' && typeof value !== 'object');
class Scalar extends Node.NodeBase {
    constructor(value) {
        super(Node.SCALAR);
        this.value = value;
    }
    toJSON(arg, ctx) {
        return ctx && ctx.keep ? this.value : toJS.toJS(this.value, arg, ctx);
    }
    toString() {
        return String(this.value);
    }
}
Scalar.BLOCK_FOLDED = 'BLOCK_FOLDED';
Scalar.BLOCK_LITERAL = 'BLOCK_LITERAL';
Scalar.PLAIN = 'PLAIN';
Scalar.QUOTE_DOUBLE = 'QUOTE_DOUBLE';
Scalar.QUOTE_SINGLE = 'QUOTE_SINGLE';

exports.Scalar = Scalar;
exports.isScalarValue = isScalarValue;


/***/ }),

/***/ 6011:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var stringifyCollection = __nccwpck_require__(2466);
var addPairToJSMap = __nccwpck_require__(4676);
var Collection = __nccwpck_require__(3466);
var Node = __nccwpck_require__(1399);
var Pair = __nccwpck_require__(246);
var Scalar = __nccwpck_require__(9338);

function findPair(items, key) {
    const k = Node.isScalar(key) ? key.value : key;
    for (const it of items) {
        if (Node.isPair(it)) {
            if (it.key === key || it.key === k)
                return it;
            if (Node.isScalar(it.key) && it.key.value === k)
                return it;
        }
    }
    return undefined;
}
class YAMLMap extends Collection.Collection {
    constructor(schema) {
        super(Node.MAP, schema);
        this.items = [];
    }
    static get tagName() {
        return 'tag:yaml.org,2002:map';
    }
    /**
     * Adds a value to the collection.
     *
     * @param overwrite - If not set `true`, using a key that is already in the
     *   collection will throw. Otherwise, overwrites the previous value.
     */
    add(pair, overwrite) {
        let _pair;
        if (Node.isPair(pair))
            _pair = pair;
        else if (!pair || typeof pair !== 'object' || !('key' in pair)) {
            // In TypeScript, this never happens.
            _pair = new Pair.Pair(pair, pair.value);
        }
        else
            _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema && this.schema.sortMapEntries;
        if (prev) {
            if (!overwrite)
                throw new Error(`Key ${_pair.key} already set`);
            // For scalars, keep the old node & its comments and anchors
            if (Node.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
                prev.value.value = _pair.value;
            else
                prev.value = _pair.value;
        }
        else if (sortEntries) {
            const i = this.items.findIndex(item => sortEntries(_pair, item) < 0);
            if (i === -1)
                this.items.push(_pair);
            else
                this.items.splice(i, 0, _pair);
        }
        else {
            this.items.push(_pair);
        }
    }
    delete(key) {
        const it = findPair(this.items, key);
        if (!it)
            return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
    }
    get(key, keepScalar) {
        const it = findPair(this.items, key);
        const node = it && it.value;
        return !keepScalar && Node.isScalar(node) ? node.value : node;
    }
    has(key) {
        return !!findPair(this.items, key);
    }
    set(key, value) {
        this.add(new Pair.Pair(key, value), true);
    }
    /**
     * @param ctx - Conversion context, originally set in Document#toJS()
     * @param {Class} Type - If set, forces the returned collection type
     * @returns Instance of Type, Map, or Object
     */
    toJSON(_, ctx, Type) {
        const map = Type ? new Type() : ctx && ctx.mapAsMap ? new Map() : {};
        if (ctx && ctx.onCreate)
            ctx.onCreate(map);
        for (const item of this.items)
            addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
    }
    toString(ctx, onComment, onChompKeep) {
        if (!ctx)
            return JSON.stringify(this);
        for (const item of this.items) {
            if (!Node.isPair(item))
                throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
            ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
            blockItemPrefix: '',
            flowChars: { start: '{', end: '}' },
            itemIndent: ctx.indent || '',
            onChompKeep,
            onComment
        });
    }
}

exports.YAMLMap = YAMLMap;
exports.findPair = findPair;


/***/ }),

/***/ 5161:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var stringifyCollection = __nccwpck_require__(2466);
var Collection = __nccwpck_require__(3466);
var Node = __nccwpck_require__(1399);
var Scalar = __nccwpck_require__(9338);
var toJS = __nccwpck_require__(2463);

class YAMLSeq extends Collection.Collection {
    constructor(schema) {
        super(Node.SEQ, schema);
        this.items = [];
    }
    static get tagName() {
        return 'tag:yaml.org,2002:seq';
    }
    add(value) {
        this.items.push(value);
    }
    /**
     * Removes a value from the collection.
     *
     * `key` must contain a representation of an integer for this to succeed.
     * It may be wrapped in a `Scalar`.
     *
     * @returns `true` if the item was found and removed.
     */
    delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== 'number')
            return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
    }
    /**
     * Returns item at `key`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     *
     * `key` must contain a representation of an integer for this to succeed.
     * It may be wrapped in a `Scalar`.
     */
    get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== 'number')
            return undefined;
        const it = this.items[idx];
        return !keepScalar && Node.isScalar(it) ? it.value : it;
    }
    /**
     * Checks if the collection includes a value with the key `key`.
     *
     * `key` must contain a representation of an integer for this to succeed.
     * It may be wrapped in a `Scalar`.
     */
    has(key) {
        const idx = asItemIndex(key);
        return typeof idx === 'number' && idx < this.items.length;
    }
    /**
     * Sets a value in this collection. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     *
     * If `key` does not contain a representation of an integer, this will throw.
     * It may be wrapped in a `Scalar`.
     */
    set(key, value) {
        const idx = asItemIndex(key);
        if (typeof idx !== 'number')
            throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (Node.isScalar(prev) && Scalar.isScalarValue(value))
            prev.value = value;
        else
            this.items[idx] = value;
    }
    toJSON(_, ctx) {
        const seq = [];
        if (ctx && ctx.onCreate)
            ctx.onCreate(seq);
        let i = 0;
        for (const item of this.items)
            seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
    }
    toString(ctx, onComment, onChompKeep) {
        if (!ctx)
            return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
            blockItemPrefix: '- ',
            flowChars: { start: '[', end: ']' },
            itemIndent: (ctx.indent || '') + '  ',
            onChompKeep,
            onComment
        });
    }
}
function asItemIndex(key) {
    let idx = Node.isScalar(key) ? key.value : key;
    if (idx && typeof idx === 'string')
        idx = Number(idx);
    return typeof idx === 'number' && Number.isInteger(idx) && idx >= 0
        ? idx
        : null;
}

exports.YAMLSeq = YAMLSeq;


/***/ }),

/***/ 4676:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var log = __nccwpck_require__(6909);
var stringify = __nccwpck_require__(8409);
var Node = __nccwpck_require__(1399);
var Scalar = __nccwpck_require__(9338);
var toJS = __nccwpck_require__(2463);

const MERGE_KEY = '<<';
function addPairToJSMap(ctx, map, { key, value }) {
    if (ctx && ctx.doc.schema.merge && isMergeKey(key)) {
        value = Node.isAlias(value) ? value.resolve(ctx.doc) : value;
        if (Node.isSeq(value))
            for (const it of value.items)
                mergeToJSMap(ctx, map, it);
        else if (Array.isArray(value))
            for (const it of value)
                mergeToJSMap(ctx, map, it);
        else
            mergeToJSMap(ctx, map, value);
    }
    else {
        const jsKey = toJS.toJS(key, '', ctx);
        if (map instanceof Map) {
            map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        }
        else if (map instanceof Set) {
            map.add(jsKey);
        }
        else {
            const stringKey = stringifyKey(key, jsKey, ctx);
            const jsValue = toJS.toJS(value, stringKey, ctx);
            if (stringKey in map)
                Object.defineProperty(map, stringKey, {
                    value: jsValue,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            else
                map[stringKey] = jsValue;
        }
    }
    return map;
}
const isMergeKey = (key) => key === MERGE_KEY ||
    (Node.isScalar(key) &&
        key.value === MERGE_KEY &&
        (!key.type || key.type === Scalar.Scalar.PLAIN));
// If the value associated with a merge key is a single mapping node, each of
// its key/value pairs is inserted into the current mapping, unless the key
// already exists in it. If the value associated with the merge key is a
// sequence, then this sequence is expected to contain mapping nodes and each
// of these nodes is merged in turn according to its order in the sequence.
// Keys in mapping nodes earlier in the sequence override keys specified in
// later mapping nodes. -- http://yaml.org/type/merge.html
function mergeToJSMap(ctx, map, value) {
    const source = ctx && Node.isAlias(value) ? value.resolve(ctx.doc) : value;
    if (!Node.isMap(source))
        throw new Error('Merge sources must be maps or map aliases');
    const srcMap = source.toJSON(null, ctx, Map);
    for (const [key, value] of srcMap) {
        if (map instanceof Map) {
            if (!map.has(key))
                map.set(key, value);
        }
        else if (map instanceof Set) {
            map.add(key);
        }
        else if (!Object.prototype.hasOwnProperty.call(map, key)) {
            Object.defineProperty(map, key, {
                value,
                writable: true,
                enumerable: true,
                configurable: true
            });
        }
    }
    return map;
}
function stringifyKey(key, jsKey, ctx) {
    if (jsKey === null)
        return '';
    if (typeof jsKey !== 'object')
        return String(jsKey);
    if (Node.isNode(key) && ctx && ctx.doc) {
        const strCtx = stringify.createStringifyContext(ctx.doc, {});
        strCtx.anchors = new Set();
        for (const node of ctx.anchors.keys())
            strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
            let jsonStr = JSON.stringify(strKey);
            if (jsonStr.length > 40)
                jsonStr = jsonStr.substring(0, 36) + '..."';
            log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
            ctx.mapKeyWarned = true;
        }
        return strKey;
    }
    return JSON.stringify(jsKey);
}

exports.addPairToJSMap = addPairToJSMap;


/***/ }),

/***/ 2463:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(1399);

/**
 * Recursively convert any node or its contents to native JavaScript
 *
 * @param value - The input value
 * @param arg - If `value` defines a `toJSON()` method, use this
 *   as its first argument
 * @param ctx - Conversion context, originally set in Document#toJS(). If
 *   `{ keep: true }` is not set, output should be suitable for JSON
 *   stringification.
 */
function toJS(value, arg, ctx) {
    if (Array.isArray(value))
        return value.map((v, i) => toJS(v, String(i), ctx));
    if (value && typeof value.toJSON === 'function') {
        if (!ctx || !Node.hasAnchor(value))
            return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: undefined };
        ctx.anchors.set(value, data);
        ctx.onCreate = res => {
            data.res = res;
            delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
            ctx.onCreate(res);
        return res;
    }
    if (typeof value === 'bigint' && !(ctx && ctx.keep))
        return Number(value);
    return value;
}

exports.toJS = toJS;


/***/ }),

/***/ 7425:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * `yaml` defines document-specific options in three places: as an argument of
 * parse, create and stringify calls, in the values of `YAML.defaultOptions`,
 * and in the version-dependent `YAML.Document.defaults` object. Values set in
 * `YAML.defaultOptions` override version-dependent defaults, and argument
 * options override both.
 */
const defaultOptions = {
    intAsBigInt: false,
    keepSourceTokens: false,
    logLevel: 'warn',
    prettyErrors: true,
    strict: true,
    uniqueKeys: true,
    version: '1.2'
};

exports.defaultOptions = defaultOptions;


/***/ }),

/***/ 9027:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var resolveBlockScalar = __nccwpck_require__(9485);
var resolveFlowScalar = __nccwpck_require__(7578);
var errors = __nccwpck_require__(4236);
var stringifyString = __nccwpck_require__(6226);

function resolveAsScalar(token, strict = true, onError) {
    if (token) {
        const _onError = (pos, code, message) => {
            const offset = typeof pos === 'number' ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
            if (onError)
                onError(offset, code, message);
            else
                throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
            case 'scalar':
            case 'single-quoted-scalar':
            case 'double-quoted-scalar':
                return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
            case 'block-scalar':
                return resolveBlockScalar.resolveBlockScalar(token, strict, _onError);
        }
    }
    return null;
}
/**
 * Create a new scalar token with `value`
 *
 * Values that represent an actual string but may be parsed as a different type should use a `type` other than `'PLAIN'`,
 * as this function does not support any schema operations and won't check for such conflicts.
 *
 * @param value The string representation of the value, which will have its content properly indented.
 * @param context.end Comments and whitespace after the end of the value, or after the block scalar header. If undefined, a newline will be added.
 * @param context.implicitKey Being within an implicit key may affect the resolved type of the token's value.
 * @param context.indent The indent level of the token.
 * @param context.inFlow Is this scalar within a flow collection? This may affect the resolved type of the token's value.
 * @param context.offset The offset position of the token.
 * @param context.type The preferred type of the scalar token. If undefined, the previous type of the `token` will be used, defaulting to `'PLAIN'`.
 */
function createScalarToken(value, context) {
    var _a;
    const { implicitKey = false, indent, inFlow = false, offset = -1, type = 'PLAIN' } = context;
    const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? ' '.repeat(indent) : '',
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
    });
    const end = (_a = context.end) !== null && _a !== void 0 ? _a : [
        { type: 'newline', offset: -1, indent, source: '\n' }
    ];
    switch (source[0]) {
        case '|':
        case '>': {
            const he = source.indexOf('\n');
            const head = source.substring(0, he);
            const body = source.substring(he + 1) + '\n';
            const props = [
                { type: 'block-scalar-header', offset, indent, source: head }
            ];
            if (!addEndtoBlockProps(props, end))
                props.push({ type: 'newline', offset: -1, indent, source: '\n' });
            return { type: 'block-scalar', offset, indent, props, source: body };
        }
        case '"':
            return { type: 'double-quoted-scalar', offset, indent, source, end };
        case "'":
            return { type: 'single-quoted-scalar', offset, indent, source, end };
        default:
            return { type: 'scalar', offset, indent, source, end };
    }
}
/**
 * Set the value of `token` to the given string `value`, overwriting any previous contents and type that it may have.
 *
 * Best efforts are made to retain any comments previously associated with the `token`,
 * though all contents within a collection's `items` will be overwritten.
 *
 * Values that represent an actual string but may be parsed as a different type should use a `type` other than `'PLAIN'`,
 * as this function does not support any schema operations and won't check for such conflicts.
 *
 * @param token Any token. If it does not include an `indent` value, the value will be stringified as if it were an implicit key.
 * @param value The string representation of the value, which will have its content properly indented.
 * @param context.afterKey In most cases, values after a key should have an additional level of indentation.
 * @param context.implicitKey Being within an implicit key may affect the resolved type of the token's value.
 * @param context.inFlow Being within a flow collection may affect the resolved type of the token's value.
 * @param context.type The preferred type of the scalar token. If undefined, the previous type of the `token` will be used, defaulting to `'PLAIN'`.
 */
function setScalarValue(token, value, context = {}) {
    let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
    let indent = 'indent' in token ? token.indent : null;
    if (afterKey && typeof indent === 'number')
        indent += 2;
    if (!type)
        switch (token.type) {
            case 'single-quoted-scalar':
                type = 'QUOTE_SINGLE';
                break;
            case 'double-quoted-scalar':
                type = 'QUOTE_DOUBLE';
                break;
            case 'block-scalar': {
                const header = token.props[0];
                if (header.type !== 'block-scalar-header')
                    throw new Error('Invalid block scalar header');
                type = header.source[0] === '>' ? 'BLOCK_FOLDED' : 'BLOCK_LITERAL';
                break;
            }
            default:
                type = 'PLAIN';
        }
    const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? ' '.repeat(indent) : '',
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
    });
    switch (source[0]) {
        case '|':
        case '>':
            setBlockScalarValue(token, source);
            break;
        case '"':
            setFlowScalarValue(token, source, 'double-quoted-scalar');
            break;
        case "'":
            setFlowScalarValue(token, source, 'single-quoted-scalar');
            break;
        default:
            setFlowScalarValue(token, source, 'scalar');
    }
}
function setBlockScalarValue(token, source) {
    const he = source.indexOf('\n');
    const head = source.substring(0, he);
    const body = source.substring(he + 1) + '\n';
    if (token.type === 'block-scalar') {
        const header = token.props[0];
        if (header.type !== 'block-scalar-header')
            throw new Error('Invalid block scalar header');
        header.source = head;
        token.source = body;
    }
    else {
        const { offset } = token;
        const indent = 'indent' in token ? token.indent : -1;
        const props = [
            { type: 'block-scalar-header', offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, 'end' in token ? token.end : undefined))
            props.push({ type: 'newline', offset: -1, indent, source: '\n' });
        for (const key of Object.keys(token))
            if (key !== 'type' && key !== 'offset')
                delete token[key];
        Object.assign(token, { type: 'block-scalar', indent, props, source: body });
    }
}
/** @returns `true` if last token is a newline */
function addEndtoBlockProps(props, end) {
    if (end)
        for (const st of end)
            switch (st.type) {
                case 'space':
                case 'comment':
                    props.push(st);
                    break;
                case 'newline':
                    props.push(st);
                    return true;
            }
    return false;
}
function setFlowScalarValue(token, source, type) {
    switch (token.type) {
        case 'scalar':
        case 'double-quoted-scalar':
        case 'single-quoted-scalar':
            token.type = type;
            token.source = source;
            break;
        case 'block-scalar': {
            const end = token.props.slice(1);
            let oa = source.length;
            if (token.props[0].type === 'block-scalar-header')
                oa -= token.props[0].source.length;
            for (const tok of end)
                tok.offset += oa;
            delete token.props;
            Object.assign(token, { type, source, end });
            break;
        }
        case 'block-map':
        case 'block-seq': {
            const offset = token.offset + source.length;
            const nl = { type: 'newline', offset, indent: token.indent, source: '\n' };
            delete token.items;
            Object.assign(token, { type, source, end: [nl] });
            break;
        }
        default: {
            const indent = 'indent' in token ? token.indent : -1;
            const end = 'end' in token && Array.isArray(token.end)
                ? token.end.filter(st => st.type === 'space' ||
                    st.type === 'comment' ||
                    st.type === 'newline')
                : [];
            for (const key of Object.keys(token))
                if (key !== 'type' && key !== 'offset')
                    delete token[key];
            Object.assign(token, { type, indent, source, end });
        }
    }
}

exports.createScalarToken = createScalarToken;
exports.resolveAsScalar = resolveAsScalar;
exports.setScalarValue = setScalarValue;


/***/ }),

/***/ 6307:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * Stringify a CST document, token, or collection item
 *
 * Fair warning: This applies no validation whatsoever, and
 * simply concatenates the sources in their logical order.
 */
const stringify = (cst) => 'type' in cst ? stringifyToken(cst) : stringifyItem(cst);
function stringifyToken(token) {
    switch (token.type) {
        case 'block-scalar': {
            let res = '';
            for (const tok of token.props)
                res += stringifyToken(tok);
            return res + token.source;
        }
        case 'block-map':
        case 'block-seq': {
            let res = '';
            for (const item of token.items)
                res += stringifyItem(item);
            return res;
        }
        case 'flow-collection': {
            let res = token.start.source;
            for (const item of token.items)
                res += stringifyItem(item);
            for (const st of token.end)
                res += st.source;
            return res;
        }
        case 'document': {
            let res = stringifyItem(token);
            if (token.end)
                for (const st of token.end)
                    res += st.source;
            return res;
        }
        default: {
            let res = token.source;
            if ('end' in token && token.end)
                for (const st of token.end)
                    res += st.source;
            return res;
        }
    }
}
function stringifyItem({ start, key, sep, value }) {
    let res = '';
    for (const st of start)
        res += st.source;
    if (key)
        res += stringifyToken(key);
    if (sep)
        for (const st of sep)
            res += st.source;
    if (value)
        res += stringifyToken(value);
    return res;
}

exports.stringify = stringify;


/***/ }),

/***/ 8497:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


const BREAK = Symbol('break visit');
const SKIP = Symbol('skip children');
const REMOVE = Symbol('remove item');
/**
 * Apply a visitor to a CST document or item.
 *
 * Walks through the tree (depth-first) starting from the root, calling a
 * `visitor` function with two arguments when entering each item:
 *   - `item`: The current item, which included the following members:
 *     - `start: SourceToken[]` – Source tokens before the key or value,
 *       possibly including its anchor or tag.
 *     - `key?: Token | null` – Set for pair values. May then be `null`, if
 *       the key before the `:` separator is empty.
 *     - `sep?: SourceToken[]` – Source tokens between the key and the value,
 *       which should include the `:` map value indicator if `value` is set.
 *     - `value?: Token` – The value of a sequence item, or of a map pair.
 *   - `path`: The steps from the root to the current node, as an array of
 *     `['key' | 'value', number]` tuples.
 *
 * The return value of the visitor may be used to control the traversal:
 *   - `undefined` (default): Do nothing and continue
 *   - `visit.SKIP`: Do not visit the children of this token, continue with
 *      next sibling
 *   - `visit.BREAK`: Terminate traversal completely
 *   - `visit.REMOVE`: Remove the current item, then continue with the next one
 *   - `number`: Set the index of the next step. This is useful especially if
 *     the index of the current token has changed.
 *   - `function`: Define the next visitor for this item. After the original
 *     visitor is called on item entry, next visitors are called after handling
 *     a non-empty `key` and when exiting the item.
 */
function visit(cst, visitor) {
    if ('type' in cst && cst.type === 'document')
        cst = { start: cst.start, value: cst.value };
    _visit(Object.freeze([]), cst, visitor);
}
// Without the `as symbol` casts, TS declares these in the `visit`
// namespace using `var`, but then complains about that because
// `unique symbol` must be `const`.
/** Terminate visit traversal completely */
visit.BREAK = BREAK;
/** Do not visit the children of the current item */
visit.SKIP = SKIP;
/** Remove the current item */
visit.REMOVE = REMOVE;
/** Find the item at `path` from `cst` as the root */
visit.itemAtPath = (cst, path) => {
    let item = cst;
    for (const [field, index] of path) {
        const tok = item && item[field];
        if (tok && 'items' in tok) {
            item = tok.items[index];
        }
        else
            return undefined;
    }
    return item;
};
/**
 * Get the immediate parent collection of the item at `path` from `cst` as the root.
 *
 * Throws an error if the collection is not found, which should never happen if the item itself exists.
 */
visit.parentCollection = (cst, path) => {
    const parent = visit.itemAtPath(cst, path.slice(0, -1));
    const field = path[path.length - 1][0];
    const coll = parent && parent[field];
    if (coll && 'items' in coll)
        return coll;
    throw new Error('Parent collection not found');
};
function _visit(path, item, visitor) {
    let ctrl = visitor(item, path);
    if (typeof ctrl === 'symbol')
        return ctrl;
    for (const field of ['key', 'value']) {
        const token = item[field];
        if (token && 'items' in token) {
            for (let i = 0; i < token.items.length; ++i) {
                const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
                if (typeof ci === 'number')
                    i = ci - 1;
                else if (ci === BREAK)
                    return BREAK;
                else if (ci === REMOVE) {
                    token.items.splice(i, 1);
                    i -= 1;
                }
            }
            if (typeof ctrl === 'function' && field === 'key')
                ctrl = ctrl(item, path);
        }
    }
    return typeof ctrl === 'function' ? ctrl(item, path) : ctrl;
}

exports.visit = visit;


/***/ }),

/***/ 9169:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var cstScalar = __nccwpck_require__(9027);
var cstStringify = __nccwpck_require__(6307);
var cstVisit = __nccwpck_require__(8497);

/** The byte order mark */
const BOM = '\u{FEFF}';
/** Start of doc-mode */
const DOCUMENT = '\x02'; // C0: Start of Text
/** Unexpected end of flow-mode */
const FLOW_END = '\x18'; // C0: Cancel
/** Next token is a scalar value */
const SCALAR = '\x1f'; // C0: Unit Separator
/** @returns `true` if `token` is a flow or block collection */
const isCollection = (token) => !!token && 'items' in token;
/** @returns `true` if `token` is a flow or block scalar; not an alias */
const isScalar = (token) => !!token &&
    (token.type === 'scalar' ||
        token.type === 'single-quoted-scalar' ||
        token.type === 'double-quoted-scalar' ||
        token.type === 'block-scalar');
/* istanbul ignore next */
/** Get a printable representation of a lexer token */
function prettyToken(token) {
    switch (token) {
        case BOM:
            return '<BOM>';
        case DOCUMENT:
            return '<DOC>';
        case FLOW_END:
            return '<FLOW_END>';
        case SCALAR:
            return '<SCALAR>';
        default:
            return JSON.stringify(token);
    }
}
/** Identify the type of a lexer token. May return `null` for unknown tokens. */
function tokenType(source) {
    switch (source) {
        case BOM:
            return 'byte-order-mark';
        case DOCUMENT:
            return 'doc-mode';
        case FLOW_END:
            return 'flow-error-end';
        case SCALAR:
            return 'scalar';
        case '---':
            return 'doc-start';
        case '...':
            return 'doc-end';
        case '':
        case '\n':
        case '\r\n':
            return 'newline';
        case '-':
            return 'seq-item-ind';
        case '?':
            return 'explicit-key-ind';
        case ':':
            return 'map-value-ind';
        case '{':
            return 'flow-map-start';
        case '}':
            return 'flow-map-end';
        case '[':
            return 'flow-seq-start';
        case ']':
            return 'flow-seq-end';
        case ',':
            return 'comma';
    }
    switch (source[0]) {
        case ' ':
        case '\t':
            return 'space';
        case '#':
            return 'comment';
        case '%':
            return 'directive-line';
        case '*':
            return 'alias';
        case '&':
            return 'anchor';
        case '!':
            return 'tag';
        case "'":
            return 'single-quoted-scalar';
        case '"':
            return 'double-quoted-scalar';
        case '|':
        case '>':
            return 'block-scalar-header';
    }
    return null;
}

exports.createScalarToken = cstScalar.createScalarToken;
exports.resolveAsScalar = cstScalar.resolveAsScalar;
exports.setScalarValue = cstScalar.setScalarValue;
exports.stringify = cstStringify.stringify;
exports.visit = cstVisit.visit;
exports.BOM = BOM;
exports.DOCUMENT = DOCUMENT;
exports.FLOW_END = FLOW_END;
exports.SCALAR = SCALAR;
exports.isCollection = isCollection;
exports.isScalar = isScalar;
exports.prettyToken = prettyToken;
exports.tokenType = tokenType;


/***/ }),

/***/ 5976:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var cst = __nccwpck_require__(9169);

/*
START -> stream

stream
  directive -> line-end -> stream
  indent + line-end -> stream
  [else] -> line-start

line-end
  comment -> line-end
  newline -> .
  input-end -> END

line-start
  doc-start -> doc
  doc-end -> stream
  [else] -> indent -> block-start

block-start
  seq-item-start -> block-start
  explicit-key-start -> block-start
  map-value-start -> block-start
  [else] -> doc

doc
  line-end -> line-start
  spaces -> doc
  anchor -> doc
  tag -> doc
  flow-start -> flow -> doc
  flow-end -> error -> doc
  seq-item-start -> error -> doc
  explicit-key-start -> error -> doc
  map-value-start -> doc
  alias -> doc
  quote-start -> quoted-scalar -> doc
  block-scalar-header -> line-end -> block-scalar(min) -> line-start
  [else] -> plain-scalar(false, min) -> doc

flow
  line-end -> flow
  spaces -> flow
  anchor -> flow
  tag -> flow
  flow-start -> flow -> flow
  flow-end -> .
  seq-item-start -> error -> flow
  explicit-key-start -> flow
  map-value-start -> flow
  alias -> flow
  quote-start -> quoted-scalar -> flow
  comma -> flow
  [else] -> plain-scalar(true, 0) -> flow

quoted-scalar
  quote-end -> .
  [else] -> quoted-scalar

block-scalar(min)
  newline + peek(indent < min) -> .
  [else] -> block-scalar(min)

plain-scalar(is-flow, min)
  scalar-end(is-flow) -> .
  peek(newline + (indent < min)) -> .
  [else] -> plain-scalar(min)
*/
function isEmpty(ch) {
    switch (ch) {
        case undefined:
        case ' ':
        case '\n':
        case '\r':
        case '\t':
            return true;
        default:
            return false;
    }
}
const hexDigits = '0123456789ABCDEFabcdef'.split('');
const tagChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()".split('');
const invalidFlowScalarChars = ',[]{}'.split('');
const invalidAnchorChars = ' ,[]{}\n\r\t'.split('');
const isNotAnchorChar = (ch) => !ch || invalidAnchorChars.includes(ch);
/**
 * Splits an input string into lexical tokens, i.e. smaller strings that are
 * easily identifiable by `tokens.tokenType()`.
 *
 * Lexing starts always in a "stream" context. Incomplete input may be buffered
 * until a complete token can be emitted.
 *
 * In addition to slices of the original input, the following control characters
 * may also be emitted:
 *
 * - `\x02` (Start of Text): A document starts with the next token
 * - `\x18` (Cancel): Unexpected end of flow-mode (indicates an error)
 * - `\x1f` (Unit Separator): Next token is a scalar value
 * - `\u{FEFF}` (Byte order mark): Emitted separately outside documents
 */
class Lexer {
    constructor() {
        /**
         * Flag indicating whether the end of the current buffer marks the end of
         * all input
         */
        this.atEnd = false;
        /**
         * Explicit indent set in block scalar header, as an offset from the current
         * minimum indent, so e.g. set to 1 from a header `|2+`. Set to -1 if not
         * explicitly set.
         */
        this.blockScalarIndent = -1;
        /**
         * Block scalars that include a + (keep) chomping indicator in their header
         * include trailing empty lines, which are otherwise excluded from the
         * scalar's contents.
         */
        this.blockScalarKeep = false;
        /** Current input */
        this.buffer = '';
        /**
         * Flag noting whether the map value indicator : can immediately follow this
         * node within a flow context.
         */
        this.flowKey = false;
        /** Count of surrounding flow collection levels. */
        this.flowLevel = 0;
        /**
         * Minimum level of indentation required for next lines to be parsed as a
         * part of the current scalar value.
         */
        this.indentNext = 0;
        /** Indentation level of the current line. */
        this.indentValue = 0;
        /** Position of the next \n character. */
        this.lineEndPos = null;
        /** Stores the state of the lexer if reaching the end of incpomplete input */
        this.next = null;
        /** A pointer to `buffer`; the current position of the lexer. */
        this.pos = 0;
    }
    /**
     * Generate YAML tokens from the `source` string. If `incomplete`,
     * a part of the last line may be left as a buffer for the next call.
     *
     * @returns A generator of lexical tokens
     */
    *lex(source, incomplete = false) {
        if (source) {
            this.buffer = this.buffer ? this.buffer + source : source;
            this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next || 'stream';
        while (next && (incomplete || this.hasChars(1)))
            next = yield* this.parseNext(next);
    }
    atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === ' ' || ch === '\t')
            ch = this.buffer[++i];
        if (!ch || ch === '#' || ch === '\n')
            return true;
        if (ch === '\r')
            return this.buffer[i + 1] === '\n';
        return false;
    }
    charAt(n) {
        return this.buffer[this.pos + n];
    }
    continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
            let indent = 0;
            while (ch === ' ')
                ch = this.buffer[++indent + offset];
            if (ch === '\r') {
                const next = this.buffer[indent + offset + 1];
                if (next === '\n' || (!next && !this.atEnd))
                    return offset + indent + 1;
            }
            return ch === '\n' || indent >= this.indentNext || (!ch && !this.atEnd)
                ? offset + indent
                : -1;
        }
        if (ch === '-' || ch === '.') {
            const dt = this.buffer.substr(offset, 3);
            if ((dt === '---' || dt === '...') && isEmpty(this.buffer[offset + 3]))
                return -1;
        }
        return offset;
    }
    getLine() {
        let end = this.lineEndPos;
        if (typeof end !== 'number' || (end !== -1 && end < this.pos)) {
            end = this.buffer.indexOf('\n', this.pos);
            this.lineEndPos = end;
        }
        if (end === -1)
            return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === '\r')
            end -= 1;
        return this.buffer.substring(this.pos, end);
    }
    hasChars(n) {
        return this.pos + n <= this.buffer.length;
    }
    setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
    }
    peek(n) {
        return this.buffer.substr(this.pos, n);
    }
    *parseNext(next) {
        switch (next) {
            case 'stream':
                return yield* this.parseStream();
            case 'line-start':
                return yield* this.parseLineStart();
            case 'block-start':
                return yield* this.parseBlockStart();
            case 'doc':
                return yield* this.parseDocument();
            case 'flow':
                return yield* this.parseFlowCollection();
            case 'quoted-scalar':
                return yield* this.parseQuotedScalar();
            case 'block-scalar':
                return yield* this.parseBlockScalar();
            case 'plain-scalar':
                return yield* this.parsePlainScalar();
        }
    }
    *parseStream() {
        let line = this.getLine();
        if (line === null)
            return this.setNext('stream');
        if (line[0] === cst.BOM) {
            yield* this.pushCount(1);
            line = line.substring(1);
        }
        if (line[0] === '%') {
            let dirEnd = line.length;
            const cs = line.indexOf('#');
            if (cs !== -1) {
                const ch = line[cs - 1];
                if (ch === ' ' || ch === '\t')
                    dirEnd = cs - 1;
            }
            while (true) {
                const ch = line[dirEnd - 1];
                if (ch === ' ' || ch === '\t')
                    dirEnd -= 1;
                else
                    break;
            }
            const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
            yield* this.pushCount(line.length - n); // possible comment
            this.pushNewline();
            return 'stream';
        }
        if (this.atLineEnd()) {
            const sp = yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - sp);
            yield* this.pushNewline();
            return 'stream';
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
    }
    *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
            return this.setNext('line-start');
        if (ch === '-' || ch === '.') {
            if (!this.atEnd && !this.hasChars(4))
                return this.setNext('line-start');
            const s = this.peek(3);
            if (s === '---' && isEmpty(this.charAt(3))) {
                yield* this.pushCount(3);
                this.indentValue = 0;
                this.indentNext = 0;
                return 'doc';
            }
            else if (s === '...' && isEmpty(this.charAt(3))) {
                yield* this.pushCount(3);
                return 'stream';
            }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
            this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
    }
    *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
            return this.setNext('block-start');
        if ((ch0 === '-' || ch0 === '?' || ch0 === ':') && isEmpty(ch1)) {
            const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
            this.indentNext = this.indentValue + 1;
            this.indentValue += n;
            return yield* this.parseBlockStart();
        }
        return 'doc';
    }
    *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
            return this.setNext('doc');
        let n = yield* this.pushIndicators();
        switch (line[n]) {
            case '#':
                yield* this.pushCount(line.length - n);
            // fallthrough
            case undefined:
                yield* this.pushNewline();
                return yield* this.parseLineStart();
            case '{':
            case '[':
                yield* this.pushCount(1);
                this.flowKey = false;
                this.flowLevel = 1;
                return 'flow';
            case '}':
            case ']':
                // this is an error
                yield* this.pushCount(1);
                return 'doc';
            case '*':
                yield* this.pushUntil(isNotAnchorChar);
                return 'doc';
            case '"':
            case "'":
                return yield* this.parseQuotedScalar();
            case '|':
            case '>':
                n += yield* this.parseBlockScalarHeader();
                n += yield* this.pushSpaces(true);
                yield* this.pushCount(line.length - n);
                yield* this.pushNewline();
                return yield* this.parseBlockScalar();
            default:
                return yield* this.parsePlainScalar();
        }
    }
    *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
            nl = yield* this.pushNewline();
            sp = yield* this.pushSpaces(true);
            if (nl > 0)
                this.indentValue = indent = sp;
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
            return this.setNext('flow');
        if ((indent !== -1 && indent < this.indentNext && line[0] !== '#') ||
            (indent === 0 &&
                (line.startsWith('---') || line.startsWith('...')) &&
                isEmpty(line[3]))) {
            // Allowing for the terminal ] or } at the same (rather than greater)
            // indent level as the initial [ or { is technically invalid, but
            // failing here would be surprising to users.
            const atFlowEndMarker = indent === this.indentNext - 1 &&
                this.flowLevel === 1 &&
                (line[0] === ']' || line[0] === '}');
            if (!atFlowEndMarker) {
                // this is an error
                this.flowLevel = 0;
                yield cst.FLOW_END;
                return yield* this.parseLineStart();
            }
        }
        let n = 0;
        while (line[n] === ',') {
            n += yield* this.pushCount(1);
            n += yield* this.pushSpaces(true);
            this.flowKey = false;
        }
        n += yield* this.pushIndicators();
        switch (line[n]) {
            case undefined:
                return 'flow';
            case '#':
                yield* this.pushCount(line.length - n);
                return 'flow';
            case '{':
            case '[':
                yield* this.pushCount(1);
                this.flowKey = false;
                this.flowLevel += 1;
                return 'flow';
            case '}':
            case ']':
                yield* this.pushCount(1);
                this.flowKey = true;
                this.flowLevel -= 1;
                return this.flowLevel ? 'flow' : 'doc';
            case '*':
                yield* this.pushUntil(isNotAnchorChar);
                return 'flow';
            case '"':
            case "'":
                this.flowKey = true;
                return yield* this.parseQuotedScalar();
            case ':': {
                const next = this.charAt(1);
                if (this.flowKey || isEmpty(next) || next === ',') {
                    this.flowKey = false;
                    yield* this.pushCount(1);
                    yield* this.pushSpaces(true);
                    return 'flow';
                }
            }
            // fallthrough
            default:
                this.flowKey = false;
                return yield* this.parsePlainScalar();
        }
    }
    *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
            while (end !== -1 && this.buffer[end + 1] === "'")
                end = this.buffer.indexOf("'", end + 2);
        }
        else {
            // double-quote
            while (end !== -1) {
                let n = 0;
                while (this.buffer[end - 1 - n] === '\\')
                    n += 1;
                if (n % 2 === 0)
                    break;
                end = this.buffer.indexOf('"', end + 1);
            }
        }
        // Only looking for newlines within the quotes
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf('\n', this.pos);
        if (nl !== -1) {
            while (nl !== -1) {
                const cs = this.continueScalar(nl + 1);
                if (cs === -1)
                    break;
                nl = qb.indexOf('\n', cs);
            }
            if (nl !== -1) {
                // this is an error caused by an unexpected unindent
                end = nl - (qb[nl - 1] === '\r' ? 2 : 1);
            }
        }
        if (end === -1) {
            if (!this.atEnd)
                return this.setNext('quoted-scalar');
            end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? 'flow' : 'doc';
    }
    *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
            const ch = this.buffer[++i];
            if (ch === '+')
                this.blockScalarKeep = true;
            else if (ch > '0' && ch <= '9')
                this.blockScalarIndent = Number(ch) - 1;
            else if (ch !== '-')
                break;
        }
        return yield* this.pushUntil(ch => isEmpty(ch) || ch === '#');
    }
    *parseBlockScalar() {
        let nl = this.pos - 1; // may be -1 if this.pos === 0
        let indent = 0;
        let ch;
        loop: for (let i = this.pos; (ch = this.buffer[i]); ++i) {
            switch (ch) {
                case ' ':
                    indent += 1;
                    break;
                case '\n':
                    nl = i;
                    indent = 0;
                    break;
                case '\r': {
                    const next = this.buffer[i + 1];
                    if (!next && !this.atEnd)
                        return this.setNext('block-scalar');
                    if (next === '\n')
                        break;
                } // fallthrough
                default:
                    break loop;
            }
        }
        if (!ch && !this.atEnd)
            return this.setNext('block-scalar');
        if (indent >= this.indentNext) {
            if (this.blockScalarIndent === -1)
                this.indentNext = indent;
            else
                this.indentNext += this.blockScalarIndent;
            do {
                const cs = this.continueScalar(nl + 1);
                if (cs === -1)
                    break;
                nl = this.buffer.indexOf('\n', cs);
            } while (nl !== -1);
            if (nl === -1) {
                if (!this.atEnd)
                    return this.setNext('block-scalar');
                nl = this.buffer.length;
            }
        }
        if (!this.blockScalarKeep) {
            do {
                let i = nl - 1;
                let ch = this.buffer[i];
                if (ch === '\r')
                    ch = this.buffer[--i];
                while (ch === ' ' || ch === '\t')
                    ch = this.buffer[--i];
                if (ch === '\n' && i >= this.pos)
                    nl = i;
                else
                    break;
            } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
    }
    *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while ((ch = this.buffer[++i])) {
            if (ch === ':') {
                const next = this.buffer[i + 1];
                if (isEmpty(next) || (inFlow && next === ','))
                    break;
                end = i;
            }
            else if (isEmpty(ch)) {
                let next = this.buffer[i + 1];
                if (ch === '\r') {
                    if (next === '\n') {
                        i += 1;
                        ch = '\n';
                        next = this.buffer[i + 1];
                    }
                    else
                        end = i;
                }
                if (next === '#' || (inFlow && invalidFlowScalarChars.includes(next)))
                    break;
                if (ch === '\n') {
                    const cs = this.continueScalar(i + 1);
                    if (cs === -1)
                        break;
                    i = Math.max(i, cs - 2); // to advance, but still account for ' #'
                }
            }
            else {
                if (inFlow && invalidFlowScalarChars.includes(ch))
                    break;
                end = i;
            }
        }
        if (!ch && !this.atEnd)
            return this.setNext('plain-scalar');
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? 'flow' : 'doc';
    }
    *pushCount(n) {
        if (n > 0) {
            yield this.buffer.substr(this.pos, n);
            this.pos += n;
            return n;
        }
        return 0;
    }
    *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
            yield s;
            this.pos += s.length;
            return s.length;
        }
        else if (allowEmpty)
            yield '';
        return 0;
    }
    *pushIndicators() {
        switch (this.charAt(0)) {
            case '!':
                return ((yield* this.pushTag()) +
                    (yield* this.pushSpaces(true)) +
                    (yield* this.pushIndicators()));
            case '&':
                return ((yield* this.pushUntil(isNotAnchorChar)) +
                    (yield* this.pushSpaces(true)) +
                    (yield* this.pushIndicators()));
            case ':':
            case '?': // this is an error outside flow collections
            case '-': // this is an error
                if (isEmpty(this.charAt(1))) {
                    if (this.flowLevel === 0)
                        this.indentNext = this.indentValue + 1;
                    else if (this.flowKey)
                        this.flowKey = false;
                    return ((yield* this.pushCount(1)) +
                        (yield* this.pushSpaces(true)) +
                        (yield* this.pushIndicators()));
                }
        }
        return 0;
    }
    *pushTag() {
        if (this.charAt(1) === '<') {
            let i = this.pos + 2;
            let ch = this.buffer[i];
            while (!isEmpty(ch) && ch !== '>')
                ch = this.buffer[++i];
            return yield* this.pushToIndex(ch === '>' ? i + 1 : i, false);
        }
        else {
            let i = this.pos + 1;
            let ch = this.buffer[i];
            while (ch) {
                if (tagChars.includes(ch))
                    ch = this.buffer[++i];
                else if (ch === '%' &&
                    hexDigits.includes(this.buffer[i + 1]) &&
                    hexDigits.includes(this.buffer[i + 2])) {
                    ch = this.buffer[(i += 3)];
                }
                else
                    break;
            }
            return yield* this.pushToIndex(i, false);
        }
    }
    *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === '\n')
            return yield* this.pushCount(1);
        else if (ch === '\r' && this.charAt(1) === '\n')
            return yield* this.pushCount(2);
        else
            return 0;
    }
    *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
            ch = this.buffer[++i];
        } while (ch === ' ' || (allowTabs && ch === '\t'));
        const n = i - this.pos;
        if (n > 0) {
            yield this.buffer.substr(this.pos, n);
            this.pos = i;
        }
        return n;
    }
    *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
            ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
    }
}

exports.Lexer = Lexer;


/***/ }),

/***/ 1929:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * Tracks newlines during parsing in order to provide an efficient API for
 * determining the one-indexed `{ line, col }` position for any offset
 * within the input.
 */
class LineCounter {
    constructor() {
        this.lineStarts = [];
        /**
         * Should be called in ascending order. Otherwise, call
         * `lineCounter.lineStarts.sort()` before calling `linePos()`.
         */
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        /**
         * Performs a binary search and returns the 1-indexed { line, col }
         * position of `offset`. If `line === 0`, `addNewLine` has never been
         * called or `offset` is before the first known newline.
         */
        this.linePos = (offset) => {
            let low = 0;
            let high = this.lineStarts.length;
            while (low < high) {
                const mid = (low + high) >> 1; // Math.floor((low + high) / 2)
                if (this.lineStarts[mid] < offset)
                    low = mid + 1;
                else
                    high = mid;
            }
            if (this.lineStarts[low] === offset)
                return { line: low + 1, col: 1 };
            if (low === 0)
                return { line: 0, col: offset };
            const start = this.lineStarts[low - 1];
            return { line: low, col: offset - start + 1 };
        };
    }
}

exports.LineCounter = LineCounter;


/***/ }),

/***/ 3328:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var cst = __nccwpck_require__(9169);
var lexer = __nccwpck_require__(5976);

function includesToken(list, type) {
    for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
            return true;
    return false;
}
function includesNonEmpty(list) {
    for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
            case 'space':
            case 'comment':
            case 'newline':
                break;
            default:
                return true;
        }
    }
    return false;
}
function isFlowToken(token) {
    switch (token === null || token === void 0 ? void 0 : token.type) {
        case 'alias':
        case 'scalar':
        case 'single-quoted-scalar':
        case 'double-quoted-scalar':
        case 'flow-collection':
            return true;
        default:
            return false;
    }
}
function getPrevProps(parent) {
    switch (parent.type) {
        case 'document':
            return parent.start;
        case 'block-map': {
            const it = parent.items[parent.items.length - 1];
            return it.sep || it.start;
        }
        case 'block-seq':
            return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
            return [];
    }
}
/** Note: May modify input array */
function getFirstKeyStartProps(prev) {
    var _a;
    if (prev.length === 0)
        return [];
    let i = prev.length;
    loop: while (--i >= 0) {
        switch (prev[i].type) {
            case 'doc-start':
            case 'explicit-key-ind':
            case 'map-value-ind':
            case 'seq-item-ind':
            case 'newline':
                break loop;
        }
    }
    while (((_a = prev[++i]) === null || _a === void 0 ? void 0 : _a.type) === 'space') {
        /* loop */
    }
    return prev.splice(i, prev.length);
}
function fixFlowSeqItems(fc) {
    if (fc.start.type === 'flow-seq-start') {
        for (const it of fc.items) {
            if (it.sep &&
                !it.value &&
                !includesToken(it.start, 'explicit-key-ind') &&
                !includesToken(it.sep, 'map-value-ind')) {
                if (it.key)
                    it.value = it.key;
                delete it.key;
                if (isFlowToken(it.value)) {
                    if (it.value.end)
                        Array.prototype.push.apply(it.value.end, it.sep);
                    else
                        it.value.end = it.sep;
                }
                else
                    Array.prototype.push.apply(it.start, it.sep);
                delete it.sep;
            }
        }
    }
}
/**
 * A YAML concrete syntax tree (CST) parser
 *
 * ```ts
 * const src: string = ...
 * for (const token of new Parser().parse(src)) {
 *   // token: Token
 * }
 * ```
 *
 * To use the parser with a user-provided lexer:
 *
 * ```ts
 * function* parse(source: string, lexer: Lexer) {
 *   const parser = new Parser()
 *   for (const lexeme of lexer.lex(source))
 *     yield* parser.next(lexeme)
 *   yield* parser.end()
 * }
 *
 * const src: string = ...
 * const lexer = new Lexer()
 * for (const token of parse(src, lexer)) {
 *   // token: Token
 * }
 * ```
 */
class Parser {
    /**
     * @param onNewLine - If defined, called separately with the start position of
     *   each new line (in `parse()`, including the start of input).
     */
    constructor(onNewLine) {
        /** If true, space and sequence indicators count as indentation */
        this.atNewLine = true;
        /** If true, next token is a scalar value */
        this.atScalar = false;
        /** Current indentation level */
        this.indent = 0;
        /** Current offset since the start of parsing */
        this.offset = 0;
        /** On the same line with a block map key */
        this.onKeyLine = false;
        /** Top indicates the node that's currently being built */
        this.stack = [];
        /** The source of the current token, set in parse() */
        this.source = '';
        /** The type of the current token, set in parse() */
        this.type = '';
        // Must be defined after `next()`
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
    }
    /**
     * Parse `source` as a YAML stream.
     * If `incomplete`, a part of the last line may be left as a buffer for the next call.
     *
     * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
     *
     * @returns A generator of tokens representing each directive, document, and other structure.
     */
    *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
            this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
            yield* this.next(lexeme);
        if (!incomplete)
            yield* this.end();
    }
    /**
     * Advance the parser by the `source` of one lexical token.
     */
    *next(source) {
        this.source = source;
        if (process.env.LOG_TOKENS)
            console.log('|', cst.prettyToken(source));
        if (this.atScalar) {
            this.atScalar = false;
            yield* this.step();
            this.offset += source.length;
            return;
        }
        const type = cst.tokenType(source);
        if (!type) {
            const message = `Not a YAML token: ${source}`;
            yield* this.pop({ type: 'error', offset: this.offset, message, source });
            this.offset += source.length;
        }
        else if (type === 'scalar') {
            this.atNewLine = false;
            this.atScalar = true;
            this.type = 'scalar';
        }
        else {
            this.type = type;
            yield* this.step();
            switch (type) {
                case 'newline':
                    this.atNewLine = true;
                    this.indent = 0;
                    if (this.onNewLine)
                        this.onNewLine(this.offset + source.length);
                    break;
                case 'space':
                    if (this.atNewLine && source[0] === ' ')
                        this.indent += source.length;
                    break;
                case 'explicit-key-ind':
                case 'map-value-ind':
                case 'seq-item-ind':
                    if (this.atNewLine)
                        this.indent += source.length;
                    break;
                case 'doc-mode':
                case 'flow-error-end':
                    return;
                default:
                    this.atNewLine = false;
            }
            this.offset += source.length;
        }
    }
    /** Call at end of input to push out any remaining constructions */
    *end() {
        while (this.stack.length > 0)
            yield* this.pop();
    }
    get sourceToken() {
        const st = {
            type: this.type,
            offset: this.offset,
            indent: this.indent,
            source: this.source
        };
        return st;
    }
    *step() {
        const top = this.peek(1);
        if (this.type === 'doc-end' && (!top || top.type !== 'doc-end')) {
            while (this.stack.length > 0)
                yield* this.pop();
            this.stack.push({
                type: 'doc-end',
                offset: this.offset,
                source: this.source
            });
            return;
        }
        if (!top)
            return yield* this.stream();
        switch (top.type) {
            case 'document':
                return yield* this.document(top);
            case 'alias':
            case 'scalar':
            case 'single-quoted-scalar':
            case 'double-quoted-scalar':
                return yield* this.scalar(top);
            case 'block-scalar':
                return yield* this.blockScalar(top);
            case 'block-map':
                return yield* this.blockMap(top);
            case 'block-seq':
                return yield* this.blockSequence(top);
            case 'flow-collection':
                return yield* this.flowCollection(top);
            case 'doc-end':
                return yield* this.documentEnd(top);
        }
        /* istanbul ignore next should not happen */
        yield* this.pop();
    }
    peek(n) {
        return this.stack[this.stack.length - n];
    }
    *pop(error) {
        const token = error || this.stack.pop();
        /* istanbul ignore if should not happen */
        if (!token) {
            const message = 'Tried to pop an empty stack';
            yield { type: 'error', offset: this.offset, source: '', message };
        }
        else if (this.stack.length === 0) {
            yield token;
        }
        else {
            const top = this.peek(1);
            if (token.type === 'block-scalar') {
                // Block scalars use their parent rather than header indent
                token.indent = 'indent' in top ? top.indent : 0;
            }
            else if (token.type === 'flow-collection' && top.type === 'document') {
                // Ignore all indent for top-level flow collections
                token.indent = 0;
            }
            if (token.type === 'flow-collection')
                fixFlowSeqItems(token);
            switch (top.type) {
                case 'document':
                    top.value = token;
                    break;
                case 'block-scalar':
                    top.props.push(token); // error
                    break;
                case 'block-map': {
                    const it = top.items[top.items.length - 1];
                    if (it.value) {
                        top.items.push({ start: [], key: token, sep: [] });
                        this.onKeyLine = true;
                        return;
                    }
                    else if (it.sep) {
                        it.value = token;
                    }
                    else {
                        Object.assign(it, { key: token, sep: [] });
                        this.onKeyLine = !includesToken(it.start, 'explicit-key-ind');
                        return;
                    }
                    break;
                }
                case 'block-seq': {
                    const it = top.items[top.items.length - 1];
                    if (it.value)
                        top.items.push({ start: [], value: token });
                    else
                        it.value = token;
                    break;
                }
                case 'flow-collection': {
                    const it = top.items[top.items.length - 1];
                    if (!it || it.value)
                        top.items.push({ start: [], key: token, sep: [] });
                    else if (it.sep)
                        it.value = token;
                    else
                        Object.assign(it, { key: token, sep: [] });
                    return;
                }
                /* istanbul ignore next should not happen */
                default:
                    yield* this.pop();
                    yield* this.pop(token);
            }
            if ((top.type === 'document' ||
                top.type === 'block-map' ||
                top.type === 'block-seq') &&
                (token.type === 'block-map' || token.type === 'block-seq')) {
                const last = token.items[token.items.length - 1];
                if (last &&
                    !last.sep &&
                    !last.value &&
                    last.start.length > 0 &&
                    !includesNonEmpty(last.start) &&
                    (token.indent === 0 ||
                        last.start.every(st => st.type !== 'comment' || st.indent < token.indent))) {
                    if (top.type === 'document')
                        top.end = last.start;
                    else
                        top.items.push({ start: last.start });
                    token.items.splice(-1, 1);
                }
            }
        }
    }
    *stream() {
        switch (this.type) {
            case 'directive-line':
                yield { type: 'directive', offset: this.offset, source: this.source };
                return;
            case 'byte-order-mark':
            case 'space':
            case 'comment':
            case 'newline':
                yield this.sourceToken;
                return;
            case 'doc-mode':
            case 'doc-start': {
                const doc = {
                    type: 'document',
                    offset: this.offset,
                    start: []
                };
                if (this.type === 'doc-start')
                    doc.start.push(this.sourceToken);
                this.stack.push(doc);
                return;
            }
        }
        yield {
            type: 'error',
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML stream`,
            source: this.source
        };
    }
    *document(doc) {
        if (doc.value)
            return yield* this.lineEnd(doc);
        switch (this.type) {
            case 'doc-start': {
                if (includesNonEmpty(doc.start)) {
                    yield* this.pop();
                    yield* this.step();
                }
                else
                    doc.start.push(this.sourceToken);
                return;
            }
            case 'anchor':
            case 'tag':
            case 'space':
            case 'comment':
            case 'newline':
                doc.start.push(this.sourceToken);
                return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
            this.stack.push(bv);
        else {
            yield {
                type: 'error',
                offset: this.offset,
                message: `Unexpected ${this.type} token in YAML document`,
                source: this.source
            };
        }
    }
    *scalar(scalar) {
        if (this.type === 'map-value-ind') {
            const prev = getPrevProps(this.peek(2));
            const start = getFirstKeyStartProps(prev);
            let sep;
            if (scalar.end) {
                sep = scalar.end;
                sep.push(this.sourceToken);
                delete scalar.end;
            }
            else
                sep = [this.sourceToken];
            const map = {
                type: 'block-map',
                offset: scalar.offset,
                indent: scalar.indent,
                items: [{ start, key: scalar, sep }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
        }
        else
            yield* this.lineEnd(scalar);
    }
    *blockScalar(scalar) {
        switch (this.type) {
            case 'space':
            case 'comment':
            case 'newline':
                scalar.props.push(this.sourceToken);
                return;
            case 'scalar':
                scalar.source = this.source;
                // block-scalar source includes trailing newline
                this.atNewLine = true;
                this.indent = 0;
                if (this.onNewLine) {
                    let nl = this.source.indexOf('\n') + 1;
                    while (nl !== 0) {
                        this.onNewLine(this.offset + nl);
                        nl = this.source.indexOf('\n', nl) + 1;
                    }
                }
                yield* this.pop();
                break;
            /* istanbul ignore next should not happen */
            default:
                yield* this.pop();
                yield* this.step();
        }
    }
    *blockMap(map) {
        var _a;
        const it = map.items[map.items.length - 1];
        // it.sep is true-ish if pair already has key or : separator
        switch (this.type) {
            case 'newline':
                this.onKeyLine = false;
                if (it.value) {
                    const end = 'end' in it.value ? it.value.end : undefined;
                    const last = Array.isArray(end) ? end[end.length - 1] : undefined;
                    if ((last === null || last === void 0 ? void 0 : last.type) === 'comment')
                        end === null || end === void 0 ? void 0 : end.push(this.sourceToken);
                    else
                        map.items.push({ start: [this.sourceToken] });
                }
                else if (it.sep)
                    it.sep.push(this.sourceToken);
                else
                    it.start.push(this.sourceToken);
                return;
            case 'space':
            case 'comment':
                if (it.value)
                    map.items.push({ start: [this.sourceToken] });
                else if (it.sep)
                    it.sep.push(this.sourceToken);
                else {
                    if (this.atIndentedComment(it.start, map.indent)) {
                        const prev = map.items[map.items.length - 2];
                        const end = (_a = prev === null || prev === void 0 ? void 0 : prev.value) === null || _a === void 0 ? void 0 : _a.end;
                        if (Array.isArray(end)) {
                            Array.prototype.push.apply(end, it.start);
                            end.push(this.sourceToken);
                            map.items.pop();
                            return;
                        }
                    }
                    it.start.push(this.sourceToken);
                }
                return;
        }
        if (this.indent >= map.indent) {
            const atNextItem = !this.onKeyLine &&
                this.indent === map.indent &&
                (it.sep || includesNonEmpty(it.start));
            switch (this.type) {
                case 'anchor':
                case 'tag':
                    if (atNextItem || it.value) {
                        map.items.push({ start: [this.sourceToken] });
                        this.onKeyLine = true;
                    }
                    else if (it.sep)
                        it.sep.push(this.sourceToken);
                    else
                        it.start.push(this.sourceToken);
                    return;
                case 'explicit-key-ind':
                    if (!it.sep && !includesToken(it.start, 'explicit-key-ind'))
                        it.start.push(this.sourceToken);
                    else if (atNextItem || it.value)
                        map.items.push({ start: [this.sourceToken] });
                    else
                        this.stack.push({
                            type: 'block-map',
                            offset: this.offset,
                            indent: this.indent,
                            items: [{ start: [this.sourceToken] }]
                        });
                    this.onKeyLine = true;
                    return;
                case 'map-value-ind':
                    if (!it.sep)
                        Object.assign(it, { key: null, sep: [this.sourceToken] });
                    else if (it.value ||
                        (atNextItem && !includesToken(it.start, 'explicit-key-ind')))
                        map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                    else if (includesToken(it.sep, 'map-value-ind'))
                        this.stack.push({
                            type: 'block-map',
                            offset: this.offset,
                            indent: this.indent,
                            items: [{ start: [], key: null, sep: [this.sourceToken] }]
                        });
                    else if (includesToken(it.start, 'explicit-key-ind') &&
                        isFlowToken(it.key) &&
                        !includesToken(it.sep, 'newline')) {
                        const start = getFirstKeyStartProps(it.start);
                        const key = it.key;
                        const sep = it.sep;
                        sep.push(this.sourceToken);
                        // @ts-ignore type guard is wrong here
                        delete it.key, delete it.sep;
                        this.stack.push({
                            type: 'block-map',
                            offset: this.offset,
                            indent: this.indent,
                            items: [{ start, key, sep }]
                        });
                    }
                    else
                        it.sep.push(this.sourceToken);
                    this.onKeyLine = true;
                    return;
                case 'alias':
                case 'scalar':
                case 'single-quoted-scalar':
                case 'double-quoted-scalar': {
                    const fs = this.flowScalar(this.type);
                    if (atNextItem || it.value) {
                        map.items.push({ start: [], key: fs, sep: [] });
                        this.onKeyLine = true;
                    }
                    else if (it.sep) {
                        this.stack.push(fs);
                    }
                    else {
                        Object.assign(it, { key: fs, sep: [] });
                        this.onKeyLine = true;
                    }
                    return;
                }
                default: {
                    const bv = this.startBlockValue(map);
                    if (bv) {
                        if (atNextItem &&
                            bv.type !== 'block-seq' &&
                            includesToken(it.start, 'explicit-key-ind'))
                            map.items.push({ start: [] });
                        this.stack.push(bv);
                        return;
                    }
                }
            }
        }
        yield* this.pop();
        yield* this.step();
    }
    *blockSequence(seq) {
        var _a;
        const it = seq.items[seq.items.length - 1];
        switch (this.type) {
            case 'newline':
                if (it.value) {
                    const end = 'end' in it.value ? it.value.end : undefined;
                    const last = Array.isArray(end) ? end[end.length - 1] : undefined;
                    if ((last === null || last === void 0 ? void 0 : last.type) === 'comment')
                        end === null || end === void 0 ? void 0 : end.push(this.sourceToken);
                    else
                        seq.items.push({ start: [this.sourceToken] });
                }
                else
                    it.start.push(this.sourceToken);
                return;
            case 'space':
            case 'comment':
                if (it.value)
                    seq.items.push({ start: [this.sourceToken] });
                else {
                    if (this.atIndentedComment(it.start, seq.indent)) {
                        const prev = seq.items[seq.items.length - 2];
                        const end = (_a = prev === null || prev === void 0 ? void 0 : prev.value) === null || _a === void 0 ? void 0 : _a.end;
                        if (Array.isArray(end)) {
                            Array.prototype.push.apply(end, it.start);
                            end.push(this.sourceToken);
                            seq.items.pop();
                            return;
                        }
                    }
                    it.start.push(this.sourceToken);
                }
                return;
            case 'anchor':
            case 'tag':
                if (it.value || this.indent <= seq.indent)
                    break;
                it.start.push(this.sourceToken);
                return;
            case 'seq-item-ind':
                if (this.indent !== seq.indent)
                    break;
                if (it.value || includesToken(it.start, 'seq-item-ind'))
                    seq.items.push({ start: [this.sourceToken] });
                else
                    it.start.push(this.sourceToken);
                return;
        }
        if (this.indent > seq.indent) {
            const bv = this.startBlockValue(seq);
            if (bv) {
                this.stack.push(bv);
                return;
            }
        }
        yield* this.pop();
        yield* this.step();
    }
    *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === 'flow-error-end') {
            let top;
            do {
                yield* this.pop();
                top = this.peek(1);
            } while (top && top.type === 'flow-collection');
        }
        else if (fc.end.length === 0) {
            switch (this.type) {
                case 'comma':
                case 'explicit-key-ind':
                    if (!it || it.sep)
                        fc.items.push({ start: [this.sourceToken] });
                    else
                        it.start.push(this.sourceToken);
                    return;
                case 'map-value-ind':
                    if (!it || it.value)
                        fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
                    else if (it.sep)
                        it.sep.push(this.sourceToken);
                    else
                        Object.assign(it, { key: null, sep: [this.sourceToken] });
                    return;
                case 'space':
                case 'comment':
                case 'newline':
                case 'anchor':
                case 'tag':
                    if (!it || it.value)
                        fc.items.push({ start: [this.sourceToken] });
                    else if (it.sep)
                        it.sep.push(this.sourceToken);
                    else
                        it.start.push(this.sourceToken);
                    return;
                case 'alias':
                case 'scalar':
                case 'single-quoted-scalar':
                case 'double-quoted-scalar': {
                    const fs = this.flowScalar(this.type);
                    if (!it || it.value)
                        fc.items.push({ start: [], key: fs, sep: [] });
                    else if (it.sep)
                        this.stack.push(fs);
                    else
                        Object.assign(it, { key: fs, sep: [] });
                    return;
                }
                case 'flow-map-end':
                case 'flow-seq-end':
                    fc.end.push(this.sourceToken);
                    return;
            }
            const bv = this.startBlockValue(fc);
            /* istanbul ignore else should not happen */
            if (bv)
                this.stack.push(bv);
            else {
                yield* this.pop();
                yield* this.step();
            }
        }
        else {
            const parent = this.peek(2);
            if (parent.type === 'block-map' &&
                (this.type === 'map-value-ind' ||
                    (this.type === 'newline' &&
                        !parent.items[parent.items.length - 1].sep))) {
                yield* this.pop();
                yield* this.step();
            }
            else if (this.type === 'map-value-ind' &&
                parent.type !== 'flow-collection') {
                const prev = getPrevProps(parent);
                const start = getFirstKeyStartProps(prev);
                fixFlowSeqItems(fc);
                const sep = fc.end.splice(1, fc.end.length);
                sep.push(this.sourceToken);
                const map = {
                    type: 'block-map',
                    offset: fc.offset,
                    indent: fc.indent,
                    items: [{ start, key: fc, sep }]
                };
                this.onKeyLine = true;
                this.stack[this.stack.length - 1] = map;
            }
            else {
                yield* this.lineEnd(fc);
            }
        }
    }
    flowScalar(type) {
        if (this.onNewLine) {
            let nl = this.source.indexOf('\n') + 1;
            while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf('\n', nl) + 1;
            }
        }
        return {
            type,
            offset: this.offset,
            indent: this.indent,
            source: this.source
        };
    }
    startBlockValue(parent) {
        switch (this.type) {
            case 'alias':
            case 'scalar':
            case 'single-quoted-scalar':
            case 'double-quoted-scalar':
                return this.flowScalar(this.type);
            case 'block-scalar-header':
                return {
                    type: 'block-scalar',
                    offset: this.offset,
                    indent: this.indent,
                    props: [this.sourceToken],
                    source: ''
                };
            case 'flow-map-start':
            case 'flow-seq-start':
                return {
                    type: 'flow-collection',
                    offset: this.offset,
                    indent: this.indent,
                    start: this.sourceToken,
                    items: [],
                    end: []
                };
            case 'seq-item-ind':
                return {
                    type: 'block-seq',
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [this.sourceToken] }]
                };
            case 'explicit-key-ind': {
                this.onKeyLine = true;
                const prev = getPrevProps(parent);
                const start = getFirstKeyStartProps(prev);
                start.push(this.sourceToken);
                return {
                    type: 'block-map',
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start }]
                };
            }
            case 'map-value-ind': {
                this.onKeyLine = true;
                const prev = getPrevProps(parent);
                const start = getFirstKeyStartProps(prev);
                return {
                    type: 'block-map',
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                };
            }
        }
        return null;
    }
    atIndentedComment(start, indent) {
        if (this.type !== 'comment')
            return false;
        if (this.indent <= indent)
            return false;
        return start.every(st => st.type === 'newline' || st.type === 'space');
    }
    *documentEnd(docEnd) {
        if (this.type !== 'doc-mode') {
            if (docEnd.end)
                docEnd.end.push(this.sourceToken);
            else
                docEnd.end = [this.sourceToken];
            if (this.type === 'newline')
                yield* this.pop();
        }
    }
    *lineEnd(token) {
        switch (this.type) {
            case 'comma':
            case 'doc-start':
            case 'doc-end':
            case 'flow-seq-end':
            case 'flow-map-end':
            case 'map-value-ind':
                yield* this.pop();
                yield* this.step();
                break;
            case 'newline':
                this.onKeyLine = false;
            // fallthrough
            case 'space':
            case 'comment':
            default:
                // all other values are errors
                if (token.end)
                    token.end.push(this.sourceToken);
                else
                    token.end = [this.sourceToken];
                if (this.type === 'newline')
                    yield* this.pop();
        }
    }
}

exports.Parser = Parser;


/***/ }),

/***/ 8649:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var composer = __nccwpck_require__(9493);
var Document = __nccwpck_require__(42);
var errors = __nccwpck_require__(4236);
var log = __nccwpck_require__(6909);
var lineCounter = __nccwpck_require__(1929);
var parser = __nccwpck_require__(3328);

function parseOptions(options) {
    const prettyErrors = options.prettyErrors !== false;
    const lineCounter$1 = options.lineCounter || (prettyErrors && new lineCounter.LineCounter()) || null;
    return { lineCounter: lineCounter$1, prettyErrors };
}
/**
 * Parse the input as a stream of YAML documents.
 *
 * Documents should be separated from each other by `...` or `---` marker lines.
 *
 * @returns If an empty `docs` array is returned, it will be of type
 *   EmptyStream and contain additional stream information. In
 *   TypeScript, you should use `'empty' in docs` as a type guard for it.
 */
function parseAllDocuments(source, options = {}) {
    const { lineCounter, prettyErrors } = parseOptions(options);
    const parser$1 = new parser.Parser(lineCounter === null || lineCounter === void 0 ? void 0 : lineCounter.addNewLine);
    const composer$1 = new composer.Composer(options);
    const docs = Array.from(composer$1.compose(parser$1.parse(source)));
    if (prettyErrors && lineCounter)
        for (const doc of docs) {
            doc.errors.forEach(errors.prettifyError(source, lineCounter));
            doc.warnings.forEach(errors.prettifyError(source, lineCounter));
        }
    if (docs.length > 0)
        return docs;
    return Object.assign([], { empty: true }, composer$1.streamInfo());
}
/** Parse an input string into a single YAML.Document */
function parseDocument(source, options = {}) {
    const { lineCounter, prettyErrors } = parseOptions(options);
    const parser$1 = new parser.Parser(lineCounter === null || lineCounter === void 0 ? void 0 : lineCounter.addNewLine);
    const composer$1 = new composer.Composer(options);
    // `doc` is always set by compose.end(true) at the very latest
    let doc = null;
    for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
            doc = _doc;
        else if (doc.options.logLevel !== 'silent') {
            doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), 'MULTIPLE_DOCS', 'Source contains multiple documents; please use YAML.parseAllDocuments()'));
            break;
        }
    }
    if (prettyErrors && lineCounter) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter));
    }
    return doc;
}
function parse(src, reviver, options) {
    let _reviver = undefined;
    if (typeof reviver === 'function') {
        _reviver = reviver;
    }
    else if (options === undefined && reviver && typeof reviver === 'object') {
        options = reviver;
    }
    const doc = parseDocument(src, options);
    if (!doc)
        return null;
    doc.warnings.forEach(warning => log.warn(doc.options.logLevel, warning));
    if (doc.errors.length > 0) {
        if (doc.options.logLevel !== 'silent')
            throw doc.errors[0];
        else
            doc.errors = [];
    }
    return doc.toJS(Object.assign({ reviver: _reviver }, options));
}
function stringify(value, replacer, options) {
    let _replacer = null;
    if (typeof replacer === 'function' || Array.isArray(replacer)) {
        _replacer = replacer;
    }
    else if (options === undefined && replacer) {
        options = replacer;
    }
    if (typeof options === 'string')
        options = options.length;
    if (typeof options === 'number') {
        const indent = Math.round(options);
        options = indent < 1 ? undefined : indent > 8 ? { indent: 8 } : { indent };
    }
    if (value === undefined) {
        const { keepUndefined } = options || replacer || {};
        if (!keepUndefined)
            return undefined;
    }
    return new Document.Document(value, _replacer, options).toString(options);
}

exports.parse = parse;
exports.parseAllDocuments = parseAllDocuments;
exports.parseDocument = parseDocument;
exports.stringify = stringify;


/***/ }),

/***/ 6831:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(1399);
var map = __nccwpck_require__(83);
var seq = __nccwpck_require__(1693);
var string = __nccwpck_require__(2201);
var tags = __nccwpck_require__(4138);

const sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
class Schema {
    constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat)
            ? tags.getTags(compat, 'compat')
            : compat
                ? tags.getTags(null, compat)
                : null;
        this.merge = !!merge;
        this.name = (typeof schema === 'string' && schema) || 'core';
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name);
        this.toStringOptions = toStringDefaults || null;
        Object.defineProperty(this, Node.MAP, { value: map.map });
        Object.defineProperty(this, Node.SCALAR, { value: string.string });
        Object.defineProperty(this, Node.SEQ, { value: seq.seq });
        // Used by createMap()
        this.sortMapEntries =
            sortMapEntries === true ? sortMapEntriesByKey : sortMapEntries || null;
    }
    clone() {
        const copy = Object.create(Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
    }
}

exports.Schema = Schema;


/***/ }),

/***/ 83:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(1399);
var Pair = __nccwpck_require__(246);
var YAMLMap = __nccwpck_require__(6011);

function createMap(schema, obj, ctx) {
    const { keepUndefined, replacer } = ctx;
    const map = new YAMLMap.YAMLMap(schema);
    const add = (key, value) => {
        if (typeof replacer === 'function')
            value = replacer.call(obj, key, value);
        else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
        if (value !== undefined || keepUndefined)
            map.items.push(Pair.createPair(key, value, ctx));
    };
    if (obj instanceof Map) {
        for (const [key, value] of obj)
            add(key, value);
    }
    else if (obj && typeof obj === 'object') {
        for (const key of Object.keys(obj))
            add(key, obj[key]);
    }
    if (typeof schema.sortMapEntries === 'function') {
        map.items.sort(schema.sortMapEntries);
    }
    return map;
}
const map = {
    collection: 'map',
    createNode: createMap,
    default: true,
    nodeClass: YAMLMap.YAMLMap,
    tag: 'tag:yaml.org,2002:map',
    resolve(map, onError) {
        if (!Node.isMap(map))
            onError('Expected a mapping for this tag');
        return map;
    }
};

exports.map = map;


/***/ }),

/***/ 6703:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(9338);

const nullTag = {
    identify: value => value == null,
    createNode: () => new Scalar.Scalar(null),
    default: true,
    tag: 'tag:yaml.org,2002:null',
    test: /^(?:~|[Nn]ull|NULL)?$/,
    resolve: () => new Scalar.Scalar(null),
    stringify: ({ source }, ctx) => source && nullTag.test.test(source) ? source : ctx.options.nullStr
};

exports.nullTag = nullTag;


/***/ }),

/***/ 1693:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var createNode = __nccwpck_require__(9652);
var Node = __nccwpck_require__(1399);
var YAMLSeq = __nccwpck_require__(5161);

function createSeq(schema, obj, ctx) {
    const { replacer } = ctx;
    const seq = new YAMLSeq.YAMLSeq(schema);
    if (obj && Symbol.iterator in Object(obj)) {
        let i = 0;
        for (let it of obj) {
            if (typeof replacer === 'function') {
                const key = obj instanceof Set ? it : String(i++);
                it = replacer.call(obj, key, it);
            }
            seq.items.push(createNode.createNode(it, undefined, ctx));
        }
    }
    return seq;
}
const seq = {
    collection: 'seq',
    createNode: createSeq,
    default: true,
    nodeClass: YAMLSeq.YAMLSeq,
    tag: 'tag:yaml.org,2002:seq',
    resolve(seq, onError) {
        if (!Node.isSeq(seq))
            onError('Expected a sequence for this tag');
        return seq;
    }
};

exports.seq = seq;


/***/ }),

/***/ 2201:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var stringifyString = __nccwpck_require__(6226);

const string = {
    identify: value => typeof value === 'string',
    default: true,
    tag: 'tag:yaml.org,2002:str',
    resolve: str => str,
    stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
    }
};

exports.string = string;


/***/ }),

/***/ 2045:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(9338);

const boolTag = {
    identify: value => typeof value === 'boolean',
    default: true,
    tag: 'tag:yaml.org,2002:bool',
    test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
    resolve: str => new Scalar.Scalar(str[0] === 't' || str[0] === 'T'),
    stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
            const sv = source[0] === 't' || source[0] === 'T';
            if (value === sv)
                return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
};

exports.boolTag = boolTag;


/***/ }),

/***/ 6810:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(9338);
var stringifyNumber = __nccwpck_require__(4174);

const floatNaN = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^(?:[-+]?\.(?:inf|Inf|INF|nan|NaN|NAN))$/,
    resolve: str => str.slice(-3).toLowerCase() === 'nan'
        ? NaN
        : str[0] === '-'
            ? Number.NEGATIVE_INFINITY
            : Number.POSITIVE_INFINITY,
    stringify: stringifyNumber.stringifyNumber
};
const floatExp = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    format: 'EXP',
    test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
    resolve: str => parseFloat(str),
    stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
    }
};
const float = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
    resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str));
        const dot = str.indexOf('.');
        if (dot !== -1 && str[str.length - 1] === '0')
            node.minFractionDigits = str.length - dot - 1;
        return node;
    },
    stringify: stringifyNumber.stringifyNumber
};

exports.float = float;
exports.floatExp = floatExp;
exports.floatNaN = floatNaN;


/***/ }),

/***/ 3019:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var stringifyNumber = __nccwpck_require__(4174);

const intIdentify = (value) => typeof value === 'bigint' || Number.isInteger(value);
const intResolve = (str, offset, radix, { intAsBigInt }) => (intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix));
function intStringify(node, radix, prefix) {
    const { value } = node;
    if (intIdentify(value) && value >= 0)
        return prefix + value.toString(radix);
    return stringifyNumber.stringifyNumber(node);
}
const intOct = {
    identify: value => intIdentify(value) && value >= 0,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'OCT',
    test: /^0o[0-7]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
    stringify: node => intStringify(node, 8, '0o')
};
const int = {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    test: /^[-+]?[0-9]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
    stringify: stringifyNumber.stringifyNumber
};
const intHex = {
    identify: value => intIdentify(value) && value >= 0,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'HEX',
    test: /^0x[0-9a-fA-F]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
    stringify: node => intStringify(node, 16, '0x')
};

exports.int = int;
exports.intHex = intHex;
exports.intOct = intOct;


/***/ }),

/***/ 27:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var map = __nccwpck_require__(83);
var _null = __nccwpck_require__(6703);
var seq = __nccwpck_require__(1693);
var string = __nccwpck_require__(2201);
var bool = __nccwpck_require__(2045);
var float = __nccwpck_require__(6810);
var int = __nccwpck_require__(3019);

const schema = [
    map.map,
    seq.seq,
    string.string,
    _null.nullTag,
    bool.boolTag,
    int.intOct,
    int.int,
    int.intHex,
    float.floatNaN,
    float.floatExp,
    float.float
];

exports.schema = schema;


/***/ }),

/***/ 4545:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(9338);
var map = __nccwpck_require__(83);
var seq = __nccwpck_require__(1693);

function intIdentify(value) {
    return typeof value === 'bigint' || Number.isInteger(value);
}
const stringifyJSON = ({ value }) => JSON.stringify(value);
const jsonScalars = [
    {
        identify: value => typeof value === 'string',
        default: true,
        tag: 'tag:yaml.org,2002:str',
        resolve: str => str,
        stringify: stringifyJSON
    },
    {
        identify: value => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: 'tag:yaml.org,2002:null',
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
    },
    {
        identify: value => typeof value === 'boolean',
        default: true,
        tag: 'tag:yaml.org,2002:bool',
        test: /^true|false$/,
        resolve: str => str === 'true',
        stringify: stringifyJSON
    },
    {
        identify: intIdentify,
        default: true,
        tag: 'tag:yaml.org,2002:int',
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
    },
    {
        identify: value => typeof value === 'number',
        default: true,
        tag: 'tag:yaml.org,2002:float',
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: str => parseFloat(str),
        stringify: stringifyJSON
    }
];
const jsonError = {
    default: true,
    tag: '',
    test: /^/,
    resolve(str, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
        return str;
    }
};
const schema = [map.map, seq.seq].concat(jsonScalars, jsonError);

exports.schema = schema;


/***/ }),

/***/ 4138:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var map = __nccwpck_require__(83);
var _null = __nccwpck_require__(6703);
var seq = __nccwpck_require__(1693);
var string = __nccwpck_require__(2201);
var bool = __nccwpck_require__(2045);
var float = __nccwpck_require__(6810);
var int = __nccwpck_require__(3019);
var schema = __nccwpck_require__(27);
var schema$1 = __nccwpck_require__(4545);
var binary = __nccwpck_require__(5724);
var omap = __nccwpck_require__(8974);
var pairs = __nccwpck_require__(9841);
var schema$2 = __nccwpck_require__(5389);
var set = __nccwpck_require__(7847);
var timestamp = __nccwpck_require__(1156);

const schemas = new Map([
    ['core', schema.schema],
    ['failsafe', [map.map, seq.seq, string.string]],
    ['json', schema$1.schema],
    ['yaml11', schema$2.schema],
    ['yaml-1.1', schema$2.schema]
]);
const tagsByName = {
    binary: binary.binary,
    bool: bool.boolTag,
    float: float.float,
    floatExp: float.floatExp,
    floatNaN: float.floatNaN,
    floatTime: timestamp.floatTime,
    int: int.int,
    intHex: int.intHex,
    intOct: int.intOct,
    intTime: timestamp.intTime,
    map: map.map,
    null: _null.nullTag,
    omap: omap.omap,
    pairs: pairs.pairs,
    seq: seq.seq,
    set: set.set,
    timestamp: timestamp.timestamp
};
const coreKnownTags = {
    'tag:yaml.org,2002:binary': binary.binary,
    'tag:yaml.org,2002:omap': omap.omap,
    'tag:yaml.org,2002:pairs': pairs.pairs,
    'tag:yaml.org,2002:set': set.set,
    'tag:yaml.org,2002:timestamp': timestamp.timestamp
};
function getTags(customTags, schemaName) {
    let tags = schemas.get(schemaName);
    if (!tags) {
        if (Array.isArray(customTags))
            tags = [];
        else {
            const keys = Array.from(schemas.keys())
                .filter(key => key !== 'yaml11')
                .map(key => JSON.stringify(key))
                .join(', ');
            throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
    }
    if (Array.isArray(customTags)) {
        for (const tag of customTags)
            tags = tags.concat(tag);
    }
    else if (typeof customTags === 'function') {
        tags = customTags(tags.slice());
    }
    return tags.map(tag => {
        if (typeof tag !== 'string')
            return tag;
        const tagObj = tagsByName[tag];
        if (tagObj)
            return tagObj;
        const keys = Object.keys(tagsByName)
            .map(key => JSON.stringify(key))
            .join(', ');
        throw new Error(`Unknown custom tag "${tag}"; use one of ${keys}`);
    });
}

exports.coreKnownTags = coreKnownTags;
exports.getTags = getTags;


/***/ }),

/***/ 5724:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(9338);
var stringifyString = __nccwpck_require__(6226);

const binary = {
    identify: value => value instanceof Uint8Array,
    default: false,
    tag: 'tag:yaml.org,2002:binary',
    /**
     * Returns a Buffer in node and an Uint8Array in browsers
     *
     * To use the resulting buffer as an image, you'll want to do something like:
     *
     *   const blob = new Blob([buffer], { type: 'image/jpeg' })
     *   document.querySelector('#photo').src = URL.createObjectURL(blob)
     */
    resolve(src, onError) {
        if (typeof Buffer === 'function') {
            return Buffer.from(src, 'base64');
        }
        else if (typeof atob === 'function') {
            // On IE 11, atob() can't handle newlines
            const str = atob(src.replace(/[\n\r]/g, ''));
            const buffer = new Uint8Array(str.length);
            for (let i = 0; i < str.length; ++i)
                buffer[i] = str.charCodeAt(i);
            return buffer;
        }
        else {
            onError('This environment does not support reading binary tags; either Buffer or atob is required');
            return src;
        }
    },
    stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        const buf = value; // checked earlier by binary.identify()
        let str;
        if (typeof Buffer === 'function') {
            str =
                buf instanceof Buffer
                    ? buf.toString('base64')
                    : Buffer.from(buf.buffer).toString('base64');
        }
        else if (typeof btoa === 'function') {
            let s = '';
            for (let i = 0; i < buf.length; ++i)
                s += String.fromCharCode(buf[i]);
            str = btoa(s);
        }
        else {
            throw new Error('This environment does not support writing binary tags; either Buffer or btoa is required');
        }
        if (!type)
            type = Scalar.Scalar.BLOCK_LITERAL;
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
            const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
            const n = Math.ceil(str.length / lineWidth);
            const lines = new Array(n);
            for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
                lines[i] = str.substr(o, lineWidth);
            }
            str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? '\n' : ' ');
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
    }
};

exports.binary = binary;


/***/ }),

/***/ 2631:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(9338);

function boolStringify({ value, source }, ctx) {
    const boolObj = value ? trueTag : falseTag;
    if (source && boolObj.test.test(source))
        return source;
    return value ? ctx.options.trueStr : ctx.options.falseStr;
}
const trueTag = {
    identify: value => value === true,
    default: true,
    tag: 'tag:yaml.org,2002:bool',
    test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
    resolve: () => new Scalar.Scalar(true),
    stringify: boolStringify
};
const falseTag = {
    identify: value => value === false,
    default: true,
    tag: 'tag:yaml.org,2002:bool',
    test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/i,
    resolve: () => new Scalar.Scalar(false),
    stringify: boolStringify
};

exports.falseTag = falseTag;
exports.trueTag = trueTag;


/***/ }),

/***/ 8035:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(9338);
var stringifyNumber = __nccwpck_require__(4174);

const floatNaN = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^[-+]?\.(?:inf|Inf|INF|nan|NaN|NAN)$/,
    resolve: (str) => str.slice(-3).toLowerCase() === 'nan'
        ? NaN
        : str[0] === '-'
            ? Number.NEGATIVE_INFINITY
            : Number.POSITIVE_INFINITY,
    stringify: stringifyNumber.stringifyNumber
};
const floatExp = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    format: 'EXP',
    test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
    resolve: (str) => parseFloat(str.replace(/_/g, '')),
    stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
    }
};
const float = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
    resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, '')));
        const dot = str.indexOf('.');
        if (dot !== -1) {
            const f = str.substring(dot + 1).replace(/_/g, '');
            if (f[f.length - 1] === '0')
                node.minFractionDigits = f.length;
        }
        return node;
    },
    stringify: stringifyNumber.stringifyNumber
};

exports.float = float;
exports.floatExp = floatExp;
exports.floatNaN = floatNaN;


/***/ }),

/***/ 9503:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var stringifyNumber = __nccwpck_require__(4174);

const intIdentify = (value) => typeof value === 'bigint' || Number.isInteger(value);
function intResolve(str, offset, radix, { intAsBigInt }) {
    const sign = str[0];
    if (sign === '-' || sign === '+')
        offset += 1;
    str = str.substring(offset).replace(/_/g, '');
    if (intAsBigInt) {
        switch (radix) {
            case 2:
                str = `0b${str}`;
                break;
            case 8:
                str = `0o${str}`;
                break;
            case 16:
                str = `0x${str}`;
                break;
        }
        const n = BigInt(str);
        return sign === '-' ? BigInt(-1) * n : n;
    }
    const n = parseInt(str, radix);
    return sign === '-' ? -1 * n : n;
}
function intStringify(node, radix, prefix) {
    const { value } = node;
    if (intIdentify(value)) {
        const str = value.toString(radix);
        return value < 0 ? '-' + prefix + str.substr(1) : prefix + str;
    }
    return stringifyNumber.stringifyNumber(node);
}
const intBin = {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'BIN',
    test: /^[-+]?0b[0-1_]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
    stringify: node => intStringify(node, 2, '0b')
};
const intOct = {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'OCT',
    test: /^[-+]?0[0-7_]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
    stringify: node => intStringify(node, 8, '0')
};
const int = {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    test: /^[-+]?[0-9][0-9_]*$/,
    resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
    stringify: stringifyNumber.stringifyNumber
};
const intHex = {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'HEX',
    test: /^[-+]?0x[0-9a-fA-F_]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
    stringify: node => intStringify(node, 16, '0x')
};

exports.int = int;
exports.intBin = intBin;
exports.intHex = intHex;
exports.intOct = intOct;


/***/ }),

/***/ 8974:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var YAMLSeq = __nccwpck_require__(5161);
var toJS = __nccwpck_require__(2463);
var Node = __nccwpck_require__(1399);
var YAMLMap = __nccwpck_require__(6011);
var pairs = __nccwpck_require__(9841);

class YAMLOMap extends YAMLSeq.YAMLSeq {
    constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = YAMLOMap.tag;
    }
    /**
     * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
     * but TypeScript won't allow widening the signature of a child method.
     */
    toJSON(_, ctx) {
        if (!ctx)
            return super.toJSON(_);
        const map = new Map();
        if (ctx && ctx.onCreate)
            ctx.onCreate(map);
        for (const pair of this.items) {
            let key, value;
            if (Node.isPair(pair)) {
                key = toJS.toJS(pair.key, '', ctx);
                value = toJS.toJS(pair.value, key, ctx);
            }
            else {
                key = toJS.toJS(pair, '', ctx);
            }
            if (map.has(key))
                throw new Error('Ordered maps must not include duplicate keys');
            map.set(key, value);
        }
        return map;
    }
}
YAMLOMap.tag = 'tag:yaml.org,2002:omap';
const omap = {
    collection: 'seq',
    identify: value => value instanceof Map,
    nodeClass: YAMLOMap,
    default: false,
    tag: 'tag:yaml.org,2002:omap',
    resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
            if (Node.isScalar(key)) {
                if (seenKeys.includes(key.value)) {
                    onError(`Ordered maps must not include duplicate keys: ${key.value}`);
                }
                else {
                    seenKeys.push(key.value);
                }
            }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
    },
    createNode(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap = new YAMLOMap();
        omap.items = pairs$1.items;
        return omap;
    }
};

exports.YAMLOMap = YAMLOMap;
exports.omap = omap;


/***/ }),

/***/ 9841:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(1399);
var Pair = __nccwpck_require__(246);
var Scalar = __nccwpck_require__(9338);
var YAMLSeq = __nccwpck_require__(5161);

function resolvePairs(seq, onError) {
    if (Node.isSeq(seq)) {
        for (let i = 0; i < seq.items.length; ++i) {
            let item = seq.items[i];
            if (Node.isPair(item))
                continue;
            else if (Node.isMap(item)) {
                if (item.items.length > 1)
                    onError('Each pair must have its own sequence indicator');
                const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
                if (item.commentBefore)
                    pair.key.commentBefore = pair.key.commentBefore
                        ? `${item.commentBefore}\n${pair.key.commentBefore}`
                        : item.commentBefore;
                if (item.comment) {
                    const cn = pair.value || pair.key;
                    cn.comment = cn.comment
                        ? `${item.comment}\n${cn.comment}`
                        : item.comment;
                }
                item = pair;
            }
            seq.items[i] = Node.isPair(item) ? item : new Pair.Pair(item);
        }
    }
    else
        onError('Expected a sequence for this tag');
    return seq;
}
function createPairs(schema, iterable, ctx) {
    const { replacer } = ctx;
    const pairs = new YAMLSeq.YAMLSeq(schema);
    pairs.tag = 'tag:yaml.org,2002:pairs';
    let i = 0;
    if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
            if (typeof replacer === 'function')
                it = replacer.call(iterable, String(i++), it);
            let key, value;
            if (Array.isArray(it)) {
                if (it.length === 2) {
                    key = it[0];
                    value = it[1];
                }
                else
                    throw new TypeError(`Expected [key, value] tuple: ${it}`);
            }
            else if (it && it instanceof Object) {
                const keys = Object.keys(it);
                if (keys.length === 1) {
                    key = keys[0];
                    value = it[key];
                }
                else
                    throw new TypeError(`Expected { key: value } tuple: ${it}`);
            }
            else {
                key = it;
            }
            pairs.items.push(Pair.createPair(key, value, ctx));
        }
    return pairs;
}
const pairs = {
    collection: 'seq',
    default: false,
    tag: 'tag:yaml.org,2002:pairs',
    resolve: resolvePairs,
    createNode: createPairs
};

exports.createPairs = createPairs;
exports.pairs = pairs;
exports.resolvePairs = resolvePairs;


/***/ }),

/***/ 5389:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var map = __nccwpck_require__(83);
var _null = __nccwpck_require__(6703);
var seq = __nccwpck_require__(1693);
var string = __nccwpck_require__(2201);
var binary = __nccwpck_require__(5724);
var bool = __nccwpck_require__(2631);
var float = __nccwpck_require__(8035);
var int = __nccwpck_require__(9503);
var omap = __nccwpck_require__(8974);
var pairs = __nccwpck_require__(9841);
var set = __nccwpck_require__(7847);
var timestamp = __nccwpck_require__(1156);

const schema = [
    map.map,
    seq.seq,
    string.string,
    _null.nullTag,
    bool.trueTag,
    bool.falseTag,
    int.intBin,
    int.intOct,
    int.int,
    int.intHex,
    float.floatNaN,
    float.floatExp,
    float.float,
    binary.binary,
    omap.omap,
    pairs.pairs,
    set.set,
    timestamp.intTime,
    timestamp.floatTime,
    timestamp.timestamp
];

exports.schema = schema;


/***/ }),

/***/ 7847:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(1399);
var Pair = __nccwpck_require__(246);
var YAMLMap = __nccwpck_require__(6011);

class YAMLSet extends YAMLMap.YAMLMap {
    constructor(schema) {
        super(schema);
        this.tag = YAMLSet.tag;
    }
    add(key) {
        let pair;
        if (Node.isPair(key))
            pair = key;
        else if (typeof key === 'object' &&
            'key' in key &&
            'value' in key &&
            key.value === null)
            pair = new Pair.Pair(key.key, null);
        else
            pair = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
            this.items.push(pair);
    }
    get(key, keepPair) {
        const pair = YAMLMap.findPair(this.items, key);
        return !keepPair && Node.isPair(pair)
            ? Node.isScalar(pair.key)
                ? pair.key.value
                : pair.key
            : pair;
    }
    set(key, value) {
        if (typeof value !== 'boolean')
            throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value) {
            this.items.splice(this.items.indexOf(prev), 1);
        }
        else if (!prev && value) {
            this.items.push(new Pair.Pair(key));
        }
    }
    toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
    }
    toString(ctx, onComment, onChompKeep) {
        if (!ctx)
            return JSON.stringify(this);
        if (this.hasAllNullValues(true))
            return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
            throw new Error('Set items must all have null values');
    }
}
YAMLSet.tag = 'tag:yaml.org,2002:set';
const set = {
    collection: 'map',
    identify: value => value instanceof Set,
    nodeClass: YAMLSet,
    default: false,
    tag: 'tag:yaml.org,2002:set',
    resolve(map, onError) {
        if (Node.isMap(map)) {
            if (map.hasAllNullValues(true))
                return Object.assign(new YAMLSet(), map);
            else
                onError('Set items must all have null values');
        }
        else
            onError('Expected a mapping for this tag');
        return map;
    },
    createNode(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set = new YAMLSet(schema);
        if (iterable && Symbol.iterator in Object(iterable))
            for (let value of iterable) {
                if (typeof replacer === 'function')
                    value = replacer.call(iterable, value, value);
                set.items.push(Pair.createPair(value, null, ctx));
            }
        return set;
    }
};

exports.YAMLSet = YAMLSet;
exports.set = set;


/***/ }),

/***/ 1156:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var stringifyNumber = __nccwpck_require__(4174);

/** Internal types handle bigint as number, because TS can't figure it out. */
function parseSexagesimal(str, asBigInt) {
    const sign = str[0];
    const parts = sign === '-' || sign === '+' ? str.substring(1) : str;
    const num = (n) => asBigInt ? BigInt(n) : Number(n);
    const res = parts
        .replace(/_/g, '')
        .split(':')
        .reduce((res, p) => res * num(60) + num(p), num(0));
    return (sign === '-' ? num(-1) * res : res);
}
/**
 * hhhh:mm:ss.sss
 *
 * Internal types handle bigint as number, because TS can't figure it out.
 */
function stringifySexagesimal(node) {
    let { value } = node;
    let num = (n) => n;
    if (typeof value === 'bigint')
        num = n => BigInt(n);
    else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
    let sign = '';
    if (value < 0) {
        sign = '-';
        value *= num(-1);
    }
    const _60 = num(60);
    const parts = [value % _60]; // seconds, including ms
    if (value < 60) {
        parts.unshift(0); // at least one : is required
    }
    else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60); // minutes
        if (value >= 60) {
            value = (value - parts[0]) / _60;
            parts.unshift(value); // hours
        }
    }
    return (sign +
        parts
            .map(n => (n < 10 ? '0' + String(n) : String(n)))
            .join(':')
            .replace(/000000\d*$/, '') // % 60 may introduce error
    );
}
const intTime = {
    identify: value => typeof value === 'bigint' || Number.isInteger(value),
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'TIME',
    test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
    resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
    stringify: stringifySexagesimal
};
const floatTime = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    format: 'TIME',
    test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
    resolve: str => parseSexagesimal(str, false),
    stringify: stringifySexagesimal
};
const timestamp = {
    identify: value => value instanceof Date,
    default: true,
    tag: 'tag:yaml.org,2002:timestamp',
    // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
    // may be omitted altogether, resulting in a date format. In such a case, the time part is
    // assumed to be 00:00:00Z (start of day, UTC).
    test: RegExp('^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})' + // YYYY-Mm-Dd
        '(?:' + // time is optional
        '(?:t|T|[ \\t]+)' + // t | T | whitespace
        '([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)' + // Hh:Mm:Ss(.ss)?
        '(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?' + // Z | +5 | -03:30
        ')?$'),
    resolve(str) {
        const match = str.match(timestamp.test);
        if (!match)
            throw new Error('!!timestamp expects a date, starting with yyyy-mm-dd');
        const [, year, month, day, hour, minute, second] = match.map(Number);
        const millisec = match[7] ? Number((match[7] + '00').substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match[8];
        if (tz && tz !== 'Z') {
            let d = parseSexagesimal(tz, false);
            if (Math.abs(d) < 30)
                d *= 60;
            date -= 60000 * d;
        }
        return new Date(date);
    },
    stringify: ({ value }) => value.toISOString().replace(/((T00:00)?:00)?\.000Z$/, '')
};

exports.floatTime = floatTime;
exports.intTime = intTime;
exports.timestamp = timestamp;


/***/ }),

/***/ 2889:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


const FOLD_FLOW = 'flow';
const FOLD_BLOCK = 'block';
const FOLD_QUOTED = 'quoted';
/**
 * Tries to keep input at up to `lineWidth` characters, splitting only on spaces
 * not followed by newlines or spaces unless `mode` is `'quoted'`. Lines are
 * terminated with `\n` and started with `indent`.
 */
function foldFlowLines(text, indent, mode = 'flow', { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
    if (!lineWidth || lineWidth < 0)
        return text;
    const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
    if (text.length <= endStep)
        return text;
    const folds = [];
    const escapedFolds = {};
    let end = lineWidth - indent.length;
    if (typeof indentAtStart === 'number') {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
            folds.push(0);
        else
            end = lineWidth - indentAtStart;
    }
    let split = undefined;
    let prev = undefined;
    let overflow = false;
    let i = -1;
    let escStart = -1;
    let escEnd = -1;
    if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text, i);
        if (i !== -1)
            end = i + endStep;
    }
    for (let ch; (ch = text[(i += 1)]);) {
        if (mode === FOLD_QUOTED && ch === '\\') {
            escStart = i;
            switch (text[i + 1]) {
                case 'x':
                    i += 3;
                    break;
                case 'u':
                    i += 5;
                    break;
                case 'U':
                    i += 9;
                    break;
                default:
                    i += 1;
            }
            escEnd = i;
        }
        if (ch === '\n') {
            if (mode === FOLD_BLOCK)
                i = consumeMoreIndentedLines(text, i);
            end = i + endStep;
            split = undefined;
        }
        else {
            if (ch === ' ' &&
                prev &&
                prev !== ' ' &&
                prev !== '\n' &&
                prev !== '\t') {
                // space surrounded by non-space can be replaced with newline + indent
                const next = text[i + 1];
                if (next && next !== ' ' && next !== '\n' && next !== '\t')
                    split = i;
            }
            if (i >= end) {
                if (split) {
                    folds.push(split);
                    end = split + endStep;
                    split = undefined;
                }
                else if (mode === FOLD_QUOTED) {
                    // white-space collected at end may stretch past lineWidth
                    while (prev === ' ' || prev === '\t') {
                        prev = ch;
                        ch = text[(i += 1)];
                        overflow = true;
                    }
                    // Account for newline escape, but don't break preceding escape
                    const j = i > escEnd + 1 ? i - 2 : escStart - 1;
                    // Bail out if lineWidth & minContentWidth are shorter than an escape string
                    if (escapedFolds[j])
                        return text;
                    folds.push(j);
                    escapedFolds[j] = true;
                    end = j + endStep;
                    split = undefined;
                }
                else {
                    overflow = true;
                }
            }
        }
        prev = ch;
    }
    if (overflow && onOverflow)
        onOverflow();
    if (folds.length === 0)
        return text;
    if (onFold)
        onFold();
    let res = text.slice(0, folds[0]);
    for (let i = 0; i < folds.length; ++i) {
        const fold = folds[i];
        const end = folds[i + 1] || text.length;
        if (fold === 0)
            res = `\n${indent}${text.slice(0, end)}`;
        else {
            if (mode === FOLD_QUOTED && escapedFolds[fold])
                res += `${text[fold]}\\`;
            res += `\n${indent}${text.slice(fold + 1, end)}`;
        }
    }
    return res;
}
/**
 * Presumes `i + 1` is at the start of a line
 * @returns index of last newline in more-indented block
 */
function consumeMoreIndentedLines(text, i) {
    let ch = text[i + 1];
    while (ch === ' ' || ch === '\t') {
        do {
            ch = text[(i += 1)];
        } while (ch && ch !== '\n');
        ch = text[i + 1];
    }
    return i;
}

exports.FOLD_BLOCK = FOLD_BLOCK;
exports.FOLD_FLOW = FOLD_FLOW;
exports.FOLD_QUOTED = FOLD_QUOTED;
exports.foldFlowLines = foldFlowLines;


/***/ }),

/***/ 8409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var anchors = __nccwpck_require__(8459);
var Node = __nccwpck_require__(1399);
var stringifyComment = __nccwpck_require__(5182);
var stringifyString = __nccwpck_require__(6226);

function createStringifyContext(doc, options) {
    const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: 'PLAIN',
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: 'false',
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: 'null',
        simpleKeys: false,
        singleQuote: null,
        trueStr: 'true',
        verifyAliasOrder: true
    }, doc.schema.toStringOptions, options);
    let inFlow;
    switch (opt.collectionStyle) {
        case 'block':
            inFlow = false;
            break;
        case 'flow':
            inFlow = true;
            break;
        default:
            inFlow = null;
    }
    return {
        anchors: new Set(),
        doc,
        indent: '',
        indentStep: typeof opt.indent === 'number' ? ' '.repeat(opt.indent) : '  ',
        inFlow,
        options: opt
    };
}
function getTagObject(tags, item) {
    if (item.tag) {
        const match = tags.filter(t => t.tag === item.tag);
        if (match.length > 0)
            return match.find(t => t.format === item.format) || match[0];
    }
    let tagObj = undefined;
    let obj;
    if (Node.isScalar(item)) {
        obj = item.value;
        const match = tags.filter(t => t.identify && t.identify(obj));
        tagObj =
            match.find(t => t.format === item.format) || match.find(t => !t.format);
    }
    else {
        obj = item;
        tagObj = tags.find(t => t.nodeClass && obj instanceof t.nodeClass);
    }
    if (!tagObj) {
        // @ts-ignore
        const name = obj && obj.constructor ? obj.constructor.name : typeof obj;
        throw new Error(`Tag not resolved for ${name} value`);
    }
    return tagObj;
}
// needs to be called before value stringifier to allow for circular anchor refs
function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
    if (!doc.directives)
        return '';
    const props = [];
    const anchor = (Node.isScalar(node) || Node.isCollection(node)) && node.anchor;
    if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
    }
    const tag = node.tag || (tagObj.default ? null : tagObj.tag);
    if (tag)
        props.push(doc.directives.tagString(tag));
    return props.join(' ');
}
function stringify(item, ctx, onComment, onChompKeep) {
    var _a;
    if (Node.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
    if (Node.isAlias(item)) {
        if (ctx.doc.directives)
            return item.toString(ctx);
        if ((_a = ctx.resolvedAliases) === null || _a === void 0 ? void 0 : _a.has(item)) {
            throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        }
        else {
            if (ctx.resolvedAliases)
                ctx.resolvedAliases.add(item);
            else
                ctx.resolvedAliases = new Set([item]);
            item = item.resolve(ctx.doc);
        }
    }
    let tagObj = undefined;
    const node = Node.isNode(item)
        ? item
        : ctx.doc.createNode(item, { onTagObj: o => (tagObj = o) });
    if (!tagObj)
        tagObj = getTagObject(ctx.doc.schema.tags, node);
    const props = stringifyProps(node, tagObj, ctx);
    if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart || 0) + props.length + 1;
    const str = typeof tagObj.stringify === 'function'
        ? tagObj.stringify(node, ctx, onComment, onChompKeep)
        : Node.isScalar(node)
            ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep)
            : node.toString(ctx, onComment, onChompKeep);
    if (!props)
        return str;
    return Node.isScalar(node) || str[0] === '{' || str[0] === '['
        ? `${props} ${str}`
        : `${props}\n${ctx.indent}${str}`;
}

exports.createStringifyContext = createStringifyContext;
exports.stringify = stringify;


/***/ }),

/***/ 2466:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Collection = __nccwpck_require__(3466);
var Node = __nccwpck_require__(1399);
var stringify = __nccwpck_require__(8409);
var stringifyComment = __nccwpck_require__(5182);

function stringifyCollection(collection, ctx, options) {
    var _a;
    const flow = (_a = ctx.inFlow) !== null && _a !== void 0 ? _a : collection.flow;
    const stringify = flow ? stringifyFlowCollection : stringifyBlockCollection;
    return stringify(collection, ctx, options);
}
function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
    const { indent, options: { commentString } } = ctx;
    const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
    let chompKeep = false; // flag for the preceding node's status
    const lines = [];
    for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (Node.isNode(item)) {
            if (!chompKeep && item.spaceBefore)
                lines.push('');
            addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
            if (item.comment)
                comment = item.comment;
        }
        else if (Node.isPair(item)) {
            const ik = Node.isNode(item.key) ? item.key : null;
            if (ik) {
                if (!chompKeep && ik.spaceBefore)
                    lines.push('');
                addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
            }
        }
        chompKeep = false;
        let str = stringify.stringify(item, itemCtx, () => (comment = null), () => (chompKeep = true));
        if (comment)
            str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        if (chompKeep && comment)
            chompKeep = false;
        lines.push(blockItemPrefix + str);
    }
    let str;
    if (lines.length === 0) {
        str = flowChars.start + flowChars.end;
    }
    else {
        str = lines[0];
        for (let i = 1; i < lines.length; ++i) {
            const line = lines[i];
            str += line ? `\n${indent}${line}` : '\n';
        }
    }
    if (comment) {
        str += '\n' + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
            onComment();
    }
    else if (chompKeep && onChompKeep)
        onChompKeep();
    return str;
}
function stringifyFlowCollection({ comment, items }, ctx, { flowChars, itemIndent, onComment }) {
    const { indent, indentStep, options: { commentString } } = ctx;
    itemIndent += indentStep;
    const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
    });
    let reqNewline = false;
    let linesAtValue = 0;
    const lines = [];
    for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (Node.isNode(item)) {
            if (item.spaceBefore)
                lines.push('');
            addCommentBefore(ctx, lines, item.commentBefore, false);
            if (item.comment)
                comment = item.comment;
        }
        else if (Node.isPair(item)) {
            const ik = Node.isNode(item.key) ? item.key : null;
            if (ik) {
                if (ik.spaceBefore)
                    lines.push('');
                addCommentBefore(ctx, lines, ik.commentBefore, false);
                if (ik.comment)
                    reqNewline = true;
            }
            const iv = Node.isNode(item.value) ? item.value : null;
            if (iv) {
                if (iv.comment)
                    comment = iv.comment;
                if (iv.commentBefore)
                    reqNewline = true;
            }
            else if (item.value == null && ik && ik.comment) {
                comment = ik.comment;
            }
        }
        if (comment)
            reqNewline = true;
        let str = stringify.stringify(item, itemCtx, () => (comment = null));
        if (i < items.length - 1)
            str += ',';
        if (comment)
            str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        if (!reqNewline && (lines.length > linesAtValue || str.includes('\n')))
            reqNewline = true;
        lines.push(str);
        linesAtValue = lines.length;
    }
    let str;
    const { start, end } = flowChars;
    if (lines.length === 0) {
        str = start + end;
    }
    else {
        if (!reqNewline) {
            const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
            reqNewline = len > Collection.Collection.maxFlowStringSingleLineLength;
        }
        if (reqNewline) {
            str = start;
            for (const line of lines)
                str += line ? `\n${indentStep}${indent}${line}` : '\n';
            str += `\n${indent}${end}`;
        }
        else {
            str = `${start} ${lines.join(' ')} ${end}`;
        }
    }
    if (comment) {
        str += stringifyComment.lineComment(str, commentString(comment), indent);
        if (onComment)
            onComment();
    }
    return str;
}
function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
    if (comment && chompKeep)
        comment = comment.replace(/^\n+/, '');
    if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart()); // Avoid double indent on first line
    }
}

exports.stringifyCollection = stringifyCollection;


/***/ }),

/***/ 5182:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * Stringifies a comment.
 *
 * Empty comment lines are left empty,
 * lines consisting of a single space are replaced by `#`,
 * and all other lines are prefixed with a `#`.
 */
const stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, '#');
function indentComment(comment, indent) {
    if (/^\n+$/.test(comment))
        return comment.substring(1);
    return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
}
const lineComment = (str, indent, comment) => comment.includes('\n')
    ? '\n' + indentComment(comment, indent)
    : (str.endsWith(' ') ? '' : ' ') + comment;

exports.indentComment = indentComment;
exports.lineComment = lineComment;
exports.stringifyComment = stringifyComment;


/***/ }),

/***/ 5225:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(1399);
var stringify = __nccwpck_require__(8409);
var stringifyComment = __nccwpck_require__(5182);

function stringifyDocument(doc, options) {
    const lines = [];
    let hasDirectives = options.directives === true;
    if (options.directives !== false && doc.directives) {
        const dir = doc.directives.toString(doc);
        if (dir) {
            lines.push(dir);
            hasDirectives = true;
        }
        else if (doc.directives.marker)
            hasDirectives = true;
    }
    if (hasDirectives)
        lines.push('---');
    const ctx = stringify.createStringifyContext(doc, options);
    const { commentString } = ctx.options;
    if (doc.commentBefore) {
        if (lines.length !== 1)
            lines.unshift('');
        const cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ''));
    }
    let chompKeep = false;
    let contentComment = null;
    if (doc.contents) {
        if (Node.isNode(doc.contents)) {
            if (doc.contents.spaceBefore && hasDirectives)
                lines.push('');
            if (doc.contents.commentBefore) {
                const cs = commentString(doc.contents.commentBefore);
                lines.push(stringifyComment.indentComment(cs, ''));
            }
            // top-level block scalars need to be indented if followed by a comment
            ctx.forceBlockIndent = !!doc.comment;
            contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? undefined : () => (chompKeep = true);
        let body = stringify.stringify(doc.contents, ctx, () => (contentComment = null), onChompKeep);
        if (contentComment)
            body += stringifyComment.lineComment(body, '', commentString(contentComment));
        if ((body[0] === '|' || body[0] === '>') &&
            lines[lines.length - 1] === '---') {
            // Top-level block scalars with a preceding doc marker ought to use the
            // same line for their header.
            lines[lines.length - 1] = `--- ${body}`;
        }
        else
            lines.push(body);
    }
    else {
        lines.push(stringify.stringify(doc.contents, ctx));
    }
    let dc = doc.comment;
    if (dc && chompKeep)
        dc = dc.replace(/^\n+/, '');
    if (dc) {
        if ((!chompKeep || contentComment) && lines[lines.length - 1] !== '')
            lines.push('');
        lines.push(stringifyComment.indentComment(commentString(dc), ''));
    }
    return lines.join('\n') + '\n';
}

exports.stringifyDocument = stringifyDocument;


/***/ }),

/***/ 4174:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function stringifyNumber({ format, minFractionDigits, tag, value }) {
    if (typeof value === 'bigint')
        return String(value);
    const num = typeof value === 'number' ? value : Number(value);
    if (!isFinite(num))
        return isNaN(num) ? '.nan' : num < 0 ? '-.inf' : '.inf';
    let n = JSON.stringify(value);
    if (!format &&
        minFractionDigits &&
        (!tag || tag === 'tag:yaml.org,2002:float') &&
        /^\d/.test(n)) {
        let i = n.indexOf('.');
        if (i < 0) {
            i = n.length;
            n += '.';
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
            n += '0';
    }
    return n;
}

exports.stringifyNumber = stringifyNumber;


/***/ }),

/***/ 4875:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(1399);
var Scalar = __nccwpck_require__(9338);
var stringify = __nccwpck_require__(8409);
var stringifyComment = __nccwpck_require__(5182);

function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
    const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
    let keyComment = (Node.isNode(key) && key.comment) || null;
    if (simpleKeys) {
        if (keyComment) {
            throw new Error('With simple keys, key nodes cannot have comments');
        }
        if (Node.isCollection(key)) {
            const msg = 'With simple keys, collection cannot be used as a key value';
            throw new Error(msg);
        }
    }
    let explicitKey = !simpleKeys &&
        (!key ||
            (keyComment && value == null && !ctx.inFlow) ||
            Node.isCollection(key) ||
            (Node.isScalar(key)
                ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL
                : typeof key === 'object'));
    ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
    });
    let keyCommentDone = false;
    let chompKeep = false;
    let str = stringify.stringify(key, ctx, () => (keyCommentDone = true), () => (chompKeep = true));
    if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
            throw new Error('With simple keys, single line scalar must not span more than 1024 characters');
        explicitKey = true;
    }
    if (ctx.inFlow) {
        if (allNullValues || value == null) {
            if (keyCommentDone && onComment)
                onComment();
            return explicitKey ? `? ${str}` : str;
        }
    }
    else if ((allNullValues && !simpleKeys) || (value == null && explicitKey)) {
        str = `? ${str}`;
        if (keyComment && !keyCommentDone) {
            str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        }
        else if (chompKeep && onChompKeep)
            onChompKeep();
        return str;
    }
    if (keyCommentDone)
        keyComment = null;
    if (explicitKey) {
        if (keyComment)
            str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        str = `? ${str}\n${indent}:`;
    }
    else {
        str = `${str}:`;
        if (keyComment)
            str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
    }
    let vcb = '';
    let valueComment = null;
    if (Node.isNode(value)) {
        if (value.spaceBefore)
            vcb = '\n';
        if (value.commentBefore) {
            const cs = commentString(value.commentBefore);
            vcb += `\n${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        valueComment = value.comment;
    }
    else if (value && typeof value === 'object') {
        value = doc.createNode(value);
    }
    ctx.implicitKey = false;
    if (!explicitKey && !keyComment && Node.isScalar(value))
        ctx.indentAtStart = str.length + 1;
    chompKeep = false;
    if (!indentSeq &&
        indentStep.length >= 2 &&
        !ctx.inFlow &&
        !explicitKey &&
        Node.isSeq(value) &&
        !value.flow &&
        !value.tag &&
        !value.anchor) {
        // If indentSeq === false, consider '- ' as part of indentation where possible
        ctx.indent = ctx.indent.substr(2);
    }
    let valueCommentDone = false;
    const valueStr = stringify.stringify(value, ctx, () => (valueCommentDone = true), () => (chompKeep = true));
    let ws = ' ';
    if (vcb || keyComment) {
        ws = valueStr === '' && !ctx.inFlow ? vcb : `${vcb}\n${ctx.indent}`;
    }
    else if (!explicitKey && Node.isCollection(value)) {
        const flow = valueStr[0] === '[' || valueStr[0] === '{';
        if (!flow || valueStr.includes('\n'))
            ws = `\n${ctx.indent}`;
    }
    else if (valueStr === '' || valueStr[0] === '\n')
        ws = '';
    str += ws + valueStr;
    if (ctx.inFlow) {
        if (valueCommentDone && onComment)
            onComment();
    }
    else if (valueComment && !valueCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
    }
    else if (chompKeep && onChompKeep) {
        onChompKeep();
    }
    return str;
}

exports.stringifyPair = stringifyPair;


/***/ }),

/***/ 6226:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(9338);
var foldFlowLines = __nccwpck_require__(2889);

const getFoldOptions = (ctx) => ({
    indentAtStart: ctx.indentAtStart,
    lineWidth: ctx.options.lineWidth,
    minContentWidth: ctx.options.minContentWidth
});
// Also checks for lines starting with %, as parsing the output as YAML 1.1 will
// presume that's starting a new document.
const containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
function lineLengthOverLimit(str, lineWidth, indentLength) {
    if (!lineWidth || lineWidth < 0)
        return false;
    const limit = lineWidth - indentLength;
    const strLen = str.length;
    if (strLen <= limit)
        return false;
    for (let i = 0, start = 0; i < strLen; ++i) {
        if (str[i] === '\n') {
            if (i - start > limit)
                return true;
            start = i + 1;
            if (strLen - start <= limit)
                return false;
        }
    }
    return true;
}
function doubleQuotedString(value, ctx) {
    const json = JSON.stringify(value);
    if (ctx.options.doubleQuotedAsJSON)
        return json;
    const { implicitKey } = ctx;
    const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
    const indent = ctx.indent || (containsDocumentMarker(value) ? '  ' : '');
    let str = '';
    let start = 0;
    for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === ' ' && json[i + 1] === '\\' && json[i + 2] === 'n') {
            // space before newline needs to be escaped to not be folded
            str += json.slice(start, i) + '\\ ';
            i += 1;
            start = i;
            ch = '\\';
        }
        if (ch === '\\')
            switch (json[i + 1]) {
                case 'u':
                    {
                        str += json.slice(start, i);
                        const code = json.substr(i + 2, 4);
                        switch (code) {
                            case '0000':
                                str += '\\0';
                                break;
                            case '0007':
                                str += '\\a';
                                break;
                            case '000b':
                                str += '\\v';
                                break;
                            case '001b':
                                str += '\\e';
                                break;
                            case '0085':
                                str += '\\N';
                                break;
                            case '00a0':
                                str += '\\_';
                                break;
                            case '2028':
                                str += '\\L';
                                break;
                            case '2029':
                                str += '\\P';
                                break;
                            default:
                                if (code.substr(0, 2) === '00')
                                    str += '\\x' + code.substr(2);
                                else
                                    str += json.substr(i, 6);
                        }
                        i += 5;
                        start = i + 1;
                    }
                    break;
                case 'n':
                    if (implicitKey ||
                        json[i + 2] === '"' ||
                        json.length < minMultiLineLength) {
                        i += 1;
                    }
                    else {
                        // folding will eat first newline
                        str += json.slice(start, i) + '\n\n';
                        while (json[i + 2] === '\\' &&
                            json[i + 3] === 'n' &&
                            json[i + 4] !== '"') {
                            str += '\n';
                            i += 2;
                        }
                        str += indent;
                        // space after newline needs to be escaped to not be folded
                        if (json[i + 2] === ' ')
                            str += '\\';
                        i += 1;
                        start = i + 1;
                    }
                    break;
                default:
                    i += 1;
            }
    }
    str = start ? str + json.slice(start) : json;
    return implicitKey
        ? str
        : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx));
}
function singleQuotedString(value, ctx) {
    if (ctx.options.singleQuote === false ||
        (ctx.implicitKey && value.includes('\n')) ||
        /[ \t]\n|\n[ \t]/.test(value) // single quoted string can't have leading or trailing whitespace around newline
    )
        return doubleQuotedString(value, ctx);
    const indent = ctx.indent || (containsDocumentMarker(value) ? '  ' : '');
    const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&\n${indent}`) + "'";
    return ctx.implicitKey
        ? res
        : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx));
}
function quotedString(value, ctx) {
    const { singleQuote } = ctx.options;
    let qs;
    if (singleQuote === false)
        qs = doubleQuotedString;
    else {
        const hasDouble = value.includes('"');
        const hasSingle = value.includes("'");
        if (hasDouble && !hasSingle)
            qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
            qs = doubleQuotedString;
        else
            qs = singleQuote ? singleQuotedString : doubleQuotedString;
    }
    return qs(value, ctx);
}
function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
    const { blockQuote, commentString, lineWidth } = ctx.options;
    // 1. Block can't end in whitespace unless the last line is non-empty.
    // 2. Strings consisting of only whitespace are best rendered explicitly.
    if (!blockQuote || /\n[\t ]+$/.test(value) || /^\s*$/.test(value)) {
        return quotedString(value, ctx);
    }
    const indent = ctx.indent ||
        (ctx.forceBlockIndent || containsDocumentMarker(value) ? '  ' : '');
    const literal = blockQuote === 'literal'
        ? true
        : blockQuote === 'folded' || type === Scalar.Scalar.BLOCK_FOLDED
            ? false
            : type === Scalar.Scalar.BLOCK_LITERAL
                ? true
                : !lineLengthOverLimit(value, lineWidth, indent.length);
    if (!value)
        return literal ? '|\n' : '>\n';
    // determine chomping from whitespace at value end
    let chomp;
    let endStart;
    for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== '\n' && ch !== '\t' && ch !== ' ')
            break;
    }
    let end = value.substring(endStart);
    const endNlPos = end.indexOf('\n');
    if (endNlPos === -1) {
        chomp = '-'; // strip
    }
    else if (value === end || endNlPos !== end.length - 1) {
        chomp = '+'; // keep
        if (onChompKeep)
            onChompKeep();
    }
    else {
        chomp = ''; // clip
    }
    if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === '\n')
            end = end.slice(0, -1);
        end = end.replace(/\n+(?!\n|$)/g, `$&${indent}`);
    }
    // determine indent indicator from whitespace at value start
    let startWithSpace = false;
    let startEnd;
    let startNlPos = -1;
    for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === ' ')
            startWithSpace = true;
        else if (ch === '\n')
            startNlPos = startEnd;
        else
            break;
    }
    let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
    if (start) {
        value = value.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
    }
    const indentSize = indent ? '2' : '1'; // root is at -1
    let header = (literal ? '|' : '>') + (startWithSpace ? indentSize : '') + chomp;
    if (comment) {
        header += ' ' + commentString(comment.replace(/ ?[\r\n]+/g, ' '));
        if (onComment)
            onComment();
    }
    if (literal) {
        value = value.replace(/\n+/g, `$&${indent}`);
        return `${header}\n${indent}${start}${value}${end}`;
    }
    value = value
        .replace(/\n+/g, '\n$&')
        .replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, '$1$2') // more-indented lines aren't folded
        //                ^ more-ind. ^ empty     ^ capture next empty lines only at end of indent
        .replace(/\n+/g, `$&${indent}`);
    const body = foldFlowLines.foldFlowLines(`${start}${value}${end}`, indent, foldFlowLines.FOLD_BLOCK, getFoldOptions(ctx));
    return `${header}\n${indent}${body}`;
}
function plainString(item, ctx, onComment, onChompKeep) {
    const { type, value } = item;
    const { actualString, implicitKey, indent, inFlow } = ctx;
    if ((implicitKey && /[\n[\]{},]/.test(value)) ||
        (inFlow && /[[\]{},]/.test(value))) {
        return quotedString(value, ctx);
    }
    if (!value ||
        /^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        // not allowed:
        // - empty string, '-' or '?'
        // - start with an indicator character (except [?:-]) or /[?-] /
        // - '\n ', ': ' or ' \n' anywhere
        // - '#' not preceded by a non-space char
        // - end with ' ' or ':'
        return implicitKey || inFlow || value.indexOf('\n') === -1
            ? quotedString(value, ctx)
            : blockString(item, ctx, onComment, onChompKeep);
    }
    if (!implicitKey &&
        !inFlow &&
        type !== Scalar.Scalar.PLAIN &&
        value.indexOf('\n') !== -1) {
        // Where allowed & type not set explicitly, prefer block style for multiline strings
        return blockString(item, ctx, onComment, onChompKeep);
    }
    if (indent === '' && containsDocumentMarker(value)) {
        ctx.forceBlockIndent = true;
        return blockString(item, ctx, onComment, onChompKeep);
    }
    const str = value.replace(/\n+/g, `$&\n${indent}`);
    // Verify that output will be parsed as a string, as e.g. plain numbers and
    // booleans get parsed with those types in v1.2 (e.g. '42', 'true' & '0.9e-3'),
    // and others in v1.1.
    if (actualString) {
        const test = (tag) => { var _a; return tag.default && tag.tag !== 'tag:yaml.org,2002:str' && ((_a = tag.test) === null || _a === void 0 ? void 0 : _a.test(str)); };
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || (compat === null || compat === void 0 ? void 0 : compat.some(test)))
            return quotedString(value, ctx);
    }
    return implicitKey
        ? str
        : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx));
}
function stringifyString(item, ctx, onComment, onChompKeep) {
    const { implicitKey, inFlow } = ctx;
    const ss = typeof item.value === 'string'
        ? item
        : Object.assign({}, item, { value: String(item.value) });
    let { type } = item;
    if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        // force double quotes on control characters & unpaired surrogates
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
            type = Scalar.Scalar.QUOTE_DOUBLE;
    }
    const _stringify = (_type) => {
        switch (_type) {
            case Scalar.Scalar.BLOCK_FOLDED:
            case Scalar.Scalar.BLOCK_LITERAL:
                return implicitKey || inFlow
                    ? quotedString(ss.value, ctx) // blocks are not valid inside flow containers
                    : blockString(ss, ctx, onComment, onChompKeep);
            case Scalar.Scalar.QUOTE_DOUBLE:
                return doubleQuotedString(ss.value, ctx);
            case Scalar.Scalar.QUOTE_SINGLE:
                return singleQuotedString(ss.value, ctx);
            case Scalar.Scalar.PLAIN:
                return plainString(ss, ctx, onComment, onChompKeep);
            default:
                return null;
        }
    };
    let res = _stringify(type);
    if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = (implicitKey && defaultKeyType) || defaultStringType;
        res = _stringify(t);
        if (res === null)
            throw new Error(`Unsupported default string type ${t}`);
    }
    return res;
}

exports.stringifyString = stringifyString;


/***/ }),

/***/ 6796:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(1399);

const BREAK = Symbol('break visit');
const SKIP = Symbol('skip children');
const REMOVE = Symbol('remove node');
/**
 * Apply a visitor to an AST node or document.
 *
 * Walks through the tree (depth-first) starting from `node`, calling a
 * `visitor` function with three arguments:
 *   - `key`: For sequence values and map `Pair`, the node's index in the
 *     collection. Within a `Pair`, `'key'` or `'value'`, correspondingly.
 *     `null` for the root node.
 *   - `node`: The current node.
 *   - `path`: The ancestry of the current node.
 *
 * The return value of the visitor may be used to control the traversal:
 *   - `undefined` (default): Do nothing and continue
 *   - `visit.SKIP`: Do not visit the children of this node, continue with next
 *     sibling
 *   - `visit.BREAK`: Terminate traversal completely
 *   - `visit.REMOVE`: Remove the current node, then continue with the next one
 *   - `Node`: Replace the current node, then continue by visiting it
 *   - `number`: While iterating the items of a sequence or map, set the index
 *     of the next step. This is useful especially if the index of the current
 *     node has changed.
 *
 * If `visitor` is a single function, it will be called with all values
 * encountered in the tree, including e.g. `null` values. Alternatively,
 * separate visitor functions may be defined for each `Map`, `Pair`, `Seq`,
 * `Alias` and `Scalar` node. To define the same visitor function for more than
 * one node type, use the `Collection` (map and seq), `Value` (map, seq & scalar)
 * and `Node` (alias, map, seq & scalar) targets. Of all these, only the most
 * specific defined one will be used for each node.
 */
function visit(node, visitor) {
    if (typeof visitor === 'object' &&
        (visitor.Collection || visitor.Node || visitor.Value)) {
        visitor = Object.assign({
            Alias: visitor.Node,
            Map: visitor.Node,
            Scalar: visitor.Node,
            Seq: visitor.Node
        }, visitor.Value && {
            Map: visitor.Value,
            Scalar: visitor.Value,
            Seq: visitor.Value
        }, visitor.Collection && {
            Map: visitor.Collection,
            Seq: visitor.Collection
        }, visitor);
    }
    if (Node.isDocument(node)) {
        const cd = _visit(null, node.contents, visitor, Object.freeze([node]));
        if (cd === REMOVE)
            node.contents = null;
    }
    else
        _visit(null, node, visitor, Object.freeze([]));
}
// Without the `as symbol` casts, TS declares these in the `visit`
// namespace using `var`, but then complains about that because
// `unique symbol` must be `const`.
/** Terminate visit traversal completely */
visit.BREAK = BREAK;
/** Do not visit the children of the current node */
visit.SKIP = SKIP;
/** Remove the current node */
visit.REMOVE = REMOVE;
function _visit(key, node, visitor, path) {
    let ctrl = undefined;
    if (typeof visitor === 'function')
        ctrl = visitor(key, node, path);
    else if (Node.isMap(node)) {
        if (visitor.Map)
            ctrl = visitor.Map(key, node, path);
    }
    else if (Node.isSeq(node)) {
        if (visitor.Seq)
            ctrl = visitor.Seq(key, node, path);
    }
    else if (Node.isPair(node)) {
        if (visitor.Pair)
            ctrl = visitor.Pair(key, node, path);
    }
    else if (Node.isScalar(node)) {
        if (visitor.Scalar)
            ctrl = visitor.Scalar(key, node, path);
    }
    else if (Node.isAlias(node)) {
        if (visitor.Alias)
            ctrl = visitor.Alias(key, node, path);
    }
    if (Node.isNode(ctrl) || Node.isPair(ctrl)) {
        const parent = path[path.length - 1];
        if (Node.isCollection(parent)) {
            parent.items[key] = ctrl;
        }
        else if (Node.isPair(parent)) {
            if (key === 'key')
                parent.key = ctrl;
            else
                parent.value = ctrl;
        }
        else if (Node.isDocument(parent)) {
            parent.contents = ctrl;
        }
        else {
            const pt = Node.isAlias(parent) ? 'alias' : 'scalar';
            throw new Error(`Cannot replace node with ${pt} parent`);
        }
        return _visit(key, ctrl, visitor, path);
    }
    if (typeof ctrl !== 'symbol') {
        if (Node.isCollection(node)) {
            path = Object.freeze(path.concat(node));
            for (let i = 0; i < node.items.length; ++i) {
                const ci = _visit(i, node.items[i], visitor, path);
                if (typeof ci === 'number')
                    i = ci - 1;
                else if (ci === BREAK)
                    return BREAK;
                else if (ci === REMOVE) {
                    node.items.splice(i, 1);
                    i -= 1;
                }
            }
        }
        else if (Node.isPair(node)) {
            path = Object.freeze(path.concat(node));
            const ck = _visit('key', node.key, visitor, path);
            if (ck === BREAK)
                return BREAK;
            else if (ck === REMOVE)
                node.key = null;
            const cv = _visit('value', node.value, visitor, path);
            if (cv === BREAK)
                return BREAK;
            else if (cv === REMOVE)
                node.value = null;
        }
    }
    return ctrl;
}

exports.visit = visit;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
const core_1 = tslib_1.__importDefault(__nccwpck_require__(2186));
const fs_1 = tslib_1.__importDefault(__nccwpck_require__(7147));
const action_1 = __nccwpck_require__(7672);
(0, action_1.run)(core_1.default, fs_1.default);

})();

module.exports = __webpack_exports__;
/******/ })()
;
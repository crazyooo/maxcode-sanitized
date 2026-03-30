/* eslint-disable */
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => MaxCodePlugin
});
module.exports = __toCommonJS(main_exports);
var import_promises4 = __toESM(require("fs/promises"));
var import_path4 = __toESM(require("path"));
var import_obsidian8 = require("obsidian");

// src/chatView.ts
var import_obsidian = require("obsidian");
var MAXCODE_VIEW_TYPE = "maxcode-chat-view";
var MaxCodeChatView = class extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.messageContainer = null;
    this.inputEl = null;
    this.tabBadgesEl = null;
    this.historyButtonEl = null;
    this.historyDropdownEl = null;
    this.modelLabelEl = null;
    this.thinkingLabelEl = null;
    this.permissionLabelEl = null;
    this.permissionToggleEl = null;
    this.runStatusEl = null;
    this.inputActionBtnEl = null;
    this.meterFillEl = null;
    this.meterPercentEl = null;
    this.contextRowEl = null;
    this.fileIndicatorEl = null;
    this.disposeListener = null;
    this.plugin = plugin;
  }
  getViewType() {
    return MAXCODE_VIEW_TYPE;
  }
  getDisplayText() {
    return "MaxCode";
  }
  getIcon() {
    return "bot";
  }
  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass("claudian-container");
    const header = container.createDiv({ cls: "claudian-header" });
    const titleSlot = header.createDiv({ cls: "claudian-title-slot" });
    const title = titleSlot.createDiv({ cls: "claudian-title" });
    const logo = title.createDiv({ cls: "claudian-logo" });
    logo.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11.3 2.1a4.6 4.6 0 0 1 4.5 2.8l.2.5.5-.1a4.6 4.6 0 0 1 4.9 7.1l-.3.4.3.4a4.6 4.6 0 0 1-4.9 7.1l-.5-.1-.2.5a4.6 4.6 0 0 1-8.6 0l-.2-.5-.5.1a4.6 4.6 0 0 1-4.9-7.1l.3-.4-.3-.4a4.6 4.6 0 0 1 4.9-7.1l.5.1.2-.5A4.6 4.6 0 0 1 11.3 2zm.7 2.2a2.4 2.4 0 0 0-2.2 1.5l-.9 2.2-2.4-.4a2.4 2.4 0 0 0-2.5 3.7l1.4 2-1.4 2a2.4 2.4 0 0 0 2.5 3.7l2.4-.4.9 2.2a2.4 2.4 0 0 0 4.4 0l.9-2.2 2.4.4a2.4 2.4 0 0 0 2.5-3.7l-1.4-2 1.4-2a2.4 2.4 0 0 0-2.5-3.7l-2.4.4-.9-2.2A2.4 2.4 0 0 0 12 4.3z"/></svg>';
    logo.addClass("maxcode-openai-logo");
    title.createDiv({ cls: "claudian-title-text", text: "Max Code" });
    const messagesWrapper = container.createDiv({ cls: "claudian-messages-wrapper" });
    this.messageContainer = messagesWrapper.createDiv({ cls: "claudian-messages claudian-messages-focusable" });
    const inputContainer = container.createDiv({ cls: "claudian-input-container" });
    const navRow = inputContainer.createDiv({ cls: "claudian-input-nav-row maxcode-chat-nav-row" });
    const tabBar = navRow.createDiv({ cls: "claudian-tab-bar-container maxcode-tab-bar-container" });
    this.tabBadgesEl = tabBar.createDiv({ cls: "claudian-tab-badges" });
    this.renderHeaderActions(navRow);
    const inputWrapper = inputContainer.createDiv({ cls: "claudian-input-wrapper" });
    this.contextRowEl = inputWrapper.createDiv({ cls: "claudian-context-row" });
    this.fileIndicatorEl = this.contextRowEl.createDiv({ cls: "claudian-file-indicator" });
    this.inputEl = inputWrapper.createEl("textarea", {
      cls: "claudian-input",
      attr: { placeholder: "Message Codex in your vault..." }
    });
    this.inputEl.rows = 4;
    this.inputEl.spellcheck = true;
    const toolbar = inputWrapper.createDiv({ cls: "claudian-input-toolbar" });
    this.renderModelSelector(toolbar);
    this.renderThinkingSelector(toolbar);
    this.renderContextMeter(toolbar);
    this.renderPermissionToggle(toolbar);
    this.renderRunStatus(toolbar);
    this.renderInputAction(toolbar);
    this.inputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        void this.handleSend();
      }
    });
    this.inputEl.addEventListener("input", () => this.refreshToolbarState());
    this.disposeListener = this.plugin.onMessagesChanged(() => this.renderMessages());
    this.registerDomEvent(document, "click", (event) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (this.historyDropdownEl?.contains(target) || this.historyButtonEl?.contains(target)) {
        return;
      }
      this.closeHistoryDropdown();
    });
    this.refreshToolbarState();
    this.renderMessages();
  }
  async onClose() {
    if (this.disposeListener) {
      this.disposeListener();
      this.disposeListener = null;
    }
  }
  async handleSend() {
    if (this.plugin.isRunning()) {
      this.plugin.stopGeneration();
      return;
    }
    if (!this.inputEl) {
      return;
    }
    const text = this.inputEl.value.trim();
    if (!text) {
      return;
    }
    this.inputEl.value = "";
    try {
      await this.plugin.sendMessage(text);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown send error";
      new import_obsidian.Notice(`MaxCode send failed: ${message}`);
    }
  }
  renderMessages() {
    if (!this.messageContainer) {
      return;
    }
    this.messageContainer.empty();
    this.renderContextRow();
    this.refreshToolbarState();
    const messages = this.plugin.getMessages();
    if (messages.length === 0) {
      const welcome = this.messageContainer.createDiv({ cls: "claudian-welcome" });
      welcome.createDiv({
        cls: "claudian-welcome-greeting",
        text: "How can I help you today?"
      });
      return;
    }
    for (const message of messages) {
      void this.renderMessage(message);
    }
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }
  async renderMessage(message) {
    if (!this.messageContainer) {
      return;
    }
    const item = this.messageContainer.createDiv({
      cls: `claudian-message claudian-message-${message.role}`
    });
    const content = item.createDiv({ cls: "claudian-message-content" });
    if (message.content.trim()) {
      const textBlock = content.createDiv({ cls: "claudian-text-block" });
      await import_obsidian.MarkdownRenderer.renderMarkdown(message.content, textBlock, "", this);
    }
    const statusEvents = (message.events ?? []).filter((event) => event.kind === "status");
    if (statusEvents.length > 0) {
      this.renderStatusPanel(content, message, statusEvents);
    }
    const traceEvents = (message.events ?? []).filter((event) => event.kind === "trace");
    if (traceEvents.length > 0) {
      this.renderTracePanel(content, message, traceEvents);
    }
    const visibleEvents = (message.events ?? []).filter((event) => event.kind !== "status" && event.kind !== "trace");
    if (visibleEvents.length > 0) {
      const timeline = content.createDiv({ cls: "maxcode-timeline" });
      timeline.createDiv({ cls: "maxcode-timeline-title", text: "Timeline" });
      for (const event of visibleEvents) {
        const block = timeline.createDiv({ cls: "claudian-tool-call" });
        const header = block.createDiv({ cls: "claudian-tool-header" });
        header.createSpan({ cls: "claudian-tool-label", text: event.kind });
        header.createSpan({
          cls: "claudian-tool-status status-completed",
          text: new Date(event.at).toLocaleTimeString()
        });
        const body = block.createDiv({ cls: "claudian-tool-content" });
        body.createDiv({ cls: "claudian-tool-result-item", text: event.text });
      }
    }
  }
  renderStatusPanel(container, message, statusEvents) {
    const latestStatus = this.getLatestStatusEvent(statusEvents);
    if (!latestStatus) {
      return;
    }
    const displayEvents = this.getDisplayStatusEvents(message, statusEvents);
    if (displayEvents.length === 0) {
      return;
    }
    const isFailed = message.traceOverallState === "failed";
    const isCompleted = message.traceOverallState === "completed";
    const headerText = isFailed ? message.traceOverallLabel?.trim() || latestStatus.text : isCompleted && latestStatus.statusKey === "thinking-timer" ? message.traceOverallLabel?.trim() || "Completed" : latestStatus.text;
    const block = container.createDiv({ cls: "claudian-thinking-block" });
    const header = block.createDiv({ cls: "claudian-thinking-header" });
    const icon = header.createDiv({ cls: "maxcode-activity-icon" });
    if (isFailed) {
      (0, import_obsidian.setIcon)(icon, "circle-alert");
    } else if (isCompleted) {
      (0, import_obsidian.setIcon)(icon, "check");
    } else {
      (0, import_obsidian.setIcon)(icon, "loader-circle");
      icon.addClass("spinning");
    }
    header.createSpan({ cls: "claudian-thinking-label", text: headerText });
    const detailEvents = displayEvents.filter((event) => event.text !== headerText);
    if (detailEvents.length === 0) {
      return;
    }
    const content = block.createDiv({ cls: "claudian-thinking-content" });
    for (const event of detailEvents) {
      content.createEl("p", { text: event.text });
    }
  }
  renderTracePanel(container, message, traceEvents) {
    const deduped = /* @__PURE__ */ new Map();
    for (const event of traceEvents) {
      const key = event.traceId?.trim() || `${event.at}:${event.text}`;
      deduped.set(key, event);
    }
    const tasks = Array.from(deduped.values()).sort((a, b) => a.at - b.at);
    if (tasks.length === 0) {
      return;
    }
    const hasFailedTask = tasks.some((task) => task.traceState === "failed");
    let runningTask = null;
    for (let i = tasks.length - 1; i >= 0; i -= 1) {
      if (tasks[i].traceState === "in_progress") {
        runningTask = tasks[i];
        break;
      }
    }
    const overallState = message.traceOverallState === "failed" || hasFailedTask ? "failed" : runningTask ? "running" : "completed";
    const panel = container.createDiv({ cls: "maxcode-activity-panel" });
    const header = panel.createDiv({ cls: "maxcode-activity-header" });
    header.createDiv({ cls: "maxcode-activity-title", text: "Activity" });
    if (overallState === "failed") {
      header.createDiv({
        cls: "maxcode-activity-status error",
        text: message.traceOverallLabel?.trim() || "Failed"
      });
    } else if (runningTask) {
      header.createDiv({ cls: "maxcode-activity-status", text: `Running ${runningTask.text}` });
    } else {
      header.createDiv({ cls: "maxcode-activity-status done", text: "Completed" });
    }
    const list = panel.createDiv({ cls: "maxcode-activity-list" });
    for (const task of tasks) {
      const row = list.createDiv({ cls: "maxcode-activity-step" });
      const done = task.traceState === "completed";
      const failed = task.traceState === "failed";
      row.toggleClass("is-done", done);
      row.toggleClass("is-failed", failed);
      row.toggleClass("is-running", !done && !failed);
      const rail = row.createDiv({ cls: "maxcode-activity-rail" });
      const icon = rail.createDiv({ cls: "maxcode-activity-icon" });
      if (done) {
        (0, import_obsidian.setIcon)(icon, "check");
      } else if (failed) {
        (0, import_obsidian.setIcon)(icon, "circle-alert");
      } else {
        (0, import_obsidian.setIcon)(icon, "loader-circle");
        icon.addClass("spinning");
      }
      const body = row.createDiv({ cls: "maxcode-activity-body" });
      body.createDiv({ cls: "maxcode-activity-text", text: task.text });
      const kindLabel = task.traceKind === "command" ? "Command" : "Reasoning";
      body.createDiv({
        cls: "maxcode-activity-meta",
        text: `${kindLabel} \xB7 ${failed ? "Failed" : done ? "Completed" : "Running"}`
      });
    }
  }
  renderModelSelector(toolbar) {
    const selector = toolbar.createDiv({ cls: "claudian-model-selector" });
    const btn = selector.createDiv({ cls: "claudian-model-btn" });
    this.modelLabelEl = btn.createSpan({ cls: "claudian-model-label" });
    const chevron = btn.createSpan({ cls: "claudian-model-chevron" });
    (0, import_obsidian.setIcon)(chevron, "chevron-up");
    const dropdown = selector.createDiv({ cls: "claudian-model-dropdown" });
    for (const model of this.plugin.getModelOptions()) {
      const option = dropdown.createDiv({ cls: "claudian-model-option", text: model });
      option.onclick = async (event) => {
        event.stopPropagation();
        await this.plugin.updateModel(model);
        this.refreshToolbarState();
      };
    }
  }
  renderThinkingSelector(toolbar) {
    const selector = toolbar.createDiv({ cls: "claudian-thinking-selector" });
    selector.createSpan({ cls: "claudian-thinking-label-text", text: "Thinking:" });
    const gears = selector.createDiv({ cls: "claudian-thinking-gears" });
    this.thinkingLabelEl = gears.createDiv({ cls: "claudian-thinking-current" });
    const options = gears.createDiv({ cls: "claudian-thinking-options" });
    for (const value of [
      { key: "off", label: "Off" },
      { key: "low", label: "Low" },
      { key: "med", label: "Med" },
      { key: "high", label: "High" }
    ]) {
      const item = options.createDiv({ cls: "claudian-thinking-gear", text: value.label });
      item.onclick = async (event) => {
        event.stopPropagation();
        await this.plugin.updateThinkingBudget(value.key);
        this.refreshToolbarState();
      };
    }
  }
  renderContextMeter(toolbar) {
    const meter = toolbar.createDiv({ cls: "claudian-context-meter" });
    meter.setAttribute("data-tooltip", "Estimated context usage");
    const gauge = meter.createDiv({ cls: "claudian-context-meter-gauge" });
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    bg.setAttribute("cx", "12");
    bg.setAttribute("cy", "12");
    bg.setAttribute("r", "8");
    bg.setAttribute("fill", "none");
    bg.setAttribute("stroke-width", "2");
    bg.classList.add("claudian-meter-bg");
    const fill = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    fill.setAttribute("cx", "12");
    fill.setAttribute("cy", "12");
    fill.setAttribute("r", "8");
    fill.setAttribute("fill", "none");
    fill.setAttribute("stroke-width", "2");
    fill.setAttribute("stroke-linecap", "round");
    fill.setAttribute("transform", "rotate(-90 12 12)");
    fill.classList.add("claudian-meter-fill");
    fill.style.strokeDasharray = `${2 * Math.PI * 8}`;
    svg.appendChild(bg);
    svg.appendChild(fill);
    gauge.appendChild(svg);
    this.meterFillEl = fill;
    this.meterPercentEl = meter.createSpan({ cls: "claudian-context-meter-percent", text: "0%" });
  }
  renderHeaderActions(header) {
    const actions = header.createDiv({ cls: "claudian-header-actions maxcode-header-actions" });
    const newBtn = actions.createDiv({ cls: "claudian-header-btn" });
    (0, import_obsidian.setIcon)(newBtn, "plus-square");
    newBtn.onclick = async () => {
      await this.plugin.createConversationFromUi();
    };
    const editBtn = actions.createDiv({ cls: "claudian-header-btn" });
    (0, import_obsidian.setIcon)(editBtn, "pencil");
    editBtn.onclick = () => {
      const lastUserMessage = [...this.plugin.getMessages()].reverse().find((message) => message.role === "user");
      const nextInput = lastUserMessage?.content?.trim() ?? "";
      if (!this.inputEl) {
        return;
      }
      if (!nextInput) {
        new import_obsidian.Notice("No previous user input to edit.");
        return;
      }
      this.inputEl.value = nextInput;
      this.inputEl.focus();
      const len = this.inputEl.value.length;
      this.inputEl.setSelectionRange(len, len);
    };
    const historyContainer = actions.createDiv({ cls: "claudian-history-container" });
    const historyBtn = historyContainer.createDiv({ cls: "claudian-header-btn" });
    (0, import_obsidian.setIcon)(historyBtn, "history");
    historyBtn.setAttribute("aria-label", "Chat history");
    historyBtn.onclick = (event) => {
      event.stopPropagation();
      this.toggleHistoryDropdown();
    };
    this.historyButtonEl = historyBtn;
    this.historyDropdownEl = historyContainer.createDiv({ cls: "claudian-history-menu" });
    this.historyDropdownEl.onclick = (event) => event.stopPropagation();
  }
  toggleHistoryDropdown() {
    if (!this.historyDropdownEl) {
      return;
    }
    const isVisible = this.historyDropdownEl.hasClass("visible");
    if (isVisible) {
      this.historyDropdownEl.removeClass("visible");
      return;
    }
    this.renderHistoryDropdown();
    this.historyDropdownEl.addClass("visible");
  }
  closeHistoryDropdown() {
    this.historyDropdownEl?.removeClass("visible");
  }
  formatHistoryDate(updatedAt, isCurrent) {
    if (isCurrent) {
      return "Current session";
    }
    return new Date(updatedAt).toLocaleString([], {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  renderHistoryDropdown() {
    if (!this.historyDropdownEl) {
      return;
    }
    this.historyDropdownEl.empty();
    const dropdownHeader = this.historyDropdownEl.createDiv({ cls: "claudian-history-header" });
    dropdownHeader.createSpan({ text: "Conversations" });
    const list = this.historyDropdownEl.createDiv({ cls: "claudian-history-list" });
    const activeId = this.plugin.getActiveConversationId();
    const items = this.plugin.getConversationSummaries();
    if (items.length === 0) {
      list.createDiv({ cls: "claudian-history-empty", text: "No conversations" });
      return;
    }
    for (const item of items) {
      const isCurrent = item.id === activeId;
      const row = list.createDiv({
        cls: `claudian-history-item${isCurrent ? " active" : ""}`
      });
      const iconEl = row.createDiv({ cls: "claudian-history-item-icon" });
      (0, import_obsidian.setIcon)(iconEl, isCurrent ? "message-square-dot" : "message-square");
      const content = row.createDiv({ cls: "claudian-history-item-content" });
      const titleEl = content.createDiv({ cls: "claudian-history-item-title", text: item.title });
      titleEl.setAttribute("title", item.title);
      content.createDiv({
        cls: "claudian-history-item-date",
        text: this.formatHistoryDate(item.updatedAt, isCurrent)
      });
      if (!isCurrent) {
        content.onclick = async (event) => {
          event.stopPropagation();
          await this.plugin.switchConversationFromUi(item.id);
          this.closeHistoryDropdown();
        };
      }
      const itemActions = row.createDiv({ cls: "claudian-history-item-actions" });
      const deleteBtn = itemActions.createEl("button", {
        cls: "claudian-action-btn claudian-delete-btn"
      });
      deleteBtn.type = "button";
      (0, import_obsidian.setIcon)(deleteBtn, "trash-2");
      deleteBtn.setAttribute("aria-label", `Delete ${item.title}`);
      deleteBtn.onclick = async (event) => {
        event.stopPropagation();
        if (!this.confirmDeleteConversation(item.id)) {
          return;
        }
        await this.plugin.deleteConversationFromUi(item.id);
        if (this.historyDropdownEl?.hasClass("visible")) {
          this.renderHistoryDropdown();
        }
      };
    }
  }
  renderPermissionToggle(toolbar) {
    const toggle = toolbar.createDiv({ cls: "claudian-permission-toggle" });
    this.permissionLabelEl = toggle.createSpan({ cls: "claudian-permission-label" });
    this.permissionToggleEl = toggle.createDiv({ cls: "claudian-toggle-switch" });
    this.permissionToggleEl.onclick = async () => {
      await this.plugin.toggleYoloMode();
      this.refreshToolbarState();
    };
  }
  renderRunStatus(toolbar) {
    this.runStatusEl = toolbar.createDiv({ cls: "maxcode-run-status idle", text: "Idle" });
  }
  renderInputAction(toolbar) {
    const action = toolbar.createEl("button", {
      cls: "maxcode-input-action-btn",
      text: "Send"
    });
    action.type = "button";
    action.onclick = () => {
      void this.handleSend();
    };
    this.inputActionBtnEl = action;
  }
  refreshToolbarState() {
    this.renderConversationTabs();
    if (this.historyDropdownEl?.hasClass("visible")) {
      this.renderHistoryDropdown();
    }
    if (this.modelLabelEl) {
      this.modelLabelEl.setText(this.plugin.settings.model);
    }
    if (this.thinkingLabelEl) {
      this.thinkingLabelEl.setText(this.plugin.getThinkingLabel());
    }
    if (this.permissionLabelEl && this.permissionToggleEl) {
      const isYolo = this.plugin.isYoloMode();
      this.permissionLabelEl.setText(isYolo ? "YOLO" : "Safe");
      this.permissionToggleEl.toggleClass("active", isYolo);
    }
    if (this.runStatusEl) {
      const running = this.plugin.isRunning();
      this.runStatusEl.setText(running ? "Running" : "Idle");
      this.runStatusEl.toggleClass("running", running);
      this.runStatusEl.toggleClass("idle", !running);
    }
    if (this.inputActionBtnEl) {
      const running = this.plugin.isRunning();
      const hasInput = Boolean(this.inputEl?.value.trim());
      this.inputActionBtnEl.setText(running ? "Stop" : "Send");
      this.inputActionBtnEl.toggleClass("is-stop", running);
      this.inputActionBtnEl.disabled = !running && !hasInput;
    }
    const chars = this.plugin.getMessages().map((m) => m.content.length).reduce((acc, cur) => acc + cur, 0);
    const percent = Math.max(1, Math.min(99, Math.round(chars / 12e3 * 100)));
    if (this.meterPercentEl) {
      this.meterPercentEl.setText(`${percent}%`);
      const meter = this.meterPercentEl.parentElement;
      meter?.toggleClass("warning", percent >= 80);
    }
    if (this.meterFillEl) {
      const circumference = 2 * Math.PI * 8;
      const fill = circumference * (1 - percent / 100);
      this.meterFillEl.style.strokeDashoffset = `${fill}`;
    }
  }
  renderConversationTabs() {
    if (!this.tabBadgesEl) {
      return;
    }
    this.tabBadgesEl.empty();
    const activeId = this.plugin.getActiveConversationId();
    const tabs = this.plugin.getConversationTabs();
    tabs.forEach((tab, index) => {
      const badge = this.tabBadgesEl.createDiv({ cls: "claudian-tab-badge", text: `${index + 1}` });
      badge.toggleClass("claudian-tab-badge-active", tab.id === activeId);
      badge.toggleClass("claudian-tab-badge-idle", tab.id !== activeId);
      badge.setAttribute("aria-label", `${tab.title} (${tab.messageCount})`);
      badge.onclick = () => {
        void this.plugin.switchConversationFromUi(tab.id);
      };
      badge.oncontextmenu = (event) => {
        event.preventDefault();
        if (!this.confirmDeleteConversation(tab.id)) {
          return;
        }
        void this.plugin.deleteConversationFromUi(tab.id);
      };
    });
  }
  confirmDeleteConversation(targetId) {
    const summaries = this.plugin.getConversationSummaries();
    if (summaries.length <= 1) {
      new import_obsidian.Notice("Cannot delete the last chat.");
      return false;
    }
    const resolvedId = (targetId?.trim() || this.plugin.getActiveConversationId()).trim();
    const target = summaries.find((item) => item.id === resolvedId);
    if (!target) {
      return false;
    }
    const detail = target.messageCount > 0 ? `${target.messageCount} messages` : "empty chat";
    return window.confirm(`Delete chat "${target.title}" (${detail})?
This cannot be undone.`);
  }
  renderContextRow() {
    if (!this.contextRowEl || !this.fileIndicatorEl) {
      return;
    }
    this.fileIndicatorEl.empty();
    const file = this.plugin.app.workspace.getActiveFile();
    if (!file) {
      this.contextRowEl.removeClass("has-content");
      return;
    }
    this.contextRowEl.addClass("has-content");
    const chip = this.fileIndicatorEl.createDiv({ cls: "claudian-file-chip" });
    const icon = chip.createSpan({ cls: "claudian-file-chip-icon" });
    (0, import_obsidian.setIcon)(icon, "file-text");
    chip.createSpan({ cls: "claudian-file-chip-name", text: file.basename });
  }
};

// src/import/claudianImporter.ts
function normalizeSlashCommands(input) {
  if (!Array.isArray(input)) {
    return [];
  }
  const commands = [];
  for (const item of input) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const record = item;
    const name = typeof record.name === "string" ? record.name.trim() : "";
    const prompt = typeof record.prompt === "string" ? record.prompt.trim() : "";
    if (!name || !prompt) {
      continue;
    }
    commands.push({ name, prompt });
  }
  return commands;
}
function importClaudianConfig(raw, current) {
  const parsed = JSON.parse(raw);
  const next = { ...current };
  const imported = [];
  if (typeof parsed.model === "string" && parsed.model.trim()) {
    next.model = parsed.model.trim();
    imported.push("model");
  }
  if (typeof parsed.temperature === "number") {
    next.temperature = Math.max(0, Math.min(1, parsed.temperature));
    imported.push("temperature");
  }
  if (typeof parsed.systemPrompt === "string") {
    next.systemPrompt = parsed.systemPrompt;
    imported.push("systemPrompt");
  }
  if (typeof parsed.safeMode === "boolean") {
    next.safeMode = parsed.safeMode;
    imported.push("safeMode");
  }
  const importedSlashCommands = normalizeSlashCommands(parsed.slashCommands);
  if (importedSlashCommands.length > 0) {
    next.slashCommands = importedSlashCommands;
    imported.push(`slashCommands(${importedSlashCommands.length})`);
  }
  return {
    updatedSettings: next,
    summary: imported.length > 0 ? `Imported: ${imported.join(", ")}` : "No compatible fields imported."
  };
}

// src/mcp/mcpClient.ts
var import_promises = __toESM(require("fs/promises"));
var import_child_process = require("child_process");
var readline = __toESM(require("readline"));
async function loadMcpServers(configPath) {
  if (!configPath.trim()) {
    return [];
  }
  const raw = await import_promises.default.readFile(configPath, "utf8");
  const parsed = JSON.parse(raw);
  if (!parsed.servers || !Array.isArray(parsed.servers)) {
    return [];
  }
  const valid = [];
  for (const server of parsed.servers) {
    if (!server || typeof server !== "object") {
      continue;
    }
    const name = typeof server.name === "string" ? server.name.trim() : "";
    const type = server.type;
    if (!name || type !== "stdio" && type !== "sse" && type !== "http") {
      continue;
    }
    valid.push({
      name,
      type,
      command: typeof server.command === "string" ? server.command : void 0,
      args: Array.isArray(server.args) ? server.args.filter((arg) => typeof arg === "string") : void 0,
      url: typeof server.url === "string" ? server.url : void 0
    });
  }
  return valid;
}
var MCP_INIT_PARAMS = {
  protocolVersion: "2024-11-05",
  clientInfo: { name: "maxcode", version: "0.1.0" },
  capabilities: {}
};
async function runJsonRpcStdio(params) {
  const { server, method, requestParams, timeoutMs = 15e3 } = params;
  if (!server.command) {
    throw new Error(`MCP server "${server.name}" is missing command.`);
  }
  const child = (0, import_child_process.spawn)(server.command, server.args ?? [], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let nextId = 1;
  let stderrOutput = "";
  const pending = /* @__PURE__ */ new Map();
  const finalize = () => {
    for (const [, handlers] of pending) {
      handlers.reject(new Error("MCP process terminated unexpectedly."));
    }
    pending.clear();
    rl.close();
    child.stdin.end();
    child.kill();
  };
  const rl = readline.createInterface({
    input: child.stdout
  });
  child.stderr.on("data", (chunk) => {
    stderrOutput += chunk.toString("utf8");
  });
  child.on("error", (error) => {
    for (const [, handlers] of pending) {
      handlers.reject(new Error(`Failed to start MCP server: ${error.message}`));
    }
    pending.clear();
    finalize();
  });
  child.on("close", () => {
    if (pending.size > 0) {
      const extra = stderrOutput ? `; stderr: ${stderrOutput.slice(0, 500)}` : "";
      for (const [, handlers] of pending) {
        handlers.reject(new Error(`MCP process closed before response${extra}`));
      }
      pending.clear();
    }
  });
  rl.on("line", (line) => {
    let parsed = null;
    try {
      parsed = JSON.parse(line);
    } catch (_error) {
      return;
    }
    if (!parsed || typeof parsed.id !== "number") {
      return;
    }
    const handlers = pending.get(parsed.id);
    if (!handlers) {
      return;
    }
    pending.delete(parsed.id);
    if (parsed.error) {
      handlers.reject(new Error(`MCP request failed: ${parsed.error.message}`));
    } else {
      handlers.resolve(parsed.result);
    }
  });
  const sendRpc = (rpcMethod, rpcParams) => {
    const id = nextId++;
    const request = {
      jsonrpc: "2.0",
      id,
      method: rpcMethod,
      params: rpcParams
    };
    child.stdin.write(`${JSON.stringify(request)}
`);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(
          new Error(
            `MCP ${rpcMethod} timed out after ${timeoutMs}ms${stderrOutput ? `; stderr: ${stderrOutput.slice(0, 500)}` : ""}`
          )
        );
      }, timeoutMs);
      pending.set(id, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (reason) => {
          clearTimeout(timer);
          reject(reason);
        }
      });
    });
  };
  try {
    await sendRpc("initialize", MCP_INIT_PARAMS);
    child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized", params: {} })}
`);
    return await sendRpc(method, requestParams);
  } finally {
    finalize();
  }
}
async function parseJsonRpcResponse(response) {
  const text = await response.text();
  if (!text.trim()) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch (_error) {
    throw new Error(`Invalid JSON-RPC response body: ${text.slice(0, 300)}`);
  }
}
async function postJsonRpcHttp(params) {
  const headers = {
    "Content-Type": "application/json"
  };
  if (params.sessionId) {
    headers["mcp-session-id"] = params.sessionId;
  }
  const response = await fetch(params.url, {
    method: "POST",
    headers,
    body: JSON.stringify(params.payload)
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`MCP HTTP error (${response.status}): ${text.slice(0, 300)}`);
  }
  const rpc = await parseJsonRpcResponse(response);
  const nextSessionId = response.headers.get("mcp-session-id") ?? params.sessionId;
  return {
    rpc,
    sessionId: nextSessionId ?? void 0
  };
}
async function runJsonRpcHttp(params) {
  const { server, method, requestParams } = params;
  if (!server.url) {
    throw new Error(`MCP server "${server.name}" is missing url.`);
  }
  let sessionId;
  const initRes = await postJsonRpcHttp({
    url: server.url,
    payload: {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: MCP_INIT_PARAMS
    },
    sessionId
  });
  sessionId = initRes.sessionId;
  if (initRes.rpc.error) {
    throw new Error(`MCP initialize failed: ${initRes.rpc.error.message}`);
  }
  await postJsonRpcHttp({
    url: server.url,
    payload: {
      jsonrpc: "2.0",
      method: "notifications/initialized",
      params: {}
    },
    sessionId
  });
  const callRes = await postJsonRpcHttp({
    url: server.url,
    payload: {
      jsonrpc: "2.0",
      id: 2,
      method,
      params: requestParams
    },
    sessionId
  });
  if (callRes.rpc.error) {
    throw new Error(`MCP ${method} failed: ${callRes.rpc.error.message}`);
  }
  return callRes.rpc.result;
}
function resolveSseEndpoint(baseUrl, endpointData) {
  try {
    return new URL(endpointData, baseUrl).toString();
  } catch (_error) {
    throw new Error(`Invalid MCP SSE endpoint value: ${endpointData}`);
  }
}
async function runJsonRpcSse(params) {
  const { server, method, requestParams, timeoutMs = 2e4 } = params;
  if (!server.url) {
    throw new Error(`MCP server "${server.name}" is missing url.`);
  }
  if (typeof EventSource === "undefined") {
    throw new Error("EventSource is unavailable in this runtime.");
  }
  return await new Promise((resolve, reject) => {
    const source = new EventSource(server.url);
    let endpointUrl = "";
    let nextId = 1;
    let settled = false;
    const pending = /* @__PURE__ */ new Map();
    const finish = (fn) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      source.close();
      fn();
    };
    const rejectAll = (message) => {
      for (const [, handlers] of pending) {
        handlers.reject(new Error(message));
      }
      pending.clear();
    };
    const timeout = setTimeout(() => {
      rejectAll(`MCP SSE request timed out after ${timeoutMs}ms`);
      finish(() => reject(new Error(`MCP SSE request timed out after ${timeoutMs}ms`)));
    }, timeoutMs);
    const onRpcMessage = (data) => {
      let parsed = null;
      try {
        parsed = JSON.parse(data);
      } catch (_error) {
        return;
      }
      if (!parsed || typeof parsed.id !== "number") {
        return;
      }
      const handlers = pending.get(parsed.id);
      if (!handlers) {
        return;
      }
      pending.delete(parsed.id);
      if (parsed.error) {
        handlers.reject(new Error(parsed.error.message));
      } else {
        handlers.resolve(parsed.result);
      }
    };
    const sendRpc = async (rpcMethod, rpcParams) => {
      if (!endpointUrl) {
        throw new Error("MCP SSE endpoint was not provided by server.");
      }
      const id = nextId++;
      const payload = {
        jsonrpc: "2.0",
        id,
        method: rpcMethod,
        params: rpcParams
      };
      const postPromise = new Promise((innerResolve, innerReject) => {
        pending.set(id, {
          resolve: innerResolve,
          reject: innerReject
        });
      });
      const response = await fetch(endpointUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        pending.delete(id);
        throw new Error(`MCP SSE post failed (${response.status})`);
      }
      return await postPromise;
    };
    source.addEventListener("endpoint", (event) => {
      endpointUrl = resolveSseEndpoint(server.url, String(event.data));
      (async () => {
        try {
          await sendRpc("initialize", MCP_INIT_PARAMS);
          await fetch(endpointUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              method: "notifications/initialized",
              params: {}
            })
          });
          const result = await sendRpc(method, requestParams);
          finish(() => resolve(result));
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown MCP SSE error";
          rejectAll(message);
          finish(() => reject(new Error(message)));
        }
      })();
    });
    source.addEventListener("message", (event) => {
      onRpcMessage(String(event.data));
    });
    source.onmessage = (event) => {
      onRpcMessage(String(event.data));
    };
    source.onerror = () => {
      rejectAll("MCP SSE transport error");
      finish(() => reject(new Error("MCP SSE transport error")));
    };
  });
}
async function listMcpTools(server) {
  const result = await runMcpJsonRpc({
    server,
    method: "tools/list"
  });
  return Array.isArray(result?.tools) ? result.tools : [];
}
async function callMcpTool(params) {
  const { server, toolName, args } = params;
  return await runMcpJsonRpc({
    server,
    method: "tools/call",
    requestParams: {
      name: toolName,
      arguments: args
    }
  });
}
async function runMcpJsonRpc(params) {
  const { server, method, requestParams } = params;
  if (server.type === "stdio") {
    return await runJsonRpcStdio({
      server,
      method,
      requestParams
    });
  }
  if (server.type === "http") {
    return await runJsonRpcHttp({
      server,
      method,
      requestParams
    });
  }
  if (server.type === "sse") {
    return await runJsonRpcSse({
      server,
      method,
      requestParams
    });
  }
  throw new Error(`Unsupported MCP transport: ${server.type}`);
}

// src/provider/codexCliProvider.ts
var import_promises2 = __toESM(require("fs/promises"));
var import_os = __toESM(require("os"));
var import_path = __toESM(require("path"));
var import_child_process2 = require("child_process");
var import_util = require("util");
var execFileAsync = (0, import_util.promisify)(import_child_process2.execFile);
function withPrependedPath(currentPath, prependDir) {
  const segments = currentPath ? currentPath.split(import_path.default.delimiter).filter(Boolean) : [];
  if (segments.includes(prependDir)) {
    return segments.join(import_path.default.delimiter);
  }
  return [prependDir, ...segments].join(import_path.default.delimiter);
}
function buildPrompt(messages) {
  return messages.map((message) => {
    const role = message.role.toUpperCase();
    return `[${role}]
${message.content}`;
  }).join("\n\n");
}
function parseCodexJsonLastMessage(stdout) {
  const lines = stdout.split("\n").map((line) => line.trim()).filter(Boolean);
  let last = "";
  for (const line of lines) {
    if (!line.startsWith("{")) {
      continue;
    }
    try {
      const parsed = JSON.parse(line);
      if (parsed.type !== "item.completed") {
        continue;
      }
      const item = parsed.item;
      if (!item || item.type !== "agent_message") {
        continue;
      }
      const text = item.text;
      if (typeof text === "string" && text.trim()) {
        last = text.trim();
      }
    } catch (_error) {
    }
  }
  return last;
}
function extractAgentTextFromItem(item) {
  if (!item) {
    return "";
  }
  const directText = item.text;
  if (typeof directText === "string" && directText.trim()) {
    return directText.trim();
  }
  const content = item.content;
  if (Array.isArray(content)) {
    const parts = [];
    for (const part of content) {
      if (!part || typeof part !== "object") {
        continue;
      }
      const record = part;
      const text = record.text;
      if (typeof text === "string" && text.trim()) {
        parts.push(text.trim());
      }
    }
    if (parts.length > 0) {
      return parts.join("\n");
    }
  }
  return "";
}
function extractAgentTextFromCodexJsonLine(line) {
  if (!line.startsWith("{")) {
    return "";
  }
  try {
    const parsed = JSON.parse(line);
    if (parsed.type !== "item.completed") {
      return "";
    }
    const item = parsed.item;
    if (!item) {
      return "";
    }
    const itemType = typeof item.type === "string" ? item.type : "";
    if (itemType !== "agent_message" && itemType !== "assistant_message") {
      return "";
    }
    return extractAgentTextFromItem(item);
  } catch (_error) {
    return "";
  }
}
function extractStatusFromCodexJsonLine(line) {
  if (!line.startsWith("{")) {
    return null;
  }
  try {
    const parsed = JSON.parse(line);
    const type = typeof parsed.type === "string" ? parsed.type : "";
    if (type === "thread.started") {
      return "Session started";
    }
    if (type === "turn.started") {
      return "Thinking...";
    }
    if (type === "item.completed") {
      const item = parsed.item;
      if (item?.type === "agent_message") {
        return "Generating final answer...";
      }
    }
    if (type === "turn.completed") {
      const usage = parsed.usage;
      const outputTokens = usage?.output_tokens;
      if (typeof outputTokens === "number" && Number.isFinite(outputTokens)) {
        return `Completed (${outputTokens} output tokens)`;
      }
      return "Completed";
    }
  } catch (_error) {
  }
  return null;
}
function extractThreadIdFromCodexJsonLine(line) {
  if (!line.startsWith("{")) {
    return null;
  }
  try {
    const parsed = JSON.parse(line);
    if (parsed.type !== "thread.started") {
      return null;
    }
    const threadId = parsed.thread_id;
    if (typeof threadId === "string" && threadId.trim()) {
      return threadId.trim();
    }
  } catch (_error) {
    return null;
  }
  return null;
}
function cleanCommand(rawCommand) {
  return rawCommand.replace(/^\/bin\/zsh\s+-lc\s+/, "").replace(/^['"]|['"]$/g, "").trim();
}
function summarizeCommand(rawCommand) {
  const command = cleanCommand(rawCommand);
  const sedMatch = command.match(/sed\s+-n\s+['"][^'"]+['"]\s+([^'" ]+)/);
  if (sedMatch?.[1]) {
    return `Read: ${sedMatch[1]}`;
  }
  const catMatch = command.match(/cat\s+([^'" ]+)/);
  if (catMatch?.[1]) {
    return `Read: ${catMatch[1]}`;
  }
  if (/^ls(\s+.+)?$/.test(command)) {
    return `List: ${command}`;
  }
  const rgMatch = command.match(/^rg\s+(.+)$/);
  if (rgMatch?.[1]) {
    return `Search: ${rgMatch[1]}`;
  }
  return `Run: ${command.slice(0, 88)}`;
}
function summarizeReasoning(rawText) {
  const cleaned = rawText.replace(/\*\*/g, "").trim();
  const firstLine = cleaned.split("\n").map((line) => line.trim()).find(Boolean);
  return firstLine || "Reasoning";
}
function extractTraceEventFromCodexJsonLine(line) {
  if (!line.startsWith("{")) {
    return null;
  }
  try {
    const parsed = JSON.parse(line);
    const eventType = typeof parsed.type === "string" ? parsed.type : "";
    if (eventType !== "item.started" && eventType !== "item.completed") {
      return null;
    }
    const item = parsed.item;
    if (!item) {
      return null;
    }
    const itemType = typeof item.type === "string" ? item.type : "";
    const id = typeof item.id === "string" && item.id ? item.id : `trace-${Date.now()}`;
    const status = eventType === "item.started" ? "in_progress" : "completed";
    if (itemType === "command_execution") {
      const command = typeof item.command === "string" ? item.command : "";
      return {
        id,
        kind: "command",
        status,
        summary: summarizeCommand(command) || "Run command"
      };
    }
    if (itemType === "reasoning") {
      const text = typeof item.text === "string" ? item.text : "";
      return {
        id,
        kind: "reasoning",
        status,
        summary: status === "completed" ? summarizeReasoning(text) : "Thinking"
      };
    }
  } catch (_error) {
    return null;
  }
  return null;
}
async function canRunBinary(binaryPath) {
  try {
    const env = { ...process.env };
    if (import_path.default.isAbsolute(binaryPath)) {
      env.PATH = withPrependedPath(process.env.PATH, import_path.default.dirname(binaryPath));
    }
    await execFileAsync(binaryPath, ["--version"], {
      timeout: 5e3,
      maxBuffer: 256 * 1024,
      env
    });
    return true;
  } catch (_error) {
    return false;
  }
}
async function scanNvmCodexBinary(binaryName) {
  const nvmRoot = import_path.default.join(import_os.default.homedir(), ".nvm/versions/node");
  try {
    const versions = await import_promises2.default.readdir(nvmRoot);
    const sorted = versions.sort((a, b) => b.localeCompare(a));
    for (const version of sorted) {
      const candidate = import_path.default.join(nvmRoot, version, "bin", binaryName);
      if (await canRunBinary(candidate)) {
        return candidate;
      }
    }
  } catch (_error) {
  }
  return null;
}
async function resolveCodexBinary(preferredPath) {
  const preferred = preferredPath.trim() || "codex";
  if (preferred.includes("/") || preferred.includes("\\")) {
    if (await canRunBinary(preferred)) {
      return preferred;
    }
    throw new Error(`Codex CLI path is not executable: ${preferred}`);
  }
  if (await canRunBinary(preferred)) {
    return preferred;
  }
  if (/^[A-Za-z0-9_.-]+$/.test(preferred)) {
    try {
      const { stdout } = await execFileAsync("/bin/zsh", ["-lc", `command -v ${preferred}`], {
        timeout: 5e3,
        maxBuffer: 128 * 1024
      });
      const resolved = stdout.trim();
      if (resolved && await canRunBinary(resolved)) {
        return resolved;
      }
    } catch (_error) {
    }
  }
  for (const candidate of [
    `/opt/homebrew/bin/${preferred}`,
    `/usr/local/bin/${preferred}`,
    import_path.default.join(import_os.default.homedir(), ".local/bin", preferred)
  ]) {
    if (await canRunBinary(candidate)) {
      return candidate;
    }
  }
  const nvmBinary = await scanNvmCodexBinary(preferred);
  if (nvmBinary) {
    return nvmBinary;
  }
  throw new Error(`Cannot find runnable Codex CLI binary for "${preferred}". Set an absolute path in settings.`);
}
var CodexCliProvider = class {
  async streamResponse(request, callbacks) {
    const codexPath = await resolveCodexBinary(request.codexCliPath?.trim() || "codex");
    const tmpDir = await import_promises2.default.mkdtemp(import_path.default.join(import_os.default.tmpdir(), "maxcode-codex-cli-"));
    const outputFile = import_path.default.join(tmpDir, "last-message.txt");
    const prompt = buildPrompt(request.messages);
    const resumeThreadId = request.codexThreadId?.trim() || "";
    const shouldResumeById = Boolean(resumeThreadId);
    const shouldResumeLast = !shouldResumeById && request.resumeLastThread === true;
    const baseArgs = ["exec", "--skip-git-repo-check", "--json", "--color", "never"];
    const args = ["exec", "--skip-git-repo-check", "--output-last-message", outputFile, "--json", "--color", "never"];
    const resumeArgs = ["exec", "resume", "--skip-git-repo-check", "--json"];
    if (request.model?.trim()) {
      const model = request.model.trim();
      baseArgs.push("-m", model);
      args.push("-m", model);
      resumeArgs.push("--model", model);
    }
    if (request.workspaceDir?.trim()) {
      const workspaceDir = request.workspaceDir.trim();
      baseArgs.push("-C", workspaceDir);
      args.push("-C", workspaceDir);
    }
    if (shouldResumeById) {
      resumeArgs.push(resumeThreadId);
    } else if (shouldResumeLast) {
      resumeArgs.push("--last");
    }
    resumeArgs.push(prompt);
    baseArgs.push(prompt);
    args.push(prompt);
    try {
      const env = { ...process.env };
      if (import_path.default.isAbsolute(codexPath)) {
        env.PATH = withPrependedPath(process.env.PATH, import_path.default.dirname(codexPath));
      }
      const apiKey = request.apiKey?.trim();
      if (apiKey) {
        env.OPENAI_API_KEY = apiKey;
      }
      let text = "";
      let result = null;
      if (shouldResumeById || shouldResumeLast) {
        try {
          result = await this.runStreamingCodexExec({
            codexPath,
            args: resumeArgs,
            env,
            signal: request.signal,
            onStatus: callbacks.onStatus,
            onTraceEvent: callbacks.onTraceEvent,
            onThreadStarted: callbacks.onThreadStarted
          });
          text = result.lastAgentMessageFromStream || parseCodexJsonLastMessage(result.stdout || "") || result.lastNonJsonText || "";
        } catch (_error) {
          callbacks.onStatus?.("Resume failed, starting a new local session...");
        }
      }
      if (!text.trim()) {
        result = await this.runStreamingCodexExec({
          codexPath,
          args,
          env,
          signal: request.signal,
          onStatus: callbacks.onStatus,
          onTraceEvent: callbacks.onTraceEvent,
          onThreadStarted: callbacks.onThreadStarted
        });
        try {
          text = (await import_promises2.default.readFile(outputFile, "utf8")).trim();
        } catch (_error) {
          text = parseCodexJsonLastMessage(result.stdout || "");
        }
        if (!text.trim()) {
          text = result.lastAgentMessageFromStream || parseCodexJsonLastMessage(result.stdout || "");
        }
      }
      if (!text.trim()) {
        callbacks.onStatus?.("Primary output empty, retrying...");
        const retry = await this.runStreamingCodexExec({
          codexPath,
          args: baseArgs,
          env,
          signal: request.signal,
          onStatus: callbacks.onStatus,
          onTraceEvent: callbacks.onTraceEvent,
          onThreadStarted: callbacks.onThreadStarted
        });
        text = retry.lastAgentMessageFromStream || parseCodexJsonLastMessage(retry.stdout || "") || retry.lastNonJsonText || "";
      }
      if (!text) {
        const stderrTail = (result?.stderr || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(-4).join("\n");
        callbacks.onError(
          stderrTail ? `Codex CLI returned empty output.
Last stderr:
${stderrTail}` : "Codex CLI returned empty output."
        );
        return;
      }
      callbacks.onDelta(text);
      callbacks.onDone();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown codex CLI error";
      callbacks.onError(`Codex CLI failed: ${message}`);
    } finally {
      await import_promises2.default.rm(tmpDir, { recursive: true, force: true });
    }
  }
  async runStreamingCodexExec(params) {
    return await new Promise((resolve, reject) => {
      const child = (0, import_child_process2.spawn)(params.codexPath, params.args, {
        env: params.env,
        stdio: ["ignore", "pipe", "pipe"]
      });
      const startAt = Date.now();
      let settled = false;
      let stdoutRaw = "";
      let stdoutBuf = "";
      let stderrRaw = "";
      let lastAgentMessageFromStream = "";
      let lastNonJsonText = "";
      let threadId = "";
      const complete = (fn) => {
        if (settled) {
          return;
        }
        settled = true;
        clearInterval(progressTimer);
        clearTimeout(timeoutTimer);
        params.signal.removeEventListener("abort", onAbort);
        fn();
      };
      const onAbort = () => {
        child.kill("SIGTERM");
        complete(() => reject(new Error("Aborted")));
      };
      const flushStdoutLines = (flushAll) => {
        const lines = stdoutBuf.split(/\r?\n/);
        if (!flushAll) {
          stdoutBuf = lines.pop() ?? "";
        } else {
          stdoutBuf = "";
        }
        for (const raw of lines) {
          const line = raw.trim();
          if (!line) {
            continue;
          }
          const status = extractStatusFromCodexJsonLine(line);
          if (status) {
            params.onStatus?.(status);
          }
          const parsedThreadId = extractThreadIdFromCodexJsonLine(line);
          if (parsedThreadId) {
            threadId = parsedThreadId;
            params.onThreadStarted?.(parsedThreadId);
          }
          const trace = extractTraceEventFromCodexJsonLine(line);
          if (trace) {
            params.onTraceEvent?.(trace);
          }
          const maybeText = extractAgentTextFromCodexJsonLine(line);
          if (maybeText) {
            lastAgentMessageFromStream = maybeText;
            continue;
          }
          if (!line.startsWith("{") && !/^\d{4}-\d{2}-\d{2}T/.test(line) && !line.startsWith("WARNING:")) {
            lastNonJsonText = line;
          }
        }
      };
      params.onStatus?.("Starting local Codex CLI...");
      const progressTimer = setInterval(() => {
        const elapsed = Math.max(1, Math.floor((Date.now() - startAt) / 1e3));
        params.onStatus?.(`Thinking... ${elapsed}s`);
      }, 2e3);
      const timeoutMs = 3e5;
      const timeoutTimer = setTimeout(() => {
        child.kill("SIGTERM");
        complete(() => reject(new Error(`Codex CLI timed out after ${Math.floor(timeoutMs / 1e3)}s`)));
      }, timeoutMs);
      params.signal.addEventListener("abort", onAbort, { once: true });
      child.stdout.on("data", (chunk) => {
        const text = typeof chunk === "string" ? chunk : chunk.toString("utf8");
        stdoutRaw += text;
        stdoutBuf += text;
        flushStdoutLines(false);
      });
      child.stderr.on("data", (chunk) => {
        const text = typeof chunk === "string" ? chunk : chunk.toString("utf8");
        stderrRaw += text;
      });
      child.on("error", (error) => {
        complete(() => reject(error));
      });
      child.on("close", (code) => {
        flushStdoutLines(true);
        if (code === 0) {
          complete(
            () => resolve({
              stdout: stdoutRaw,
              stderr: stderrRaw,
              lastAgentMessageFromStream,
              lastNonJsonText,
              threadId
            })
          );
          return;
        }
        const stderr = stderrRaw.trim();
        const tail = stderr ? `
${stderr.split(/\r?\n/).slice(-6).join("\n")}` : "";
        complete(() => reject(new Error(`Codex CLI exited with code ${code ?? "unknown"}${tail}`)));
      });
    });
  }
};

// src/security/approval.ts
var import_obsidian2 = require("obsidian");
var ApprovalModal = class extends import_obsidian2.Modal {
  constructor(app, title, detail, onResolve) {
    super(app);
    this.resolved = false;
    this.titleText = title;
    this.detail = detail;
    this.onResolve = onResolve;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: this.titleText });
    contentEl.createEl("pre", { text: this.detail });
    new import_obsidian2.Setting(contentEl).addButton(
      (button) => button.setButtonText("Deny").onClick(() => {
        this.resolved = true;
        this.onResolve(false);
        this.close();
      })
    ).addButton(
      (button) => button.setButtonText("Approve").setCta().onClick(() => {
        this.resolved = true;
        this.onResolve(true);
        this.close();
      })
    );
  }
  onClose() {
    if (!this.resolved) {
      this.onResolve(false);
    }
  }
};
async function requestApproval(params) {
  const { app, approvalMode, risk, title, detail } = params;
  if (approvalMode === "yolo") {
    return true;
  }
  if (approvalMode === "safe" && risk === "low") {
    return true;
  }
  return new Promise((resolve) => {
    const modal = new ApprovalModal(app, title, detail, (approved) => resolve(approved));
    modal.open();
  });
}

// src/security/secureStorage.ts
var FallbackStorage = class {
  encrypt(value) {
    return value;
  }
  decrypt(value) {
    return value;
  }
};
var ElectronSafeStorage = class {
  constructor(safeStorage) {
    this.safeStorage = safeStorage;
  }
  encrypt(value) {
    if (!value) {
      return "";
    }
    if (!this.safeStorage.isEncryptionAvailable()) {
      return value;
    }
    return this.safeStorage.encryptString(value).toString("base64");
  }
  decrypt(value) {
    if (!value) {
      return "";
    }
    if (!this.safeStorage.isEncryptionAvailable()) {
      return value;
    }
    return this.safeStorage.decryptString(Buffer.from(value, "base64"));
  }
};
function createSecretStorage() {
  try {
    const electron = window.require?.("electron");
    if (electron?.safeStorage) {
      return new ElectronSafeStorage(electron.safeStorage);
    }
  } catch (_error) {
  }
  return new FallbackStorage();
}

// src/settingsTab.ts
var import_obsidian3 = require("obsidian");
var MaxCodeSettingTab = class extends import_obsidian3.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "MaxCode Settings" });
    new import_obsidian3.Setting(containerEl).setName("Codex CLI path").setDesc("Executable path for local Codex CLI.").addText((text) => {
      text.setPlaceholder("codex").setValue(this.plugin.settings.codexCliPath).onChange(async (value) => {
        this.plugin.settings.codexCliPath = value.trim() || "codex";
        await this.plugin.saveSettings();
      });
    });
    const codexAuthSetting = new import_obsidian3.Setting(containerEl).setName("Codex account").setDesc("Use local Codex CLI login or API key for chat requests.");
    const codexAuthStatusEl = codexAuthSetting.descEl.createDiv({ cls: "maxcode-codex-auth-status" });
    codexAuthStatusEl.setText("Status: checking...");
    const refreshCodexAuthStatus = async () => {
      codexAuthStatusEl.classList.remove("is-ok", "is-error");
      codexAuthStatusEl.setText("Status: checking...");
      const status = await this.plugin.getCodexLoginStatus();
      if (status.loggedIn) {
        codexAuthStatusEl.classList.add("is-ok");
      } else {
        codexAuthStatusEl.classList.add("is-error");
      }
      codexAuthStatusEl.setText(`Status: ${status.message}`);
      if (status.detail) {
        codexAuthStatusEl.setAttr("title", status.detail);
      } else {
        codexAuthStatusEl.removeAttribute("title");
      }
    };
    codexAuthSetting.addButton((button) => button.setButtonText("Refresh").onClick(() => {
      void refreshCodexAuthStatus();
    }));
    codexAuthSetting.addButton((button) => button.setButtonText("Login").setCta().onClick(async () => {
      await this.plugin.runCodexLoginDeviceAuth();
      await refreshCodexAuthStatus();
    }));
    codexAuthSetting.addButton((button) => button.setButtonText("Logout").onClick(async () => {
      await this.plugin.runCodexLogout();
      await refreshCodexAuthStatus();
    }));
    void refreshCodexAuthStatus();
    new import_obsidian3.Setting(containerEl).setName("Codex working directory").setDesc("Directory passed to codex with -C. Leave empty to use HOME (recommended for AGENTS.md/skills parity).").addText((text) => {
      text.setPlaceholder("/Users/yourname").setValue(this.plugin.settings.codexWorkingDir).onChange(async (value) => {
        this.plugin.settings.codexWorkingDir = value.trim();
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian3.Setting(containerEl).setName("Sync with local Codex sessions").setDesc("Use `codex exec resume` with thread ids and auto-sync rollout history from ~/.codex/sessions.").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.syncWithLocalCodex).onChange(async (value) => {
        this.plugin.settings.syncWithLocalCodex = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian3.Setting(containerEl).setName("OpenAI API key (optional)").setDesc("If set, MaxCode injects OPENAI_API_KEY into local Codex CLI runtime.").addText((text) => {
      text.setPlaceholder("sk-...").setValue(this.plugin.getApiKey() ? "********" : "").onChange(async (value) => {
        if (value === "********") {
          return;
        }
        await this.plugin.setApiKey(value.trim());
      });
    });
    new import_obsidian3.Setting(containerEl).setName("Model").setDesc("Available Codex/OpenAI models.").addDropdown((dropdown) => {
      for (const model of this.plugin.getModelOptions()) {
        dropdown.addOption(model, model);
      }
      dropdown.setValue(this.plugin.settings.model).onChange(async (value) => {
        this.plugin.settings.model = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian3.Setting(containerEl).setName("Thinking budget").setDesc("UI and prompting hint only.").addDropdown((dropdown) => {
      dropdown.addOption("off", "Off").addOption("low", "Low").addOption("med", "Med").addOption("high", "High").setValue(this.plugin.settings.thinkingBudget).onChange(async (value) => {
        this.plugin.settings.thinkingBudget = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian3.Setting(containerEl).setName("Temperature").setDesc("Response creativity from 0.0 to 1.0.").addSlider((slider) => {
      slider.setDynamicTooltip().setLimits(0, 1, 0.1).setValue(this.plugin.settings.temperature).onChange(async (value) => {
        this.plugin.settings.temperature = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian3.Setting(containerEl).setName("System prompt").setDesc("Applies to every new assistant response.").addTextArea((textArea) => {
      textArea.setValue(this.plugin.settings.systemPrompt).onChange(async (value) => {
        this.plugin.settings.systemPrompt = value;
        await this.plugin.saveSettings();
      });
      textArea.inputEl.rows = 4;
    });
    new import_obsidian3.Setting(containerEl).setName("Safe mode").setDesc("When enabled, high-risk tools must ask for approval (MVP placeholder).").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.safeMode).onChange(async (value) => {
        this.plugin.settings.safeMode = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian3.Setting(containerEl).setName("Approval mode").setDesc("safe: high-risk ask approval, plan: all tool calls ask approval, yolo: no approval").addDropdown((dropdown) => {
      dropdown.addOption("safe", "Safe").addOption("plan", "Plan").addOption("yolo", "YOLO").setValue(this.plugin.settings.approvalMode).onChange(async (value) => {
        this.plugin.settings.approvalMode = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian3.Setting(containerEl).setName("Slash commands (JSON)").setDesc('Array format: [{"name":"summarize","prompt":"... {{selection}} ... {{args}}"}]').addTextArea((textArea) => {
      textArea.setValue(JSON.stringify(this.plugin.settings.slashCommands, null, 2)).onChange(async (value) => {
        const parsed = this.parseSlashCommands(value);
        if (!parsed) {
          return;
        }
        this.plugin.settings.slashCommands = parsed;
        await this.plugin.saveSettings();
      });
      textArea.inputEl.rows = 10;
      textArea.inputEl.style.width = "100%";
    });
    new import_obsidian3.Setting(containerEl).setName("Bash allowlist (CSV)").setDesc("Only these commands are allowed for /bash.").addText((text) => {
      text.setValue(this.plugin.settings.bashAllowlist.join(",")).onChange(async (value) => {
        this.plugin.settings.bashAllowlist = value.split(",").map((v) => v.trim()).filter(Boolean);
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian3.Setting(containerEl).setName("MCP config path").setDesc("Path to MCP JSON config file used by /mcp-list.").addText((text) => {
      text.setPlaceholder("/absolute/path/to/mcp.json").setValue(this.plugin.settings.mcpConfigPath).onChange(async (value) => {
        this.plugin.settings.mcpConfigPath = value.trim();
        await this.plugin.saveSettings();
      });
    });
  }
  parseSlashCommands(raw) {
    try {
      const value = JSON.parse(raw);
      if (!Array.isArray(value)) {
        new import_obsidian3.Notice("Slash commands JSON must be an array.");
        return null;
      }
      const commands = [];
      for (const item of value) {
        if (!item || typeof item !== "object") {
          continue;
        }
        const record = item;
        const name = typeof record.name === "string" ? record.name.trim() : "";
        const prompt = typeof record.prompt === "string" ? record.prompt : "";
        if (!name || !prompt) {
          continue;
        }
        commands.push({ name, prompt });
      }
      return commands;
    } catch (_error) {
      return null;
    }
  }
};

// src/tools/fileTools.ts
var import_promises3 = __toESM(require("fs/promises"));
var import_path3 = __toESM(require("path"));

// src/tools/pathGuard.ts
var import_path2 = __toESM(require("path"));
function normalizeInsideRoot(rootPath, targetPath) {
  const normalizedRoot = import_path2.default.resolve(rootPath);
  const absoluteTarget = import_path2.default.isAbsolute(targetPath) ? import_path2.default.resolve(targetPath) : import_path2.default.resolve(normalizedRoot, targetPath);
  const relative = import_path2.default.relative(normalizedRoot, absoluteTarget);
  if (relative.startsWith("..") || import_path2.default.isAbsolute(relative)) {
    throw new Error("Path is outside vault boundary.");
  }
  return absoluteTarget;
}

// src/tools/fileTools.ts
async function readFileTool(vaultRoot, filePath) {
  const absolutePath = normalizeInsideRoot(vaultRoot, filePath);
  const stat = await import_promises3.default.stat(absolutePath);
  if (!stat.isFile()) {
    throw new Error("Target path is not a file.");
  }
  const content = await import_promises3.default.readFile(absolutePath, "utf8");
  return content.length > 12e3 ? `${content.slice(0, 12e3)}

...[truncated]` : content;
}
async function writeFileTool(vaultRoot, filePath, content) {
  const absolutePath = normalizeInsideRoot(vaultRoot, filePath);
  const dir = import_path3.default.dirname(absolutePath);
  await import_promises3.default.mkdir(dir, { recursive: true });
  await import_promises3.default.writeFile(absolutePath, content, "utf8");
  return `Wrote ${content.length} chars to ${absolutePath}`;
}
async function readRawFileIfExists(vaultRoot, filePath) {
  const absolutePath = normalizeInsideRoot(vaultRoot, filePath);
  try {
    const stat = await import_promises3.default.stat(absolutePath);
    if (!stat.isFile()) {
      return null;
    }
    return await import_promises3.default.readFile(absolutePath, "utf8");
  } catch (_error) {
    return null;
  }
}
async function searchTool(vaultRoot, query) {
  const hits = [];
  const normalizedRoot = import_path3.default.resolve(vaultRoot);
  async function walk(dir) {
    const entries = await import_promises3.default.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === ".obsidian" || entry.name === "node_modules") {
        continue;
      }
      const fullPath = import_path3.default.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      if (!entry.isFile()) {
        continue;
      }
      if (!entry.name.endsWith(".md")) {
        continue;
      }
      try {
        const content = await import_promises3.default.readFile(fullPath, "utf8");
        if (content.toLowerCase().includes(query.toLowerCase())) {
          hits.push(import_path3.default.relative(normalizedRoot, fullPath));
        }
      } catch (_error) {
      }
      if (hits.length >= 100) {
        return;
      }
    }
  }
  await walk(normalizedRoot);
  return hits;
}

// src/tools/bashTool.ts
var import_child_process3 = require("child_process");
var import_util2 = require("util");
var execFileAsync2 = (0, import_util2.promisify)(import_child_process3.execFile);
function parseCommand(raw) {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("Command is empty.");
  }
  if (/[|&;<>()`$]/.test(trimmed)) {
    throw new Error("Shell metacharacters are not allowed.");
  }
  const parts = trimmed.split(/\s+/).filter(Boolean);
  const [command, ...args] = parts;
  if (!command) {
    throw new Error("Invalid command.");
  }
  return { command, args };
}
async function runBashTool(params) {
  const { commandLine, allowlist, cwd } = params;
  const { command, args } = parseCommand(commandLine);
  if (!allowlist.includes(command)) {
    throw new Error(`Command "${command}" is not allowed.`);
  }
  const result = await execFileAsync2(command, args, {
    cwd,
    timeout: 15e3,
    maxBuffer: 256 * 1024,
    windowsHide: true
  });
  const stdout = result.stdout?.trim() ?? "";
  const stderr = result.stderr?.trim() ?? "";
  if (stderr && !stdout) {
    return `stderr:
${stderr}`;
  }
  if (!stdout && !stderr) {
    return "(no output)";
  }
  if (stdout && stderr) {
    return `stdout:
${stdout}

stderr:
${stderr}`;
  }
  return stdout || stderr;
}

// src/types.ts
var DEFAULT_SETTINGS = {
  authMode: "apiKey",
  encryptedApiKey: "",
  encryptedGatewayAccessToken: "",
  preferCodexCli: true,
  codexCliPath: "codex",
  codexWorkingDir: "",
  syncWithLocalCodex: true,
  model: "gpt-5.4",
  thinkingBudget: "med",
  temperature: 0.2,
  systemPrompt: "You are MaxCode, an Obsidian coding assistant.",
  safeMode: true,
  approvalMode: "safe",
  gatewayBaseUrl: "",
  slashCommands: [
    {
      name: "summarize",
      prompt: "Summarize the following text in concise bullet points:\n\n{{selection}}{{args}}"
    },
    {
      name: "improve",
      prompt: "Improve this text while keeping original meaning and markdown structure:\n\n{{selection}}{{args}}"
    }
  ],
  bashAllowlist: ["ls", "cat", "pwd", "echo", "head", "tail", "wc", "rg"],
  mcpConfigPath: ""
};

// src/ui/agentRunApprovalModal.ts
var import_obsidian4 = require("obsidian");
var AgentRunApprovalModal = class extends import_obsidian4.Modal {
  constructor(app, modeLabel, onResolve) {
    super(app);
    this.resolved = false;
    this.modeLabel = modeLabel;
    this.onResolve = onResolve;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: "Agent Approval Strategy" });
    contentEl.createEl("p", {
      text: `Current mode: ${this.modeLabel}. Choose how approvals should work for this /agent run.`
    });
    new import_obsidian4.Setting(contentEl).addButton(
      (button) => button.setButtonText("Cancel").onClick(() => {
        this.resolved = true;
        this.onResolve("cancel");
        this.close();
      })
    ).addButton(
      (button) => button.setButtonText("Step By Step").onClick(() => {
        this.resolved = true;
        this.onResolve("step_by_step");
        this.close();
      })
    ).addButton(
      (button) => button.setButtonText("Approve All This Run").setCta().onClick(() => {
        this.resolved = true;
        this.onResolve("approve_all");
        this.close();
      })
    );
  }
  onClose() {
    if (!this.resolved) {
      this.onResolve("cancel");
    }
  }
};
async function chooseAgentRunApprovalPolicy(params) {
  return await new Promise((resolve) => {
    const modal = new AgentRunApprovalModal(params.app, params.mode.toUpperCase(), resolve);
    modal.open();
  });
}

// src/ui/confirmFileWriteModal.ts
var import_obsidian5 = require("obsidian");
var MAX_LCS_LINES = 320;
var MAX_RENDER_LINES = 600;
function buildLineDiff(beforeText, afterText) {
  const a = beforeText.split("\n");
  const b = afterText.split("\n");
  if (a.length > MAX_LCS_LINES || b.length > MAX_LCS_LINES) {
    return [
      { kind: "remove", text: `(before preview truncated, ${a.length} lines)` },
      ...a.slice(0, 120).map((line) => ({ kind: "remove", text: line })),
      { kind: "add", text: `(after preview truncated, ${b.length} lines)` },
      ...b.slice(0, 120).map((line) => ({ kind: "add", text: line }))
    ];
  }
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i2 = n - 1; i2 >= 0; i2--) {
    for (let j2 = m - 1; j2 >= 0; j2--) {
      if (a[i2] === b[j2]) {
        dp[i2][j2] = dp[i2 + 1][j2 + 1] + 1;
      } else {
        dp[i2][j2] = Math.max(dp[i2 + 1][j2], dp[i2][j2 + 1]);
      }
    }
  }
  const diff = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      diff.push({ kind: "context", text: a[i] });
      i += 1;
      j += 1;
      continue;
    }
    if (dp[i + 1][j] >= dp[i][j + 1]) {
      diff.push({ kind: "remove", text: a[i] });
      i += 1;
    } else {
      diff.push({ kind: "add", text: b[j] });
      j += 1;
    }
  }
  while (i < n) {
    diff.push({ kind: "remove", text: a[i] });
    i += 1;
  }
  while (j < m) {
    diff.push({ kind: "add", text: b[j] });
    j += 1;
  }
  return diff;
}
var ConfirmFileWriteModal = class extends import_obsidian5.Modal {
  constructor(app, params) {
    super(app);
    this.resolved = false;
    this.path = params.path;
    this.beforeText = params.beforeText;
    this.afterText = params.afterText;
    this.onResolve = params.onResolve;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.addClass("claudian-approval-modal");
    contentEl.createEl("h3", { text: "Review File Changes" });
    contentEl.createEl("p", { text: this.path, cls: "claudian-approval-desc" });
    const diffLines = buildLineDiff(this.beforeText, this.afterText);
    const wrapper = contentEl.createDiv({ cls: "claudian-write-edit-block done" });
    const headerEl = wrapper.createDiv({ cls: "claudian-write-edit-header" });
    headerEl.createDiv({ cls: "claudian-write-edit-label", text: "Diff Preview" });
    const diffContainer = wrapper.createDiv({ cls: "claudian-write-edit-content" });
    const hunk = diffContainer.createDiv({ cls: "claudian-diff-hunk" });
    const renderLines = diffLines.slice(0, MAX_RENDER_LINES);
    for (const line of renderLines) {
      const cls = line.kind === "add" ? "claudian-diff-line claudian-diff-insert" : line.kind === "remove" ? "claudian-diff-line claudian-diff-delete" : "claudian-diff-line claudian-diff-equal";
      const row = hunk.createDiv({ cls });
      row.createSpan({
        cls: "claudian-diff-prefix",
        text: line.kind === "add" ? "+" : line.kind === "remove" ? "-" : " "
      });
      row.createSpan({
        cls: "claudian-diff-text",
        text: line.text
      });
    }
    if (diffLines.length > MAX_RENDER_LINES) {
      hunk.createDiv({
        cls: "claudian-diff-no-changes",
        text: `... truncated ${diffLines.length - MAX_RENDER_LINES} more lines`
      });
    }
    new import_obsidian5.Setting(contentEl).addButton(
      (button) => button.setButtonText("Cancel").onClick(() => {
        this.resolved = true;
        this.onResolve(false);
        this.close();
      })
    ).addButton(
      (button) => button.setButtonText("Apply").setCta().onClick(() => {
        this.resolved = true;
        this.onResolve(true);
        this.close();
      })
    );
  }
  onClose() {
    if (!this.resolved) {
      this.onResolve(false);
    }
  }
};
async function confirmFileWrite(params) {
  return await new Promise((resolve) => {
    const modal = new ConfirmFileWriteModal(params.app, {
      path: params.path,
      beforeText: params.beforeText,
      afterText: params.afterText,
      onResolve: resolve
    });
    modal.open();
  });
}

// src/ui/confirmChangeModal.ts
var import_obsidian6 = require("obsidian");
var ConfirmChangeModal = class extends import_obsidian6.Modal {
  constructor(app, params) {
    super(app);
    this.resolved = false;
    this.titleText = params.title;
    this.beforeText = params.beforeText;
    this.afterText = params.afterText;
    this.onResolve = params.onResolve;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: this.titleText });
    contentEl.createEl("p", { text: "Review changes before applying." });
    contentEl.createEl("h4", { text: "Before" });
    contentEl.createEl("pre", { text: this.beforeText.slice(0, 4e3) });
    contentEl.createEl("h4", { text: "After" });
    contentEl.createEl("pre", { text: this.afterText.slice(0, 4e3) });
    new import_obsidian6.Setting(contentEl).addButton(
      (button) => button.setButtonText("Cancel").onClick(() => {
        this.resolved = true;
        this.onResolve(false);
        this.close();
      })
    ).addButton(
      (button) => button.setButtonText("Apply").setCta().onClick(() => {
        this.resolved = true;
        this.onResolve(true);
        this.close();
      })
    );
  }
  onClose() {
    if (!this.resolved) {
      this.onResolve(false);
    }
  }
};
async function confirmTextChange(params) {
  return await new Promise((resolve) => {
    const modal = new ConfirmChangeModal(params.app, {
      title: params.title,
      beforeText: params.beforeText,
      afterText: params.afterText,
      onResolve: resolve
    });
    modal.open();
  });
}

// src/ui/textInputModal.ts
var import_obsidian7 = require("obsidian");
var TextInputModal = class extends import_obsidian7.Modal {
  constructor(app, params) {
    super(app);
    this.title = params.title;
    this.placeholder = params.placeholder;
    this.initialValue = params.initialValue ?? "";
    this.onSubmit = params.onSubmit;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: this.title });
    let value = this.initialValue;
    new import_obsidian7.Setting(contentEl).addTextArea((textArea) => {
      textArea.setPlaceholder(this.placeholder).setValue(this.initialValue).onChange((next) => {
        value = next;
      });
      textArea.inputEl.rows = 4;
      textArea.inputEl.style.width = "100%";
    });
    new import_obsidian7.Setting(contentEl).addButton(
      (button) => button.setButtonText("Cancel").onClick(() => {
        this.close();
      })
    ).addButton(
      (button) => button.setButtonText("Confirm").setCta().onClick(() => {
        this.onSubmit(value);
        this.close();
      })
    );
  }
};

// src/main.ts
var MaxCodePlugin = class extends import_obsidian8.Plugin {
  constructor() {
    super(...arguments);
    this.settings = { ...DEFAULT_SETTINGS };
    this.provider = new CodexCliProvider();
    this.secretStorage = createSecretStorage();
    this.abortController = null;
    this.agentApproveAllForCurrentRun = false;
    this.conversations = [];
    this.activeConversationId = "";
    this.tabConversationIds = [];
    this.auditTrail = [];
    this.listeners = /* @__PURE__ */ new Set();
  }
  async onload() {
    await this.loadPluginData();
    if (await this.syncAllConversationsWithLocalCodex()) {
      await this.savePluginData();
    }
    this.registerView(MAXCODE_VIEW_TYPE, (leaf) => new MaxCodeChatView(leaf, this));
    this.addRibbonIcon("bot", "Open MaxCode", () => {
      void this.activateView();
    });
    this.addCommand({
      id: "open-maxcode-chat",
      name: "Open chat view",
      callback: () => void this.activateView()
    });
    this.addCommand({
      id: "codex-login-device-auth",
      name: "Codex account login (device auth)",
      callback: () => {
        void this.runCodexLoginDeviceAuth();
      }
    });
    this.addCommand({
      id: "codex-logout",
      name: "Codex account logout",
      callback: () => {
        void this.runCodexLogout();
      }
    });
    this.addCommand({
      id: "ask-with-selection",
      name: "Ask MaxCode with selected text",
      editorCallback: async (editor) => {
        const selection = editor.getSelection().trim();
        if (!selection) {
          new import_obsidian8.Notice("Select text first.");
          return;
        }
        await this.activateView();
        await this.sendMessage(`Please help me with the following selected text:

${selection}`);
      }
    });
    this.addCommand({
      id: "agent-with-selection",
      name: "Run agent with selected text",
      editorCallback: async (editor) => {
        const selection = editor.getSelection().trim();
        if (!selection) {
          new import_obsidian8.Notice("Select text first.");
          return;
        }
        await this.activateView();
        await this.sendMessage(`/agent ${selection}`);
      }
    });
    this.addCommand({
      id: "inline-edit-selection",
      name: "Inline edit selection",
      callback: () => {
        void this.startInlineEditFromUi();
      }
    });
    this.addCommand({
      id: "import-claudian-config",
      name: "Import Claudian config (JSON)",
      callback: () => {
        new TextInputModal(this.app, {
          title: "Import Claudian Config",
          placeholder: "/absolute/path/to/claudian-config.json",
          onSubmit: (path5) => {
            void this.importClaudianConfigFromPath(path5.trim());
          }
        }).open();
      }
    });
    this.addSettingTab(new MaxCodeSettingTab(this.app, this));
  }
  async onunload() {
    for (const leaf of this.app.workspace.getLeavesOfType(MAXCODE_VIEW_TYPE)) {
      leaf.detach();
    }
  }
  getMessages() {
    return this.getActiveConversation().messages;
  }
  getActiveConversationTitle() {
    return this.getActiveConversation().title;
  }
  getConversationSummaries() {
    return this.conversations.map((session) => ({
      id: session.id,
      title: session.title,
      updatedAt: session.updatedAt,
      messageCount: session.messages.length
    })).sort((a, b) => b.updatedAt - a.updatedAt);
  }
  getConversationTabs() {
    const tabs = this.tabConversationIds.map((id) => this.conversations.find((session) => session.id === id)).filter(Boolean).slice(0, 8);
    return tabs.map((session) => ({
      id: session.id,
      title: session.title,
      messageCount: session.messages.length
    }));
  }
  getConversationCount() {
    return this.conversations.length;
  }
  getActiveConversationId() {
    return this.activeConversationId;
  }
  async createConversationFromUi() {
    const session = this.createSession([], "");
    this.conversations.push(session);
    this.activeConversationId = session.id;
    this.touchTabConversation(session.id);
    await this.savePluginData();
    this.notifyMessagesChanged();
  }
  async renameActiveConversationFromUi(nextTitle) {
    const session = this.getActiveConversation();
    const normalized = nextTitle.trim();
    if (!normalized) {
      return;
    }
    session.title = normalized;
    session.updatedAt = Date.now();
    await this.savePluginData();
    this.notifyMessagesChanged();
  }
  async switchConversationFromUi(id) {
    const found = this.conversations.find((session) => session.id === id);
    if (!found) {
      return;
    }
    this.activeConversationId = found.id;
    this.touchTabConversation(found.id);
    await this.syncConversationFromLocalCodex(found);
    await this.savePluginData();
    this.notifyMessagesChanged();
  }
  async deleteConversationFromUi(id) {
    const targetId = (id ?? this.activeConversationId).trim();
    if (!targetId) {
      return;
    }
    if (this.conversations.length <= 1) {
      new import_obsidian8.Notice("Cannot delete the last chat. Create another chat first.");
      return;
    }
    const target = this.conversations.find((session) => session.id === targetId);
    if (!target) {
      return;
    }
    const next = this.conversations.filter((session) => session.id !== targetId);
    if (next.length === this.conversations.length) {
      return;
    }
    this.conversations = next;
    this.tabConversationIds = this.tabConversationIds.filter((conversationId) => conversationId !== targetId);
    if (!this.conversations.some((session) => session.id === this.activeConversationId)) {
      this.activeConversationId = this.tabConversationIds[0] ?? this.conversations[0].id;
    }
    this.touchTabConversation(this.activeConversationId);
    await this.savePluginData();
    this.notifyMessagesChanged();
  }
  onMessagesChanged(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  getModelOptions() {
    return [
      "gpt-5.4",
      "gpt-5.3-codex",
      "gpt-5.2",
      "gpt-5.2-codex",
      "gpt-5.1-codex-max",
      "gpt-5.1-codex",
      "gpt-5.1"
    ];
  }
  async updateModel(model) {
    const next = model.trim();
    this.settings.model = this.getModelOptions().includes(next) ? next : this.getModelOptions()[0];
    await this.saveSettings();
  }
  getThinkingLabel() {
    switch (this.settings.thinkingBudget) {
      case "off":
        return "Off";
      case "low":
        return "Low";
      case "high":
        return "High";
      case "med":
      default:
        return "Med";
    }
  }
  async updateThinkingBudget(value) {
    this.settings.thinkingBudget = value;
    await this.saveSettings();
  }
  isRunning() {
    return this.abortController !== null;
  }
  isYoloMode() {
    return this.getEffectiveApprovalMode() === "yolo";
  }
  async toggleYoloMode() {
    const isYolo = this.isYoloMode();
    this.settings.safeMode = true;
    this.settings.approvalMode = isYolo ? "safe" : "yolo";
    await this.saveSettings();
  }
  async startInlineEditFromUi() {
    new TextInputModal(this.app, {
      title: "Inline Edit",
      placeholder: "Instruction for rewriting the selected text",
      initialValue: "Improve clarity and structure while preserving markdown.",
      onSubmit: (instruction) => {
        void this.inlineEditSelection(instruction.trim());
      }
    }).open();
  }
  async showAuditFromUi() {
    await this.sendMessage("/audit-last 30");
  }
  stopGeneration() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
      new import_obsidian8.Notice("MaxCode response stopped.");
      this.notifyMessagesChanged();
    }
  }
  async clearMessages() {
    const session = this.getActiveConversation();
    session.messages = [];
    session.updatedAt = Date.now();
    await this.savePluginData();
    this.notifyMessagesChanged();
  }
  getApiKey() {
    return this.secretStorage.decrypt(this.settings.encryptedApiKey);
  }
  async setApiKey(apiKey) {
    this.settings.encryptedApiKey = this.secretStorage.encrypt(apiKey);
    await this.saveSettings();
  }
  getGatewayToken() {
    return this.secretStorage.decrypt(this.settings.encryptedGatewayAccessToken);
  }
  async setGatewayToken(token) {
    this.settings.encryptedGatewayAccessToken = this.secretStorage.encrypt(token);
    await this.saveSettings();
  }
  async getCodexLoginStatus() {
    try {
      const codexPath = await resolveCodexBinary(this.settings.codexCliPath?.trim() || "codex");
      const env = { ...process.env };
      if (import_path.default.isAbsolute(codexPath)) {
        env.PATH = withPrependedPath(process.env.PATH, import_path.default.dirname(codexPath));
      }
      const { stdout, stderr } = await execFileAsync(codexPath, ["login", "status"], {
        timeout: 12e3,
        maxBuffer: 256 * 1024,
        env
      });
      const raw = `${stdout || ""}
${stderr || ""}`.trim();
      if (!raw) {
        return {
          loggedIn: false,
          message: "No status output from Codex CLI.",
          detail: raw
        };
      }
      const firstLine = raw.split(/\r?\n/).map((line) => line.trim()).find(Boolean) ?? raw;
      const loggedIn = /logged in/i.test(raw);
      return { loggedIn, message: firstLine, detail: raw };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown status error";
      return { loggedIn: false, message: `Status check failed: ${message}`, detail: message };
    }
  }
  async runCodexLoginDeviceAuth() {
    try {
      const codexPath = await resolveCodexBinary(this.settings.codexCliPath?.trim() || "codex");
      const env = { ...process.env };
      if (import_path.default.isAbsolute(codexPath)) {
        env.PATH = withPrependedPath(process.env.PATH, import_path.default.dirname(codexPath));
      }
      new import_obsidian8.Notice("Starting Codex login via device auth...");
      const { stdout, stderr } = await execFileAsync(codexPath, ["login", "--device-auth"], {
        timeout: 18e4,
        maxBuffer: 512 * 1024,
        env
      });
      const combined = `${stdout || ""}
${stderr || ""}`.trim();
      const summary = combined.split(/\r?\n/).map((line) => line.trim()).find(Boolean) ?? "Codex login completed.";
      new import_obsidian8.Notice(summary);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown login error";
      new import_obsidian8.Notice(`Codex login failed: ${message}`);
    }
  }
  async runCodexLogout() {
    try {
      const codexPath = await resolveCodexBinary(this.settings.codexCliPath?.trim() || "codex");
      const env = { ...process.env };
      if (import_path.default.isAbsolute(codexPath)) {
        env.PATH = withPrependedPath(process.env.PATH, import_path.default.dirname(codexPath));
      }
      await execFileAsync(codexPath, ["logout"], {
        timeout: 12e3,
        maxBuffer: 256 * 1024,
        env
      });
      new import_obsidian8.Notice("Codex account logged out.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown logout error";
      new import_obsidian8.Notice(`Codex logout failed: ${message}`);
    }
  }
  async ensureCodexAuthReady() {
    if (this.getApiKey().trim()) {
      return { ready: true, message: "OPENAI_API_KEY configured in MaxCode settings." };
    }
    const status = await this.getCodexLoginStatus();
    if (status.loggedIn) {
      return { ready: true, message: status.message };
    }
    return {
      ready: false,
      message: `Codex auth required. ${status.message}
Run "codex login --device-auth" in terminal or use MaxCode Settings -> Codex account -> Login.`
    };
  }
  async saveSettings() {
    await this.savePluginData();
  }
  async sendMessage(rawMessage) {
    if (this.abortController) {
      throw new Error("A response is already running. Stop it first.");
    }
    const agentHandled = await this.tryHandleAgentCommand(rawMessage);
    if (agentHandled) {
      return;
    }
    const toolHandled = await this.tryHandleToolCommand(rawMessage);
    if (toolHandled) {
      return;
    }
    const authState = await this.ensureCodexAuthReady();
    if (!authState.ready) {
      new import_obsidian8.Notice(authState.message, 8e3);
      throw new Error(authState.message);
    }
    const session = this.getActiveConversation();
    if (this.settings.syncWithLocalCodex) {
      await this.syncConversationFromLocalCodex(session);
    }
    const isFirstTurnInSession = session.messages.length === 0;
    const resolvedMessage = this.resolveSlashCommand(rawMessage);
    const userMessage = this.createMessage("user", rawMessage);
    const assistantMessage = this.createMessage("assistant", "");
    session.messages.push(userMessage, assistantMessage);
    if (session.messages.length <= 2 && !session.title.startsWith("Chat ")) {
      session.title = this.summarizeConversationTitle(rawMessage);
    } else if (session.messages.length <= 2) {
      session.title = this.summarizeConversationTitle(rawMessage);
    }
    session.updatedAt = Date.now();
    this.notifyMessagesChanged();
    const requestMessages = [];
    const shouldUseThreadSyncFlow = this.settings.syncWithLocalCodex;
    if (shouldUseThreadSyncFlow) {
      requestMessages.push(this.createMessage("user", resolvedMessage));
    } else {
      const currentNoteContext = await this.buildCurrentNoteContext();
      const thinkingHint = this.settings.thinkingBudget === "off" ? "" : `Thinking budget preference: ${this.getThinkingLabel()}.`;
      requestMessages.push(this.createMessage("system", [this.settings.systemPrompt, thinkingHint].filter(Boolean).join("\n")));
      if (currentNoteContext) {
        requestMessages.push(this.createMessage("system", currentNoteContext));
      }
      for (const message of session.messages) {
        if (message.id !== assistantMessage.id) {
          if (message.id === userMessage.id) {
            requestMessages.push({ ...message, content: resolvedMessage });
          } else {
            requestMessages.push(message);
          }
        }
      }
    }
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    this.notifyMessagesChanged();
    try {
      await this.provider.streamResponse(
        {
          messages: requestMessages,
          model: this.settings.model,
          temperature: this.settings.temperature,
          signal,
          codexCliPath: this.settings.codexCliPath,
          workspaceDir: this.getCodexWorkspaceDirOrUndefined(),
          codexThreadId: session.codexThreadId?.trim() || void 0,
          resumeLastThread: shouldUseThreadSyncFlow && !session.codexThreadId && isFirstTurnInSession,
          apiKey: this.getApiKey()
        },
        {
          onDelta: (delta) => {
            assistantMessage.content += delta;
            this.notifyMessagesChanged();
          },
          onThreadStarted: (threadId) => {
            if (threadId && session.codexThreadId !== threadId) {
              session.codexThreadId = threadId;
              session.updatedAt = Date.now();
              void this.savePluginData();
            }
          },
          onTraceEvent: (event) => {
            this.upsertTraceEvent(assistantMessage, event);
            this.notifyMessagesChanged();
          },
          onDone: () => {
            this.setMessageTraceOverallState(assistantMessage, "completed", "Completed");
            session.updatedAt = Date.now();
            void this.savePluginData();
            this.notifyMessagesChanged();
          },
          onError: (message) => {
            this.markMessageTraceFailed(assistantMessage, message);
            assistantMessage.content = assistantMessage.content ? `${assistantMessage.content}

[Error] ${message}` : `[Error] ${message}`;
            session.updatedAt = Date.now();
            void this.savePluginData();
            this.notifyMessagesChanged();
          },
          onStatus: (status) => {
            this.upsertStatusEvent(assistantMessage, status);
            this.notifyMessagesChanged();
          }
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      if (!signal.aborted) {
        this.markMessageTraceFailed(assistantMessage, errorMessage);
        assistantMessage.content = assistantMessage.content ? `${assistantMessage.content}

[Error] ${errorMessage}` : `[Error] ${errorMessage}`;
        session.updatedAt = Date.now();
        this.notifyMessagesChanged();
        await this.savePluginData();
      }
    } finally {
      this.abortController = null;
      this.notifyMessagesChanged();
    }
  }
  async buildCurrentNoteContext() {
    const file = this.app.workspace.getActiveFile();
    if (!file) {
      return "";
    }
    const content = await this.app.vault.cachedRead(file);
    const clipped = content.length > 6e3 ? `${content.slice(0, 6e3)}

...[truncated]` : content;
    return `Current note path: ${file.path}
Current note content:
${clipped}`;
  }
  async activateView() {
    if (await this.syncAllConversationsWithLocalCodex()) {
      await this.savePluginData();
      this.notifyMessagesChanged();
    }
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(MAXCODE_VIEW_TYPE)[0] ?? null;
    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      await leaf?.setViewState({ type: MAXCODE_VIEW_TYPE, active: true });
    }
    if (leaf) {
      workspace.revealLeaf(leaf);
    }
  }
  async inlineEditSelection(instruction) {
    if (this.abortController) {
      new import_obsidian8.Notice("A response is already running. Stop it first.");
      return;
    }
    if (!instruction) {
      new import_obsidian8.Notice("Inline edit instruction is required.");
      return;
    }
    const view = this.app.workspace.getActiveViewOfType(import_obsidian8.MarkdownView);
    const editor = view?.editor;
    if (!editor) {
      new import_obsidian8.Notice("Open a markdown editor first.");
      return;
    }
    const selected = editor.getSelection().trim();
    if (!selected) {
      new import_obsidian8.Notice("Select text first.");
      return;
    }
    const prompt = `Rewrite the following markdown based on this instruction:
${instruction}

Return only the rewritten markdown.

Selected markdown:
${selected}`;
    const result = await this.completeText(prompt, "You edit markdown precisely and return only final markdown.");
    if (!result.trim()) {
      new import_obsidian8.Notice("Inline edit returned empty content.");
      return;
    }
    const next = result.trim();
    const approved = await confirmTextChange({
      app: this.app,
      title: "Apply Inline Edit?",
      beforeText: selected,
      afterText: next
    });
    if (!approved) {
      new import_obsidian8.Notice("Inline edit cancelled.");
      return;
    }
    editor.replaceSelection(next);
    new import_obsidian8.Notice("Inline edit applied.");
  }
  async completeText(userPrompt, systemPrompt) {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    this.notifyMessagesChanged();
    let output = "";
    try {
      await this.provider.streamResponse(
        {
          messages: [
            this.createMessage("system", systemPrompt),
            this.createMessage("user", userPrompt)
          ],
          model: this.settings.model,
          temperature: this.settings.temperature,
          signal,
          codexCliPath: this.settings.codexCliPath,
          workspaceDir: this.getCodexWorkspaceDirOrUndefined(),
          apiKey: this.getApiKey()
        },
        {
          onDelta: (delta) => {
            output += delta;
          },
          onDone: () => {
          },
          onError: (message) => {
            throw new Error(message);
          }
        }
      );
      return output;
    } finally {
      this.abortController = null;
      this.notifyMessagesChanged();
    }
  }
  async importClaudianConfigFromPath(configPath) {
    if (!configPath) {
      new import_obsidian8.Notice("Config path is required.");
      return;
    }
    try {
      const req = window.require;
      if (!req) {
        throw new Error("Node runtime is not available.");
      }
      const fs5 = req("node:fs/promises");
      const raw = await fs5.readFile(configPath, "utf8");
      const imported = importClaudianConfig(raw, this.settings);
      this.settings = imported.updatedSettings;
      await this.saveSettings();
      new import_obsidian8.Notice(imported.summary);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown import error";
      new import_obsidian8.Notice(`Import failed: ${message}`);
    }
  }
  async tryHandleAgentCommand(rawMessage) {
    const trimmed = rawMessage.trim();
    if (!trimmed.startsWith("/agent")) {
      return false;
    }
    const task = trimmed.slice("/agent".length).trim();
    if (!task) {
      throw new Error("Usage: /agent <task>");
    }
    const userMessage = this.createMessage("user", rawMessage);
    const assistantMessage = this.createMessage("assistant", "Agent is planning...");
    assistantMessage.events = [];
    const session = this.getActiveConversation();
    session.messages.push(userMessage, assistantMessage);
    session.updatedAt = Date.now();
    this.notifyMessagesChanged();
    try {
      const finalAnswer = await this.runAgentWithCodexCli(task, assistantMessage);
      assistantMessage.content = finalAnswer;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown agent error";
      assistantMessage.content = `[Agent Error] ${message}`;
    }
    await this.savePluginData();
    this.notifyMessagesChanged();
    return true;
  }
  async runAgentWithCodexCli(task, assistantMessage) {
    this.appendEvent(assistantMessage, "status", "using local codex cli agent mode");
    this.notifyMessagesChanged();
    const currentNoteContext = await this.buildCurrentNoteContext();
    const prompt = [
      `Task: ${task}`,
      currentNoteContext ? `Current note context:
${currentNoteContext}` : "",
      "Use available local context and provide final answer in markdown."
    ].filter(Boolean).join("\n\n");
    const systemPrompt = "You are MaxCode Agent running via local Codex CLI. Be concise, actionable, and file-oriented when relevant.";
    return await this.completeText(prompt, systemPrompt);
  }
  async runAgentLoopWithNativeTools(task, assistantMessage) {
    const auth = this.getProviderAuth();
    const endpoint = auth.gatewayBaseUrl ? `${auth.gatewayBaseUrl.replace(/\/$/, "")}/v1/responses` : "https://api.openai.com/v1/responses";
    if (!auth.token) {
      throw new Error("Missing token. Configure API Key or gateway token in settings.");
    }
    const policy = await this.chooseApprovalPolicyForAgentRun();
    if (policy === "cancel") {
      this.appendEvent(assistantMessage, "status", "run cancelled before execution");
      return "Agent run cancelled.";
    }
    this.agentApproveAllForCurrentRun = policy === "approve_all";
    this.appendEvent(
      assistantMessage,
      "status",
      this.agentApproveAllForCurrentRun ? "approval policy: approve_all" : "approval policy: step_by_step"
    );
    const currentNoteContext = await this.buildCurrentNoteContext();
    const taskInput = [
      `Task: ${task}`,
      currentNoteContext ? `Current note context:
${currentNoteContext}` : ""
    ].filter(Boolean).join("\n\n");
    let previousResponseId;
    let inputPayload = taskInput;
    const maxSteps = 8;
    try {
      for (let step = 1; step <= maxSteps; step++) {
        this.appendEvent(assistantMessage, "status", `step ${step}: requesting model decision`);
        this.notifyMessagesChanged();
        const response = await this.requestOpenAiResponse(endpoint, auth.token, {
          model: this.settings.model,
          temperature: this.settings.temperature,
          instructions: `${this.settings.systemPrompt}
Use tools when needed. When enough evidence is gathered, answer directly.`,
          previous_response_id: previousResponseId,
          input: inputPayload,
          tools: this.buildAgentToolDefinitions(),
          tool_choice: "auto"
        });
        previousResponseId = typeof response.id === "string" ? response.id : previousResponseId;
        const functionCalls = this.extractFunctionCallsFromResponse(response);
        const textOutput = this.extractOutputTextFromResponse(response).trim();
        if (functionCalls.length === 0) {
          return textOutput || "Agent finished with no text output.";
        }
        const toolOutputs = [];
        for (const call of functionCalls) {
          this.appendEvent(assistantMessage, "tool_call", `${call.name}(${call.arguments.slice(0, 220)})`);
          this.notifyMessagesChanged();
          let args = {};
          if (call.arguments?.trim()) {
            const parsed = JSON.parse(call.arguments);
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
              args = parsed;
            }
          }
          const output = await this.executeAgentToolCall(call.name, args);
          this.appendEvent(assistantMessage, "tool_result", `${call.name} -> ${output.slice(0, 300)}`);
          this.notifyMessagesChanged();
          toolOutputs.push({
            type: "function_call_output",
            call_id: call.call_id,
            output
          });
        }
        inputPayload = toolOutputs;
      }
    } finally {
      this.agentApproveAllForCurrentRun = false;
    }
    return `Agent reached max steps (${maxSteps}) without final response.`;
  }
  async chooseApprovalPolicyForAgentRun() {
    const mode = this.getEffectiveApprovalMode();
    if (mode === "yolo") {
      return "approve_all";
    }
    return await chooseAgentRunApprovalPolicy({
      app: this.app,
      mode
    });
  }
  appendEvent(message, kind, text) {
    if (!message.events) {
      message.events = [];
    }
    message.events.push({
      at: Date.now(),
      kind,
      text
    });
  }
  upsertTraceEvent(message, event) {
    if (!message.events) {
      message.events = [];
    }
    const normalizedText = event.summary.trim() || (event.kind === "command" ? "Run command" : "Thinking");
    const index = message.events.findIndex((item) => item.kind === "trace" && item.traceId === event.id);
    if (index >= 0) {
      message.events[index] = {
        ...message.events[index],
        at: Date.now(),
        kind: "trace",
        text: normalizedText,
        traceId: event.id,
        traceKind: event.kind,
        traceState: event.status
      };
      return;
    }
    message.events.push({
      at: Date.now(),
      kind: "trace",
      text: normalizedText,
      traceId: event.id,
      traceKind: event.kind,
      traceState: event.status
    });
  }
  upsertStatusEvent(message, text) {
    const normalizedText = text.trim();
    if (!normalizedText) {
      return;
    }
    if (!message.events) {
      message.events = [];
    }
    const now = Date.now();
    const isThinkingTimer = /^Thinking\.\.\.\s+\d+s$/.test(normalizedText);
    if (isThinkingTimer) {
      const timerEvent = this.findLatestStatusEvent(message.events, "thinking-timer");
      if (timerEvent) {
        timerEvent.at = now;
        timerEvent.text = normalizedText;
        return;
      }
      message.events.push({
        at: now,
        kind: "status",
        text: normalizedText,
        statusKey: "thinking-timer"
      });
      return;
    }
    const latestStatus = this.getLatestStatusEvent(message.events.filter((event) => event.kind === "status"));
    if (latestStatus?.text === normalizedText) {
      latestStatus.at = now;
      return;
    }
    message.events.push({
      at: now,
      kind: "status",
      text: normalizedText
    });
  }
  getDisplayStatusEvents(message, statusEvents) {
    const milestones = statusEvents.filter((event) => event.statusKey !== "thinking-timer");
    const displayEvents = milestones.slice(-3);
    const isFinished = message.traceOverallState === "completed" || message.traceOverallState === "failed";
    const timerEvent = this.findLatestStatusEvent(statusEvents, "thinking-timer");
    if (!isFinished && timerEvent) {
      displayEvents.push(timerEvent);
    } else if (displayEvents.length === 0 && timerEvent) {
      displayEvents.push(timerEvent);
    }
    return displayEvents.filter((event, index, items) => items.findIndex((item) => item.text === event.text) === index);
  }
  getLatestStatusEvent(statusEvents) {
    for (let i = statusEvents.length - 1; i >= 0; i -= 1) {
      if (statusEvents[i]?.text?.trim()) {
        return statusEvents[i];
      }
    }
    return null;
  }
  findLatestStatusEvent(events, statusKey) {
    for (let i = events.length - 1; i >= 0; i -= 1) {
      if (events[i].kind === "status" && events[i].statusKey === statusKey) {
        return events[i];
      }
    }
    return null;
  }
  setMessageTraceOverallState(message, state, label) {
    message.traceOverallState = state;
    message.traceOverallLabel = label;
  }
  markMessageTraceFailed(message, reason) {
    if (!message.events) {
      message.events = [];
    }
    let hasTrace = false;
    let markedFailed = false;
    for (const event of message.events) {
      if (event.kind !== "trace") {
        continue;
      }
      hasTrace = true;
      if (event.traceState !== "completed") {
        event.traceState = "failed";
        event.at = Date.now();
        markedFailed = true;
      }
    }
    const normalizedReason = reason.trim();
    if (!hasTrace || !markedFailed) {
      message.events.push({
        at: Date.now(),
        kind: "trace",
        text: normalizedReason || "Request failed",
        traceId: `trace-error-${Date.now()}`,
        traceKind: "reasoning",
        traceState: "failed"
      });
    }
    this.setMessageTraceOverallState(message, "failed", normalizedReason.startsWith("Codex CLI timed out") ? "Timed out" : "Failed");
  }
  getProviderAuth() {
    if (this.settings.authMode === "gateway") {
      return {
        token: this.getGatewayToken(),
        gatewayBaseUrl: this.settings.gatewayBaseUrl
      };
    }
    return {
      token: this.getApiKey()
    };
  }
  async requestOpenAiResponse(endpoint, token, payload) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Provider error (${response.status}): ${errorText}`);
    }
    return await response.json();
  }
  extractFunctionCallsFromResponse(response) {
    const output = response.output;
    if (!Array.isArray(output)) {
      return [];
    }
    const calls = [];
    for (const item of output) {
      if (!item || typeof item !== "object") {
        continue;
      }
      const record = item;
      if (record.type !== "function_call") {
        continue;
      }
      const callId = typeof record.call_id === "string" ? record.call_id : "";
      const name = typeof record.name === "string" ? record.name : "";
      const argumentsRaw = typeof record.arguments === "string" ? record.arguments : "{}";
      if (!callId || !name) {
        continue;
      }
      calls.push({
        type: "function_call",
        call_id: callId,
        name,
        arguments: argumentsRaw
      });
    }
    return calls;
  }
  extractOutputTextFromResponse(response) {
    const directText = response.output_text;
    if (typeof directText === "string") {
      return directText;
    }
    const output = response.output;
    if (!Array.isArray(output)) {
      return "";
    }
    const texts = [];
    for (const item of output) {
      if (!item || typeof item !== "object") {
        continue;
      }
      const record = item;
      if (record.type !== "message") {
        continue;
      }
      const content = record.content;
      if (!Array.isArray(content)) {
        continue;
      }
      for (const part of content) {
        if (!part || typeof part !== "object") {
          continue;
        }
        const contentPart = part;
        const text = contentPart.text;
        if (typeof text === "string" && text.trim()) {
          texts.push(text);
        }
      }
    }
    return texts.join("\n");
  }
  buildAgentToolDefinitions() {
    return [
      {
        type: "function",
        name: "read_file",
        description: "Read a file from the vault by relative path.",
        parameters: {
          type: "object",
          properties: {
            path: { type: "string" }
          },
          required: ["path"],
          additionalProperties: false
        }
      },
      {
        type: "function",
        name: "search_vault",
        description: "Search markdown files in vault for a query.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string" }
          },
          required: ["query"],
          additionalProperties: false
        }
      },
      {
        type: "function",
        name: "write_file",
        description: "Write content to a file path in vault.",
        parameters: {
          type: "object",
          properties: {
            path: { type: "string" },
            content: { type: "string" }
          },
          required: ["path", "content"],
          additionalProperties: false
        }
      },
      {
        type: "function",
        name: "run_bash",
        description: "Run an allowlisted shell command in vault root.",
        parameters: {
          type: "object",
          properties: {
            command: { type: "string" }
          },
          required: ["command"],
          additionalProperties: false
        }
      },
      {
        type: "function",
        name: "mcp_list_servers",
        description: "List MCP servers from local MCP config file.",
        parameters: {
          type: "object",
          properties: {},
          additionalProperties: false
        }
      },
      {
        type: "function",
        name: "mcp_list_tools",
        description: "List tools from a configured MCP server.",
        parameters: {
          type: "object",
          properties: {
            server: { type: "string" }
          },
          required: ["server"],
          additionalProperties: false
        }
      },
      {
        type: "function",
        name: "mcp_call_tool",
        description: "Call a tool on a configured MCP server.",
        parameters: {
          type: "object",
          properties: {
            server: { type: "string" },
            tool: { type: "string" },
            args: { type: "object" }
          },
          required: ["server", "tool", "args"],
          additionalProperties: false
        }
      }
    ];
  }
  async executeAgentToolCall(name, args) {
    if (name === "read_file") {
      const filePath = typeof args.path === "string" ? args.path.trim() : "";
      if (!filePath) {
        throw new Error("read_file requires path.");
      }
      return await this.performRead(filePath);
    }
    if (name === "search_vault") {
      const query = typeof args.query === "string" ? args.query.trim() : "";
      if (!query) {
        throw new Error("search_vault requires query.");
      }
      return await this.performSearch(query);
    }
    if (name === "write_file") {
      const filePath = typeof args.path === "string" ? args.path.trim() : "";
      const content = typeof args.content === "string" ? args.content : "";
      if (!filePath) {
        throw new Error("write_file requires path.");
      }
      return await this.performWrite(filePath, content);
    }
    if (name === "run_bash") {
      const commandLine = typeof args.command === "string" ? args.command.trim() : "";
      if (!commandLine) {
        throw new Error("run_bash requires command.");
      }
      return await this.performBash(commandLine);
    }
    if (name === "mcp_list_servers") {
      return await this.performMcpList();
    }
    if (name === "mcp_list_tools") {
      const serverName = typeof args.server === "string" ? args.server.trim() : "";
      if (!serverName) {
        throw new Error("mcp_list_tools requires server.");
      }
      return await this.performMcpTools(serverName);
    }
    if (name === "mcp_call_tool") {
      const serverName = typeof args.server === "string" ? args.server.trim() : "";
      const toolName = typeof args.tool === "string" ? args.tool.trim() : "";
      const toolArgs = args.args;
      if (!serverName || !toolName) {
        throw new Error("mcp_call_tool requires server and tool.");
      }
      if (!toolArgs || typeof toolArgs !== "object" || Array.isArray(toolArgs)) {
        throw new Error("mcp_call_tool args must be an object.");
      }
      return await this.performMcpCall(serverName, toolName, toolArgs);
    }
    throw new Error(`Unsupported tool name: ${name}`);
  }
  async tryHandleToolCommand(rawMessage) {
    const trimmed = rawMessage.trim();
    if (!trimmed.startsWith("/")) {
      return false;
    }
    const toolPrefixes = ["/read ", "/write ", "/search ", "/bash ", "/mcp-list", "/mcp-tools ", "/mcp-call ", "/audit-last"];
    if (!toolPrefixes.some((prefix) => trimmed.startsWith(prefix) || trimmed === prefix.trim())) {
      return false;
    }
    const userMessage = this.createMessage("user", rawMessage);
    const assistantMessage = this.createMessage("assistant", "Running tool...");
    const session = this.getActiveConversation();
    session.messages.push(userMessage, assistantMessage);
    session.updatedAt = Date.now();
    this.notifyMessagesChanged();
    try {
      const result = await this.executeToolCommand(trimmed);
      assistantMessage.content = result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown tool error";
      assistantMessage.content = `[Tool Error] ${message}`;
    }
    await this.savePluginData();
    this.notifyMessagesChanged();
    return true;
  }
  async executeToolCommand(trimmedCommand) {
    if (trimmedCommand === "/read" || trimmedCommand.startsWith("/read ")) {
      const filePath = trimmedCommand.slice("/read".length).trim();
      if (!filePath) {
        throw new Error("Usage: /read <relative-path>");
      }
      return await this.performRead(filePath);
    }
    if (trimmedCommand === "/search" || trimmedCommand.startsWith("/search ")) {
      const query = trimmedCommand.slice("/search".length).trim();
      if (!query) {
        throw new Error("Usage: /search <query>");
      }
      return await this.performSearch(query);
    }
    if (trimmedCommand === "/write" || trimmedCommand.startsWith("/write ")) {
      const body = trimmedCommand.slice("/write".length).trim();
      const separator = body.indexOf(":::");
      if (separator === -1) {
        throw new Error("Usage: /write <relative-path> ::: <content>");
      }
      const filePath = body.slice(0, separator).trim();
      const content = body.slice(separator + 3).trimStart();
      if (!filePath) {
        throw new Error("Write command requires a target path.");
      }
      return await this.performWrite(filePath, content);
    }
    if (trimmedCommand === "/bash" || trimmedCommand.startsWith("/bash ")) {
      const commandLine = trimmedCommand.slice("/bash".length).trim();
      if (!commandLine) {
        throw new Error("Usage: /bash <command>");
      }
      return await this.performBash(commandLine);
    }
    if (trimmedCommand === "/mcp-list") {
      return await this.performMcpList();
    }
    if (trimmedCommand === "/mcp-tools" || trimmedCommand.startsWith("/mcp-tools ")) {
      const serverName = trimmedCommand.slice("/mcp-tools".length).trim();
      if (!serverName) {
        throw new Error("Usage: /mcp-tools <server-name>");
      }
      return await this.performMcpTools(serverName);
    }
    if (trimmedCommand === "/mcp-call" || trimmedCommand.startsWith("/mcp-call ")) {
      const body = trimmedCommand.slice("/mcp-call".length).trim();
      const separator = body.indexOf(":::");
      if (separator === -1) {
        throw new Error("Usage: /mcp-call <server-name> <tool-name> ::: <json-args>");
      }
      const head = body.slice(0, separator).trim();
      const jsonArgsRaw = body.slice(separator + 3).trim();
      const [serverName, toolName] = head.split(/\s+/);
      if (!serverName || !toolName) {
        throw new Error("Usage: /mcp-call <server-name> <tool-name> ::: <json-args>");
      }
      let parsedArgs = {};
      if (jsonArgsRaw) {
        const parsed = JSON.parse(jsonArgsRaw);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          throw new Error("MCP tool args must be a JSON object.");
        }
        parsedArgs = parsed;
      }
      return await this.performMcpCall(serverName, toolName, parsedArgs);
    }
    if (trimmedCommand === "/audit-last" || trimmedCommand.startsWith("/audit-last ")) {
      const rawCount = trimmedCommand.slice("/audit-last".length).trim();
      const count = rawCount ? Number(rawCount) : 20;
      const safeCount = Number.isFinite(count) ? Math.max(1, Math.min(200, Math.floor(count))) : 20;
      return this.renderAuditTrail(safeCount);
    }
    throw new Error("Unsupported tool command.");
  }
  async performRead(filePath) {
    const approved = await this.checkApproval("low", "Read File", filePath);
    if (!approved) {
      this.recordAudit("read_file", filePath, "denied");
      return "Denied by approval policy.";
    }
    try {
      const content = await readFileTool(this.getVaultRootPath(), filePath);
      this.recordAudit("read_file", filePath, "ok");
      return `Read file: ${filePath}

${content}`;
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown";
      this.recordAudit("read_file", `${filePath} :: ${message}`, "error");
      throw error;
    }
  }
  async performSearch(query) {
    const approved = await this.checkApproval("low", "Search Vault", query);
    if (!approved) {
      this.recordAudit("search_vault", query, "denied");
      return "Denied by approval policy.";
    }
    try {
      const hits = await searchTool(this.getVaultRootPath(), query);
      this.recordAudit("search_vault", `${query} :: ${hits.length} hit(s)`, "ok");
      if (hits.length === 0) {
        return `No markdown files contain: ${query}`;
      }
      return `Found ${hits.length} file(s):
${hits.map((hit) => `- ${hit}`).join("\n")}`;
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown";
      this.recordAudit("search_vault", `${query} :: ${message}`, "error");
      throw error;
    }
  }
  async performWrite(filePath, content) {
    const vaultRoot = this.getVaultRootPath();
    const effectiveMode = this.getEffectiveApprovalMode();
    if (effectiveMode !== "yolo" && !this.agentApproveAllForCurrentRun) {
      const before = await readRawFileIfExists(vaultRoot, filePath) ?? "";
      const approved = await confirmFileWrite({
        app: this.app,
        path: filePath,
        beforeText: before,
        afterText: content
      });
      if (!approved) {
        this.recordAudit("write_file", filePath, "denied");
        return "Denied by review.";
      }
    }
    try {
      const result = await writeFileTool(vaultRoot, filePath, content);
      this.recordAudit("write_file", `${filePath} :: ${content.length} chars`, "ok");
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown";
      this.recordAudit("write_file", `${filePath} :: ${message}`, "error");
      throw error;
    }
  }
  async performBash(commandLine) {
    const approved = await this.checkApproval("high", "Run Bash Command", commandLine);
    if (!approved) {
      this.recordAudit("run_bash", commandLine, "denied");
      return "Denied by approval policy.";
    }
    try {
      const output = await runBashTool({
        commandLine,
        allowlist: this.settings.bashAllowlist,
        cwd: this.getVaultRootPath()
      });
      this.recordAudit("run_bash", commandLine, "ok");
      return `Command: ${commandLine}

${output}`;
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown";
      this.recordAudit("run_bash", `${commandLine} :: ${message}`, "error");
      throw error;
    }
  }
  async performMcpList() {
    const approved = await this.checkApproval("low", "Read MCP Config", this.settings.mcpConfigPath || "(empty path)");
    if (!approved) {
      this.recordAudit("mcp_list_servers", this.settings.mcpConfigPath || "(empty path)", "denied");
      return "Denied by approval policy.";
    }
    try {
      const servers = await loadMcpServers(this.settings.mcpConfigPath);
      this.recordAudit("mcp_list_servers", `${servers.length} server(s)`, "ok");
      if (servers.length === 0) {
        return "No MCP servers configured.";
      }
      return `MCP servers:
${servers.map((s) => `- ${s.name} (${s.type})`).join("\n")}`;
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown";
      this.recordAudit("mcp_list_servers", message, "error");
      throw error;
    }
  }
  async performMcpTools(serverName) {
    const approved = await this.checkApproval("low", "List MCP Tools", serverName);
    if (!approved) {
      this.recordAudit("mcp_list_tools", serverName, "denied");
      return "Denied by approval policy.";
    }
    try {
      const servers = await loadMcpServers(this.settings.mcpConfigPath);
      const server = servers.find((item) => item.name === serverName);
      if (!server) {
        throw new Error(`MCP server "${serverName}" not found in config.`);
      }
      const tools = await listMcpTools(server);
      this.recordAudit("mcp_list_tools", `${serverName} :: ${tools.length} tool(s)`, "ok");
      if (tools.length === 0) {
        return `No tools found on MCP server "${serverName}".`;
      }
      return `MCP tools (${serverName}):
${tools.map((tool) => `- ${tool.name}${tool.description ? `: ${tool.description}` : ""}`).join("\n")}`;
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown";
      this.recordAudit("mcp_list_tools", `${serverName} :: ${message}`, "error");
      throw error;
    }
  }
  async performMcpCall(serverName, toolName, parsedArgs) {
    const approved = await this.checkApproval(
      "high",
      "Call MCP Tool",
      `${serverName} :: ${toolName}

${JSON.stringify(parsedArgs, null, 2).slice(0, 600)}`
    );
    if (!approved) {
      this.recordAudit("mcp_call_tool", `${serverName}/${toolName}`, "denied");
      return "Denied by approval policy.";
    }
    try {
      const servers = await loadMcpServers(this.settings.mcpConfigPath);
      const server = servers.find((item) => item.name === serverName);
      if (!server) {
        throw new Error(`MCP server "${serverName}" not found in config.`);
      }
      const result = await callMcpTool({
        server,
        toolName,
        args: parsedArgs
      });
      this.recordAudit("mcp_call_tool", `${serverName}/${toolName}`, "ok");
      return `MCP result (${serverName}/${toolName}):
${JSON.stringify(result, null, 2)}`;
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown";
      this.recordAudit("mcp_call_tool", `${serverName}/${toolName} :: ${message}`, "error");
      throw error;
    }
  }
  getVaultRootPath() {
    const adapter = this.app.vault.adapter;
    const basePath = adapter.basePath;
    if (!basePath) {
      throw new Error("Vault filesystem path is unavailable.");
    }
    return basePath;
  }
  getVaultRootPathOrUndefined() {
    const adapter = this.app.vault.adapter;
    return adapter.basePath;
  }
  getCodexWorkspaceDirOrUndefined() {
    const configured = this.expandHomePath(this.settings.codexWorkingDir.trim());
    if (configured) {
      return configured;
    }
    const home = this.expandHomePath(process.env.HOME ?? "");
    if (home) {
      return home;
    }
    return this.getVaultRootPathOrUndefined();
  }
  expandHomePath(raw) {
    const input = raw.trim();
    if (!input) {
      return "";
    }
    if (input === "~") {
      return (process.env.HOME ?? "").trim();
    }
    if (input.startsWith("~/")) {
      const home = (process.env.HOME ?? "").trim();
      if (!home) {
        return input;
      }
      return `${home}/${input.slice(2)}`;
    }
    return input;
  }
  getLocalCodexSessionsRootOrUndefined() {
    const home = this.expandHomePath(process.env.HOME ?? "");
    if (!home) {
      return void 0;
    }
    return import_path4.default.join(home, ".codex", "sessions");
  }
  isCodexSessionRelevantToWorkspace(sessionCwd) {
    const normalized = typeof sessionCwd === "string" ? sessionCwd.trim() : "";
    if (!normalized) {
      return true;
    }
    const workspaceDir = this.getCodexWorkspaceDirOrUndefined();
    if (!workspaceDir) {
      return true;
    }
    const base = import_path4.default.resolve(workspaceDir);
    const target = import_path4.default.resolve(normalized);
    return target === base || target.startsWith(`${base}${import_path4.default.sep}`);
  }
  extractThreadIdFromRolloutPath(filePath) {
    const fileName = import_path4.default.basename(filePath);
    const match = fileName.match(/^rollout-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-(.+)\.jsonl$/i);
    return match?.[1]?.trim() || "";
  }
  parseRolloutSessionMeta(raw, filePath) {
    const firstLine = raw.split(/\r?\n/, 1)[0]?.trim() || "";
    if (!firstLine.startsWith("{")) {
      return null;
    }
    try {
      const parsed = JSON.parse(firstLine);
      if (parsed.type !== "session_meta") {
        return null;
      }
      const payload = parsed.payload ?? {};
      const threadId = typeof payload.id === "string" && payload.id.trim() ? payload.id.trim() : this.extractThreadIdFromRolloutPath(filePath);
      if (!threadId) {
        return null;
      }
      const timestamp = typeof payload.timestamp === "string" ? payload.timestamp : "";
      const createdAt = Date.parse(timestamp);
      return {
        threadId,
        createdAt: Number.isFinite(createdAt) ? createdAt : Date.now(),
        cwd: typeof payload.cwd === "string" ? payload.cwd : "",
        originator: typeof payload.originator === "string" ? payload.originator : ""
      };
    } catch (_error) {
      return null;
    }
  }
  buildImportedConversationTitle(messages, createdAt) {
    const firstUserMessage = messages.find((message) => message.role === "user" && typeof message.content === "string" && message.content.trim());
    if (firstUserMessage) {
      return this.summarizeConversationTitle(firstUserMessage.content);
    }
    return `Codex ${new Date(createdAt).toLocaleString()}`;
  }
  async listLocalCodexRolloutFiles(rootDir) {
    const matches = [];
    const stack = [rootDir];
    while (stack.length > 0) {
      const currentDir = stack.pop();
      let entries;
      try {
        entries = await import_promises4.default.readdir(currentDir, { withFileTypes: true });
      } catch (_error) {
        continue;
      }
      for (const entry of entries) {
        const fullPath = import_path4.default.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          stack.push(fullPath);
          continue;
        }
        if (!entry.isFile()) {
          continue;
        }
        if (entry.name.startsWith("rollout-") && entry.name.endsWith(".jsonl")) {
          matches.push(fullPath);
        }
      }
    }
    return matches.sort((a, b) => a.localeCompare(b));
  }
  async syncAllConversationsWithLocalCodex() {
    if (!this.settings.syncWithLocalCodex) {
      return false;
    }
    const sessionsRoot = this.getLocalCodexSessionsRootOrUndefined();
    if (!sessionsRoot) {
      return false;
    }
    const rolloutFiles = await this.listLocalCodexRolloutFiles(sessionsRoot);
    if (rolloutFiles.length === 0) {
      return false;
    }
    const sessionsByThreadId = new Map(this.conversations.map((session) => [session.codexThreadId?.trim() || "", session]).filter(([threadId]) => Boolean(threadId)));
    let changed = false;
    for (const filePath of rolloutFiles) {
      const fileKey = import_path4.default.basename(filePath);
      const derivedThreadId = this.extractThreadIdFromRolloutPath(filePath);
      const knownSession = derivedThreadId ? sessionsByThreadId.get(derivedThreadId) : void 0;
      if (knownSession && (knownSession.syncedRolloutFiles ?? []).includes(fileKey)) {
        continue;
      }
      let raw = "";
      try {
        raw = await import_promises4.default.readFile(filePath, "utf8");
      } catch (_error) {
        continue;
      }
      const meta = this.parseRolloutSessionMeta(raw, filePath);
      if (!meta || !this.isCodexSessionRelevantToWorkspace(meta.cwd)) {
        continue;
      }
      const existing = sessionsByThreadId.get(meta.threadId);
      if (existing) {
        const seen = new Set((existing.syncedRolloutFiles ?? []).map((item) => item.trim()).filter(Boolean));
        if (seen.has(fileKey)) {
          continue;
        }
        const importedCount = this.importRolloutMessagesFromRaw(existing, raw);
        seen.add(fileKey);
        existing.syncedRolloutFiles = Array.from(seen).slice(-500);
        existing.updatedAt = Math.max(existing.updatedAt, meta.createdAt);
        if (!existing.title || existing.title.startsWith("Chat ") || existing.title.startsWith("Codex ")) {
          existing.title = this.buildImportedConversationTitle(existing.messages, existing.createdAt);
        }
        changed = true;
        continue;
      }
      const session = this.createSession([], "");
      session.codexThreadId = meta.threadId;
      session.createdAt = meta.createdAt;
      session.updatedAt = meta.createdAt;
      session.syncedRolloutFiles = [fileKey];
      this.importRolloutMessagesFromRaw(session, raw);
      session.title = this.buildImportedConversationTitle(session.messages, meta.createdAt);
      this.conversations.push(session);
      sessionsByThreadId.set(meta.threadId, session);
      changed = true;
    }
    return changed;
  }
  async syncConversationFromLocalCodex(session) {
    if (!this.settings.syncWithLocalCodex) {
      return;
    }
    const threadId = session.codexThreadId?.trim();
    if (!threadId) {
      return;
    }
    const sessionsRoot = this.getLocalCodexSessionsRootOrUndefined();
    if (!sessionsRoot) {
      return;
    }
    const rolloutFiles = await this.findRolloutFilesForThread(sessionsRoot, threadId);
    if (rolloutFiles.length === 0) {
      return;
    }
    const seen = new Set((session.syncedRolloutFiles ?? []).map((item) => item.trim()).filter(Boolean));
    let importedAny = false;
    for (const filePath of rolloutFiles) {
      const fileKey = import_path4.default.basename(filePath);
      if (seen.has(fileKey)) {
        continue;
      }
      const importedCount = await this.importRolloutMessages(session, filePath);
      seen.add(fileKey);
      if (importedCount > 0) {
        importedAny = true;
      }
    }
    session.syncedRolloutFiles = Array.from(seen).slice(-500);
    if (importedAny) {
      session.updatedAt = Date.now();
      this.notifyMessagesChanged();
    }
  }
  async findRolloutFilesForThread(rootDir, threadId) {
    const rolloutFiles = await this.listLocalCodexRolloutFiles(rootDir);
    return rolloutFiles.filter((filePath) => filePath.endsWith(`${threadId}.jsonl`));
  }
  async importRolloutMessages(session, filePath) {
    let raw = "";
    try {
      raw = await import_promises4.default.readFile(filePath, "utf8");
    } catch (_error) {
      return 0;
    }
    return this.importRolloutMessagesFromRaw(session, raw);
  }
  importRolloutMessagesFromRaw(session, raw) {
    let importedCount = 0;
    const lines = raw.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("{")) {
        continue;
      }
      let parsed;
      try {
        parsed = JSON.parse(trimmed);
      } catch (_error) {
        continue;
      }
      if (parsed.type !== "response_item") {
        continue;
      }
      const payload = parsed.payload;
      if (!payload || payload.type !== "message") {
        continue;
      }
      const role = payload.role;
      if (role !== "user" && role !== "assistant") {
        continue;
      }
      const text = this.extractRolloutMessageText(payload.content);
      if (!text) {
        continue;
      }
      if (role === "user" && this.isMetaPromptFromRollout(text)) {
        continue;
      }
      if (this.appendImportedMessage(session, role, text)) {
        importedCount += 1;
      }
    }
    return importedCount;
  }
  extractRolloutMessageText(content) {
    if (!Array.isArray(content)) {
      return "";
    }
    const parts = [];
    for (const part of content) {
      if (!part || typeof part !== "object") {
        continue;
      }
      const item = part;
      const text = item.text;
      if (typeof text === "string" && text.trim()) {
        parts.push(text.trim());
      }
    }
    return parts.join("\n").trim();
  }
  isMetaPromptFromRollout(text) {
    return text.startsWith("[SYSTEM]") || text.includes("AGENTS.md instructions for") || text.includes("<environment_context>");
  }
  appendImportedMessage(session, role, content) {
    const normalized = content.trim();
    if (!normalized) {
      return false;
    }
    const last = session.messages[session.messages.length - 1];
    if (last && last.role === role && last.content.trim() === normalized) {
      return false;
    }
    session.messages.push(this.createMessage(role, normalized));
    return true;
  }
  async checkApproval(risk, title, detail) {
    if (this.agentApproveAllForCurrentRun) {
      return true;
    }
    const effectiveMode = this.getEffectiveApprovalMode();
    return await requestApproval({
      app: this.app,
      approvalMode: effectiveMode,
      risk,
      title,
      detail
    });
  }
  getEffectiveApprovalMode() {
    return this.settings.safeMode ? this.settings.approvalMode : "yolo";
  }
  renderAuditTrail(count) {
    if (this.auditTrail.length === 0) {
      return "No audit entries yet.";
    }
    const recent = this.auditTrail.slice(-count);
    return recent.map((entry) => `${new Date(entry.at).toISOString()} | ${entry.status.toUpperCase()} | ${entry.action} | ${entry.detail}`).join("\n");
  }
  recordAudit(action, detail, status) {
    this.auditTrail.push({
      at: Date.now(),
      action,
      detail,
      status
    });
    if (this.auditTrail.length > 500) {
      this.auditTrail = this.auditTrail.slice(this.auditTrail.length - 500);
    }
    void this.savePluginData();
  }
  resolveSlashCommand(input) {
    const trimmed = input.trim();
    if (!trimmed.startsWith("/")) {
      return input;
    }
    const [commandToken, ...argsParts] = trimmed.split(/\s+/);
    const commandName = commandToken.slice(1);
    if (!commandName) {
      return input;
    }
    const command = this.settings.slashCommands.find((item) => item.name === commandName);
    if (!command) {
      return input;
    }
    const args = argsParts.join(" ").trim();
    const selection = this.getCurrentSelectionText();
    return command.prompt.replace(/\{\{selection\}\}/g, selection).replace(/\{\{args\}\}/g, args).trim();
  }
  getCurrentSelectionText() {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian8.MarkdownView);
    const selection = view?.editor?.getSelection() ?? "";
    return selection.trim();
  }
  createMessage(role, content) {
    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role,
      content,
      createdAt: Date.now()
    };
  }
  notifyMessagesChanged() {
    for (const listener of this.listeners) {
      listener();
    }
  }
  async loadPluginData() {
    const raw = await this.loadData();
    if (!raw) {
      this.settings = { ...DEFAULT_SETTINGS };
      const session = this.createSession([], "Chat 1");
      this.conversations = [session];
      this.activeConversationId = session.id;
      this.tabConversationIds = [session.id];
      return;
    }
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...raw.settings ?? {}
    };
    if (!this.getModelOptions().includes(this.settings.model)) {
      this.settings.model = this.getModelOptions()[0];
    }
    const loadedSessions = Array.isArray(raw.conversations) ? raw.conversations.filter((item) => Boolean(item && typeof item === "object")).map((item) => ({
      id: typeof item.id === "string" && item.id ? item.id : this.newSessionId(),
      title: typeof item.title === "string" && item.title.trim() ? item.title.trim() : "Untitled Chat",
      createdAt: typeof item.createdAt === "number" ? item.createdAt : Date.now(),
      updatedAt: typeof item.updatedAt === "number" ? item.updatedAt : Date.now(),
      messages: Array.isArray(item.messages) ? item.messages : [],
      codexThreadId: typeof item.codexThreadId === "string" ? item.codexThreadId : "",
      syncedRolloutFiles: Array.isArray(item.syncedRolloutFiles) ? item.syncedRolloutFiles.filter((entry) => typeof entry === "string") : []
    })) : [];
    if (loadedSessions.length > 0) {
      this.conversations = loadedSessions;
    } else {
      const legacyMessages = Array.isArray(raw.messages) ? raw.messages : [];
      const legacyTitle = legacyMessages.find((m) => m.role === "user" && m.content.trim())?.content.slice(0, 28).trim() || "Chat 1";
      this.conversations = [this.createSession(legacyMessages, legacyTitle)];
    }
    const targetId = typeof raw.activeConversationId === "string" ? raw.activeConversationId : "";
    const found = this.conversations.find((session) => session.id === targetId);
    this.activeConversationId = found ? found.id : this.conversations[0].id;
    this.tabConversationIds = Array.isArray(raw.tabConversationIds) ? raw.tabConversationIds.filter((id) => typeof id === "string") : [];
    this.auditTrail = Array.isArray(raw.auditTrail) ? raw.auditTrail : [];
    this.ensureConversationState();
  }
  async savePluginData() {
    this.ensureConversationState();
    await this.saveData({
      settings: this.settings,
      messages: this.getMessages(),
      conversations: this.conversations,
      activeConversationId: this.activeConversationId,
      tabConversationIds: this.tabConversationIds,
      auditTrail: this.auditTrail
    });
  }
  ensureConversationState() {
    if (this.conversations.length === 0) {
      const session = this.createSession([], "Chat 1");
      this.conversations = [session];
      this.activeConversationId = session.id;
      this.tabConversationIds = [session.id];
      return;
    }
    if (!this.conversations.some((session) => session.id === this.activeConversationId)) {
      this.activeConversationId = this.conversations[0].id;
    }
    this.tabConversationIds = this.tabConversationIds.filter((id, index, list) => list.indexOf(id) === index && this.conversations.some((session) => session.id === id)).slice(0, 8);
    if (!this.tabConversationIds.includes(this.activeConversationId)) {
      this.tabConversationIds.unshift(this.activeConversationId);
      this.tabConversationIds = this.tabConversationIds.slice(0, 8);
    }
  }
  getActiveConversation() {
    this.ensureConversationState();
    const found = this.conversations.find((session) => session.id === this.activeConversationId);
    if (found) {
      return found;
    }
    const fallback = this.createSession([], "Chat 1");
    this.conversations = [fallback];
    this.activeConversationId = fallback.id;
    this.tabConversationIds = [fallback.id];
    return fallback;
  }
  touchTabConversation(id) {
    const normalized = id?.trim();
    if (!normalized) {
      return;
    }
    this.tabConversationIds = [normalized, ...this.tabConversationIds.filter((item) => item !== normalized)].slice(0, 8);
  }
  createSession(messages, preferredTitle) {
    const now = Date.now();
    const title = preferredTitle.trim() || `Chat ${this.conversations.length + 1}`;
    return {
      id: this.newSessionId(),
      title,
      createdAt: now,
      updatedAt: now,
      messages,
      codexThreadId: "",
      syncedRolloutFiles: []
    };
  }
  newSessionId() {
    return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
  summarizeConversationTitle(raw) {
    const firstLine = raw.replace(/\s+/g, " ").trim().slice(0, 28);
    return firstLine || "Untitled Chat";
  }
};

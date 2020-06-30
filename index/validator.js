/*
 * Validator v0.11.5 for Bootstrap 3, by @1000hz
 * Copyright 2016 Cina Saffary
 * Licensed under http://opensource.org/licenses/MIT
 *
 * https://github.com/1000hz/bootstrap-validator
 */
+ function(a) {
    function b(f) { return f.is('[type="checkbox"]') ? f.prop("checked") : f.is('[type="radio"]') ? !!a('[name="' + f.attr("name") + '"]:checked').length : f.val() }
    var e = function(f, g) {
        this.options = g;
        this.validators = a.extend({}, e.VALIDATORS, g.custom);
        this.$element = a(f);
        this.$btn = a('button[type="submit"], input[type="submit"]').filter('[form="' + this.$element.attr("id") + '"]').add(this.$element.find('input[type="submit"], button[type="submit"]'));
        this.update();
        this.$element.on("input.bs.validator change.bs.validator focusout.bs.validator", a.proxy(this.onInput, this));
        this.$element.on("submit.bs.validator", a.proxy(this.onSubmit, this));
        this.$element.on("reset.bs.validator", a.proxy(this.reset, this));
        this.$element.find("[data-match]").each(function() {
            var h = a(this);
            var i = h.data("match");
            a(i).on("input.bs.validator", function(j) { b(h) && h.trigger("input.bs.validator") })
        });
        this.$inputs.filter(function() { return b(a(this)) }).trigger("focusout");
        this.$element.attr("novalidate", true);
        this.toggleSubmit()
    };
    e.VERSION = "0.11.5";
    e.INPUT_SELECTOR = ':input:not([type="hidden"], [type="submit"], [type="reset"], button)';
    e.FOCUS_OFFSET = 20;
    e.DEFAULTS = { delay: 500, html: false, disable: true, focus: true, custom: {}, errors: { match: "Does not match", minlength: "Not long enough" }, feedback: { success: "glyphicon-ok", error: "glyphicon-remove" } };
    e.VALIDATORS = { "native": function(f) { var g = f[0]; if (g.checkValidity) { return !g.checkValidity() && !g.validity.valid && (g.validationMessage || "error!") } }, match: function(f) { var g = f.data("match"); return f.val() !== a(g).val() && e.DEFAULTS.errors.match }, minlength: function(f) { var g = f.data("minlength"); return f.val().length < g && e.DEFAULTS.errors.minlength } };
    e.prototype.update = function() { this.$inputs = this.$element.find(e.INPUT_SELECTOR).add(this.$element.find('[data-validate="true"]')).not(this.$element.find('[data-validate="false"]')); return this };
    e.prototype.onInput = function(h) {
        var i = this;
        var f = a(h.target);
        var g = h.type !== "focusout";
        if (!this.$inputs.is(f)) { return }
        this.validateInput(f, g).done(function() { i.toggleSubmit() })
    };
    e.prototype.validateInput = function(f, g) {
        var l = b(f);
        var j = f.data("bs.validator.errors");
        var i;
        if (f.is('[type="radio"]')) { f = this.$element.find('input[name="' + f.attr("name") + '"]') }
        var h = a.Event("validate.bs.validator", { relatedTarget: f[0] });
        this.$element.trigger(h);
        if (h.isDefaultPrevented()) { return }
        var k = this;
        return this.runValidators(f).done(function(m) {
            f.data("bs.validator.errors", m);
            m.length ? g ? k.defer(f, k.showErrors) : k.showErrors(f) : k.clearErrors(f);
            if (!j || m.toString() !== j.toString()) {
                h = m.length ? a.Event("invalid.bs.validator", { relatedTarget: f[0], detail: m }) : a.Event("valid.bs.validator", { relatedTarget: f[0], detail: j });
                k.$element.trigger(h)
            }
            k.toggleSubmit();
            k.$element.trigger(a.Event("validated.bs.validator", { relatedTarget: f[0] }))
        })
    };
    e.prototype.runValidators = function(f) {
        var h = [];
        var g = a.Deferred();
        f.data("bs.validator.deferred") && f.data("bs.validator.deferred").reject();
        f.data("bs.validator.deferred", g);

        function k(m) { return f.data(m + "-error") }

        function l() { var m = f[0].validity; return m.typeMismatch ? f.data("type-error") : m.patternMismatch ? f.data("pattern-error") : m.stepMismatch ? f.data("step-error") : m.rangeOverflow ? f.data("max-error") : m.rangeUnderflow ? f.data("min-error") : m.valueMissing ? f.data("required-error") : null }

        function j() { return f.data("error") }

        function i(m) { return k(m) || l() || j() }
        a.each(this.validators, a.proxy(function(n, o) { var m = null; if ((b(f) || f.attr("required")) && (f.data(n) || n == "native") && (m = o.call(this, f))) { m = i(n) || m;!~h.indexOf(m) && h.push(m) } }, this));
        if (!h.length && b(f) && f.data("remote")) {
            this.defer(f, function() {
                var m = {};
                m[f.attr("name")] = b(f);
                a.get(f.data("remote"), m).fail(function(o, p, n) { h.push(i("remote") || n) }).always(function() { g.resolve(h) })
            })
        } else { g.resolve(h) }
        return g.promise()
    };
    e.prototype.validate = function() {
        var f = this;
        a.when(this.$inputs.map(function(g) { return f.validateInput(a(this), false) })).then(function() {
            f.toggleSubmit();
            f.focusError()
        });
        return this
    };
    e.prototype.focusError = function() {
        if (!this.options.focus) { return }
        var f = this.$element.find(".has-error:first :input");
        if (f.length === 0) { return }
        a("html, body").animate({ scrollTop: f.offset().top - e.FOCUS_OFFSET }, 250);
        f.focus()
    };
    e.prototype.showErrors = function(g) {
        var k = this.options.html ? "html" : "text";
        var j = g.data("bs.validator.errors");
        var i = g.closest(".form-group");
        var f = i.find(".help-block.with-errors");
        var h = i.find(".form-control-feedback");
        if (!j.length) { return }
        f.data("bs.validator.originalContent") === undefined && f.data("bs.validator.originalContent", f.html());
        f.empty().append(j);
        i.addClass("has-error has-danger");
        i.hasClass("has-feedback") && h.removeClass(this.options.feedback.success) && h.addClass(this.options.feedback.error) && i.removeClass("has-success")
    };
    e.prototype.clearErrors = function(g) {
        var i = g.closest(".form-group");
        var f = i.find(".help-block.with-errors");
        var h = i.find(".form-control-feedback");
        f.html(f.data("bs.validator.originalContent"));
        i.removeClass("has-error has-danger has-success");
        i.hasClass("has-feedback") && h.removeClass(this.options.feedback.error) && h.removeClass(this.options.feedback.success) && b(g) && h.addClass(this.options.feedback.success) && i.addClass("has-success")
    };
    e.prototype.hasErrors = function() {
        function f() { return !!(a(this).data("bs.validator.errors") || []).length }
        return !!this.$inputs.filter(f).length
    };
    e.prototype.isIncomplete = function() {
        function f() { var g = b(a(this)); return !(typeof g == "string" ? a.trim(g) : g) }
        return !!this.$inputs.filter("[required]").filter(f).length
    };
    e.prototype.onSubmit = function(f) { this.validate(); if (this.isIncomplete() || this.hasErrors()) { f.preventDefault() } };
    e.prototype.toggleSubmit = function() {
        if (!this.options.disable) { return }
        this.$btn.toggleClass("disabled", this.isIncomplete() || this.hasErrors())
    };
    e.prototype.defer = function(f, g) {
        g = a.proxy(g, this, f);
        if (!this.options.delay) { return g() }
        window.clearTimeout(f.data("bs.validator.timeout"));
        f.data("bs.validator.timeout", window.setTimeout(g, this.options.delay))
    };
    e.prototype.reset = function() {
        this.$element.find(".form-control-feedback").removeClass(this.options.feedback.error).removeClass(this.options.feedback.success);
        this.$inputs.removeData(["bs.validator.errors", "bs.validator.deferred"]).each(function() {
            var f = a(this);
            var g = f.data("bs.validator.timeout");
            window.clearTimeout(g) && f.removeData("bs.validator.timeout")
        });
        this.$element.find(".help-block.with-errors").each(function() {
            var f = a(this);
            var g = f.data("bs.validator.originalContent");
            f.removeData("bs.validator.originalContent").html(g)
        });
        this.$btn.removeClass("disabled");
        this.$element.find(".has-error, .has-danger, .has-success").removeClass("has-error has-danger has-success");
        return this
    };
    e.prototype.destroy = function() {
        this.reset();
        this.$element.removeAttr("novalidate").removeData("bs.validator").off(".bs.validator");
        this.$inputs.off(".bs.validator");
        this.options = null;
        this.validators = null;
        this.$element = null;
        this.$btn = null;
        return this
    };

    function d(f) { return this.each(function() { var g = a(this); var i = a.extend({}, e.DEFAULTS, g.data(), typeof f == "object" && f); var h = g.data("bs.validator"); if (!h && f == "destroy") { return } if (!h) { g.data("bs.validator", (h = new e(this, i))) } if (typeof f == "string") { h[f]() } }) }
    var c = a.fn.validator;
    a.fn.validator = d;
    a.fn.validator.Constructor = e;
    a.fn.validator.noConflict = function() { a.fn.validator = c; return this };
    a(window).on("load", function() {
        a('form[data-toggle="validator"]').each(function() {
            var f = a(this);
            d.call(f, f.data())
        })
    })
}(jQuery);
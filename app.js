(() => {
    "use strict";

    const GROUP_ORDER = ["一组", "二组", "三组", "四组", "五组", "未分组"];
    const CATEGORY_ORDER = ["肺部手术", "食管手术", "纵隔手术", "胸部切除", "其他手术"];
    const COLORS = ["#2f78c4", "#0f9b8e", "#efa51a", "#e55762", "#7557c8"];
    const FIELD_ALIASES = {
        surgery: ["手术名称", "手术名", "手术术式", "术式名称", "手术操作名称", "术式"],
        doctor: ["手术医生", "主刀医生", "主刀", "术者"],
        group: ["医疗组", "组别", "医疗组别", "治疗组"],
        category: ["手术分类", "分类", "类别", "术式分类"],
        date: ["手术日期", "手术时间", "日期", "手术开始日期"],
        diagnosis: ["诊断", "主要诊断", "术前诊断", "入院诊断"],
        age: ["年龄", "患者年龄"],
        sex: ["性别", "患者性别"],
        duration: ["手术时长（分钟）", "手术时长", "手术用时", "时长(分钟)", "时长"],
        bloodLoss: ["术中出血量", "出血量", "术中出血(ml)", "出血量(ml)"],
        emergency: ["是否急诊", "急诊手术", "手术类型", "急择期"],
        minimallyInvasive: ["是否微创", "微创手术", "微创标识"],
        los: ["术后住院日", "术后住院天数", "住院日", "住院天数"],
        grade: ["手术级别", "手术分级", "手术等级"],
        complication: ["并发症", "是否并发症", "术后并发症"],
        outcome: ["转归", "出院转归", "患者转归", "转出日期"]
    };
    const CATEGORY_OPTIONS = [
        { val: "食管手术|食管癌根治术", label: "食管手术 - 根治术" },
        { val: "纵隔手术|纵隔肿瘤/胸腺切除", label: "纵隔手术 - 肿瘤/胸腺" },
        { val: "胸部切除|巨大肿物/胸壁切除", label: "胸部切除 - 巨大肿物/胸壁" },
        { val: "肺部手术|常规肺切除", label: "肺部手术 - 常规切除" },
        { val: "肺部手术|袖式切除", label: "肺部手术 - 袖式切除" },
        { val: "肺部手术|全肺切除", label: "肺部手术 - 全肺切除" },
        { val: "肺部手术|楔形切除", label: "肺部手术 - 楔形切除" },
        { val: "肺部手术|肺段切除", label: "肺部手术 - 肺段切除" },
        { val: "其他手术|其他", label: "其他手术" }
    ];

    const DEMO_CSV = `序号,医疗组,性别,年龄,诊断,手术医生,手术名称,手术分类,手术日期,手术时长（分钟）,术中出血量,是否急诊,是否微创,术后住院日,手术级别,并发症,转归
1,一组,男,61,纵隔占位,医生01,正中开胸纵隔肿物切除术+全胸腺切除术+血管成形术,纵隔,2025/1/9,210,260,否,否,8,四级,无,出院
2,一组,女,48,纵隔占位,医生02,VATS右进胸纵隔肿物切除术,,2025/1/12,145,80,否,是,4,三级,无,出院
3,二组,女,53,胸腔占位,医生03,正中开胸肿物切除+静脉成形术,胸部,2025/1/18,235,320,否,否,9,四级,无,出院
4,二组,男,55,肺部占位,医生04,VATS右肺上叶袖式切除术+淋巴结清扫术,肺部,2025/1/24,280,180,否,是,7,四级,无,出院
5,二组,女,44,肺部占位,医生04,正中开胸胸腔肿物切除+部分心包切除+右侧全肺切,胸部,2025/2/3,310,450,否,否,11,四级,有,出院
6,一组,男,70,肺部占位,医生01,VATS左肺下叶切除术+淋巴结清扫术,,2025/2/11,165,100,否,是,5,三级,无,出院
7,五组,男,50,食管占位,医生05,VATS胸腹腔镜联合食管根治术,食管,2025/2/18,295,220,否,是,9,四级,无,出院
8,五组,女,66,食管占位,医生05,左开胸食管根治术+淋巴结清扫术,食管,2025/3/2,325,360,否,否,10,四级,无,出院
9,一组,男,59,肺部占位,医生02,VATS右肺上叶袖式切除术+纵隔淋巴结清扫术,肺部,2025/3/11,260,150,否,是,6,四级,无,出院
10,一组,女,64,肺部占位,医生01,VATS右上叶袖式切除+淋巴结清扫术+肺动脉成形术,,2025/3/20,275,190,否,是,7,四级,无,出院
11,二组,男,67,肺部占位,医生03,VATS右肺上叶袖式切除术+淋巴结清扫术+肺大疱切除术,肺部,2025/4/8,255,140,否,是,6,四级,无,出院
12,二组,女,69,肺部占位,医生04,VATS辅助左肺上叶袖式切除术,肺部,2025/4/16,245,130,否,是,6,四级,无,出院
13,三组,女,42,肺结节,医生06,胸腔镜右肺上叶楔形切除术,肺部,2025/4/22,90,30,否,是,3,二级,无,出院
14,三组,男,73,肺部占位,医生06,急诊开胸探查+肺破裂修补术,肺部,2025/4/27,180,500,是,否,12,三级,有,出院
15,一组,女,38,肺结节,医生02,胸腔镜左肺上叶肺段切除术,肺部,2025/5/6,135,60,否,是,4,三级,无,出院
16,五组,男,62,食管占位,医生05,胸腹腔镜联合食管根治术,食管,2025/5/14,305,240,否,是,8,四级,无,出院
17,二组,女,57,肺部占位,医生03,VATS右肺中叶切除+淋巴结清扫,肺部,2025/5/21,175,95,否,是,5,三级,无,出院
18,一组,男,65,纵隔占位,医生01,胸腔镜纵隔肿物切除术,纵隔,2025/5/28,125,55,否,是,4,三级,无,出院`;

    const state = {
        raw: [], derived: [], filtered: [], doctorGroups: {}, overrides: {}, charts: {}, sourceName: "匿名合成演示数据"
    };

    const el = id => document.getElementById(id);
    const safeString = value => value === null || value === undefined ? "" : String(value).trim();
    const getValue = (row, aliasKey) => {
        for (const key of FIELD_ALIASES[aliasKey]) if (safeString(row[key]) !== "") return safeString(row[key]);
        return "";
    };
    const toNumber = value => {
        const match = safeString(value).replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
        return match ? Number(match[0]) : null;
    };
    const parseBoolean = value => {
        const text = safeString(value).toLowerCase();
        if (!text) return null;
        if (/^(1|true|是|有|急诊|微创|yes|y)$/.test(text)) return true;
        if (/^(0|false|否|无|择期|开放|no|n)$/.test(text)) return false;
        if (text.includes("急诊") || text.includes("微创")) return true;
        return null;
    };
    const parseDate = value => {
        if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
        if (typeof value === "number" && typeof XLSX !== "undefined") {
            const parsed = XLSX.SSF.parse_date_code(value);
            if (parsed) return new Date(parsed.y, parsed.m - 1, parsed.d);
        }
        const text = safeString(value);
        if (!text) return null;
        const normalized = text.replace(/年|\//g, "-").replace(/月/g, "-").replace(/日/g, "").split(" ")[0];
        const date = new Date(normalized);
        return Number.isNaN(date.getTime()) ? null : date;
    };
    const dateKey = date => date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : "";
    const monthKey = date => date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` : "无日期";
    const percent = (part, total, digits = 1) => total ? `${(part / total * 100).toFixed(digits)}%` : "--";
    const average = values => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
    const shortText = (text, max = 18) => text.length > max ? `${text.slice(0, max)}…` : text;
    const sortedKeys = (obj, order = []) => Object.keys(obj).sort((a, b) => {
        const ai = order.indexOf(a), bi = order.indexOf(b);
        if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        return a.localeCompare(b, "zh-CN");
    });

    function detectLungSubtype(name) {
        if (name.includes("袖式")) return "袖式切除";
        if (name.includes("全肺")) return "全肺切除";
        if (name.includes("楔形")) return "楔形切除";
        if (name.includes("段切除") || name.includes("肺段")) return "肺段切除";
        return "常规肺切除";
    }

    function classify(row, surgery, id) {
        if (state.overrides[id]) {
            const [main, sub] = state.overrides[id].split("|");
            return { main, sub, declared: getValue(row, "category") };
        }
        const declared = getValue(row, "category");
        let main = "", sub = "";
        if (declared.includes("食管")) { main = "食管手术"; sub = "食管癌根治术"; }
        else if (declared.includes("纵隔") || declared.includes("胸腺")) { main = "纵隔手术"; sub = "纵隔肿瘤/胸腺切除"; }
        else if (declared.includes("胸")) { main = "胸部切除"; sub = "巨大肿物/胸壁切除"; }
        else if (declared.includes("肺")) { main = "肺部手术"; sub = detectLungSubtype(surgery); }
        if (!main) {
            const first = surgery.split(/[+＋]/)[0];
            if (first.includes("食管")) { main = "食管手术"; sub = "食管癌根治术"; }
            else if (first.includes("纵隔") || first.includes("胸腺")) { main = "纵隔手术"; sub = "纵隔肿瘤/胸腺切除"; }
            else if (first.includes("胸壁") || first.includes("胸腔肿物") || first.includes("巨大肿物")) { main = "胸部切除"; sub = "巨大肿物/胸壁切除"; }
            else if (/[肺叶段楔形]/.test(first)) { main = "肺部手术"; sub = detectLungSubtype(surgery); }
            else { main = "其他手术"; sub = "其他"; }
        }
        return { main, sub, declared };
    }

    function normalizeRows(rows) {
        return rows.map((row, id) => {
            const normalized = {};
            Object.entries(row || {}).forEach(([key, value]) => normalized[safeString(key).replace(/^\ufeff/, "")] = typeof value === "string" ? value.trim() : value);
            normalized._id = id;
            return normalized;
        }).filter(row => getValue(row, "surgery"));
    }

    function deriveRows() {
        state.derived = state.raw.map(raw => {
            const surgery = getValue(raw, "surgery");
            const doctor = getValue(raw, "doctor") || "未知医生";
            const group = state.doctorGroups[doctor] || getValue(raw, "group") || "未分组";
            const date = parseDate(getValue(raw, "date"));
            const classification = classify(raw, surgery, raw._id);
            const microField = parseBoolean(getValue(raw, "minimallyInvasive"));
            const minimallyInvasive = microField !== null ? microField : /VATS|胸腔镜|腹腔镜|机器人|微创/i.test(surgery);
            const emergencyField = parseBoolean(getValue(raw, "emergency"));
            const emergency = emergencyField !== null ? emergencyField : (/急诊/.test(surgery) ? true : null);
            const complicationText = getValue(raw, "complication");
            const outcomeText = getValue(raw, "outcome");
            return {
                id: raw._id, raw, surgery, doctor, group, date, dateText: dateKey(date) || getValue(raw, "date") || "--",
                month: monthKey(date), diagnosis: getValue(raw, "diagnosis") || "--", age: toNumber(getValue(raw, "age")),
                sex: getValue(raw, "sex") || "未知", duration: toNumber(getValue(raw, "duration")), bloodLoss: toNumber(getValue(raw, "bloodLoss")),
                los: toNumber(getValue(raw, "los")), grade: getValue(raw, "grade"), emergency, minimallyInvasive,
                complication: complicationText ? parseBoolean(complicationText) : null,
                mortality: outcomeText ? /死亡|院内死亡/.test(outcomeText) : null,
                main: classification.main, sub: classification.sub, declared: classification.declared
            };
        });
    }

    function initializeData(rows, sourceName) {
        state.raw = normalizeRows(rows);
        if (!state.raw.length) return showStatus("未找到可用的“手术名称”数据，请检查表头。", true);
        state.sourceName = sourceName;
        state.overrides = {};
        state.doctorGroups = {};
        state.raw.forEach(row => {
            const doctor = getValue(row, "doctor") || "未知医生";
            if (!state.doctorGroups[doctor]) state.doctorGroups[doctor] = getValue(row, "group") || "未分组";
        });
        deriveRows();
        populateFilters(true);
        renderGroupSettings();
        applyFilters();
        showStatus(`当前数据源：${sourceName}（${state.raw.length.toLocaleString("zh-CN")} 条，仅本地解析）`);
    }

    function findHeaderIndex(matrix) {
        return matrix.findIndex(row => (row || []).some(cell => FIELD_ALIASES.surgery.includes(safeString(cell))));
    }

    function matrixToObjects(matrix) {
        const headerIndex = findHeaderIndex(matrix);
        if (headerIndex < 0) return [];
        const headers = matrix[headerIndex].map(value => safeString(value));
        return matrix.slice(headerIndex + 1).filter(row => row.some(value => safeString(value))).map(row => {
            const object = {};
            headers.forEach((header, index) => { if (header) object[header] = row[index] ?? ""; });
            return object;
        });
    }

    function loadFile(file) {
        const extension = file.name.split(".").pop().toLowerCase();
        const reader = new FileReader();
        reader.onerror = () => showStatus("文件读取失败，请重试。", true);
        if (extension === "csv") {
            reader.onload = event => {
                const result = Papa.parse(event.target.result, { skipEmptyLines: true });
                if (result.errors.some(error => error.type === "Quotes")) return showStatus("CSV 存在引号格式错误，请检查后重试。", true);
                initializeData(matrixToObjects(result.data), file.name);
            };
            reader.readAsText(file, "UTF-8");
        } else {
            reader.onload = event => {
                try {
                    const workbook = XLSX.read(event.target.result, { type: "array", cellDates: true });
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false });
                    initializeData(matrixToObjects(matrix), `${file.name} · ${workbook.SheetNames[0]}`);
                } catch (error) {
                    console.error(error);
                    showStatus("Excel 解析失败，请确认文件未加密且格式正确。", true);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    }

    function populateFilters(resetDates = false) {
        const groups = sortedKeys(Object.fromEntries(state.derived.map(row => [row.group, true])), GROUP_ORDER);
        const doctors = [...new Set(state.derived.map(row => row.doctor))].sort((a, b) => a.localeCompare(b, "zh-CN"));
        const categories = [...new Set(state.derived.map(row => row.main))].sort((a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b));
        setSelectOptions(el("groupFilter"), groups, "全部医疗组");
        setSelectOptions(el("doctorFilter"), doctors, "全部医生");
        setSelectOptions(el("categoryFilter"), categories, "全部类别");
        if (resetDates) {
            const dates = state.derived.map(row => row.date).filter(Boolean).sort((a, b) => a - b);
            el("startDateFilter").value = dates.length ? dateKey(dates[0]) : "";
            el("endDateFilter").value = dates.length ? dateKey(dates[dates.length - 1]) : "";
        }
    }

    function setSelectOptions(select, values, placeholder) {
        const current = select.value;
        select.replaceChildren();
        const empty = document.createElement("option"); empty.value = ""; empty.textContent = placeholder; select.appendChild(empty);
        values.forEach(value => { const option = document.createElement("option"); option.value = value; option.textContent = value; select.appendChild(option); });
        if (values.includes(current)) select.value = current;
    }

    function applyFilters() {
        deriveRows();
        const start = el("startDateFilter").value ? new Date(`${el("startDateFilter").value}T00:00:00`) : null;
        const end = el("endDateFilter").value ? new Date(`${el("endDateFilter").value}T23:59:59`) : null;
        const group = el("groupFilter").value, doctor = el("doctorFilter").value, category = el("categoryFilter").value;
        const keyword = el("keywordFilter").value.trim().toLowerCase();
        state.filtered = state.derived.filter(row => {
            if ((start || end) && !row.date) return false;
            if (start && row.date < start) return false;
            if (end && row.date > end) return false;
            if (group && row.group !== group) return false;
            if (doctor && row.doctor !== doctor) return false;
            if (category && row.main !== category) return false;
            if (keyword && !`${row.surgery} ${row.diagnosis} ${row.doctor}`.toLowerCase().includes(keyword)) return false;
            return true;
        });
        el("filterSummary").textContent = `当前显示 ${state.filtered.length.toLocaleString("zh-CN")} / ${state.derived.length.toLocaleString("zh-CN")} 条手术记录`;
        renderAll();
    }

    function buildStats(rows) {
        const stats = { total: rows.length, categories: {}, groups: {}, doctors: {}, months: {}, procedures: {}, weekdays: Array(7).fill(0), ages: {}, sexes: {}, sleeve: 0, micro: 0 };
        rows.forEach(row => {
            stats.categories[row.main] = (stats.categories[row.main] || 0) + 1;
            stats.groups[row.group] ||= {}; stats.groups[row.group][row.main] = (stats.groups[row.group][row.main] || 0) + 1;
            stats.doctors[row.doctor] ||= {}; stats.doctors[row.doctor][row.main] = (stats.doctors[row.doctor][row.main] || 0) + 1;
            stats.months[row.month] ||= { total: 0, micro: 0 }; stats.months[row.month].total++; if (row.minimallyInvasive) stats.months[row.month].micro++;
            const procedure = row.surgery.split(/[+＋]/)[0].trim() || "未知术式"; stats.procedures[procedure] = (stats.procedures[procedure] || 0) + 1;
            if (row.date) stats.weekdays[(row.date.getDay() + 6) % 7]++;
            if (row.age !== null) { const band = row.age < 40 ? "<40" : row.age < 50 ? "40-49" : row.age < 60 ? "50-59" : row.age < 70 ? "60-69" : "70+"; stats.ages[band] = (stats.ages[band] || 0) + 1; }
            stats.sexes[row.sex] = (stats.sexes[row.sex] || 0) + 1;
            if (row.sub === "袖式切除") stats.sleeve++;
            if (row.minimallyInvasive) stats.micro++;
        });
        return stats;
    }

    function renderAll() {
        const stats = buildStats(state.filtered);
        renderPeriod(); renderKpis(stats); renderInsights(stats); renderCharts(stats); renderOptionalMetrics(); renderDataQuality(); renderTable();
    }

    function renderPeriod() {
        const dates = state.filtered.map(row => row.date).filter(Boolean).sort((a, b) => a - b);
        el("dataPeriod").textContent = dates.length ? `数据期间：${dateKey(dates[0])} 至 ${dateKey(dates[dates.length - 1])}` : "数据期间：未提供有效日期";
    }

    function renderKpis(stats) {
        const monthCount = Object.keys(stats.months).filter(month => month !== "无日期").length;
        const doctorCount = Object.keys(stats.doctors).filter(name => name !== "未知医生").length;
        const coreFields = ["date", "doctor", "group", "surgery"];
        const filled = state.filtered.reduce((sum, row) => sum + coreFields.filter(field => field === "date" ? row.date : row[field] && !row[field].startsWith("未")).length, 0);
        const complete = stats.total ? filled / (stats.total * coreFields.length) : 0;
        el("totalCount").textContent = stats.total.toLocaleString("zh-CN");
        el("totalCountMeta").textContent = `${Object.keys(stats.groups).length} 个医疗组`;
        el("avgMonthly").textContent = monthCount ? (stats.total / monthCount).toFixed(1) : "--";
        el("avgMonthlyMeta").textContent = monthCount ? `覆盖 ${monthCount} 个月份` : "缺少日期字段";
        el("activeDoctors").textContent = doctorCount.toLocaleString("zh-CN");
        el("activeDoctorsMeta").textContent = doctorCount ? `人均 ${(stats.total / doctorCount).toFixed(1)} 台` : "缺少医生字段";
        el("minimallyInvasiveRate").textContent = percent(stats.micro, stats.total);
        el("minimallyInvasiveMeta").textContent = `${stats.micro} 台识别为微创`;
        el("sleeveCount").textContent = stats.sleeve.toLocaleString("zh-CN");
        el("sleeveMeta").textContent = `占总手术 ${percent(stats.sleeve, stats.total)}`;
        el("dataCompleteness").textContent = `${(complete * 100).toFixed(0)}%`;
        el("dataCompletenessMeta").textContent = complete >= .95 ? "核心字段状态良好" : "建议先补全关键字段";
    }

    function renderInsights(stats) {
        const topEntry = obj => Object.entries(obj).sort((a, b) => b[1] - a[1])[0];
        const peakMonth = topEntry(Object.fromEntries(Object.entries(stats.months).filter(([month]) => month !== "无日期").map(([month, value]) => [month, value.total])));
        const groupTotals = Object.fromEntries(Object.entries(stats.groups).map(([group, values]) => [group, Object.values(values).reduce((a, b) => a + b, 0)]));
        const topGroup = topEntry(groupTotals), topCategory = topEntry(stats.categories);
        const unknown = state.filtered.filter(row => row.doctor === "未知医生" || row.group === "未分组" || !row.date).length;
        const insights = [
            { icon: "fa-calendar-alt", title: "手术高峰月", value: peakMonth ? peakMonth[0] : "暂无", note: peakMonth ? `${peakMonth[1]} 台手术` : "需要日期字段", accent: "#2f78c4", tint: "#eef6fd" },
            { icon: "fa-users", title: "工作量最高医疗组", value: topGroup ? topGroup[0] : "暂无", note: topGroup ? `${topGroup[1]} 台 · ${percent(topGroup[1], stats.total)}` : "需要组别字段", accent: "#0f8b83", tint: "#effaf8" },
            { icon: "fa-chart-pie", title: "主要手术类别", value: topCategory ? topCategory[0] : "暂无", note: topCategory ? `${topCategory[1]} 台 · ${percent(topCategory[1], stats.total)}` : "暂无数据", accent: "#7557c8", tint: "#f4f1fc" },
            { icon: "fa-exclamation-circle", title: "需要补全的记录", value: `${unknown} 条`, note: unknown ? "缺日期、医生或医疗组" : "关键字段无明显缺失", accent: unknown ? "#d17a22" : "#397a57", tint: unknown ? "#fff7eb" : "#f0f8f2" }
        ];
        const container = el("insightsGrid"); container.replaceChildren();
        insights.forEach(item => {
            const article = document.createElement("article"); article.className = "insight-card surface-card p-4"; article.style.setProperty("--accent", item.accent); article.style.setProperty("--tint", item.tint);
            article.innerHTML = `<div class="flex items-start gap-3"><span class="w-9 h-9 rounded-xl bg-white grid place-items-center shadow-sm" style="color:${item.accent}"><i class="fas ${item.icon}"></i></span><span class="min-w-0"><span class="block text-[10px] font-bold text-slate-500">${item.title}</span><strong class="block mt-1 text-base truncate"></strong><span class="block mt-1 text-[11px] text-slate-500"></span></span></div>`;
            article.querySelector("strong").textContent = item.value; article.querySelector("span span:last-child").textContent = item.note; container.appendChild(article);
        });
    }

    function baseChartOption() {
        return { animationDuration: 550, textStyle: { fontFamily: "Inter, system-ui, sans-serif", color: "#536b7b" }, tooltip: { backgroundColor: "rgba(8,34,56,.94)", borderWidth: 0, textStyle: { color: "#fff" } } };
    }

    function renderChart(id, option) {
        if (typeof echarts === "undefined") return;
        const node = el(id); if (!node) return;
        state.charts[id] ||= echarts.init(node);
        state.charts[id].setOption({ ...baseChartOption(), ...option }, true);
    }

    function renderCharts(stats) {
        const months = sortedKeys(stats.months).filter(month => month !== "无日期");
        renderChart("monthlyTrendChart", {
            tooltip: { trigger: "axis" }, legend: { top: 8, right: 8, data: ["手术量", "微创占比"] },
            grid: { top: 56, left: 48, right: 54, bottom: 40 },
            xAxis: { type: "category", data: months, axisLine: { lineStyle: { color: "#dbe6ec" } } },
            yAxis: [{ type: "value", minInterval: 1, splitLine: { lineStyle: { color: "#edf2f5" } } }, { type: "value", max: 100, axisLabel: { formatter: "{value}%" }, splitLine: { show: false } }],
            series: [
                { name: "手术量", type: "bar", barMaxWidth: 38, data: months.map(month => stats.months[month].total), itemStyle: { color: "#2f78c4", borderRadius: [7, 7, 0, 0] } },
                { name: "微创占比", type: "line", yAxisIndex: 1, smooth: true, symbolSize: 7, data: months.map(month => +(stats.months[month].micro / stats.months[month].total * 100).toFixed(1)), lineStyle: { width: 3, color: "#0f9b8e" }, itemStyle: { color: "#0f9b8e" }, areaStyle: { color: "rgba(15,155,142,.08)" } }
            ]
        });
        const categoryData = sortedKeys(stats.categories, CATEGORY_ORDER).map((name, index) => ({ name, value: stats.categories[name], itemStyle: { color: COLORS[index % COLORS.length] } }));
        renderChart("categoryPieChart", { tooltip: { trigger: "item", formatter: "{b}<br/>{c} 台 · {d}%" }, legend: { bottom: 4, itemWidth: 9, itemHeight: 9 }, series: [{ type: "pie", radius: ["48%", "70%"], center: ["50%", "44%"], padAngle: 2, itemStyle: { borderRadius: 5, borderColor: "#fff", borderWidth: 2 }, label: { formatter: "{b}\n{d}%", color: "#405b6d" }, data: categoryData }] });
        const groups = sortedKeys(stats.groups, GROUP_ORDER), categories = CATEGORY_ORDER;
        renderChart("groupStackChart", { tooltip: { trigger: "axis", axisPointer: { type: "shadow" } }, legend: { top: 8, itemWidth: 9, itemHeight: 9, data: categories }, grid: { top: 56, left: 64, right: 18, bottom: 34 }, xAxis: { type: "value", minInterval: 1, splitLine: { lineStyle: { color: "#edf2f5" } } }, yAxis: { type: "category", data: groups, axisLine: { show: false }, axisTick: { show: false } }, series: categories.map((category, index) => ({ name: category, type: "bar", stack: "total", barMaxWidth: 34, itemStyle: { color: COLORS[index], borderRadius: index === categories.length - 1 ? [0, 5, 5, 0] : 0 }, label: { show: true, position: "inside", formatter: p => p.value ? p.value : "", color: "#fff", fontWeight: 700 }, data: groups.map(group => stats.groups[group][category] || 0) })) });
        const doctors = sortedKeys(stats.doctors).sort((a, b) => Object.values(stats.doctors[b]).reduce((x, y) => x + y, 0) - Object.values(stats.doctors[a]).reduce((x, y) => x + y, 0));
        const doctorSeries = categories.map((category, index) => ({ name: category, type: "bar", stack: "total", itemStyle: { color: COLORS[index] }, label: { show: true, position: "inside", formatter: p => p.value ? p.value : "", color: "#fff", fontWeight: 700 }, data: doctors.map(doctor => stats.doctors[doctor][category] || 0) }));
        const doctorTotals = doctors.map(doctor => Object.values(stats.doctors[doctor]).reduce((a, b) => a + b, 0));
        doctorSeries.push({ name: "总计", type: "bar", data: doctorTotals, barGap: "-100%", silent: true, itemStyle: { color: "transparent" }, label: { show: true, position: "top", formatter: p => p.value || "", fontWeight: 700, color: "#1f3b4d" } });
        renderChart("doctorBarChart", { tooltip: { trigger: "axis", axisPointer: { type: "shadow" } }, legend: { top: 8, data: categories, itemWidth: 9, itemHeight: 9 }, grid: { top: 56, left: 48, right: 16, bottom: 76 }, xAxis: { type: "category", data: doctors, axisLabel: { rotate: doctors.length > 7 ? 40 : 0, interval: 0 } }, yAxis: { type: "value", minInterval: 1, splitLine: { lineStyle: { color: "#edf2f5" } } }, series: doctorSeries });
        const procedures = Object.entries(stats.procedures).sort((a, b) => b[1] - a[1]).slice(0, 10).reverse();
        renderChart("procedureTopChart", { tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, formatter: params => `${procedures[params[0].dataIndex][0]}<br/>${params[0].value} 台` }, grid: { top: 20, left: 116, right: 24, bottom: 28 }, xAxis: { type: "value", minInterval: 1, splitLine: { lineStyle: { color: "#edf2f5" } } }, yAxis: { type: "category", data: procedures.map(([name]) => shortText(name, 10)), axisLine: { show: false }, axisTick: { show: false } }, series: [{ type: "bar", data: procedures.map(([, value]) => value), barMaxWidth: 20, itemStyle: { color: "#0f8b83", borderRadius: [0, 6, 6, 0] }, label: { show: true, position: "right", color: "#365367" } }] });
        renderChart("weekdayChart", { tooltip: { trigger: "axis" }, grid: { top: 30, left: 42, right: 12, bottom: 42 }, xAxis: { type: "category", data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"], axisLabel: { rotate: 30 } }, yAxis: { type: "value", minInterval: 1, splitLine: { lineStyle: { color: "#edf2f5" } } }, series: [{ type: "bar", data: stats.weekdays, barMaxWidth: 28, itemStyle: { color: params => params.dataIndex >= 5 ? "#91a5b2" : "#2f78c4", borderRadius: [6, 6, 0, 0] }, label: { show: true, position: "top", formatter: p => p.value || "", color: "#526b7b" } }] });
        const ageOrder = ["<40", "40-49", "50-59", "60-69", "70+"];
        renderChart("ageChart", { tooltip: { trigger: "axis" }, title: { text: "年龄", left: "center", top: 8, textStyle: { fontSize: 11, color: "#6b7f8d" } }, grid: { top: 44, left: 34, right: 6, bottom: 42 }, xAxis: { type: "category", data: ageOrder, axisLabel: { rotate: 40, fontSize: 9 } }, yAxis: { type: "value", minInterval: 1, splitLine: { lineStyle: { color: "#edf2f5" } } }, series: [{ type: "bar", data: ageOrder.map(key => stats.ages[key] || 0), itemStyle: { color: "#7557c8", borderRadius: [5, 5, 0, 0] } }] });
        const sexData = Object.entries(stats.sexes).map(([name, value], index) => ({ name, value, itemStyle: { color: ["#2f78c4", "#e16f8d", "#91a5b2"][index % 3] } }));
        renderChart("sexChart", { tooltip: { trigger: "item" }, title: { text: "性别", left: "center", top: 8, textStyle: { fontSize: 11, color: "#6b7f8d" } }, legend: { bottom: 4, itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 9 } }, series: [{ type: "pie", radius: ["42%", "66%"], center: ["50%", "48%"], label: { show: false }, data: sexData }] });
    }

    function renderOptionalMetrics() {
        const rows = state.filtered;
        const metrics = [];
        const addAverage = (field, label, unit, icon) => { const values = rows.map(row => row[field]).filter(value => value !== null); const value = average(values); if (value !== null) metrics.push({ label, value: `${value.toFixed(1)}${unit}`, note: `基于 ${values.length} 条有效记录`, icon }); };
        addAverage("duration", "平均手术时长", " 分钟", "fa-clock");
        addAverage("bloodLoss", "平均术中出血", " ml", "fa-tint");
        addAverage("los", "平均术后住院日", " 天", "fa-bed");
        const emergencyKnown = rows.filter(row => row.emergency !== null); if (emergencyKnown.length) metrics.push({ label: "急诊手术占比", value: percent(emergencyKnown.filter(row => row.emergency).length, emergencyKnown.length), note: `基于 ${emergencyKnown.length} 条记录`, icon: "fa-ambulance" });
        const complicationKnown = rows.filter(row => row.complication !== null); if (complicationKnown.length) metrics.push({ label: "并发症记录比例", value: percent(complicationKnown.filter(row => row.complication).length, complicationKnown.length), note: "仅反映导入字段记录", icon: "fa-notes-medical" });
        const mortalityKnown = rows.filter(row => row.mortality !== null); if (mortalityKnown.length) metrics.push({ label: "院内死亡记录比例", value: percent(mortalityKnown.filter(row => row.mortality).length, mortalityKnown.length), note: "需按医院口径复核", icon: "fa-heartbeat" });
        el("optionalMetricsSection").classList.toggle("hidden", metrics.length === 0);
        const grid = el("optionalMetricsGrid"); grid.replaceChildren();
        metrics.forEach(metric => { const card = document.createElement("article"); card.className = "rounded-xl border border-slate-200 bg-slate-50/70 p-4"; card.innerHTML = `<div class="w-8 h-8 rounded-lg bg-white text-teal-700 grid place-items-center shadow-sm"><i class="fas ${metric.icon}"></i></div><div class="text-[10px] text-slate-500 font-bold mt-3"></div><div class="text-xl font-bold mt-1"></div><div class="text-[10px] text-slate-400 mt-1"></div>`; const divs = card.querySelectorAll("div"); divs[1].textContent = metric.label; divs[2].textContent = metric.value; divs[3].textContent = metric.note; grid.appendChild(card); });
    }

    function fieldCoverage(aliasKey) {
        if (!state.filtered.length) return 0;
        return state.filtered.filter(row => getValue(row.raw, aliasKey) !== "").length / state.filtered.length * 100;
    }

    function renderDataQuality() {
        const fields = [
            ["surgery", "手术名称", true], ["date", "手术日期", true], ["doctor", "手术医生", true], ["group", "医疗组", true],
            ["category", "原始分类", false], ["diagnosis", "诊断", false], ["age", "年龄", false], ["duration", "手术时长", false], ["los", "术后住院日", false]
        ].map(([key, label, core]) => ({ key, label, core, coverage: fieldCoverage(key) }));
        renderChart("dataQualityChart", { tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, formatter: params => `${params[0].name}<br/>${params[0].value.toFixed(1)}%` }, grid: { top: 20, left: 96, right: 38, bottom: 26 }, xAxis: { type: "value", max: 100, axisLabel: { formatter: "{value}%" }, splitLine: { lineStyle: { color: "#edf2f5" } } }, yAxis: { type: "category", data: fields.map(field => field.label).reverse(), axisLine: { show: false }, axisTick: { show: false } }, series: [{ type: "bar", data: fields.map(field => ({ value: field.coverage, itemStyle: { color: field.coverage >= 95 ? "#0f9b8e" : field.coverage >= 70 ? "#2f78c4" : "#d17a22" } })).reverse(), barMaxWidth: 18, itemStyle: { borderRadius: [0, 6, 6, 0] }, label: { show: true, position: "right", formatter: p => `${p.value.toFixed(0)}%`, color: "#506979" } }] });
        const coreAverage = average(fields.filter(field => field.core).map(field => field.coverage)) || 0;
        const grade = coreAverage >= 95 ? "A · 良好" : coreAverage >= 80 ? "B · 可用" : "C · 待补全";
        el("qualityGrade").textContent = grade; el("qualityGrade").className = `text-xs font-bold px-3 py-1 rounded-full ${coreAverage >= 95 ? "bg-emerald-50 text-emerald-700" : coreAverage >= 80 ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`;
        const list = el("qualityList"); list.replaceChildren();
        fields.filter(field => field.core || field.coverage < 100).slice(0, 6).forEach(field => {
            const item = document.createElement("div"); item.innerHTML = `<div class="flex justify-between text-xs mb-1.5"><span></span><strong></strong></div><div class="quality-bar"><div class="quality-fill"></div></div><p class="text-[10px] text-slate-500 mt-1.5"></p>`;
            item.querySelector("span").textContent = field.label; item.querySelector("strong").textContent = `${field.coverage.toFixed(0)}%`; item.querySelector(".quality-fill").style.width = `${field.coverage}%`;
            item.querySelector("p").textContent = field.coverage >= 95 ? "覆盖率良好" : field.core ? "建议补全，会影响核心分析" : "补全后可解锁更多指标";
            list.appendChild(item);
        });
    }

    function renderTable() {
        const body = el("tableBody"); body.replaceChildren();
        const rows = state.filtered.slice(0, 300); el("detailCount").textContent = `显示 ${rows.length} / ${state.filtered.length} 条`;
        rows.forEach(row => {
            const tr = document.createElement("tr"); tr.className = "table-row";
            const values = [row.dateText, row.group, row.doctor, row.surgery, row.diagnosis, `${row.age ?? "--"} / ${row.sex}`, row.declared || "--"];
            values.forEach((value, index) => { const td = document.createElement("td"); td.className = `px-4 py-3 ${index === 3 ? "max-w-xs truncate text-slate-700" : "text-slate-600"}`; td.textContent = value; if (index === 3) td.title = value; tr.appendChild(td); });
            const td = document.createElement("td"); td.className = "px-4 py-2"; const select = document.createElement("select"); select.className = `control custom-select py-2 ${state.overrides[row.id] ? "bg-amber-50 border-amber-300 text-amber-800 font-semibold" : ""}`; select.setAttribute("aria-label", `修正第 ${row.id + 1} 条手术分类`);
            const current = `${row.main}|${row.sub}`; CATEGORY_OPTIONS.forEach(optionData => { const option = document.createElement("option"); option.value = optionData.val; option.textContent = optionData.label; option.selected = optionData.val === current; select.appendChild(option); });
            select.addEventListener("change", () => { state.overrides[row.id] = select.value; deriveRows(); populateFilters(); applyFilters(); }); td.appendChild(select); tr.appendChild(td); body.appendChild(tr);
        });
    }

    function renderGroupSettings() {
        const container = el("doctorGroupInputs"); container.replaceChildren();
        Object.keys(state.doctorGroups).sort((a, b) => a.localeCompare(b, "zh-CN")).forEach(doctor => {
            const wrap = document.createElement("label"); wrap.className = "rounded-xl border border-slate-200 bg-slate-50 p-3";
            const name = document.createElement("span"); name.className = "block text-[11px] font-bold text-slate-600 mb-2"; name.textContent = doctor;
            const input = document.createElement("input"); input.className = "control py-2 bg-white"; input.value = state.doctorGroups[doctor]; input.dataset.doctor = doctor; input.setAttribute("list", "groupList");
            wrap.append(name, input); container.appendChild(wrap);
        });
    }

    function resetFilters() {
        el("groupFilter").value = ""; el("doctorFilter").value = ""; el("categoryFilter").value = ""; el("keywordFilter").value = "";
        const dates = state.derived.map(row => row.date).filter(Boolean).sort((a, b) => a - b);
        el("startDateFilter").value = dates.length ? dateKey(dates[0]) : ""; el("endDateFilter").value = dates.length ? dateKey(dates[dates.length - 1]) : ""; applyFilters();
    }

    function downloadBlob(content, name, type) {
        const url = URL.createObjectURL(new Blob([content], { type })); const link = document.createElement("a"); link.href = url; link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 500);
    }

    function downloadTemplate() {
        const template = `序号,手术日期,医疗组,手术医生,手术名称,手术分类,诊断,年龄,性别,手术时长（分钟）,术中出血量,是否急诊,是否微创,术后住院日,手术级别,并发症,转归\n1,2025/1/1,一组,医生01,VATS右肺上叶切除术,肺部,肺部占位,60,男,180,100,否,是,5,三级,无,出院`;
        downloadBlob(`\ufeff${template}`, "手术数据导入模板.csv", "text/csv;charset=utf-8");
    }

    function exportFiltered() {
        if (!state.filtered.length) return showStatus("当前没有可导出的筛选结果。", true);
        const rows = state.filtered.map(row => {
            const clean = {}; Object.entries(row.raw).forEach(([key, value]) => { if (!key.startsWith("_")) clean[key] = value; });
            clean["分析_医疗组"] = row.group; clean["分析_主类别"] = row.main; clean["分析_细分术式"] = row.sub; clean["分析_是否微创"] = row.minimallyInvasive ? "是" : "否"; return clean;
        });
        downloadBlob(`\ufeff${Papa.unparse(rows)}`, `手术分析_筛选结果_${dateKey(new Date())}.csv`, "text/csv;charset=utf-8");
    }

    function showStatus(message, error = false) {
        el("fileStatus").textContent = message; el("fileStatus").className = error ? "text-rose-200 font-semibold" : "text-slate-200";
    }

    function bindEvents() {
        el("dataInput").addEventListener("change", event => { const file = event.target.files[0]; if (file) loadFile(file); });
        ["startDateFilter", "endDateFilter", "groupFilter", "doctorFilter", "categoryFilter"].forEach(id => el(id).addEventListener("change", applyFilters));
        let timer; el("keywordFilter").addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(applyFilters, 220); });
        el("resetFiltersBtn").addEventListener("click", resetFilters); el("exportFilteredBtn").addEventListener("click", exportFiltered); el("downloadTemplateBtn").addEventListener("click", downloadTemplate);
        el("groupSettingsToggle").addEventListener("click", () => { const panel = el("groupSettingsPanel"), expanded = panel.classList.toggle("hidden") === false; el("groupSettingsToggle").setAttribute("aria-expanded", String(expanded)); el("toggleIcon").classList.toggle("rotate-180", expanded); });
        el("applyGroupSettingsBtn").addEventListener("click", () => { containerInputs().forEach(input => state.doctorGroups[input.dataset.doctor] = input.value.trim() || "未分组"); deriveRows(); populateFilters(); applyFilters(); });
        window.addEventListener("resize", () => Object.values(state.charts).forEach(chart => chart && chart.resize()));
    }

    function containerInputs() { return [...document.querySelectorAll("#doctorGroupInputs input")]; }

    function initialize() {
        if (typeof Papa === "undefined" || typeof XLSX === "undefined" || typeof echarts === "undefined") return showStatus("资源库加载失败，请检查网络后刷新页面。", true);
        const datalist = document.createElement("datalist"); datalist.id = "groupList"; GROUP_ORDER.filter(group => group !== "未分组").forEach(group => { const option = document.createElement("option"); option.value = group; datalist.appendChild(option); }); document.body.appendChild(datalist);
        bindEvents();
        const demo = Papa.parse(DEMO_CSV, { header: true, skipEmptyLines: true }).data;
        initializeData(demo, "匿名合成演示数据");
    }

    window.addEventListener("DOMContentLoaded", initialize);
})();

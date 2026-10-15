/* 每日励志句子：按需增删，保持一行一条即可 */
var QUOTES = [
  "道阻且长，行则将至。",
  "日拱一卒，功不唐捐。",
  "学如逆水行舟，不进则退。",
  "千里之行，始于足下。",
  "星光不问赶路人，时光不负有心人。",
  "博观而约取，厚积而薄发。",
  "路漫漫其修远兮，吾将上下而求索。",
  "纸上得来终觉浅，绝知此事要躬行。",
  "业精于勤，荒于嬉；行成于思，毁于随。",
  "志之所趋，无远弗届，穷山距海，不能限也。",
  "合抱之木，生于毫末；九层之台，起于累土。",
  "不积跬步，无以至千里；不积小流，无以成江海。",
  "书山有路勤为径，学海无涯苦作舟。",
  "锲而舍之，朽木不折；锲而不舍，金石可镂。",
  "少年易老学难成，一寸光阴不可轻。",
  "莫等闲，白了少年头，空悲切。",
  "长风破浪会有时，直挂云帆济沧海。",
  "千淘万漉虽辛苦，吹尽狂沙始到金。",
  "宝剑锋从磨砺出，梅花香自苦寒来。",
  "志当存高远。",
  "非淡泊无以明志，非宁静无以致远。",
  "天行健，君子以自强不息。",
  "功崇惟志，业广惟勤。",
  "知不足而奋进，望远山而前行。"
];

function dayOfYear() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start;
  return Math.floor(diff / 86400000);
}

function todayQuote() {
  var index = dayOfYear() % QUOTES.length;
  return { text: QUOTES[index], day: dayOfYear() };
}

function renderQuote() {
  var q = todayQuote();
  var textEl = document.getElementById("quoteText");
  var dayEl = document.getElementById("quoteDay");
  if (textEl) textEl.textContent = q.text;
  if (dayEl) dayEl.textContent = "今日寄语 · 第 " + q.day + " 天";
}

function percent(done, total) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

function makeBar(className, done, total) {
  var wrap = document.createElement("div");
  wrap.className = "bar";

  var fill = document.createElement("div");
  fill.className = "bar-fill " + className;
  fill.style.width = percent(done, total) + "%";
  wrap.appendChild(fill);
  return wrap;
}

function makeProgressBlock(label, data, barClass) {
  var block = document.createElement("div");
  block.className = "progress-block";

  var top = document.createElement("div");
  top.className = "progress-label";

  var labelEl = document.createElement("strong");
  labelEl.textContent = label;

  var valueEl = document.createElement("span");
  valueEl.className = "progress-value";
  valueEl.textContent = data.done + " / " + data.total;

  top.appendChild(labelEl);
  top.appendChild(valueEl);

  block.appendChild(top);
  block.appendChild(makeBar(barClass, data.done, data.total));

  if (data.note) {
    var note = document.createElement("p");
    note.className = "progress-note";
    note.textContent = data.note;
    block.appendChild(note);
  }

  return block;
}

function makeMaterials(materials) {
  var box = document.createElement("div");

  var title = document.createElement("p");
  title.className = "materials-title";
  title.textContent = "已找到的资料";
  box.appendChild(title);

  var list = document.createElement("ul");
  list.className = "materials";

  if (!materials || materials.length === 0) {
    var none = document.createElement("li");
    none.className = "none";
    none.textContent = "暂无资料记录";
    list.appendChild(none);
  } else {
    materials.forEach(function (m) {
      var li = document.createElement("li");
      var dot = document.createElement("span");
      dot.className = "dot";
      li.appendChild(dot);

      if (m.url) {
        var a = document.createElement("a");
        a.href = m.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = m.title;
        li.appendChild(a);
      } else {
        var span = document.createElement("span");
        span.className = "plain";
        span.textContent = m.title;
        li.appendChild(span);
      }

      list.appendChild(li);
    });
  }

  box.appendChild(list);
  return box;
}

function makeFeishuButton(feishu) {
  var btn = document.createElement("a");
  btn.className = "feishu-btn";
  if (feishu) {
    btn.href = feishu;
    btn.target = "_blank";
    btn.rel = "noopener";
    btn.textContent = "打开学习指南（飞书）";
  } else {
    btn.classList.add("disabled");
    btn.textContent = "飞书链接待设置";
  }
  return btn;
}

function makeCard(subject) {
  var card = document.createElement("article");
  card.className = "card";

  var head = document.createElement("div");
  head.className = "card-head";

  var name = document.createElement("h2");
  name.className = "subject-name";
  name.textContent = subject.name || "未命名学科";
  head.appendChild(name);

  var badge = document.createElement("span");
  badge.className = "leader-badge";
  var leader = subject.leader ? subject.leader : "待填写";
  badge.innerHTML = "领学人 <span class='name'>" + leader + "</span>";
  head.appendChild(badge);

  card.appendChild(head);

  card.appendChild(makeProgressBlock("模拟卷", subject.mockExam || { done: 0, total: 0 }, "mock"));
  card.appendChild(makeProgressBlock("学习指南", subject.studyGuide || { done: 0, total: 0 }, "guide"));
  card.appendChild(makeMaterials(subject.materials));
  card.appendChild(makeFeishuButton(subject.feishu));

  return card;
}

function renderBoard(data) {
  var board = document.getElementById("board");
  var loading = document.getElementById("loading");
  if (loading) loading.remove();

  var subjects = data.subjects || [];
  if (subjects.length === 0) {
    var empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "看板暂无数据，请在 subjects.json 中填写学科信息。";
    board.appendChild(empty);
    return;
  }

  subjects.forEach(function (subject) {
    board.appendChild(makeCard(subject));
  });
}

function renderMeta(data) {
  var nameEl = document.getElementById("className");
  if (nameEl && data.className) nameEl.textContent = data.className;

  var metaEl = document.getElementById("headerMeta");
  var parts = [];
  if (data.semester) parts.push(data.semester);
  if (data.subjects) parts.push("共 " + data.subjects.length + " 门学科");
  if (data.updated) parts.push("数据更新于 " + data.updated);
  if (metaEl) metaEl.textContent = parts.join(" · ");
}

function showLoadError() {
  var loading = document.getElementById("loading");
  if (loading) {
    loading.className = "empty";
    loading.textContent = "数据加载失败。请使用本地服务器打开本页（例如在目录下运行 python -m http.server 8000 后访问 http://localhost:8000），或检查 subjects.json 是否存在。";
  }
}

renderQuote();

fetch("subjects.json")
  .then(function (res) {
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  })
  .then(function (data) {
    renderMeta(data);
    renderBoard(data);
  })
  .catch(function () {
    showLoadError();
  });
/* 壁纸背景轮播：把图片放进 pictures 文件夹，路径填在 BACKGROUNDS 数组里即可 */
var BACKGROUNDS = [
  "pictures/1.jpg",
  "pictures/2.jpg"
  "pictures/3.jpg"
  "pictures/4.jpg"
  "pictures/5.jpg"
  "pictures/6.jpg"
  "pictures/7.jpg"
  "pictures/8.jpg"
  "pictures/9.jpg"
  "pictures/10.jpg"
  "pictures/11.jpg"
  "pictures/12.jpg"
  "pictures/13.jpg"
];

var bgIndex = 0;

function buildBackground() {
  var bg = document.getElementById("background");
  if (!bg || BACKGROUNDS.length === 0) return;

  BACKGROUNDS.forEach(function (src, i) {
    var slide = document.createElement("div");
    slide.className = "bg-slide" + (i === 0 ? " active" : "");
    slide.style.backgroundImage = "url('" + src + "')";
    bg.appendChild(slide);
  });

  if (BACKGROUNDS.length > 1) {
    setInterval(function () {
      var slides = bg.querySelectorAll(".bg-slide");
      if (!slides.length) return;
      slides[bgIndex].classList.remove("active");
      bgIndex = (bgIndex + 1) % slides.length;
      slides[bgIndex].classList.add("active");
    }, 8000);
  }
}

buildBackground();
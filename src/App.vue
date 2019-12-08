<template>
  <div id="app">
    <div class="mdui-appbar">
      <div class="mdui-toolbar mdui-color-grey-900">
        <span v-if="grayscale" class="mdui-typo-title">黑白生草图制作器</span>
        <span v-else class="mdui-typo-title">
          <del>黑白</del>生草图制作器
        </span>
        <div class="mdui-toolbar-spacer"></div>
        <a
          v-show="deferredPrompt"
          mdui-tooltip="{ content: '安装' }"
          class="mdui-btn mdui-btn-icon mdui-ripple mdui-ripple-white cursor-pointer"
          @click="installPWA"
        >
          <i class="mdui-icon material-icons">add</i>
        </a>
        <a
          href="https://github.com/Tsuk1ko/bww-generator"
          target="_blank"
          class="mdui-btn mdui-btn-icon mdui-ripple mdui-ripple-white"
        >
          <github-icon />
        </a>
      </div>
    </div>
    <gallery :images="gallery.images" :index="gallery.index" @close="gallery.index = null" />
    <div class="mdui-container mdui-m-t-4" style="overflow:hidden">
      <div class="item-group">
        <label
          class="mdui-btn mdui-ripple mdui-color-teal mdui-btn-raised"
          for="image-select"
          @dragover.prevent
          @drop.prevent="e => (file = e.dataTransfer.files[0])"
        >选择图片 (可拖拽至此)</label>
        <input
          type="file"
          id="image-select"
          accept="image/*"
          style="display:none"
          ref="image"
          @change="file = $refs.image.files[0]"
        />
        <mdui-chip
          v-if="image"
          icon="crop_free"
          color="mdui-color-red-600"
        >{{image.width}} x {{image.height}}</mdui-chip>
      </div>
      <div v-if="image" class="item-group mdui-m-t-1">
        <mdui-input v-model="width" :disabled="autoWidth" data-key="width">宽 (px)</mdui-input>
        <mdui-input :value="height" :disabled="true">高 (px)</mdui-input>
        <mdui-input :value="ratio" :disabled="true" type="text">缩放比例</mdui-input>
        <mdui-input v-model="padding" :disabled="autoWidth">文字边距 (px)</mdui-input>
        <mdui-input v-model="space" :disabled="autoWidth">文字行距 (px)</mdui-input>
        <mdui-checkbox v-model="autoWidth" style="margin-top:8px">自动调整</mdui-checkbox>
      </div>
      <mdui-textfield
        class="mdui-p-t-0 mdui-textfield-floating-label"
        v-model="fontFamily"
      >自定义字体 (font-family)</mdui-textfield>
      <div class="sentence-input-group mdui-m-b-1">
        <div class="sentence-input" v-for="(sentence, index) in sentences" :key="index">
          <mdui-textfield
            class="text-input"
            v-model="sentences[index].text"
            @input="val => { if (sentence.auto) sentence.size = autoFontSize(val) }"
          >行 {{index + 1}}</mdui-textfield>
          <mdui-textfield
            class="size-input"
            type="number"
            v-model="sentences[index].size"
            :disabled="sentence.auto"
          >大小 (px)</mdui-textfield>
          <mdui-checkbox-small
            v-model="sentences[index].auto"
            @change="val => (sentence.size = autoFontSize(sentence.text))"
          >自动</mdui-checkbox-small>
        </div>
      </div>
      <div class="item-group mdui-m-b-2">
        <button
          class="mdui-btn mdui-btn-icon mdui-color-pink-accent mdui-ripple mdui-btn-raised"
          @click="addSentence"
        >
          <i class="mdui-icon material-icons">add</i>
        </button>
        <button
          class="mdui-btn mdui-btn-icon mdui-color-teal mdui-ripple mdui-btn-raised"
          :disabled="sentences.length <= 1"
          @click="delSentence"
        >
          <i class="mdui-icon material-icons">remove</i>
        </button>
        <button
          class="mdui-btn mdui-ripple mdui-color-indigo-accent mdui-btn-raised"
          :disabled="generating"
          @click="generate"
        >生成</button>
        <mdui-checkbox v-model="grayscale">黑白</mdui-checkbox>
      </div>
    </div>
    <div class="mdui-container mdui-m-b-2">
      <label class="mdui-textfield-label">
        效果预览 点击切换
        <span v-html="previewModeText"></span>
        不影响成品大小
      </label>
      <div
        v-if="image"
        id="preview-wrap"
        ref="previewWrap"
        :class="{ 'mdui-table-fluid mdui-shadow-0': !adaptiveWidth }"
        :style="{ transform: previewScale, border: 'none' }"
      >
        <div
          id="preview"
          ref="preview"
          :style="{ width: `${width}px` }"
          @click="adaptiveWidth = !adaptiveWidth"
        >
          <img :src="image.src" :style="{ filter: grayscale ? 'grayscale(1)' : 'unset' }" />
          <div class="sentences mdui-text-center" :style="{ padding: `${padding}px`, fontFamily }">
            <p
              v-for="(sentence, index) in sentences"
              :key="index"
              :style="{ marginTop: `${index == 0 ? 0 : space}px`, fontSize: `${sentence.size}px` }"
            >{{sentence.text}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Gallery from 'vue-gallery';
import MduiChip from './components/MduiChip';
import MduiInput from './components/MduiInput';
import MduiTextfield from './components/MduiTextfield';
import MduiCheckbox from './components/MduiCheckbox';
import MduiCheckboxSmall from './components/MduiCheckboxSmall';
import GithubIcon from './components/GithubIcon';
import { toPng as dom2png } from 'dom-to-image';

export default {
  name: 'app',
  components: { Gallery, MduiChip, MduiInput, MduiTextfield, MduiCheckbox, MduiCheckboxSmall, GithubIcon },
  data: () => ({
    file: null,
    image: null,
    fontFamily: window.localStorage.getItem('bw-font-family') || '',
    width: 0,
    sentences: [],
    padding: 0,
    space: 0,
    grayscale: true,
    autoWidth: true,
    generating: false,
    gallery: {
      images: [],
      index: null,
    },
    wrapWidth: 0,
    adaptiveWidth: true,
    deferredPrompt: null,
    generateCacheKey: '',
  }),
  watch: {
    updateFontSizeWatch() {
      this.updateAllFontSize();
    },
    file(file) {
      if (!file) return;
      this.setImage(window.URL.createObjectURL(file));
    },
    autoWidth(val) {
      if (val) this.init();
    },
    fontFamily(val) {
      window.localStorage.setItem('bw-font-family', val);
    },
  },
  computed: {
    ratio() {
      return `${((100 * this.width) / this.image.width).toFixed(2)}%`;
    },
    height() {
      return Math.round((this.width / this.image.width) * this.image.height);
    },
    previewScale() {
      return this.adaptiveWidth ? `scale(${Math.min(this.wrapWidth / this.width, 1)})` : 'unset';
    },
    previewModeText() {
      return this.adaptiveWidth ? '[<b class="mdui-text-color-black">适应宽度</b>/100%]' : '[适应宽度/<b class="mdui-text-color-black">100%</b>]';
    },
    updateFontSizeWatch() {
      return [this.width, this.padding, this.space].join();
    },
    generateCacheWatch() {
      return [this.updateFontSizeWatch, this.grayscale, JSON.stringify(this.sentences)].join();
    },
  },
  methods: {
    setImage(src) {
      return new Promise(resolve => {
        const image = new Image();
        image.onload = () => {
          this.image = image;
          this.init();
          resolve();
        };
        image.src = src;
      });
    },
    init() {
      const width = this.image.width;
      this.width = width <= 400 ? Math.min(width * 2, 300) : Math.min(width, 600);
      this.padding = Math.round(width * 0.03);
      this.space = Math.round(width * 0.02);
    },
    autoFontSize(str) {
      const w = this.width - 2 * this.padding;
      return Math.floor(Math.max(Math.min((1.9 * w) / this.textLen(str), w * 0.068), w * 0.045));
    },
    updateAllFontSize() {
      this.sentences.filter(s => s.auto).forEach(s => (s.size = this.autoFontSize(s.text)));
    },
    async generate() {
      if (this.generateCacheKey === this.generateCacheWatch) {
        this.gallery.index = 0;
        return;
      }
      this.generating = true;
      this.generateCacheKey = this.generateCacheWatch;
      let output = await dom2png(this.$refs.preview);
      for (const check = await dom2png(this.$refs.preview); check !== output; output = check);
      this.gallery.images = [
        {
          title: 'PC 右击复制或保存，手机长按保存',
          href: output,
        },
      ];
      this.gallery.index = 0;
      this.generating = false;
    },
    textLen(text) {
      // eslint-disable-next-line no-control-regex
      return text.replace(/[^\x00-\xff]/g, '**').length;
    },
    addSentence() {
      this.sentences.push({ text: '', size: this.autoFontSize(''), auto: true });
    },
    delSentence() {
      this.sentences.splice(this.sentences.length - 1, 1);
    },
    updateWrapWidth() {
      this.wrapWidth = this.$refs.previewWrap.clientWidth;
    },
    installPWA() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt = null;
      }
    },
  },
  async mounted() {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
    await this.setImage('img/example.png');
    this.sentences.push(
      ...['有的时候，事情总不尽人意', '時には、物事はいつも思うようにならない'].map(text => ({ text, size: this.autoFontSize(text), auto: true }))
    );
    this.updateWrapWidth();
    window.onresize = this.updateWrapWidth;
  },
};
</script>

<style>
body::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background: rgba(0, 0, 0, 0.08);
}
body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}
.cursor-pointer {
  cursor: pointer;
}
.mdui-textfield-label {
  width: 130%;
}
.item-group {
  margin-right: -16px;
  /* margin-bottom: -16px; */
  display: flex;
  flex-wrap: wrap;
}
.item-group > * {
  margin-right: 16px;
  margin-bottom: 16px;
}
#preview-wrap {
  transform-origin: left top;
}
#preview {
  background-color: #000;
  user-select: none;
  cursor: pointer;
}
#preview img {
  pointer-events: none;
}
#preview img {
  width: 100%;
}
.sentences {
  color: #fff;
}
.sentences p {
  margin-bottom: 0;
}
.sentence-input {
  display: flex;
  margin-right: -16px;
  margin-bottom: -16px;
}
.sentence-input > * {
  margin-right: 16px;
  margin-bottom: 16px;
}
.sentence-input .text-input {
  flex-grow: 1;
}
.sentence-input .size-input {
  width: 56px;
}
</style>

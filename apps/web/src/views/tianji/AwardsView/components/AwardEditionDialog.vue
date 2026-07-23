<script setup lang="ts">
import { toRef } from 'vue';
import type { PlayerListItem } from '@/services/types/catalog';
import type { AwardTargetType } from '@/services/types/awards';
import type { SelectOption } from '@/stores/options';
import { ClubSelect, CountrySelect } from '@/components/selects';
import BaseOptionSelect from '@/components/selects/BaseOptionSelect.vue';
import IconFont from '@/components/IconFont.vue';

interface RecipientFormRow {
  playerId: string;
  countryId: string;
  clubId: string;
  rank?: number;
  placement: string;
  externalUrl: string;
  remark: string;
}

const props = defineProps<{
  title: string;
  form: {
    name: string;
    competitionEditionId: string;
    season: string;
    year?: number;
    externalUrl: string;
    remark: string;
    recipients: RecipientFormRow[];
  };
  saving: boolean;
  playersLoading: boolean;
  playerOptions: PlayerListItem[];
  playerOptionMeta: (player: PlayerListItem) => string;
  targetType: AwardTargetType;
  targetTypeLabels: Record<AwardTargetType, string>;
  competitionEditionOptions: SelectOption[];
}>();

const visible = defineModel<boolean>('visible', { required: true });
const form = toRef(props, 'form');

const emit = defineEmits<{
  save: [];
  searchPlayers: [keyword: string];
}>();

function addRecipientRow(form: { recipients: RecipientFormRow[] }) {
  form.recipients.push({
    playerId: '',
    countryId: '',
    clubId: '',
    rank: undefined,
    placement: '',
    externalUrl: '',
    remark: ''
  });
}

function clearRecipientRow(form: { recipients: RecipientFormRow[] }, index: number) {
  form.recipients.splice(index, 1);

  if (!form.recipients.length) {
    addRecipientRow(form);
  }
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="860px">
    <el-form class="competition-form-grid" label-position="top" @submit.prevent="emit('save')">
      <el-form-item label="名称" required>
        <el-input v-model="form.name" placeholder="2024 金球奖" />
      </el-form-item>
      <el-form-item label="关联赛事届次">
        <BaseOptionSelect
          v-model="form.competitionEditionId"
          :options="competitionEditionOptions"
          placeholder="非赛事奖项可不选"
        />
      </el-form-item>
      <el-form-item label="年份">
        <el-input-number v-model="form.year" :min="1800" :max="2200" :controls="false" />
      </el-form-item>
      <el-form-item label="赛季">
        <el-input v-model="form.season" placeholder="2023-24" />
      </el-form-item>
      <el-form-item label="外链">
        <el-input v-model="form.externalUrl" placeholder="https://..." />
      </el-form-item>
      <el-form-item label="备注" class="form-wide">
        <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="可选" />
      </el-form-item>
    </el-form>

    <div class="standing-editor">
      <div class="panel-header">
        <h3>获奖{{ targetTypeLabels[targetType] }}</h3>
        <el-button size="small" @click="addRecipientRow(form)">
          <IconFont name="add" />
          新增获奖对象
        </el-button>
      </div>
      <div class="standing-grid">
        <div
          v-for="(recipient, index) in form.recipients"
          :key="index"
          class="standing-row award-recipient-row"
        >
          <el-form-item v-if="targetType === 'PLAYER'" label="球员">
            <el-select
              v-model="recipient.playerId"
              filterable
              remote
              clearable
              :loading="playersLoading"
              :remote-method="(keyword: string) => emit('searchPlayers', keyword)"
              placeholder="选择球员"
            >
              <el-option
                v-for="player in playerOptions"
                :key="player.id"
                :label="player.chineseName"
                :value="player.id"
              >
                <div class="player-name-cell">
                  <strong>{{ player.chineseName }}</strong>
                  <span>{{ playerOptionMeta(player) }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-else-if="targetType === 'COUNTRY'" label="国家队">
            <CountrySelect
              v-model="recipient.countryId"
              include-hidden
              include-historical
              placeholder="选择国家队"
            />
          </el-form-item>
          <el-form-item v-else label="俱乐部">
            <ClubSelect v-model="recipient.clubId" placeholder="选择俱乐部" />
          </el-form-item>
          <el-form-item label="排名">
            <el-input-number v-model="recipient.rank" :min="1" :controls="false" />
          </el-form-item>
          <el-form-item label="名次文本">
            <el-input v-model="recipient.placement" placeholder="冠军 / 金球奖 / 第二名" />
          </el-form-item>
          <el-form-item label="外链">
            <el-input v-model="recipient.externalUrl" placeholder="https://..." />
          </el-form-item>
          <el-form-item label="备注" class="form-wide">
            <el-input v-model="recipient.remark" placeholder="补充说明" />
          </el-form-item>
          <div class="competition-form-actions">
            <el-button type="danger" plain @click="clearRecipientRow(form, index)">
              <IconFont name="reset" />
              清空此行
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button :disabled="saving" @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="emit('save')">
        <IconFont name="save" />
        保存年份
      </el-button>
    </template>
  </el-dialog>
</template>

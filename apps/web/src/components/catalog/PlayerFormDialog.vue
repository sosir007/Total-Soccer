<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import {
  createPlayer,
  updatePlayer,
  type PlayerDetail,
  type PlayerPayload
} from '@/services/catalog';
import {
  CitySelect,
  ClubSelect,
  ConfederationSelect,
  CountrySelect,
  EthnicitySelect,
  HairColorSelect,
  PlayerTypeSelect,
  PositionSelect,
  PreferredFootSelect
} from '@/components/selects';
import { useOptionStore } from '@/stores/options';

const visible = defineModel<boolean>({ default: false });
const props = defineProps<{
  player?: PlayerDetail | null;
}>();
const emit = defineEmits<{
  saved: [player: PlayerDetail];
}>();

const saving = ref(false);
const optionStore = useOptionStore();
const form = reactive({
  uid: '',
  chineseName: '',
  englishName: '',
  birthDate: '',
  deathDate: '',
  countryId: '',
  nationalityIds: [] as string[],
  birthCountryId: '',
  birthCityId: '',
  clubId: '',
  confederationId: '',
  primaryRole: '',
  positions: '',
  clubHistoryIds: [] as string[],
  playerTypeId: '',
  ethnicityId: '',
  hairColorId: '',
  preferredFootId: '',
  foot: '',
  pa: 0,
  ca: 0,
  height: undefined as number | undefined,
  weight: undefined as number | undefined,
  shirtNumber: '',
  skinTone: '',
  initialClub: '',
  clubs: '',
  marketValue: undefined as number | undefined,
  retired: false,
  deceased: false,
  databaseSource: '',
  staffRoles: '',
  achievement: '',
  externalUrl: '',
  remark: ''
});

watch(
  () => [visible.value, props.player] as const,
  () => {
    if (!visible.value) {
      return;
    }

    form.uid = props.player?.uid ?? '';
    form.chineseName = props.player?.chineseName ?? '';
    form.englishName = props.player?.englishName ?? '';
    form.birthDate = formatFormDate(props.player?.birthDate);
    form.deathDate = formatFormDate(props.player?.deathDate);
    form.countryId = props.player?.country?.id ?? '';
    form.nationalityIds =
      props.player?.nationalities?.map((item) => item.country.id) ??
      (props.player?.country?.id ? [props.player.country.id] : []);
    form.birthCountryId = props.player?.birthCountry?.id ?? '';
    form.birthCityId = props.player?.birthCityRef?.id ?? '';
    form.clubId = props.player?.club?.id ?? '';
    form.confederationId = props.player?.confederationRef?.id ?? '';
    form.primaryRole = props.player?.primaryRole ?? '';
    form.positions = props.player?.positions ?? props.player?.primaryRole ?? '';
    form.clubHistoryIds = resolveClubHistoryIds(props.player?.clubs);
    form.playerTypeId = props.player?.playerTypeRef?.id ?? '';
    form.ethnicityId = props.player?.ethnicityRef?.id ?? '';
    form.hairColorId = props.player?.hairColorRef?.id ?? '';
    form.preferredFootId = props.player?.preferredFootRef?.id ?? '';
    form.foot = props.player?.foot ?? '';
    form.pa = props.player?.pa ?? 0;
    form.ca = props.player?.ca ?? 0;
    form.height = props.player?.height ?? undefined;
    form.weight = props.player?.weight ?? undefined;
    form.shirtNumber = props.player?.shirtNumber ?? '';
    form.skinTone = props.player?.skinTone ?? '';
    form.initialClub = props.player?.initialClub ?? '';
    form.clubs = props.player?.clubs ?? '';
    form.marketValue = props.player?.marketValue ?? undefined;
    form.retired = props.player?.retired ?? false;
    form.deceased = props.player?.deceased ?? false;
    form.databaseSource = props.player?.databaseSource ?? '';
    form.staffRoles = props.player?.staffRoles ?? '';
    form.achievement = props.player?.achievement ?? '';
    form.externalUrl = props.player?.externalUrl ?? '';
    form.remark = props.player?.remark ?? '';
  },
  { immediate: true }
);

function formatFormDate(value?: string | number | null) {
  return value ? dayjs(value).format('YYYY-MM-DD') : '';
}

function resolveClubHistoryIds(value?: string | null) {
  if (!value) {
    return [];
  }

  const names = value
    .split(/[、,，/]/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (names.length === 0) {
    return [];
  }

  const idByName = new Map(optionStore.clubs.map((club) => [club.name, club.id]));

  return names.flatMap((name) => {
    const id = idByName.get(name);

    return id ? [id] : [];
  });
}

watch(
  () => visible.value,
  (isVisible) => {
    if (isVisible) {
      void optionStore.ensureClubs().then(() => {
        form.clubHistoryIds = resolveClubHistoryIds(props.player?.clubs);
      });
    }
  },
  { immediate: true }
);

async function submit() {
  if (!form.uid.trim() || !form.chineseName.trim()) {
    ElMessage.warning('请填写 UID 和球员中文名。');
    return;
  }

  saving.value = true;

  try {
    const payload: PlayerPayload = {
      uid: form.uid.trim(),
      chineseName: form.chineseName.trim(),
      englishName: form.englishName.trim() || undefined,
      birthDate: form.birthDate || undefined,
      deathDate: form.deathDate || undefined,
      countryId: form.countryId || undefined,
      nationalityIds: form.nationalityIds,
      birthCountryId: form.birthCountryId || undefined,
      birthCityId: form.birthCityId || undefined,
      clubId: form.clubId || undefined,
      confederationId: form.confederationId || undefined,
      primaryRole: form.primaryRole || undefined,
      positions: form.positions.trim() || undefined,
      clubHistoryIds: form.clubHistoryIds,
      playerTypeId: form.playerTypeId || undefined,
      ethnicityId: form.ethnicityId || undefined,
      hairColorId: form.hairColorId || undefined,
      preferredFootId: form.preferredFootId || undefined,
      foot: form.foot.trim() || undefined,
      pa: form.pa,
      ca: form.ca,
      height: form.height ?? null,
      weight: form.weight ?? null,
      shirtNumber: form.shirtNumber.trim() || undefined,
      skinTone: form.skinTone.trim() || undefined,
      initialClub: form.initialClub.trim() || undefined,
      clubs: form.clubs.trim() || undefined,
      marketValue: form.marketValue ?? null,
      retired: form.retired,
      deceased: form.deceased,
      databaseSource: form.databaseSource.trim() || undefined,
      staffRoles: form.staffRoles.trim() || undefined,
      achievement: form.achievement.trim() || undefined,
      externalUrl: form.externalUrl.trim() || undefined,
      remark: form.remark.trim() || undefined
    };
    const result = props.player
      ? await updatePlayer(props.player.id, payload)
      : await createPlayer(payload);

    visible.value = false;
    emit('saved', result);
    ElMessage.success(props.player ? '球员已更新。' : '球员已新增。');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '球员保存失败。');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="player ? '编辑球员' : '新增球员'"
    width="880px"
    destroy-on-close
  >
    <el-form class="catalog-form" label-position="top" @submit.prevent="submit">
      <div class="catalog-form-grid">
        <el-form-item label="UID" required>
          <el-input v-model="form.uid" placeholder="未知可填 -" />
        </el-form-item>
        <el-form-item label="中文名" required>
          <el-input v-model="form.chineseName" placeholder="请输入中文名" />
        </el-form-item>
        <el-form-item label="英文名">
          <el-input v-model="form.englishName" placeholder="请输入英文名" />
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker
            v-model="form.birthDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="选择生日"
          />
        </el-form-item>
        <el-form-item label="过世日期">
          <el-date-picker
            v-model="form.deathDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="未去世可不填"
          />
        </el-form-item>
        <el-form-item label="足联">
          <ConfederationSelect v-model="form.confederationId" />
        </el-form-item>
        <el-form-item label="代表国籍">
          <CountrySelect v-model="form.countryId" placeholder="请选择代表国籍" />
        </el-form-item>
        <el-form-item label="国籍">
          <CountrySelect
            v-model="form.nationalityIds"
            multiple
            placeholder="请选择一个或多个国籍"
          />
        </el-form-item>
        <el-form-item label="代表球队">
          <ClubSelect v-model="form.clubId" />
        </el-form-item>
        <el-form-item label="代表位置">
          <PositionSelect v-model="form.primaryRole" placeholder="请选择代表位置" />
        </el-form-item>
        <el-form-item label="位置">
          <el-input v-model="form.positions" placeholder="例如 ST、AMC、DC，多个可用顿号分隔" />
        </el-form-item>
        <el-form-item label="球衣">
          <el-input v-model="form.shirtNumber" placeholder="如 10" />
        </el-form-item>
        <el-form-item label="球员类型">
          <PlayerTypeSelect v-model="form.playerTypeId" />
        </el-form-item>
        <el-form-item label="惯用脚">
          <PreferredFootSelect v-model="form.preferredFootId" />
        </el-form-item>
        <el-form-item label="左右脚">
          <el-input v-model="form.foot" placeholder="例如 左脚 / 右脚 / 双脚" />
        </el-form-item>
        <el-form-item label="种族">
          <EthnicitySelect v-model="form.ethnicityId" />
        </el-form-item>
        <el-form-item label="发色">
          <HairColorSelect v-model="form.hairColorId" />
        </el-form-item>
        <el-form-item label="肤色">
          <el-input v-model="form.skinTone" placeholder="请输入肤色" />
        </el-form-item>
        <el-form-item label="PA">
          <el-input-number v-model="form.pa" :controls="false" :min="0" :max="250" />
        </el-form-item>
        <el-form-item label="CA">
          <el-input-number v-model="form.ca" :controls="false" :min="0" :max="250" />
        </el-form-item>
        <el-form-item label="身高">
          <el-input-number v-model="form.height" :controls="false" :min="0" :max="300" />
        </el-form-item>
        <el-form-item label="体重">
          <el-input-number v-model="form.weight" :controls="false" :min="0" :max="300" />
        </el-form-item>
        <el-form-item label="出生国家">
          <CountrySelect v-model="form.birthCountryId" placeholder="请选择出生国家" />
        </el-form-item>
        <el-form-item label="出生城市">
          <CitySelect
            v-model="form.birthCityId"
            :country-id="form.birthCountryId"
            placeholder="请选择出生城市"
          />
        </el-form-item>
        <el-form-item label="初始球队">
          <el-input v-model="form.initialClub" placeholder="请输入初始球队" />
        </el-form-item>
        <el-form-item label="市场价值">
          <el-input-number v-model="form.marketValue" :controls="false" :min="0" />
        </el-form-item>
        <el-form-item label="数据库">
          <el-input v-model="form.databaseSource" placeholder="请输入数据库来源" />
        </el-form-item>
        <el-form-item label="担任过职位">
          <el-input v-model="form.staffRoles" placeholder="如 主教练 / 总监" />
        </el-form-item>
        <el-form-item label="是否退役">
          <el-switch v-model="form.retired" active-text="是" inactive-text="否" />
        </el-form-item>
        <el-form-item label="是否去世">
          <el-switch v-model="form.deceased" active-text="是" inactive-text="否" />
        </el-form-item>
      </div>
      <el-form-item label="球队经历">
        <ClubSelect v-model="form.clubHistoryIds" multiple placeholder="请选择球员效力过的球队" />
      </el-form-item>
      <el-form-item label="成就">
        <el-input
          v-model="form.achievement"
          type="textarea"
          :rows="3"
          placeholder="填写球员定位、荣誉或核心成就"
        />
      </el-form-item>
      <el-form-item label="外部链接">
        <el-input v-model="form.externalUrl" placeholder="https://..." />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="补充说明" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="saving" @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="submit">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.catalog-form {
  display: grid;
  gap: 4px;
}

.catalog-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;
}

.catalog-form :deep(.el-date-editor.el-input),
.catalog-form :deep(.el-input-number) {
  width: 100%;
}

@media (max-width: 720px) {
  .catalog-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>

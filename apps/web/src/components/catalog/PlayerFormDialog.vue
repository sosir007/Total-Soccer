<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import {
  createPlayer,
  updatePlayer,
  type PlayerDetail,
  type PlayerCareer,
  type PlayerCareerPayload,
  type PlayerCareerType,
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
  display?: 'dialog' | 'page';
}>();
const emit = defineEmits<{
  saved: [player: PlayerDetail];
  cancelled: [];
}>();

const saving = ref(false);
const optionStore = useOptionStore();
interface CareerForm {
  careerType: PlayerCareerType;
  clubId: string;
  countryId: string;
  startYear?: number;
  endYear?: number;
  startSeason: string;
  endSeason: string;
  appearances?: number;
  goals?: number;
  assists?: number;
  cleanSheets?: number;
  goalsConceded?: number;
  position: string;
  positionGroup: string;
  showInProfile: boolean;
  isRepresentative: boolean;
  isLegend: boolean;
  sortOrder: number;
  remark: string;
}

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
  remark: '',
  careers: [] as CareerForm[]
});

watch(
  () => [visible.value, props.player, props.display] as const,
  () => {
    if (props.display !== 'page' && !visible.value) {
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
    form.careers = (props.player?.careers ?? []).map((career, index) =>
      careerToForm(career, index)
    );
  },
  { immediate: true }
);

function careerToForm(career: PlayerCareer, index: number): CareerForm {
  return {
    careerType: career.careerType,
    clubId: career.club?.id ?? career.clubId ?? '',
    countryId: career.country?.id ?? career.countryId ?? '',
    startYear: career.startYear ?? undefined,
    endYear: career.endYear ?? undefined,
    startSeason: career.startSeason ?? '',
    endSeason: career.endSeason ?? '',
    appearances: career.appearances ?? undefined,
    goals: career.goals ?? undefined,
    assists: career.assists ?? undefined,
    cleanSheets: career.cleanSheets ?? undefined,
    goalsConceded: career.goalsConceded ?? undefined,
    position: career.position ?? '',
    positionGroup: career.positionGroup ?? '',
    showInProfile: career.showInProfile,
    isRepresentative: career.isRepresentative,
    isLegend: career.isLegend,
    sortOrder: career.sortOrder ?? index,
    remark: career.remark ?? ''
  };
}

function createCareerForm(careerType: PlayerCareerType): CareerForm {
  return {
    careerType,
    clubId: '',
    countryId: careerType === 'COUNTRY' ? form.countryId : '',
    startYear: undefined,
    endYear: undefined,
    startSeason: '',
    endSeason: '',
    appearances: undefined,
    goals: undefined,
    assists: undefined,
    cleanSheets: undefined,
    goalsConceded: undefined,
    position: form.primaryRole,
    positionGroup: '',
    showInProfile: true,
    isRepresentative: false,
    isLegend: false,
    sortOrder: form.careers.length,
    remark: ''
  };
}

function addCareer(careerType: PlayerCareerType) {
  form.careers.push(createCareerForm(careerType));
}

function buildCareers(): PlayerCareerPayload[] {
  return form.careers.flatMap((career, index) => {
    if (career.careerType === 'CLUB' && !career.clubId) {
      return [];
    }

    if (career.careerType === 'COUNTRY' && !career.countryId) {
      return [];
    }

    return [
      {
        careerType: career.careerType,
        clubId: career.careerType === 'CLUB' ? career.clubId : null,
        countryId: career.careerType === 'COUNTRY' ? career.countryId : null,
        startYear: career.startYear ?? null,
        endYear: career.endYear ?? null,
        startSeason: career.startSeason.trim() || undefined,
        endSeason: career.endSeason.trim() || undefined,
        appearances: career.appearances ?? null,
        goals: career.goals ?? null,
        assists: career.assists ?? null,
        cleanSheets: career.cleanSheets ?? null,
        goalsConceded: career.goalsConceded ?? null,
        position: career.position.trim() || undefined,
        positionGroup: career.positionGroup.trim() || undefined,
        showInProfile: career.careerType === 'CLUB' ? career.showInProfile : true,
        isRepresentative: career.careerType === 'CLUB' ? career.isRepresentative : false,
        isLegend: career.careerType === 'CLUB' ? career.isLegend : false,
        sortOrder: career.sortOrder ?? index,
        remark: career.remark.trim() || undefined
      }
    ];
  });
}

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

function cancel() {
  if (props.display === 'page') {
    emit('cancelled');
    return;
  }

  visible.value = false;
}

watch(
  () => [visible.value, props.display] as const,
  ([isVisible]) => {
    if (isVisible || props.display === 'page') {
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
      remark: form.remark.trim() || undefined,
      careers: buildCareers()
    };
    const result = props.player
      ? await updatePlayer(props.player.id, payload)
      : await createPlayer(payload);

    if (props.display !== 'page') {
      visible.value = false;
    }
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
  <component
    :is="display === 'page' ? 'div' : 'el-dialog'"
    v-model="visible"
    :title="player ? '编辑球员' : '新增球员'"
    width="880px"
    destroy-on-close
    :class="display === 'page' ? 'catalog-form-panel' : undefined"
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
      <div class="career-editor">
        <div class="career-editor-header">
          <div>
            <strong>结构化经历</strong>
            <span>用于球员列表代表俱乐部、球队经历，以及俱乐部/国家详情档案。</span>
          </div>
          <div class="career-editor-actions">
            <el-button size="small" @click="addCareer('CLUB')">新增俱乐部经历</el-button>
            <el-button size="small" @click="addCareer('COUNTRY')">新增国家队经历</el-button>
          </div>
        </div>

        <div v-if="!form.careers.length" class="mini-empty">
          暂无结构化经历，可先新增俱乐部经历或国家队经历。
        </div>

        <div v-for="(career, index) in form.careers" :key="index" class="career-card">
          <div class="career-card-title">
            <el-tag :type="career.careerType === 'CLUB' ? 'success' : 'warning'">
              {{ career.careerType === 'CLUB' ? '俱乐部经历' : '国家队经历' }}
            </el-tag>
            <span>排序 {{ index + 1 }}</span>
          </div>
          <div class="career-card-grid">
            <el-form-item label="经历类型">
              <el-select v-model="career.careerType">
                <el-option label="俱乐部" value="CLUB" />
                <el-option label="国家队" value="COUNTRY" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="career.careerType === 'CLUB'" label="俱乐部">
              <ClubSelect v-model="career.clubId" placeholder="请选择俱乐部" />
            </el-form-item>
            <el-form-item v-else label="国家队">
              <CountrySelect v-model="career.countryId" placeholder="请选择国家队" />
            </el-form-item>
            <el-form-item label="开始年份">
              <el-input-number
                v-model="career.startYear"
                :controls="false"
                :min="1800"
                :max="2200"
              />
            </el-form-item>
            <el-form-item label="结束年份">
              <el-input-number v-model="career.endYear" :controls="false" :min="1800" :max="2200" />
            </el-form-item>
            <el-form-item label="开始赛季">
              <el-input v-model="career.startSeason" placeholder="例如 1994-95" />
            </el-form-item>
            <el-form-item label="结束赛季">
              <el-input v-model="career.endSeason" placeholder="例如 1999-00" />
            </el-form-item>
            <el-form-item label="位置">
              <PositionSelect v-model="career.position" placeholder="请选择位置" />
            </el-form-item>
            <el-form-item label="位置组">
              <el-input v-model="career.positionGroup" placeholder="前场 / 中场 / 后场 / 门将" />
            </el-form-item>
            <el-form-item label="场次">
              <el-input-number v-model="career.appearances" :controls="false" :min="0" />
            </el-form-item>
            <el-form-item label="进球">
              <el-input-number v-model="career.goals" :controls="false" :min="0" />
            </el-form-item>
            <el-form-item label="助攻">
              <el-input-number v-model="career.assists" :controls="false" :min="0" />
            </el-form-item>
            <el-form-item label="零封">
              <el-input-number v-model="career.cleanSheets" :controls="false" :min="0" />
            </el-form-item>
            <el-form-item label="失球">
              <el-input-number v-model="career.goalsConceded" :controls="false" :min="0" />
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number v-model="career.sortOrder" :controls="false" :min="0" />
            </el-form-item>
            <el-form-item v-if="career.careerType === 'CLUB'" label="俱乐部展示">
              <el-switch v-model="career.showInProfile" active-text="展示" inactive-text="隐藏" />
            </el-form-item>
            <el-form-item v-if="career.careerType === 'CLUB'" label="代表俱乐部">
              <el-switch v-model="career.isRepresentative" active-text="是" inactive-text="否" />
            </el-form-item>
            <el-form-item v-if="career.careerType === 'CLUB'" label="俱乐部名宿">
              <el-switch v-model="career.isLegend" active-text="是" inactive-text="否" />
            </el-form-item>
            <el-form-item label="备注" class="career-card-wide">
              <el-input v-model="career.remark" placeholder="补充经历说明" />
            </el-form-item>
          </div>
        </div>
      </div>
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
      <el-button :disabled="saving" @click="cancel">取消</el-button>
      <el-button type="primary" :loading="saving" @click="submit">保存</el-button>
    </template>
    <div v-if="display === 'page'" class="catalog-form-page-actions">
      <el-button :disabled="saving" @click="cancel">取消</el-button>
      <el-button type="primary" :loading="saving" @click="submit">保存</el-button>
    </div>
  </component>
</template>

<style scoped>
.catalog-form {
  display: grid;
  gap: 4px;
}

.catalog-form-panel {
  display: grid;
  gap: 18px;
}

.catalog-form-page-actions {
  position: sticky;
  bottom: 0;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 0 0;
  border-top: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.76), #fff);
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

.career-editor {
  display: grid;
  gap: 12px;
}

.career-editor-header {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #f8fbf7;
}

.career-editor-header div:first-child {
  display: grid;
  gap: 4px;
}

.career-editor-header span {
  color: var(--muted);
  font-size: 12px;
}

.career-editor-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.career-card {
  display: grid;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
}

.career-card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--muted);
  font-size: 12px;
}

.career-card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;
}

.career-card-wide {
  grid-column: 1 / -1;
}

@media (max-width: 720px) {
  .catalog-form-grid,
  .career-card-grid {
    grid-template-columns: 1fr;
  }

  .career-editor-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

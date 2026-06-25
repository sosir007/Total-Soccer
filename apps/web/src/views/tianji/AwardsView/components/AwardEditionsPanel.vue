<script setup lang="ts">
import type { AwardEdition } from '@/services/types/awards';
import EntityLink from '@/components/EntityLink.vue';

defineProps<{
  editions: AwardEdition[];
  formatEditionRecipients: (edition: AwardEdition) => string;
  formatRecipientPlacement: (recipient: NonNullable<AwardEdition['recipients']>[number]) => string;
}>();

const emit = defineEmits<{
  create: [];
  edit: [edition: AwardEdition];
}>();
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <div>
        <h3>年份与获奖人</h3>
        <p>一个奖项下维护所有年份和当年获奖球员。</p>
      </div>
      <el-button type="success" @click="emit('create')">新增年份</el-button>
    </div>

    <div v-if="!editions.length" class="mini-empty">暂无奖项年份</div>

    <el-table v-else :data="editions" border>
      <el-table-column prop="year" label="年份" width="90" sortable />
      <el-table-column prop="name" label="届次 / 年份" min-width="150" />
      <el-table-column prop="season" label="赛季" width="110">
        <template #default="{ row }">{{ row.season || '-' }}</template>
      </el-table-column>
      <el-table-column label="获奖人" min-width="240" show-overflow-tooltip>
        <template #default="{ row }">
          <div v-if="row.recipients?.length" class="inline-entity-list">
            <span
              v-for="recipient in row.recipients"
              :key="recipient.id"
              class="award-recipient-chip"
            >
              <span v-if="formatRecipientPlacement(recipient)">
                {{ formatRecipientPlacement(recipient) }}
              </span>
              <EntityLink
                :id="recipient.player.id"
                type="player"
                :name="recipient.player.chineseName"
              />
            </span>
          </div>
          <span v-else>{{ formatEditionRecipients(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip>
        <template #default="{ row }">{{ row.remark || '-' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="90" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="emit('edit', row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

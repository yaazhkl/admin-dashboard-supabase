<template>
    <div class="">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div class="bg-sky-900 rounded-xl border border-slate-200 p-5 shadow-sm">
            <p class="text-sm text-white">Total Departments</p>
            <p class="text-3xl font-bold text-white mt-1">{{ totalDepartment }}</p>
          </div>
          <div class="bg-sky-900 rounded-xl border border-slate-200 p-5 shadow-sm">
            <p class="text-sm text-white">Largest Departments</p>
            <p class="text-3xl font-bold text-white mt-1">{{ largestDepartment?.name }}</p>
          </div>
          <div class="bg-sky-900 rounded-xl border border-slate-200 p-5 shadow-sm">
            <p class="text-sm text-white">Smallest Department</p>
            <p class="text-3xl font-bold text-white mt-1">{{ smallestDepartment?.name }}</p>
          </div>
        </div>
    </div>
</template>
<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useDepartmentStore } from '../store/departmentStore';
  import { storeToRefs } from 'pinia';
  import { usePositionStore} from '../store/positionStore';

  // state
  const departmentCount = ref();
  const useDepartment = useDepartmentStore();
  const usePosition = usePositionStore();
  const {departmentList} = storeToRefs(useDepartment);
  const {positionList}  = storeToRefs(usePosition);


  // Actions
  const totalDepartment = computed(()=>{
    return departmentList.value.length;
  });

  const departmentsWithPositionCount = computed(()=>{
    return departmentList.value.map((depart)=>({
      ...depart,
      totalPositions : positionList.value.filter((pos)=>
        pos.departmentId === depart.id
      ).length,
    }))
  });

  const largestDepartment = computed(()=>{
    const list = departmentsWithPositionCount.value;
    return list.reduce((max, curr) => (curr.totalPositions > max.totalPositions ? curr : max), list[0]);
  });

  const smallestDepartment = computed(()=>{
    const list = departmentsWithPositionCount.value;
    return list.reduce((min, curr) => (curr.totalPositions < min.totalPositions ? curr : min), list[0]);
  })


  onMounted(async()=>{
    departmentCount.value = totalDepartment
    await useDepartment.departmentCall();
    await usePosition.positionCall();
  });

</script>
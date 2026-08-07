<template>
    <div class="bg-white rounded-xl shadow-sm p-6">

        <h2 class="font-bold text-center text-xl mb-5">
        Employees by Department
        </h2>

        <div class="h-[320px]">

            <Bar
                :data="chartData"
                :options="chartOptions"
            />

    </div>

</div>
</template>
<script setup lang="ts">
    import { computed } from 'vue';
    import { useDepartmentStore } from '../store/departmentStore';
    import { useUserStore } from '../store/userStore';
    import { storeToRefs } from 'pinia';
    import { Bar } from 'vue-chartjs';
    import type { ChartOptions } from 'chart.js';

    import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

    // state
    const useUser = useUserStore();
    const useDepartment = useDepartmentStore();
    const {userList} = storeToRefs(useUser);
    const {departmentList} = storeToRefs(useDepartment);


    const departmentChart = computed(() => {

    return departmentList.value.map(dep => ({
        label: dep.name,
        count: userList.value.filter(
            user => user.departmentId === dep.id
            ).length
        }))

    })


    const chartData = computed(() => ({

        labels: departmentChart.value.map(d => d.label),

        datasets:[
            {
                label:"Employees",

                data: departmentChart.value.map(d => d.count),

                backgroundColor:"#0ea5e9",

                borderRadius:8
            }
        ]

    }));

    
    const chartOptions: ChartOptions<'bar'> = {
        responsive : true,
        maintainAspectRatio:false,
        plugins : {
            legend : {
                position :"bottom"
            }
        }
    }

</script>
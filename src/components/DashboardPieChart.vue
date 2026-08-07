<template>
    <div class="bg-white rounded-xl shadow-sm p-6">

        <h2 class="font-bold text-center text-xl mb-5">
            Active vs Inactive Users
        </h2>

        <div class="h-[320px]">
            <Pie
                :data="chartData"
                :options="chartOptions"
            />
        </div>

    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
    import { useUserStore } from '../store/userStore';
    import { storeToRefs } from 'pinia';
    import { Pie } from 'vue-chartjs';
    import type { ChartOptions } from 'chart.js';
    import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

    // state
    const useUser = useUserStore();
    const {userList} = storeToRefs(useUser);


    const activeUser = computed(()=>
        userList.value.filter(user => user.active).length
    );

    const inactiveUser = computed(()=>
        userList.value.filter(user => !user.active).length
    );


    const chartData = computed(()=>({
        labels : [
            "Aktif",
            "Non-aktif"
        ],

        datasets: [
            {
                data : [
                    activeUser.value,
                    inactiveUser.value
                ],
                backgroundColor: [
                    "#22c55e",
                    "#ef4444"
                ]
            }
        ]
    }));


    const chartOptions: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
            position: 'bottom',
            },
        },
    };
</script>
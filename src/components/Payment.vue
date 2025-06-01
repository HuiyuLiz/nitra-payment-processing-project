<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="q-pa-md">
        <div class="row justify-center">
          <div class="col-md-8 col-12">

            <!-- Title and Clinic Selector -->
            <div class="row q-mb-md q-gutter-md items-center">
              <div class="text-h5 text-weight-medium">Collect Payment</div>
              <q-select v-model="selectedClinic" :options="clinicOptions" standout="bg-gray-100 text-black" dense
                dropdown-icon="keyboard_arrow_down" dropdown-icon-class="text-gray-500">
                <template #prepend>
                  <q-icon name="location_on" size="xs" class="text-gray-500" />
                </template>
              </q-select>
              <q-btn class="text-sm text-weight-bold text-red-400 q-ml-auto" flat label="Reset Payment" no-caps
                v-if="amount" @click="resetForm" />
            </div>

            <!-- Main Card -->
            <div flat bordered class="container">
              <div class="row q-col-gutter-md">

                <!-- Payment Input Section -->
                <div class="col-md-9 col-12 amount-container">
                  <div>
                    <div class="text-subtitle1 text-gray-700 text-lg q-mt-xl text-center">Enter Amount</div>
                    <q-input v-model.number="amount" type="number" min="0" step="0.01" dense
                      :class="['amount-input-large', 'q-mx-auto', { 'input-expanded': isInputFocused || amount !== 0 }]"
                      @update="updateAmount" @focus="isInputFocused = true" @blur="isInputFocused = false" borderless>
                      <template #prepend>
                        <div class="amount-dollar-icon">
                          <i class="fa fa-dollar" aria-hidden="true"></i>
                        </div>
                      </template>
                    </q-input>
                  </div>

                  <!-- Description -->
                  <div class="q-mb-lg q-mx-auto q-mt-xl" style="width: 400px;">
                    <q-input filled v-model="description" label="Description (Optional)" type="textarea" rows="3" />
                  </div>


                </div>

                <!-- Right Summary Section -->
                <div class="col-md-3 col-12 q-pa-none">
                  <div class="q-py-md">
                    <div class="text-h6 q-mt-md">Summary</div>

                    <q-separator class="-q-mx-md q-my-md" />

                    <div class="row justify-between q-mb-sm q-px-m text-gray-700 q-px-md">
                      <span>Subtotal</span>
                      <span>${{ formatAmount(amount) }}</span>
                    </div>

                    <div class="row justify-between q-mb-sm q-px-m text-gray-700 q-px-md">
                      <span>Tax ({{ taxRate }}%)</span>
                      <span>${{ formatAmount(taxAmount) }}</span>
                    </div>

                    <q-separator class="q-my-md q-mx-md" color="teal-700" />

                    <div class="row justify-between q-mb-lg text-weight-medium q-px-md">
                      <span>Total</span>
                      <span>${{ formatAmount(totalAmount) }}</span>
                    </div>

                    <div class="custom-toggle-button q-mb-lg q-mx-auto">
                      <q-btn :class="['row', { 'bg-teal-100 text-teal-700': paymentMethod === 'cash' }]"
                        :color="paymentMethod === 'cash' ? 'teal-100' : 'white'"
                        :text-color="paymentMethod === 'cash' ? 'teal-700' : 'teal-700'" no-caps unelevated
                        @click="paymentMethod = 'cash'">
                        <img src="@/assets/images/sack-dollar.svg" alt="Dollar Icon" />
                        <div class="q-px-sm text-xxs"> Pay by Cash ${{ formatAmount(paymentMethod === 'cash' ?
                          totalAmount : 0)
                        }}</div>
                      </q-btn>

                      <q-btn :class="['row', { 'bg-teal-100 text-teal-700': paymentMethod === 'card' }]"
                        :color="paymentMethod === 'card' ? 'teal-100' : 'white'"
                        :text-color="paymentMethod === 'card' ? 'teal-700' : 'teal-700'" no-caps unelevated
                        @click="paymentMethod = 'card'">
                        <img src="@/assets/images/credit-card.svg" alt="Dollar Icon" />
                        <div class="q-px-sm text-xxs"> Pay by Card ${{ formatAmount(paymentMethod === 'card' ?
                          totalAmount : 0)
                        }}</div>
                      </q-btn>
                    </div>

                    <q-separator class="q-my-md q-mx-md" color="teal-700" v-if="isLoggedIn" />

                    <!-- Card Fee -->
                    <div class="row items-center justify-between q-mb-sm q-px-m text-gray-700 q-px-md"
                      v-if="isLoggedIn">
                      <span>Patient Card Processing Fee</span>
                      <q-btn label="Edit" flat color="teal-400" size="md" @click="showProcessingFeeDialog = true" />
                      <span class="q-ml-quto">${{ formatAmount(amount) }}</span>
                    </div>


                    <q-separator class="q-my-md q-mx-md" color="teal-700" />

                    <!-- Cash Total -->
                    <div class="row items-center justify-between text-center q-mb-lg q-px-md">
                      <div class="text-xs">Pay by Cash Total</div>
                      <div class="text-xl text-red-500 text-weight-bold">
                        ${{ formatAmount(cashPaymentAmount) }}
                      </div>
                      <div class="text-xxs text-red-500 text-weight-bold">
                        *Total amount falls below the required minimum of ${{ formatAmount(cashPaymentAmount) }}
                      </div>
                    </div>

                    <q-separator class="-q-mx-md q-my-md" />

                    <div class="row items-center q-mb-md">
                      <q-select v-model="selectedClinic" :options="clinicOptions" standout="bg-gray-100 text-black"
                        dense dropdown-icon="keyboard_arrow_down" dropdown-icon-class="text-gray-500"
                        class="full-width  q-px-md">
                        <template #prepend>
                          <q-icon name="location_on" size="xs" class="text-gray-500" />
                        </template>
                      </q-select>
                    </div>

                    <div class="row items-center q-mb-md" v-if="isLoggedIn">
                      <q-select v-model="selectedPayment" :options="paymentsOptions" standout="bg-gray-100 text-black"
                        label="Device Reader" dropdown-icon="keyboard_arrow_down" dropdown-icon-class="text-gray-500"
                        class="full-width  q-px-md">
                        <template #prepend>
                          <q-icon name="location_on" size="xs" class="text-gray-500" />
                        </template>
                      </q-select>
                    </div>

                    <!-- Log Payment Button -->
                    <div class="row items-center q-mb-lg q-px-md">
                      <q-btn @click="logPayment" color="orange-300" size="md" v-if="!isLoggedIn"
                        class="full-width row items-center justify-center" unelevated no-caps>
                        <div class="q-px-sm row items-center justify-center"> <img
                            src="@/assets/images/money-bill-wave.svg" alt="Dollar Icon" /></div>
                        <div>Log Payment</div>
                      </q-btn>
                    </div>

                    <!-- Initiate Payment on Reader -->
                    <div class="row items-center q-mb-sm q-px-md" v-if="isLoggedIn">
                      <q-btn @click="initiatePaymentOnReader" color="orange-400" size="md"
                        class="full-width row items-center justify-center" unelevated no-caps>
                        <div class="q-px-sm row items-center justify-center"> <img
                            src="@/assets/images/orange-credit-card.svg" alt="Dollar Icon" /></div>
                        <div>Initiate Payment on Reader</div>
                      </q-btn>
                    </div>

                    <!-- Input Card Number Maually -->
                    <div class="row items-center q-mb-lg q-px-md" v-if="isLoggedIn">
                      <q-btn @click="inputCardNumberManually" color="orange-50" size="md"
                        class="full-width row items-center justify-center" unelevated no-caps>
                        <div class="q-px-sm row items-center justify-center"> <img src="@/assets/images/reader.svg"
                            alt="Dollar Icon" /></div>
                        <div class="text-orange-400">Input Card Number Maually</div>
                      </q-btn>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>

  <!-- Processing Fee Edit Dialog -->
  <q-dialog v-model="showProcessingFeeDialog">
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-2xl text-weight-bold">Edit Merchant Processing Fee</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
        <div class="text-xs text-gray-700 q-mb-lg">
          Only applies to this transaction
        </div>
      </q-card-section>

      <q-card-section>


        <!-- slider -->
        <div class="q-mb-md q-mx-lg">
          <div class="row justify-between text-caption text-grey-7 q-mb-xs">
            <span>0</span>
            <span>3.5%</span>
          </div>
          <q-slider v-model="progress" label color="teal-400" />
        </div>

        <q-separator class="q-my-md" />

        <!-- Merchant processing fee -->
        <div class="row items-center q-mb-md">
          <div class="col-4">
            <span class="text-gray-900 text-sm">Merchant processing fee</span>
          </div>
          <div class="col-2">
            <q-input outlined v-model="merchantProcessingFee" type="number" dense filled>
              <template v-slot:append>
                <div class="text-sm text-gray-700">%</div>
              </template>
            </q-input>
          </div>
          <div class="col-1 text-center text-gray-400 text-xxs">/ 3.5 %</div>
          <div class="text-gray-400 q-mr-sm">+</div>
          <div class="col-2">
            <q-input outlined v-model="merchantProcessingFee" type="number" prefix="$" dense filled>
            </q-input>
          </div>
          <div class="col-1 text-center text-gray-400 text-xxs">/ $0.10</div>
        </div>

        <!-- Patient processing fee -->
        <div class="row items-center q-mb-md">
          <div class="col-4">
            <span class="text-gray-900 text-sm">Patient processing fee</span>
          </div>
          <div class="col-2">
            <q-input outlined v-model="patientProcessingFee" type="number" dense filled>
              <template v-slot:append>
                <div class="text-sm text-gray-700">%</div>
              </template>
            </q-input>
          </div>
          <div class="col-1 text-center text-gray-400 text-xxs">/ 3.5 %</div>
          <div class="text-gray-400 q-mr-sm">+</div>
          <div class="col-2">
            <q-input outlined v-model="merchantProcessingFee" type="number" prefix="$" dense filled>
            </q-input>
          </div>
          <div class="col-1 text-center text-gray-400 text-xxs">/ $0.10</div>
        </div>

        <q-separator class="q-my-md" />

        <div class="row items-center justify-center text-center">
          <u class="text-xs text-center text-teal-400 q-mb-md">Set patient processing fee to 0</u>
        </div>

        <div class="text-sm text-black text-weight-bold q-mb-md">
          On this ${{ formatAmount(amount) }} transaction, you pay ${{ formatAmount(merchantProcessingAmount) }} and
          patient pays ${{ formatAmount(patientProcessingAmount) }}
        </div>
      </q-card-section>

      <q-separator class="-q-mx-md" />

      <q-card-actions align="between" class="q-mx-md">
        <q-btn label="Cancel" color="gray-600" flat v-close-popup unelevated no-caps />
        <q-btn label="Update" color="orange-400" unelevated no-caps @click="updateProcessingFee" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Card Reader Dialog -->
  <q-dialog v-model="showCardReaderDialog">
    <q-card style="min-width: 500px">
      <q-card-section class="text-center">
        <img src="@/assets/images/card-payment-warining.svg" alt="card" />
        <div class="text-2xl q-mb-md text-weight-bold">
          <img src="@/assets/images/eye.svg" alt="card" />
          Review Details with Patient
        </div>
        <div class="text-sm text-grey-700 q-mb-lg">
          Review details of this transaction with the customer via the device<br>
          display. If everything looks good, proceed to process payment.
        </div>

        <q-btn color="teal-50" class="full-width text-teal-900 q-py-sm" unelevated no-caps :loading="autoProcessing"
          @click="startAutoProcessing">Auto-Processing in <span class="text-weight-bold q-px-sm">
            5s</span></q-btn>
        <div class="text-xxs text-gray-700 q-mt-sm" unelevated no-caps :loading="autoProcessing">Or
          click “Process Payment” below</div>
      </q-card-section>

      <q-separator class="-q-mx-md" />

      <q-card-actions align="between" class="q-mx-md">
        <q-btn label="Cancel" color="gray-600" flat v-close-popup unelevated no-caps />
        <q-btn label="Process Payment" color="orange-400" unelevated no-caps />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Manual Card Input Dialog -->
  <q-dialog v-model="showManualCardDialog">
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-2xl text-weight-bold">Credit Card Details</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-input v-model="cardDetails.nameOnCard" label="Name on Card" filled class="q-mb-md" />

        <q-input v-model="cardDetails.cardNumber" label="Card Number" filled mask="#### #### #### ####"
          class="q-mb-md" />

        <div class="row q-gutter-md q-mb-md">
          <q-input v-model="cardDetails.expirationDate" label="Expiration Date" filled mask="##/##" class="col" />
          <q-input v-model="cardDetails.cvc" label="CVC" filled mask="###" class="col" />
        </div>

        <div class="row q-gutter-md q-mb-md">
          <q-select v-model="cardDetails.country" :options="countryOptions" label="Country" filled class="col" />
          <q-input v-model="cardDetails.ZIP" label="ZIP" filled mask="###" class="col" />
        </div>
      </q-card-section>

      <q-separator class="-q-mx-md" />

      <q-card-actions align="between" class="q-mx-md q-my-sm">
        <q-btn label="Cancel" color="gray-600" flat v-close-popup unelevated no-caps />
        <q-btn label="Pay $27.21" color="orange-400" unelevated no-caps />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'
import { locations, payments, type Payment } from '../mock/mock.js'

interface PaymentData {
  amount: number
  description: string
  method: 'cash' | 'card'
  clinic: string
  timestamp: Date
}

// Composables
const $q = useQuasar()

// Props
interface Props {
  defaultClinic?: string
  defaultPayment?: string
  taxRate?: number
}

const props = withDefaults(defineProps<Props>(), {
  defaultClinic: 'New York Clinic',
  defaultPayment: "Device Reader 01",
  taxRate: 0
})

// Reactive data
const amount = ref<number>(0)
const description = ref<string>('')
const paymentMethod = ref<'cash' | 'card'>('cash')
const selectedClinic = ref<string>(props.defaultClinic)
const selectedPayment = ref<string>(props.defaultPayment)
const showSuccessDialog = ref<boolean>(false)
const showProcessingFeeDialog = ref<boolean>(false)
const showCardReaderDialog = ref<boolean>(false)
const showManualCardDialog = ref<boolean>(false)
const autoProcessing = ref<boolean>(false)
const progress = ref<number>(0.5)
const isInputFocused = ref<boolean>(false)
const isLoggedIn = ref<boolean>(false)

// Processing Fee data
const merchantProcessingFee = ref<number>(1.00)
const patientProcessingFee = ref<number>(2.50)

// Watch progress changes to update processing fees
watch(progress, (newValue) => {
  merchantProcessingFee.value = Number((newValue * 3.5).toFixed(2))
  patientProcessingFee.value = Number((3.5 - merchantProcessingFee.value).toFixed(2))
})

// Watch processing fees to update progress
watch([merchantProcessingFee, patientProcessingFee], ([newMerchantFee]) => {
  progress.value = Number((newMerchantFee / 3.5).toFixed(2))
})

// Card Details
const cardDetails = ref({
  nameOnCard: '',
  cardNumber: '',
  expirationDate: '',
  cvc: '',
  country: 'United States',
  ZIP: ''
})

// Locations
const locationsApi = ref<{ id: number, name: string, taxRate: string, createdAt: string, updatedAt: string, deletedAt: string | null }[]>(locations)

const clinicOptions = computed(() => {
  return locationsApi.value.map(location => location.name)
})


// Payments
const paymentsApi = ref<Payment[]>(payments)

const paymentsOptions = computed(() => {
  return paymentsApi.value.map(location => location.label)
})


const countryOptions = ref<string[]>([
  'United States',
  'Canada',
  'United Kingdom',
  'Australia'
])

// Computed
const taxAmount = computed<number>(() => {
  return (amount.value * props.taxRate) / 100
})

const totalAmount = computed<number>(() => {
  return amount.value + taxAmount.value
})

const cashPaymentAmount = computed<number>(() => {
  return paymentMethod.value === 'cash' ? totalAmount.value : 0
})

const merchantProcessingAmount = computed<number>(() => {
  return (amount.value * merchantProcessingFee.value) / 100
})

const patientProcessingAmount = computed<number>(() => {
  return (amount.value * patientProcessingFee.value) / 100
})

const isCardDetailsValid = computed<boolean>(() => {
  return cardDetails.value.nameOnCard.length > 0 &&
    cardDetails.value.cardNumber.replace(/\s/g, '').length === 16 &&
    cardDetails.value.expirationDate.length === 5 &&
    cardDetails.value.cvc.length === 3 &&
    cardDetails.value.ZIP.length === 1
})

// Methods
const formatAmount = (value: number): string => {
  return (value || 0).toString()
}

const updateAmount = (value: number | null): void => {
  amount.value = value || 0
}

const logPayment = (): void => {
  const paymentData: PaymentData = {
    amount: totalAmount.value,
    description: description.value,
    method: paymentMethod.value,
    clinic: selectedClinic.value,
    timestamp: new Date()
  }

  console.log('Payment logged:', paymentData)

  isLoggedIn.value = true

  // emit('paymentLogged', paymentData)
}

const resetForm = (): void => {
  amount.value = 0
  description.value = ''
  paymentMethod.value = 'cash'
}

const updateProcessingFee = (): void => {
  showProcessingFeeDialog.value = false
  $q.notify({
    type: 'positive',
    message: 'Processing fee updated successfully',
    position: 'top'
  })
}

const initiatePaymentOnReader = (): void => {
  showCardReaderDialog.value = true
}

const inputCardNumberManually = (): void => {
  showManualCardDialog.value = true
}

const startAutoProcessing = (): void => {
  autoProcessing.value = true
  setTimeout(() => {
    autoProcessing.value = false
    processCardPayment()
  }, 5000)
}

const processCardPayment = (): void => {
  showCardReaderDialog.value = false
  showSuccessDialog.value = true
  $q.notify({
    type: 'positive',
    message: 'Card payment processed successfully',
    position: 'top'
  })
}

const processManualCardPayment = (): void => {
  if (!isCardDetailsValid.value) {
    $q.notify({
      type: 'negative',
      message: 'Please fill in all card details',
      position: 'top'
    })
    return
  }

  showManualCardDialog.value = false
  showSuccessDialog.value = true
  $q.notify({
    type: 'positive',
    message: 'Manual card payment processed successfully',
    position: 'top'
  })
}

// Emits
// const emit = defineEmits<{
//   paymentLogged: [payment: PaymentData]
// }>()
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  border: 1px solid $gray-200;
  border-radius: 8px;
  min-height: 90vh;
}

.amount-container {
  position: relative;
}

.separator {
  border-left: 1px solid $gray-200;
}

.amount-display {
  font-size: 4rem;
  font-weight: 300;
  color: #333;
}

.custom-toggle-button {
  display: flex;
  width: fit-content;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid $teal-100;
}

.amount-dollar-icon {
  color: black;
  position: absolute;
  font-size: 40px;
  top: 20%;
  left: -8%;
}

.amount-input-large {
  width: 100px;
  margin: 0 auto;
  transition: width 0.3s ease;

  :deep(.q-field__control) {
    font-size: 76px;
    font-weight: 700;
    text-align: center;
    height: auto;
    min-height: 100px;
  }

  :deep(.q-field__native) {
    font-size: 76px;
    font-weight: 700;
    text-align: center;
    padding: 20px 0;
  }

  :deep(.q-field__bottom) {
    display: none;
  }
}

.amount-input-large.input-expanded {
  width: 400px;
}

.payment-method-toggle {
  margin: 10px 0;
}

.payment-toggle {
  display: flex;
}

.clinic-selector {
  margin-bottom: 20px;
}

.divider-vertical {
  border-right: 1px solid $gray-200;
}

@media (max-width: 768px) {
  .amount-display {
    font-size: 3rem;
  }

  .payment-container {
    padding: 10px;
  }
}

.my-custom-toggle {
  min-width: 100%;

  :deep(.q-btn) {
    min-width: auto;
    white-space: nowrap;
  }
}
</style>
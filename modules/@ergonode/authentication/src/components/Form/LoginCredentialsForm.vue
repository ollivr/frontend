/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <LoginForm>
        <template #header>
            <div class="logo-header">
                <IconLogoName />
            </div>
        </template>
        <template #body>
            <TextField
                data-cy="login-email"
                v-model="email"
                label="E-mail" />
            <TextField
                data-cy="login-pass"
                v-model="password"
                :input="passwordInputType"
                label="Password"
                @keyup.13="onSubmit" />
            <Toggler
                v-model="isPasswordVisible"
                label="Show password" />
        </template>
        <template #footer>
            <Button
                data-cy="login-button"
                title="LOG IN"
                type="submit"
                @click.stop.prevent.native="onSubmit" />
        </template>
    </LoginForm>
</template>

<script>
import LoginForm from '@Authentication/components/Form/LoginForm';
import Button from '@Core/components/Button/Button';
import IconLogoName from '@Core/components/Icons/Logo/IconLogoName';
import TextField from '@Core/components/Inputs/TextField';
import Toggler from '@Core/components/Inputs/Toggler/Toggler';
import {
    INPUT_TYPE,
} from '@Core/defaults/theme';
import {
    mapActions,
} from 'vuex';

export default {
    name: 'LoginCredentialsForm',
    components: {
        LoginForm,
        TextField,
        Button,
        Toggler,
        IconLogoName,
    },
    data() {
        return {
            email: '',
            password: '',
            isPasswordVisible: false,
        };
    },
    computed: {
        passwordInputType() {
            return {
                type: this.isPasswordVisible ? 'text' : 'password',
            };
        },
        underlineInputType() {
            return INPUT_TYPE.UNDERLINE;
        },
    },
    methods: {
        ...mapActions('authentication', [
            'authenticateUser',
        ]),
        async onSubmit() {
            try {
                await this.authenticateUser({
                    data: {
                        username: this.email,
                        password: this.password,
                    },
                });
                this.$router.push({
                    name: 'dashboard',
                });
            } catch (e) {
                console.error(e);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
    .logo-header {
        display: flex;
        flex: 1;
        justify-content: center;
    }
</style>

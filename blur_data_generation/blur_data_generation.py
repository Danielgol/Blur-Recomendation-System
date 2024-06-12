import os
import cv2
import math
import numpy as np
from random import randint

from kwentar_blur_augmentation.generate_kernels import *
from kwentar_blur_augmentation.generate_motion_PSF import *
from kwentar_blur_augmentation.generate_trajectory import *
from kwentar_blur_augmentation.blur_image import BlurImage

def apply_blur_mask(image, blur_mask):
    b, g, r = cv2.split(image)
    blur_mask = blur_mask / np.sum(blur_mask)

    b_blurred = cv2.filter2D(b, -1, blur_mask)
    g_blurred = cv2.filter2D(g, -1, blur_mask)
    r_blurred = cv2.filter2D(r, -1, blur_mask)

    blurred_image = cv2.merge([b_blurred, g_blurred, r_blurred])

    return blurred_image



img_path = "./coco_val2017/" # path to the dataset you are going to blur
images = os.listdir(img_path)

BEGIN = 0 # First Image Index
N_GEN = 1000 # Last Image Index
# Number of generated images = N_GEN - BEGIN (Note that N_GEN > BEGIN)

count = 0
for num, name in enumerate(images[BEGIN:BEGIN+N_GEN]):

    img = cv2.imread(os.path.join(img_path, name))
    height, width, _ = img.shape
    max_len = height if width > height else width
    max_len = max_len//8
    canva_sz = height if width < height else width
    canva_sz = canva_sz//4
    cut = max_len//2


    # Sharp:
    sharp = []
    try:
        sharp = img.copy()[cut:height-cut,cut:width-cut]
    except:
        continue


    # Defocused Blur:
    df_blurred = []
    try:
        kernel_size = np.random.choice([11, 15, 17])
        mask = generate_defocused_kernel(kernel_size, -1, 250)
        df_blurred = apply_blur_mask(img.copy(), mask)
        df_blurred = df_blurred.copy()[cut:height-cut,cut:width-cut]
    except:
        continue


    # Motion Blur:
    # DeblurGAN   https://github.com/KupynOrest/DeblurGAN/blob/master/motion_blur/
    params = np.random.choice([0.002, 0.0015, 0.001])
    trajectory = Trajectory(canvas=canva_sz, max_len=max_len, expl=params).fit()
    psf = PSF(canvas=canva_sz, trajectory=trajectory).fit()
    part = np.random.choice([1, 2, 3])
    mt_blurred = []
    try:
        mt_blurred = BlurImage(os.path.join(img_path, name), PSFs=psf, part=None).blur_image(save=False)
        mt_blurred = mt_blurred[cut:height-cut,cut:width-cut] * 255
    except:
        continue

    # Add each image to its respective folder:
    cv2.imwrite("./blur_dataset/sharp/"+name, sharp)
    cv2.imwrite("./blur_dataset/motion_blurred/"+name, mt_blurred)
    cv2.imwrite("./blur_dataset/defocused_blurred/"+name, df_blurred)
    
    print(num,"/",N_GEN)
